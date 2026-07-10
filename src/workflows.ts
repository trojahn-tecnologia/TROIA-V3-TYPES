import { ObjectId } from 'mongodb';

import type { DatabaseType } from './databases';

// ============================================================
// WORKFLOW TYPES
// ============================================================

/**
 * Node Types - All supported node types for workflows.
 *
 * SINGLE SOURCE OF TRUTH: add new node types here only.
 * The WorkflowNodeType union is derived from this array so that
 * runtime validators (Zod enums) can import WORKFLOW_NODE_TYPES
 * directly and stay in sync automatically.
 */
export const WORKFLOW_NODE_TYPES = [
  // Triggers
  'trigger_webhook',
  'trigger_schedule',
  'trigger_event',
  'trigger_manual',
  'trigger_date_field',
  'trigger_inactivity',
  'trigger_instagram_comment',
  'trigger_instagram_mention',
  // Actions
  'action_send_message',
  'action_send_email',
  'action_send_template',
  'action_send_media',
  'action_http_request',
  'action_query_database',
  'action_create_lead',
  'action_update_lead',
  'action_update_contact',
  'action_add_tag',
  'action_remove_tag',
  'action_assign',
  'action_set_variable',
  'action_create_conversation',
  'action_create_ticket',
  'action_internal_notification',
  'action_find_leads',
  'action_create_database_document',
  // Controls
  'control_if',
  'control_switch',
  'control_delay',
  'control_wait_for',
  'control_loop',
  'control_split',
  // AI
  'ai_agent',
  'ai_agent_inline',
  // Skill
  'skill_input',
  'skill_output',
] as const;

/** Derived from WORKFLOW_NODE_TYPES — do not edit manually. */
export type WorkflowNodeType = (typeof WORKFLOW_NODE_TYPES)[number];

/**
 * Workflow Statuses — runtime constant + derived type.
 */
export const WORKFLOW_STATUSES = ['active', 'inactive', 'draft', 'archived'] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

/**
 * Execution Statuses — runtime constant + derived type.
 */
export const WORKFLOW_EXECUTION_STATUSES = ['pending', 'running', 'completed', 'failed', 'cancelled', 'suspended'] as const;
export type WorkflowExecutionStatus = (typeof WORKFLOW_EXECUTION_STATUSES)[number];

/**
 * Node Run Entry Status
 */
export type NodeRunEntryStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'suspended';

// ============================================================
// NODE CONFIGURATION INTERFACES
// ============================================================

/**
 * Catálogo canônico de operadores de condição/filtro do motor de workflows.
 * FONTE ÚNICA — o ConditionEvaluator do backend, o buildMongoFilterConditions
 * (dispatchers + preview) e o FILTER_OPERATORS da UI derivam deste catálogo.
 *
 * 'greater_or_equal' e 'less_or_equal' são ALIASES aceitos em runtime
 * (normalizados para 'greater_than_or_equal'/'less_than_or_equal') porque
 * configs históricos criados pela UI usam essa grafia.
 */
export const WORKFLOW_CONDITION_OPERATORS = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'greater_than',
  'less_than',
  'greater_than_or_equal',
  'less_than_or_equal',
  'greater_or_equal',   // alias legado (UI) de greater_than_or_equal
  'less_or_equal',      // alias legado (UI) de less_than_or_equal
  'is_empty',
  'is_not_empty',
  'is_null',
  'is_not_null',
  'in',
  'not_in',
  'matches_regex',
] as const;

export type WorkflowConditionOperator = typeof WORKFLOW_CONDITION_OPERATORS[number];

/**
 * Filter Condition - Standard format for workflow filters
 * Used by triggers and conditions to filter entities
 */
export interface FilterCondition {
  /** Field path to evaluate (e.g., "status", "lead.stepId", "{{contact.tags}}") */
  field: string;
  /** Comparison operator (catálogo canônico WORKFLOW_CONDITION_OPERATORS) */
  operator: WorkflowConditionOperator;
  /** Value to compare against */
  value: string | number | boolean | null | string[] | number[];
}

/**
 * Webhook Trigger Configuration
 */
export interface WebhookTriggerConfig {
  webhookId?: string;
  secret?: string;
}

/**
 * Schedule Trigger Configuration (Cron)
 */
export interface ScheduleTriggerConfig {
  cronExpression: string;
  timezone?: string;
}

/**
 * Event Trigger Configuration
 */
export interface EventTriggerConfig {
  eventType: WorkflowEventType;
  /**
   * Para eventos *.updated: dispara apenas se algum destes campos estiver
   * na lista de campos alterados publicada pelo evento (`changes`).
   * Vazio/ausente = dispara em qualquer alteração.
   */
  watchFields?: string[];
  filters?: FilterCondition[];
}

