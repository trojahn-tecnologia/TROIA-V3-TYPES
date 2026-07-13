import { AppAwareDocument, PaginationQuery, GenericQueryOptions, ListResponse } from './common';
export type ProjectStatus = 'active' | 'completed' | 'archived';
/** Modo de enforcement de uma dependência Finish-to-Start (decisão D2) */
export type DependencyMode = 'inform' | 'warn' | 'block';
export interface ProjectPhase {
    id: string;
    name: string;
    color: string;
    order: number;
}
export interface ProjectDependency {
    taskId: string;
    mode: DependencyMode;
}
export interface ProjectNotifyEvents {
    milestoneCompleted: boolean;
    phaseCompleted: boolean;
    projectCompleted: boolean;
    taskCompleted: boolean;
}
export interface ProjectNotifyConfig {
    channelId?: string;
    events: ProjectNotifyEvents;
    messageTemplate?: string;
}
export interface ProjectInternalNotifyConfig {
    unblocked: boolean;
    completedLeader: boolean;
    overdue: boolean;
}
export interface Project extends AppAwareDocument {
    name: string;
    clientId?: string;
    description?: string;
    color: string;
    status: ProjectStatus;
    pipelineId: string;
    leaderId: string;
    memberIds: string[];
    phases: ProjectPhase[];
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
    ticketId: string;
    phaseId?: string;
    order: number;
    startDate: Date;
    endDate: Date;
    isMilestone: boolean;
    dependencies: ProjectDependency[];
}
export interface ProjectTaskResponse extends Omit<ProjectTask, '_id' | 'appId' | 'startDate' | 'endDate'> {
    id: string;
    appId: string;
    startDate: string;
    endDate: string;
}
/** Item de tarefa no payload de criação composta. Dependências referenciam
 *  o índice do array `tasks` (resolvidas para ids reais no backend). */
export interface CreateProjectTaskInput {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assigneeId?: string;
    phaseId?: string;
    startDate: string;
    endDate: string;
    isMilestone?: boolean;
    dependencies?: {
        taskIndex: number;
        mode: DependencyMode;
    }[];
    existingTicketId?: string;
}
export interface CreateProjectRequest {
    name: string;
    clientId?: string;
    description?: string;
    color?: string;
    pipelineId: string;
    leaderId: string;
    memberIds?: string[];
    phases?: {
        id: string;
        name: string;
        color: string;
        order?: number;
    }[];
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
    status?: ProjectStatus;
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
    dependencies?: ProjectDependency[];
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
    ticket: ProjectTaskTicketInfo | null;
    blocked: boolean;
}
export interface ProjectProgress {
    done: number;
    total: number;
    pct: number;
}
export interface ProjectGanttResponse {
    project: ProjectResponse;
    tasks: ProjectGanttTask[];
    progress: ProjectProgress;
    overdueCount: number;
}
/** Estado de dependências de um ticket (consumido pelo kanban — modo 'warn') */
export interface TaskDependencyStatusResponse {
    inProject: boolean;
    projectId?: string;
    projectName?: string;
    taskId?: string;
    pendingPredecessors: {
        taskId: string;
        ticketNumber: string;
        title: string;
        mode: DependencyMode;
    }[];
    strictestPendingMode: DependencyMode | null;
}
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
    startDate?: string;
    endDate?: string;
    nextMilestone?: {
        title: string;
        date: string;
    } | null;
    clientName?: string;
}
export interface ProjectListResponse extends ListResponse<ProjectListItem> {
}
export interface ProjectQueryOptions extends GenericQueryOptions<ProjectQuery> {
}
export declare const PROJECT_DEFAULT_MESSAGE_TEMPLATE = "Ol\u00E1 {{contato}}! Atualiza\u00E7\u00E3o do projeto {{projeto}}: \u2705 {{evento}}. Progresso geral: {{progresso}}. Qualquer d\u00FAvida \u00E9 s\u00F3 responder por aqui.";
