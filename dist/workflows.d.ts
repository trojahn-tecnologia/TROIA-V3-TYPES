import { ObjectId } from 'mongodb';
/**
 * Node Types - All supported node types for workflows.
 *
 * SINGLE SOURCE OF TRUTH: add new node types here only.
 * The WorkflowNodeType union is derived from this array so that
 * runtime validators (Zod enums) can import WORKFLOW_NODE_TYPES
 * directly and stay in sync automatically.
 */
export declare const WORKFLOW_NODE_TYPES: readonly ["trigger_webhook", "trigger_schedule", "trigger_event", "trigger_manual", "trigger_date_field", "trigger_inactivity", "trigger_instagram_comment", "action_send_message", "action_send_email", "action_send_template", "action_send_media", "action_http_request", "action_query_database", "action_create_lead", "action_update_lead", "action_update_contact", "action_add_tag", "action_remove_tag", "action_assign", "action_set_variable", "action_create_conversation", "action_create_ticket", "action_internal_notification", "action_find_leads", "control_if", "control_switch", "control_delay", "control_wait_for", "control_loop", "control_split", "ai_agent", "ai_agent_inline", "skill_input", "skill_output"];
/** Derived from WORKFLOW_NODE_TYPES — do not edit manually. */
export type WorkflowNodeType = (typeof WORKFLOW_NODE_TYPES)[number];
/**
 * Workflow Statuses — runtime constant + derived type.
 */
export declare const WORKFLOW_STATUSES: readonly ["active", "inactive", "draft", "archived"];
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
/**
 * Execution Statuses — runtime constant + derived type.
 */
export declare const WORKFLOW_EXECUTION_STATUSES: readonly ["pending", "running", "completed", "failed", "cancelled", "suspended"];
export type WorkflowExecutionStatus = (typeof WORKFLOW_EXECUTION_STATUSES)[number];
/**
 * Node Run Entry Status
 */
export type NodeRunEntryStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'suspended';
/**
 * Filter Condition - Standard format for workflow filters
 * Used by triggers and conditions to filter entities
 */
export interface FilterCondition {
    /** Field path to evaluate (e.g., "status", "lead.step", "{{contact.tags}}") */
    field: string;
    /** Comparison operator */
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'is_empty' | 'is_not_empty';
    /** Value to compare against */
    value: string | number | boolean | null | string[] | number[];
}
/**
 * Webhook Trigger Configuration
 */
export interface WebhookTriggerConfig {
    webhookId?: string;
    secret?: string;
    validatePayload?: boolean;
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
    offsetDirection: 'before' | 'after';
    filters?: FilterCondition[];
}
/**
 * Union type of all valid date field trigger configs
 * Use this when you need to accept any valid configuration without specifying entity type
 */
export type AnyDateFieldTriggerConfig = DateFieldTriggerConfig<'contact'> | DateFieldTriggerConfig<'lead'> | DateFieldTriggerConfig<'ticket'> | DateFieldTriggerConfig<'conversation'> | DateFieldTriggerConfig<'event'>;
/**
 * Inactivity Trigger Configuration
 */
export interface InactivityTriggerConfig {
    entityType: 'conversation' | 'contact' | 'lead' | 'ticket';
    inactivityPeriod: number;
    periodUnit?: 'seconds' | 'minutes' | 'hours' | 'days';
    inactivityField: string;
    filters?: FilterCondition[];
    maxTriggersPerEntity?: number;
    resetOnActivity?: boolean;
}
/**
 * Send Message Action Configuration
 */
export interface SendMessageActionConfig {
    conversationId?: string;
    contactId?: string;
    contactIds?: string[];
    channelId?: string;
    message: string;
    messageType?: 'text' | 'template';
    templateId?: string;
    templateVariables?: Record<string, string>;
    targetType?: 'existing' | 'new_conversation';
}
/**
 * Send Email Action Configuration
 */