/**
 * Date Field Entity Types - All supported entity types for date field triggers
 */
export type DateFieldEntityType = 'contact' | 'lead' | 'ticket' | 'conversation' | 'event';

/**
 * Date Fields Map - Maps each entity type to its valid date fields
 * This ensures type-safety when configuring date field triggers
 *
 * IMPORTANT: When adding new date fields to entities, update this map!
 */
export interface DateFieldsMap {
  contact: 'createdAt' | 'updatedAt' | 'lastInteractionAt' | 'birthDate' | 'lastContactedAt';
  lead: 'createdAt' | 'updatedAt' | 'assignedAt' | 'wonDate' | 'lostDate' | 'lastInteractionAt' | 'lastFollowUpAt' | 'lastStepAt' | 'expectedCloseDate' | 'lastActivityAt';
  ticket: 'createdAt' | 'updatedAt' | 'assignedAt' | 'dueDate' | 'firstResponseAt' | 'lastResponseAt' | 'resolvedAt' | 'closedAt' | 'slaBreachTime';
  conversation: 'createdAt' | 'updatedAt' | 'startedAt' | 'closedAt' | 'lastMessageAt' | 'lastMessageFromCustomer' | 'lastMessageFromAgent' | 'assignedAt';
  event: 'startTime' | 'endTime' | 'createdAt' | 'updatedAt';
}

/**
 * Helper type to extract valid date fields for a specific entity type
 */
export type ValidDateFieldsFor<T extends DateFieldEntityType> = DateFieldsMap[T];

/**
 * Date Field Trigger Configuration (Type-Safe with Generics)
 *
 * Uses generics to ensure type-safety between entityType and dateField.
 * TypeScript will enforce that dateField is a valid date field for the specified entity.
 *
 * @example
 * // Type-safe configuration:
 * const config: DateFieldTriggerConfig<'event'> = {
 *   entityType: 'event',
 *   dateField: 'startTime', // ✅ Valid - only 'startTime' | 'endTime' | 'createdAt' | 'updatedAt' allowed
 *   offsetValue: 1,
 *   offsetUnit: 'hours',
 *   offsetDirection: 'before'
 * };
 *
 * // This would cause a TypeScript error:
 * const badConfig: DateFieldTriggerConfig<'event'> = {
 *   entityType: 'event',
 *   dateField: 'startDate', // ❌ Error: 'startDate' is not assignable to 'startTime' | 'endTime' | ...
 *   ...
 * };
 */
export interface DateFieldTriggerConfig<T extends DateFieldEntityType> {
  entityType: T;
  dateField: ValidDateFieldsFor<T>;
  /** Numeric value for the offset (0 or greater) */
  offsetValue: number;
  /** Unit for the offset */
  offsetUnit: 'minutes' | 'hours' | 'days';
  /** 'exact' = disparar exatamente na data (offset é ignorado/zerado pelo motor) */
  offsetDirection: 'before' | 'after' | 'exact';
  filters?: FilterCondition[];
}

/**
 * Union type of all valid date field trigger configs
 * Use this when you need to accept any valid configuration without specifying entity type
 */
export type AnyDateFieldTriggerConfig =
  | DateFieldTriggerConfig<'contact'>
  | DateFieldTriggerConfig<'lead'>
  | DateFieldTriggerConfig<'ticket'>
  | DateFieldTriggerConfig<'conversation'>
  | DateFieldTriggerConfig<'event'>;

/**
 * Inactivity Trigger Configuration
 */
export interface InactivityTriggerConfig {
  entityType: 'conversation' | 'contact' | 'lead' | 'ticket';
  inactivityPeriod: number; // The numeric value (interpreted based on periodUnit)
  periodUnit?: 'seconds' | 'minutes' | 'hours' | 'days'; // default: 'hours' (unificado com o dispatcher em 2026-07-06 — o antigo comentário 'seconds' nunca refletiu o runtime)
  inactivityField?: string; // default por entidade: conversation→lastMessageAt, contact→lastInteractionAt, lead→lastActivityAt, ticket→lastResponseAt (InactivityTriggerDispatcher)
  filters?: FilterCondition[];
  maxTriggersPerEntity?: number; // default: 1
  resetOnActivity?: boolean; // default: true
}

/**
 * Instagram Comment Trigger Configuration
 *
 * - keyword: case-insensitive "contains" match against the comment text.
 *   Empty/absent = any comment triggers.
 * - postId: Instagram media ID (Graph API media id, e.g. "17887498072083520").
 *   Equality match. Empty/absent = all posts/reels of the connected account.
 */
export interface InstagramCommentTriggerConfig {
  keyword?: string;
  postId?: string;
}

