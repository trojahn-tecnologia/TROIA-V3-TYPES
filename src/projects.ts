import { AppAwareDocument, PaginationQuery, GenericQueryOptions, ListResponse } from './common';

// ============================================================================
// PROJECTS — Gestão de projetos (Gantt de tickets do helpdesk)
// Spec: DOCS/superpowers/specs/2026-07-11-projects-module-design.md
// ============================================================================

export type ProjectStatus = 'active' | 'completed' | 'archived';

/** Modo de enforcement de uma dependência Finish-to-Start (decisão D2) */
export type DependencyMode = 'inform' | 'warn' | 'block';

export interface ProjectPhase {
  id: string;          // uuid/string local ao projeto (não é ObjectId)
  name: string;
  color: string;       // #RRGGBB
  order: number;
}

export interface ProjectDependency {
  taskId: string;      // project-task predecessora (FS)
  mode: DependencyMode;
}

export interface ProjectNotifyEvents {
  milestoneCompleted: boolean;
  phaseCompleted: boolean;
  projectCompleted: boolean;
  taskCompleted: boolean;
}

export interface ProjectNotifyConfig {
  channelId?: string;               // canal de envio das mensagens ao contato
  events: ProjectNotifyEvents;
  messageTemplate?: string;         // vazio => template default do sistema
}

export interface ProjectInternalNotifyConfig {
  unblocked: boolean;               // dependência liberada -> responsável
  completedLeader: boolean;         // tarefa concluída -> líder
  overdue: boolean;                 // tarefa vencida -> líder + responsável
}

export interface Project extends AppAwareDocument {
  name: string;
  clientId?: string;                // ref customers
  description?: string;
  color: string;                    // #RRGGBB
  status: ProjectStatus;            // 'completed' é automático (todas as tarefas concluídas)
  pipelineId: string;               // ticket-pipeline onde os tickets nascem (D1)
  leaderId: string;
  memberIds: string[];
  phases: ProjectPhase[];           // embutidas — agrupamento visual
  contactIds: string[];
  notifyConfig: ProjectNotifyConfig;
  internalNotifyConfig: ProjectInternalNotifyConfig;
  createdBy?: string;
}

export interface ProjectResponse extends Omit<Project, '_id' | 'appId'> {
  id: string;
  appId: string;
}

export interface ProjectTask extends AppAwareDocument {
  projectId: string;
  ticketId: string;                 // único por (appId, companyId) — ticket pertence a <=1 projeto
  phaseId?: string;                 // ref Project.phases[].id
  order: number;
  startDate: Date;                  // UTC-midnight
  endDate: Date;                    // UTC-midnight; espelhado em ticket.dueDate
  isMilestone: boolean;             // marco: startDate === endDate
  dependencies: ProjectDependency[];
}

export interface ProjectTaskResponse extends Omit<ProjectTask, '_id' | 'appId' | 'startDate' | 'endDate'> {
  id: string;
  appId: string;
  startDate: string;                // ISO
  endDate: string;                  // ISO
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

/** Item de tarefa no payload de criação composta. Dependências referenciam
 *  o índice do array `tasks` (resolvidas para ids reais no backend). */
export interface CreateProjectTaskInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  phaseId?: string;
  startDate: string;                // ISO date (YYYY-MM-DD aceito)
  endDate: string;
  isMilestone?: boolean;
  dependencies?: { taskIndex: number; mode: DependencyMode }[];
  existingTicketId?: string;        // vincular ticket existente em vez de criar
}

export interface CreateProjectRequest {
  name: string;
  clientId?: string;
  description?: string;
  color?: string;
  pipelineId: string;
  leaderId: string;
  memberIds?: string[];
  phases?: { id: string; name: string; color: string; order?: number }[];
  tasks: CreateProjectTaskInput[];
  contactIds?: string[];
  notifyConfig?: Partial<ProjectNotifyConfig>;
  internalNotifyConfig?: Partial<ProjectInternalNotifyConfig>;
}

export interface UpdateProjectRequest {
  name?: string;
  clientId?: string;
  description?: string;
  color?: string;
  pipelineId?: string;
  leaderId?: string;
  memberIds?: string[];
  phases?: ProjectPhase[];
  contactIds?: string[];
  notifyConfig?: ProjectNotifyConfig;
  internalNotifyConfig?: ProjectInternalNotifyConfig;
  status?: ProjectStatus;           // arquivar/reativar manual
}

export interface CreateProjectTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  phaseId?: string;
  startDate: string;
  endDate: string;
  isMilestone?: boolean;
  dependencies?: ProjectDependency[];   // aqui já com taskId real
}

export interface UpdateProjectTaskRequest {
  phaseId?: string;
  order?: number;
  startDate?: string;
  endDate?: string;
  isMilestone?: boolean;
  dependencies?: ProjectDependency[];
}

export interface LinkTicketRequest {
  ticketId: string;
  phaseId?: string;
  startDate: string;
  endDate: string;
  isMilestone?: boolean;
  dependencies?: ProjectDependency[];
}

// ---------------------------------------------------------------------------
// Responses compostas
// ---------------------------------------------------------------------------

/** Enrichment do ticket para o Gantt/Lista (Two-Phase Fetch no backend) */
export interface ProjectTaskTicketInfo {
  ticketId: string;
  ticketNumber: string;
  title: string;
  statusCategory: 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  stageName?: string;
  stageColor?: string;
  assigneeId?: string;
  assigneeName?: string;
  priority?: string;
}

export interface ProjectGanttTask extends ProjectTaskResponse {
  ticket: ProjectTaskTicketInfo | null;   // null = ticket não encontrado (defensivo)
  blocked: boolean;                        // tem predecessora pendente em modo 'block'
}

export interface ProjectProgress {
  done: number;
  total: number;
  pct: number;                             // 0-100 arredondado
}

export interface ProjectGanttResponse {
  project: ProjectResponse;
  tasks: ProjectGanttTask[];
  progress: ProjectProgress;
  overdueCount: number;                    // tarefas com endDate < hoje e não concluídas
}

/** Estado de dependências de um ticket (consumido pelo kanban — modo 'warn') */
export interface TaskDependencyStatusResponse {
  inProject: boolean;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  pendingPredecessors: { taskId: string; ticketNumber: string; title: string; mode: DependencyMode }[];
  strictestPendingMode: DependencyMode | null;   // 'block' > 'warn' > 'inform'
}

// Query / list
export interface ProjectQuery extends PaginationQuery {
  status?: ProjectStatus;
  pipelineId?: string;
  leaderId?: string;
}
export interface ProjectListItem extends ProjectResponse {
  progress: ProjectProgress;
  overdueCount: number;
  taskCount: number;
  milestoneCount: number;
  startDate?: string;               // min(tasks.startDate) ISO
  endDate?: string;                 // max(tasks.endDate) ISO
  nextMilestone?: { title: string; date: string } | null;
  clientName?: string;              // enrichment (nome do customer vinculado via clientId)
}
export interface ProjectListResponse extends ListResponse<ProjectListItem> {}
export interface ProjectQueryOptions extends GenericQueryOptions<ProjectQuery> {}

export const PROJECT_DEFAULT_MESSAGE_TEMPLATE =
  'Olá {{contato}}! Atualização do projeto {{projeto}}: ✅ {{evento}}. Progresso geral: {{progresso}}. Qualquer dúvida é só responder por aqui.';