export interface SendEmailActionConfig {
    to: string;
    subject: string;
    body: string;
    templateId?: string;
    templateVariables?: Record<string, string>;
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
 */
export interface QueryDatabaseActionConfig {
    collection: string;
    operation: 'find' | 'findOne' | 'count' | 'aggregate';
    query: Record<string, unknown>;
    outputVariable?: string;
}
/**
 * Create Lead Action Configuration
 */
export interface CreateLeadActionConfig {
    contactId?: string;
    funnelId?: string;
    step?: string;
    description?: string;
    value?: number;
    assignToUserId?: string;
}
/**
 * Update Contact Action Configuration
 */
export interface UpdateContactActionConfig {
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
    userId?: string;
    teamId?: string;
    strategy?: 'round_robin' | 'least_busy' | 'random' | 'specific_user';
}
/**
 * Set Variable Action Configuration
 */
export interface SetVariableActionConfig {
    variable: string;
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
    /**
     * Optional variable name to store the created conversation.
     * If provided, the conversation will be stored in context.variables[outputVariable].
     * The conversation is always added to context.conversation regardless of this setting.
     */
    outputVariable?: string;
}
/**
 * IF Control Configuration
 */
export interface IfControlConfig {
    condition: string;
    operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
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
    items?: string;
    maxIterations?: number;
    condition?: string;
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
    /** Memory mode: 'thread' persists history per conversation, 'ephemeral' is stateless */
    memoryMode: 'thread' | 'ephemeral';
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
export type NodeConfig = WebhookTriggerConfig | ScheduleTriggerConfig | EventTriggerConfig | AnyDateFieldTriggerConfig | InactivityTriggerConfig | SendMessageActionConfig | SendEmailActionConfig | HttpRequestActionConfig | QueryDatabaseActionConfig | CreateLeadActionConfig | UpdateContactActionConfig | AssignActionConfig | SetVariableActionConfig | IfControlConfig | SwitchControlConfig | DelayControlConfig | LoopControlConfig | AIAgentNodeConfig | AIAgentInlineConfig | SkillInputConfig | SkillOutputConfig | Record<string, unknown>;
/**
 * Workflow Variable Value - Type-safe recursive value type for workflow variables
 */
export type WorkflowVariableValue = string | number | boolean | null | WorkflowVariableValue[] | {
    [key: string]: WorkflowVariableValue;
};
/**
 * Workflow Variables Record
 */
export type WorkflowVariables = Record<string, WorkflowVariableValue>;
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
/**
 * Single run entry for a node (supports multiple iterations/retries).
 * Inspired by n8n runData format: one entry per execution attempt.
 */
export interface NodeRunEntry {
    runIndex: number;
    status: NodeRunEntryStatus;
    startedAt: string;
    completedAt?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    error?: string;
    duration?: number;
    suspendedPayload?: unknown;
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
/**
 * Workflow Event Types
 */
export type WorkflowEventType = 'message.received' | 'message.sent' | 'message.delivered' | 'message.read' | 'conversation.created' | 'conversation.updated' | 'conversation.closed' | 'conversation.reopened' | 'conversation.assigned' | 'conversation.inactive' | 'contact.created' | 'contact.updated' | 'contact.deleted' | 'contact.tag_added' | 'contact.tag_removed' | 'contact.birthday' | 'contact.inactive' | 'lead.created' | 'lead.updated' | 'lead.stage_changed' | 'lead.won' | 'lead.lost' | 'lead.inactive' | 'ticket.created' | 'ticket.updated' | 'ticket.status_changed' | 'ticket.assigned' | 'ticket.resolved' | 'ticket.closed' | 'calendar_event.created' | 'calendar_event.updated' | 'calendar_event.cancelled' | 'database.document.created' | 'database.document.updated' | 'form.submitted' | 'instagram.comment.received' | 'webhook.received' | 'custom.event';
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
        attendees?: Array<{
            contactId?: string;
            email?: string;
            name?: string;
        }>;
    };
}
/**
 * Entity context for workflow execution.
 * Contains ONLY entity references — no workflow metadata.
 * Built by WorkflowContextBuilder.buildContextFromDoc().
 *
 * This type enforces separation between entity data and workflow execution fields
 * (workflowId, executionId, triggerType, etc.), preventing accidental mixing.
 */
export interface WorkflowEntityContext {
    conversation?: WorkflowExecutionContext['conversation'];
    contact?: WorkflowExecutionContext['contact'];
    lead?: WorkflowExecutionContext['lead'];
    ticket?: WorkflowExecutionContext['ticket'];
    event?: WorkflowExecutionContext['event'];
}
/**
 * Standard parameters for triggering a workflow execution.
 * ALL trigger services MUST use this interface — no exceptions.
 *
 * entityContext is REQUIRED — context must always be pre-built by
 * WorkflowContextBuilder before calling WorkflowTriggerRunner.run().
 */
export interface TriggerWorkflowParams {
    /** Raw MongoDB workflow document */
    workflow: Record<string, unknown>;
    /** Trigger node from workflow definition */
    triggerNode: Record<string, unknown>;
    /** ID of the entity being triggered */
    entityId: string;
    /** Pre-built entity context (REQUIRED — never optional) */
    entityContext: WorkflowEntityContext;
    /** Trigger-specific data (varies by trigger type) */
    triggerData: Record<string, unknown>;
}
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
    execute(node: WorkflowNode, context: WorkflowExecutionContext, workflow?: WorkflowResponse): Promise<NodeHandlerResult>;
    validate?(node: WorkflowNode): boolean | string;
}
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