/**
 * Instagram Mention Trigger Configuration
 *
 * Fires when the connected professional account is @-mentioned on Instagram —
 * either in a media caption (Meta webhook field 'mentions' with `value.media_id`)
 * or in a comment (`value.comment_id` + `value.media_id`).
 *
 * - keyword: case-insensitive "contains" match against the mention text (the
 *   caption/comment where the account was tagged). Empty/absent = any mention
 *   triggers. When the text cannot be resolved from the webhook (minimal
 *   payload without Advanced Access), an empty keyword still fires; a non-empty
 *   keyword will not match an unresolved (empty) text.
 */
export interface InstagramMentionTriggerConfig {
  keyword?: string;
}

/**
 * Send Message Action Configuration
 */
export interface SendMessageActionConfig {
  // Destino
  targetType?: 'current' | 'new_conversation';
  channelId?: string;
  /**
   * Origem do destinatário quando `targetType='new_conversation'`:
   *  - `context`: usa o contato do contexto do workflow (`inputData.contact.id`)
   *  - `specific`: usa `contactId` fixo configurado
   *  - `trigger_author`: responde o autor do evento (comentário/menção no
   *    Instagram) resolvendo o IGSID de `triggerData.from.id`. O contato é
   *    criado sob demanda quando o comentarista/mentionador ainda não existe
   *    na base. Nesse modo, o canal cai para `triggerData.channelId` quando
   *    `channelId` não é configurado.
   */
  contactSource?: 'context' | 'specific' | 'trigger_author';
  contactId?: string;

  // Conteúdo
  messageType?: 'text' | 'image' | 'audio' | 'video' | 'document';
  message?: string;
  mediaUrl?: string;
  caption?: string;
  filename?: string;

  // Legacy (compat)
  conversationId?: string;
}

/**
 * Send Email Action Configuration
 *
 * Note: `templateId`/`templateVariables` were removed (2026-07-06) — they were
 * never reachable from the UI and `SendEmailStepFactory` ignored `templateId`.
 * Emails are sent as free-form body via SystemEmailService.
 */
export interface SendEmailActionConfig {
  to: string;
  subject: string;
  body: string;
}

/**
 * HTTP Request Action Configuration
 */
export interface HttpRequestActionConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: string | Record<string, unknown>;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * Query Database Action Configuration
 *
 * Queries the RAG databases (databases-documents) — same contract used by the
 * AI agents' search tools. Rewritten 2026-07-06: the old shape
 * `{ collection, operation, query, outputVariable }` targeted a dead Mongo API.
 */
export interface QueryDatabaseActionConfig {
  /** Type of database to search (properties, vehicles, products, services, documents) */
  databaseType: DatabaseType;
  /** Names of the databases to search within (empty = validation error at design time) */
  databaseNames: string[];
  /** Free-text semantic search — supports {{variable}} templates */
  searchText?: string;
  /** Structured filters applied post-vector (aligned with Database{Type}Data schema) */
  structuredFilters?: Record<string, unknown>;
  /** Max results (default defined by the step factory) */
  limit?: number;
}

/**
 * Create Lead Action Configuration
 */
export interface CreateLeadActionConfig {
  /**
   * Source type for the contact ID.
   * - 'context': extract from workflow context (contact, conversation, event)
   * - 'specific': use the `contactId` configured in the node
   * @default 'context'
   */
  contactSource?: 'context' | 'specific';
  contactId?: string;
  funnelId?: string;
  step?: string;
  description?: string;
  value?: number;
  /** Assignment mode — 'auto' uses the funnel's distribution, 'user'/'team' are direct */
  assignTo?: 'auto' | 'user' | 'team';
  /** Target user when assignTo === 'user' */
  userId?: string;
  /** Target team when assignTo === 'team' */
  teamId?: string;
}

/**
 * Update Lead Action Configuration
 */
export interface UpdateLeadActionConfig {
  /**
   * Source type for the lead ID.
   * - 'context': extract from workflow context (lead)
   * - 'specific': use the `leadId` configured in the node
   * @default 'context'
   */
  leadSource?: 'context' | 'specific';
  /** Target lead when leadSource === 'specific' */
  leadId?: string;
  /** Whitelisted lead fields to update — values support {{variable}} templates */
  fields: Record<string, unknown>;
}

/**
 * Send Template Action Configuration
 */
export interface SendTemplateActionConfig {
  /** Channel used to send the template (defines provider + template source) */
  channelId: string;
  /** ID of the approved template to send */
  templateId: string;
  /** Template variables — values support {{variable}} templates */
  templateVariables?: Record<string, string>;
  /** Optional explicit contact — defaults to the contact from workflow context */
  contactId?: string;
}

/**
 * Create Ticket Action Configuration
 */
export interface CreateTicketActionConfig {
  title: string;
  description?: string;
  /** Target pipeline — when omitted, the service resolves the default pipeline */
  pipelineId?: string;
  stageId?: string;
  contactId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Update Contact Action Configuration
 */
export interface UpdateContactActionConfig {
  /**
   * Source type for the contact to update.
   * - 'context' (default): use the contact from workflow context (contact / trigger author)
   * - 'specific': use the `contactId` configured in the node (required in this mode)
   * @default 'context'
   */
  contactSource?: 'context' | 'specific';
  contactId?: string;
  addTags?: string[];
  removeTags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Assign Action Configuration
 */
export interface AssignActionConfig {
  resourceType: 'ticket' | 'conversation' | 'lead';
  resourceId?: string;
  /**
   * Assignment mode written by the UI (AssignConfig.tsx).
   * - 'auto': automatic distribution (context strategy)
   * - 'user': direct assignment to `userId`
   * - 'team': rotation within `teamId`
   */
  assigneeType?: 'auto' | 'user' | 'team';
  userId?: string;
  teamId?: string;
  /** Legacy strategy vocabulary — still accepted via API/AI-modifier */
  strategy?: 'round_robin' | 'least_busy' | 'random' | 'specific_user';
}

/**
 * Set Variable Action Configuration
 */
export interface SetVariableActionConfig {
  /** Nome canônico gravado pela UI (SetVariableConfig.tsx) e pelo AI-modifier. */
  variableName?: string;
  /** Nome legado — aceito pelo step factory como fallback. */
  variable?: string;
  value: string | number | boolean | null;
  expression?: string;
}

/**
 * Create Conversation Action Configuration
 *
 * Creates a new conversation or returns an existing active/waiting conversation
 * for the specified contact. This action is essential for workflows that start
 * from non-conversation triggers (e.g., date field triggers on calendar events)
 * and need to establish a conversation context for AI Agents or messaging actions.
 *
 * The conversation is automatically added to the workflow context after creation,
 * making it available for subsequent nodes that require a conversation.
 */
export interface CreateConversationActionConfig {
  /**
   * Source type for the contact ID.
   * - 'context': Extract from workflow context (contact, event, lead)
   * - 'specific': Use a specific contact ID configured in the node
   * @default 'context'
   */
  contactSourceType?: 'context' | 'specific';

  /**
   * Contact ID to create conversation for.
   * Required when contactSourceType is 'specific'.
   */
  contactId?: string;

  /**
   * Optional channel ID to use for the conversation.
   * If not provided, the system will use the default channel for the contact.
   * Can be a context reference like {{event.channelId}}.
   */
  channelId?: string;
}

/**
 * IF Control Configuration
 */
export interface IfControlConfig {
  condition: string;
  operator?: WorkflowConditionOperator;
  value?: string | number | boolean | null;
}

/**
 * Switch Control Configuration
 */
export interface SwitchControlConfig {
  field: string;
  cases: Array<{
    value: string | number | boolean | null;
    label?: string;
  }>;
  /** default: true — a UI e o motor tratam undefined como habilitado (defaultCase !== false) */
  defaultCase?: boolean;
}

/**
 * Delay Control Configuration
 */
export interface DelayControlConfig {
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

/**
 * Loop Control Configuration
 */
export interface LoopControlConfig {
  items?: string; // Variable name containing array
  maxIterations?: number;
  condition?: string;
}

/**
 * Wait For Control Configuration (control_wait_for)
 * Espera timeout OU evento de cancelamento — duas saídas: 'timeout' | 'event'.
 */
export interface WaitForControlConfig {
  timeout: { duration: number; unit: 'minutes' | 'hours' | 'days' };
  cancelEvent?: {
    eventType: string;      // ex: 'message.received'
    entityType?: string;    // informativo — o significado do matchValue é fixo por eventType
    matchField?: string;    // informativo (não usado pelo motor)
    matchValue?: string;    // template, ex: '{{conversation.id}}'
  };
  /** Smart Delay: se preenchido, SUBSTITUI o timeout (espera até este horário HH:mm). */
  waitUntilTime?: string;
  waitUntilWeekday?: boolean;
}

/**
 * Split Control Configuration (control_split — teste A/B)
 * sourceHandle das edges: 'path-0'..'path-N' (índice do path).
 */
export interface SplitControlConfig {
  paths: Array<{ label: string; weight: number }>;
}

/**
 * AI Agent Node Configuration
 *
 * Executes an existing AI Agent with its own configured tools.
 * The agent uses its own capabilities, customActionIds, and databases.
 */
export interface AIAgentNodeConfig {
  /** ID of the AI Agent to execute */
  agentId: string;
  /** Context type - defaults to 'conversation' for workflow usage */
  contextType?: 'conversation' | 'contact' | 'lead';
  /** Optional context entity ID (usually derived from workflow context) */
  contextId?: string;
  /** Optional custom prompt to override agent's default */
  customPrompt?: string;
  /** Whether to wait for agent response before continuing workflow */
  waitForResponse?: boolean;
  /** When true, if the conversation has no messages, fetches history from the last conversation of the same contact+channel */
  includeHistory?: boolean;
}

/**
 * AI Agent Inline Node Configuration
 *
 * A standalone Mastra Agent built inline inside the workflow. Unlike AIAgentNodeConfig
 * (which references an existing AIAgent entity), this node defines its own system
 * prompt, model, memory and receives tools dynamically from connected action nodes
 * via the 'tools' targetHandle.
 *
 * Use this when you want a custom AI agent tailored to this workflow, without
 * creating a full AI Agent entity in the database.
 */
export interface AIAgentInlineConfig {
  /** Display name of the agent (used in logs and traces) */
  nodeName?: string;
  /** System prompt that defines the agent behavior */
  systemPrompt: string;
  /** LLM model id (e.g. 'gpt-4o-mini', 'claude-haiku-4-5') — provider resolved automatically */
  model: string;
  /** Sampling temperature (0-2, default: 0.7) */
  temperature?: number;
  /** Maximum tokens for the response */
  maxTokens?: number;
  /** Maximum iterations of the tool-calling loop (default: 5) */
  maxIterations?: number;
  /**
   * Memory mode: 'thread' persists history per conversation, 'ephemeral' is stateless.
   * @default 'ephemeral'
   */
  memoryMode?: 'thread' | 'ephemeral';
  /** Input template (supports {{variable}} substitution from workflow context) */
  input: string;
  /**
   * IDs of workflow nodes connected as tools (via 'tools' targetHandle).
   * Auto-populated by the WorkflowExecutor when processing edges with targetHandle='tools'.
   */
  toolNodeIds?: string[];
  /** Preferred context type (defaults to 'conversation') */
  contextType?: 'conversation' | 'contact' | 'lead';
}

/**
 * Create Database Document Action Configuration
 * Creates a new document in the databases-documents collection.
 * Used for blog article generation, knowledge base entries, etc.
 */
export interface CreateDatabaseDocumentActionConfig {
  /** ID do banco de dados onde salvar o documento */
  databaseId: string;
  /** Tipo do documento (default: 'documents') */
  documentType?: string;
  /** Título — suporta {{variável}} */
  title: string;
  /** Conteúdo — suporta {{variável}} */
  content: string;
  /** Resumo — suporta {{variável}} */
  summary?: string;
  /** Categoria do documento (default: 'article') */
  category?: string;
  /** Autor — suporta {{variável}} */
  author?: string;
  /** Keywords — separadas por vírgula ou {{variável}} */
  keywords?: string;
  /** Status inicial (default: 'draft') */
  itemStatus?: 'published' | 'draft';
}

/**
 * Skill Input Node Configuration
 *
 * Entry point of a workflow being used as a skill.
 * Replaces the trigger for skill-type workflows and carries the skill metadata.
 */
export interface SkillInputConfig {
  /** Descrição que o LLM lê pra decidir quando chamar */
  description: string;
  /** Modo de execução do skill */
  executionMode: 'sync' | 'async';
  /** JSON Schema dos parâmetros de entrada */
  inputSchema: {
    type: 'object';
    properties: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'array';
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
  /** JSON Schema do retorno (opcional) */
  outputSchema?: {
    type: 'object';
    properties: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      description?: string;
    }>;
  };
}

/**
 * Skill Output Node Configuration
 *
 * Marks the exit point of a workflow being used as a skill.
 * Maps workflow variables to the skill's output payload.
 */
export interface SkillOutputConfig {
  /** Mapeamento de variáveis do contexto para o output do skill.
   *  Ex: { "precoTotal": "{{variables.total}}" } */
  outputMapping: Record<string, string>;
}

/**
 * Node Configuration - Union of all config types
 */
export type NodeConfig =
  | WebhookTriggerConfig
  | ScheduleTriggerConfig
  | EventTriggerConfig
  | AnyDateFieldTriggerConfig
  | InactivityTriggerConfig
  | InstagramCommentTriggerConfig
  | InstagramMentionTriggerConfig
  | SendMessageActionConfig
  | SendEmailActionConfig
  | HttpRequestActionConfig
  | QueryDatabaseActionConfig
  | CreateLeadActionConfig
  | UpdateLeadActionConfig
  | SendTemplateActionConfig
  | CreateTicketActionConfig
  | UpdateContactActionConfig
  | AssignActionConfig
  | SetVariableActionConfig
  | IfControlConfig
  | SwitchControlConfig
  | DelayControlConfig
  | LoopControlConfig
  | WaitForControlConfig
  | SplitControlConfig
  | AIAgentNodeConfig
  | AIAgentInlineConfig
  | CreateDatabaseDocumentActionConfig
  | SkillInputConfig
  | SkillOutputConfig
  // LegacyNodeConfig fallback — nós sem interface canônica ainda dependem disto
  // (action_send_media, action_add_tag, action_remove_tag, action_internal_notification,
  // action_find_leads, trigger_instagram_comment, trigger_instagram_mention e
  // configs legadas gravadas no DB).
  | Record<string, unknown>;

// ============================================================
// WORKFLOW VARIABLE TYPES
// ============================================================

/**
 * Workflow Variable Value - Type-safe recursive value type for workflow variables
 */
export type WorkflowVariableValue =
  | string
  | number
  | boolean
  | null
  | WorkflowVariableValue[]
  | { [key: string]: WorkflowVariableValue };

/**
 * Workflow Variables Record
 */
export type WorkflowVariables = Record<string, WorkflowVariableValue>;

// ============================================================
// WORKFLOW DEFINITION
// ============================================================

/**
 * Workflow Node Position
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Workflow Node Data
 */
export interface WorkflowNodeData {
  label: string;
  description?: string;
  config: NodeConfig;
}

/**
 * Workflow Node
 */
export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: NodePosition;
  data: WorkflowNodeData;
}

/**
 * Workflow Edge
 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | undefined;
  targetHandle?: string | undefined;
  label?: string | undefined;
  condition?: string | undefined;
}

/**
 * Workflow Definition
 */
/**
 * Viewport configuration for React Flow
 */
export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: WorkflowVariables | undefined;
  version?: number | undefined;
  viewport?: WorkflowViewport | undefined;
}

// ============================================================
// WORKFLOW FOLDER
// ============================================================

/**
 * Workflow Folder Entity (Database Document)
 */
export interface WorkflowFolder {
  _id?: ObjectId;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: ObjectId;
  order?: number;
  appId: ObjectId;
  companyId: ObjectId;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Workflow Folder Response (API Response)
 */
export interface WorkflowFolderResponse extends Omit<WorkflowFolder, '_id' | 'parentId' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  parentId?: string;
  appId: string;
  companyId: string;
  workflowCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Create Workflow Folder Request
 */
export interface CreateWorkflowFolderRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  order?: number;
}

/**
 * Update Workflow Folder Request
 */
export interface UpdateWorkflowFolderRequest {
  name?: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  parentId?: string | null;
  order?: number;
}

/**
 * Workflow Folder Query Parameters
 */
export interface WorkflowFolderQuery {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Workflow Folder List Response (Paginated)
 */
export interface WorkflowFolderListResponse {
  items: WorkflowFolderResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// WORKFLOW ENTITY
// ============================================================

/**
 * Workflow Entity (Database Document)
 */
export interface Workflow {
  _id?: ObjectId;
  name: string;
  description?: string;
  status: WorkflowStatus;
  definition: WorkflowDefinition;
  folderId?: ObjectId;
  /** Classificação de uso. Default: 'automation' */
  usageType?: 'automation' | 'skill';
  /** Environment where this workflow was created (development, production, etc.) */
  environment?: string;
  appId: ObjectId;
  companyId: ObjectId;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Workflow Response (API Response)
 */
export interface WorkflowResponse extends Omit<Workflow, '_id' | 'folderId' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  folderId?: string;
  appId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ============================================================
// WORKFLOW EXECUTION
// ============================================================

/**
 * Single run entry for a node (supports multiple iterations/retries).
 * Inspired by n8n runData format: one entry per execution attempt.
 */
export interface NodeRunEntry {
  runIndex: number;                    // 0, 1, 2... (iterações/retries)
  status: NodeRunEntryStatus;
  startedAt: string;                   // ISO string (NÃO Date)
  completedAt?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  duration?: number;
  suspendedPayload?: unknown;          // payload retornado pelo suspend() do Mastra
}

/**
 * Snapshot metadata for suspended/resumed executions (Mastra suspend/resume).
 */
export interface WorkflowSnapshotMeta {
  runId: string;
  workflowId: string;
  status: 'running' | 'suspended' | 'completed' | 'failed' | 'cancelled';
  suspendedAt?: string;
  resumeAt?: string;
}

/**
 * Workflow Execution Entity (Database Document)
 */
export interface WorkflowExecution {
  _id?: ObjectId;
  workflowId: ObjectId;
  workflowName?: string;
  status: WorkflowExecutionStatus;
  triggerType: WorkflowNodeType;
  triggerData?: Record<string, unknown>;
  context: Record<string, unknown>;
  variables: WorkflowVariables;
  /** Map<nodeId, run entries[]> — formato runData estilo n8n */
  runData: Record<string, NodeRunEntry[]>;
  /** Ordem de primeira execução dos nós, para rendering da UI timeline */
  nodeOrder: string[];
  currentNodeId?: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  duration?: number;
  /** Indicates if this execution was triggered via test mode (for tracking/audit purposes only) */
  isTest?: boolean;
  appId: ObjectId;
  companyId: ObjectId;
  /**
   * UUID do run Mastra associado a esta execução.
   * Persiste o vínculo mastraRunId → executionId mesmo após restart do processo
   * (o Map em memória do ExecutionRecorder é transitório).
   * Usado por findExecutionIdByRunId para resume de runs suspensos.
   */
  mastraRunId?: string;
}

/**
 * Workflow Execution Response (API Response)
 */
export interface WorkflowExecutionResponse extends Omit<WorkflowExecution, '_id' | 'workflowId' | 'appId' | 'companyId' | 'startedAt' | 'completedAt'> {
  id: string;
  workflowId: string;
  appId: string;
  companyId: string;
  startedAt: string;
  completedAt?: string;
}

// ============================================================
// WORKFLOW TRIGGER COUNTS
// ============================================================

/**
 * Workflow Trigger Count (for inactivity triggers)
 */
export interface WorkflowTriggerCount {
  _id?: ObjectId;
  workflowId: ObjectId;
  entityType: 'conversation' | 'contact' | 'lead' | 'ticket';
  entityId: string;
  triggerCount: number;
  lastTriggeredAt: Date;
  resetAt?: Date;
  appId: ObjectId;
  companyId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workflow Trigger Count Response
 */
export interface WorkflowTriggerCountResponse extends Omit<WorkflowTriggerCount, '_id' | 'workflowId' | 'appId' | 'companyId' | 'lastTriggeredAt' | 'resetAt' | 'createdAt' | 'updatedAt'> {
  id: string;
  workflowId: string;
  appId: string;
  companyId: string;
  lastTriggeredAt: string;
  resetAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// WORKFLOW EVENTS
// ============================================================

/**
 * Workflow Event Types
 *
 * Members under "Planned / no publisher yet" are offered by the trigger UI but
 * have no publish call site in the backend today — workflows subscribed to them
 * never fire. Kept in the union to avoid breaking existing consumers/configs;
 * adding a publisher promotes the member to its category group above.
 */
export type WorkflowEventType =
  // Messages
  | 'message.received'
  | 'message.sent'
  // Conversations
  | 'conversation.created'
  | 'conversation.updated'
  | 'conversation.closed'
  | 'conversation.assigned'
  // Contacts
  | 'contact.created'
  | 'contact.updated'
  | 'contact.tag_added'
  | 'contact.tag_removed'
  // Leads
  | 'lead.created'
  | 'lead.updated'
  | 'lead.stage_changed'
  | 'lead.won'
  | 'lead.lost'
  // Tickets
  | 'ticket.created'
  | 'ticket.updated'
  | 'ticket.status_changed'
  | 'ticket.assigned'
  | 'ticket.resolved'
  | 'ticket.closed'
  // Calendar Events
  | 'calendar_event.created'
  | 'calendar_event.updated'
  | 'calendar_event.cancelled'
  // Databases
  | 'database.document.created'
  | 'database.document.updated'
  // Forms
  | 'form.submitted'
  // Custom
  | 'custom.event'
  // --- Planned / no publisher yet ---
  | 'message.delivered'
  | 'message.read'
  | 'conversation.reopened'
  | 'conversation.inactive'
  | 'contact.deleted'
  | 'contact.birthday'
  | 'contact.inactive'
  | 'lead.inactive'
  | 'webhook.received'
  | 'instagram.comment.received'
  | 'instagram.mention.received'
  | 'facebook.comment.received';

/**
 * Workflow Event
 */
export interface WorkflowEvent {
  type: WorkflowEventType;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  appId: string;
  companyId: string;
  workflowId?: string;
  executionId?: string;
  timestamp: Date;
}

// ============================================================
// API REQUESTS
// ============================================================

/**
 * Create Workflow Request
 */
export interface CreateWorkflowRequest {
  name: string;
  description?: string | undefined;
  status?: WorkflowStatus | undefined;
  definition: WorkflowDefinition;
  folderId?: string | undefined;
  /** Environment where this workflow is being created (auto-set by backend if not provided) */
  environment?: string | undefined;
}

/**
 * Update Workflow Request
 */
export interface UpdateWorkflowRequest {
  name?: string | undefined;
  description?: string | undefined;
  status?: WorkflowStatus | undefined;
  definition?: WorkflowDefinition | undefined;
  folderId?: string | null | undefined;
}

/**
 * Workflow Query Parameters
 */
export interface WorkflowQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  status?: WorkflowStatus | undefined;
  folderId?: string | null | undefined;
  /** Filter workflows by environment */
  environment?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

/**
 * Workflow Execution Query Parameters
 */
export interface WorkflowExecutionQuery {
  page?: number | undefined;
  limit?: number | undefined;
  workflowId?: string | undefined;
  status?: WorkflowExecutionStatus | undefined;
  triggerType?: WorkflowNodeType | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

/**
 * Trigger Workflow Request
 */
export interface TriggerWorkflowRequest {
  workflowId: string;
  triggerData?: Record<string, unknown>;
  variables?: Record<string, unknown>;
}

// ============================================================
// WORKFLOW EXECUTION CONTEXT
// ============================================================

/**
 * Execution Context - Available to all nodes during execution
 */
export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  appId: string;
  companyId: string;
  triggerType: WorkflowNodeType;
  triggerData: Record<string, unknown>;
  variables: Record<string, unknown>;
  metadata: Record<string, unknown>;
  // Entity references
  conversation?: {
    id: string;
    contactId?: string;
    channelId?: string;
    agentId?: string;
    status?: string;
  };
  contact?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    tags?: string[];
  };
  lead?: {
    id: string;
    contactId?: string;
    funnelId?: string;
    step?: string;
    value?: number;
  };
  ticket?: {
    id: string;
    subject?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  };
  event?: {
    id: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    contactId?: string;
    channelId?: string;
    attendees?: Array<{ contactId?: string; email?: string; name?: string }>;
  };
}

// ============================================================
// NODE HANDLER INTERFACES
// ============================================================

/**
 * Node Handler Result
 */
export interface NodeHandlerResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  nextNodes?: string[];
  skipRemaining?: boolean;
}

/**
 * Node Handler Interface
 *
 * The optional third `workflow` parameter allows handlers that need access to
 * the full workflow definition (e.g. AIAgentInlineHandler builds tools from
 * connected action nodes). Most handlers ignore it.
 */
export interface INodeHandler {
  nodeType: WorkflowNodeType;
  execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext,
    workflow?: WorkflowResponse
  ): Promise<NodeHandlerResult>;
  validate?(node: WorkflowNode): boolean | string;
}

// ============================================================
// WORKFLOW BUILDER TYPES (Frontend)
// ============================================================

/**
 * Node Category
 */
export type NodeCategory = 'triggers' | 'actions' | 'controls' | 'ai';

/**
 * Node Palette Item
 */
export interface NodePaletteItem {
  type: WorkflowNodeType;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultConfig: Partial<NodeConfig>;
}

/**
 * Workflow Builder State
 */
export interface WorkflowBuilderState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isDirty: boolean;
  isValid: boolean;
  validationErrors: string[];
}

/**
 * Workflow Validation Result
 */
export interface WorkflowValidationResult {
  isValid: boolean;
  errors: Array<{
    nodeId?: string;
    edgeId?: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

// ============================================================================
// EXPORT / IMPORT (portabilidade)
// ============================================================================

export type WorkflowRefType =
  | 'channel' | 'funnel' | 'funnelStep' | 'pipeline' | 'pipelineStage'
  | 'agent' | 'template' | 'user' | 'team' | 'contact' | 'database';

export interface WorkflowExportRef {
  token: string;              // "$ref:1" — único no arquivo
  type: WorkflowRefType;
  name: string | null;        // nome do recurso no export (pista pro wizard)
  sourceId: string;           // ObjectId original — usado pra auto-resolver (backup)
  required: boolean;
  dependsOn?: string;         // token do pai (funnelStep→funnel, pipelineStage→pipeline)
}

export interface WorkflowExportFolder {
  tempId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentTempId?: string;
}

export interface WorkflowExportEntry {
  name: string;
  description?: string;
  usageType?: 'automation' | 'skill';
  folderTempId?: string;      // só no bundle
  definition: WorkflowDefinition;
}

export interface WorkflowExportFile {
  formatVersion: 1;
  kind: 'workflow' | 'bundle';
  exportedAt: string;
  folders?: WorkflowExportFolder[];
  workflows: WorkflowExportEntry[];
  references: WorkflowExportRef[];
}

export interface WorkflowImportPreviewRef extends WorkflowExportRef {
  resolved: boolean;          // sourceId existe na company/tipo atual
}

export interface WorkflowImportPreview {
  kind: 'workflow' | 'bundle';
  folderCount: number;
  workflowCount: number;
  references: WorkflowImportPreviewRef[];
  warnings: string[];
}

export interface WorkflowImportRequest {
  file: WorkflowExportFile;
  mappings: Record<string, string>;   // token → novo ObjectId (inclui auto-resolvidos)
  targetFolderId?: string | null;      // onde colocar (kind:'workflow')
}

export interface WorkflowImportResult {
  createdWorkflowIds: string[];
  createdFolderIds: string[];
  warnings: string[];
}
