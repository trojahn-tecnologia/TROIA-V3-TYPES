import { ObjectId } from 'mongodb';
import type { DatabaseType } from './databases';
/**
 * Node Types - All supported node types for workflows.
 *
 * SINGLE SOURCE OF TRUTH: add new node types here only.
 * The WorkflowNodeType union is derived from this array so that
 * runtime validators (Zod enums) can import WORKFLOW_NODE_TYPES
 * directly and stay in sync automatically.
 */
export declare const WORKFLOW_NODE_TYPES: readonly ["trigger_webhook", "trigger_schedule", "trigger_event", "trigger_manual", "trigger_date_field", "trigger_inactivity", "trigger_instagram_comment", "trigger_instagram_mention", "action_send_message", "action_send_email", "action_send_template", "action_send_media", "action_http_request", "action_query_database", "action_create_lead", "action_update_lead", "action_update_contact", "action_add_tag", "action_remove_tag", "action_assign", "action_set_variable", "action_create_conversation", "action_create_ticket", "action_internal_notification", "action_find_leads", "action_create_database_document", "action_mirror_media", "action_voice_clone", "action_voice_tts", "action_voice_clone_delete", "action_create_checklist", "action_find_unit", "action_find_user", "action_find_contact", "action_url_to_pdf", "action_nfe_pdf", "control_if", "control_switch", "control_wait_for", "control_loop", "control_split", "control_retry_scope", "ai_agent", "ai_agent_inline", "skill_input", "skill_output"];
/** Derived from WORKFLOW_NODE_TYPES — do not edit manually. */
export type WorkflowNodeType = (typeof WORKFLOW_NODE_TYPES)[number];
/**
 * Workflow Statuses — runtime constant + derived type.
 */
export declare const WORKFLOW_STATUSES: readonly ["active", "inactive", "draft", "archived"];
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
/**
 * Pausa automática (2026-08-22): um workflow ativo vira `inactive` sozinho
 * quando as últimas N execuções terminadas (sem as de teste) falharam, ou
 * quando um canal que ele usa é excluído. `autoPause` guarda o motivo; é
 * limpo ao reativar.
 */
export declare const WORKFLOW_AUTO_PAUSE_CONSECUTIVE_FAILURES = 10;
export declare const WORKFLOW_AUTO_PAUSE_REASONS: readonly ["consecutive_failures", "channel_deleted"];
export type WorkflowAutoPauseReason = (typeof WORKFLOW_AUTO_PAUSE_REASONS)[number];
export interface WorkflowAutoPauseDetails {
    /** `consecutive_failures`: quantas falhas seguidas (= a constante no momento). */
    consecutiveFailures?: number;
    /** `consecutive_failures`: `error` da execução que fechou a sequência. */
    lastError?: string;
    /** `channel_deleted`: canal excluído. */
    channelId?: string;
    channelName?: string;
}
export interface WorkflowAutoPauseInfo {
    reason: WorkflowAutoPauseReason;
    at: Date;
    details: WorkflowAutoPauseDetails;
}
/** Forma na API (`at` em ISO). */
export interface WorkflowAutoPauseResponse {
    reason: WorkflowAutoPauseReason;
    at: string;
    details: WorkflowAutoPauseDetails;
}
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
 * Catálogo canônico de operadores de condição/filtro do motor de workflows.
 * FONTE ÚNICA — o ConditionEvaluator do backend, o buildMongoFilterConditions
 * (dispatchers + preview) e o FILTER_OPERATORS da UI derivam deste catálogo.
 *
 * 'greater_or_equal' e 'less_or_equal' são ALIASES aceitos em runtime
 * (normalizados para 'greater_than_or_equal'/'less_than_or_equal') porque
 * configs históricos criados pela UI usam essa grafia.
 */
export declare const WORKFLOW_CONDITION_OPERATORS: readonly ["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "greater_than", "less_than", "greater_than_or_equal", "less_than_or_equal", "greater_or_equal", "less_or_equal", "is_empty", "is_not_empty", "is_null", "is_not_null", "in", "not_in", "matches_regex"];
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
    conversation: 'createdAt' | 'updatedAt' | 'startedAt' | 'closedAt' | 'lastMessageAt' | 'lastMessageFromCustomer' | 'assignedAt' | 'slaBreachTime';
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
export type AnyDateFieldTriggerConfig = DateFieldTriggerConfig<'contact'> | DateFieldTriggerConfig<'lead'> | DateFieldTriggerConfig<'ticket'> | DateFieldTriggerConfig<'conversation'> | DateFieldTriggerConfig<'event'>;
/**
 * Inactivity Trigger Configuration
 */
export interface InactivityTriggerConfig {
    entityType: 'conversation' | 'contact' | 'lead' | 'ticket';
    inactivityPeriod: number;
    periodUnit?: 'seconds' | 'minutes' | 'hours' | 'days';
    inactivityField?: string;
    filters?: FilterCondition[];
    maxTriggersPerEntity?: number;
    resetOnActivity?: boolean;
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
 * Business hours gate para nodes de SAÍDA de workflows (2026-08).
 *
 * Quando `enabled: true` e o run atinge o node FORA da janela, o run SUSPENDE
 * (snapshot + BullMQ delayed job) e retoma no próximo instante válido — só
 * então o envio acontece. Payload de suspensão: `{ reason: 'business_hours',
 * resumeAt }` (ver BusinessHoursSuspendPayload no backend).
 *
 * Shape deliberadamente compatível com a futura entidade `business-calendars`
 * (DOCS/superpowers/specs/2026-07-27-sla-helpdesk-pesquisa.md §6.2): weekday
 * domingo-zero como ShiftSchedule.weekdays, janela única por dia — o calendário
 * futuro generaliza para múltiplos slots/dia. SEM feriados no MVP.
 */
export interface WorkflowBusinessHoursConfig {
    /** Ativo somente quando `=== true`. `false` preserva a janela configurada sem aplicá-la. */
    enabled: boolean;
    /** Dias ativos, 0=Dom..6=Sáb. Vazio é inválido (rejeitado no save). */
    weekdays: number[];
    /** "HH:mm" — início da janela (inclusive). */
    startTime: string;
    /** "HH:mm" — fim da janela (exclusive). Deve ser > startTime (sem janela overnight no MVP). */
    endTime: string;
    /** IANA tz. Ausente = timezone da company (fallback America/Sao_Paulo). */
    timezone?: string;
}
/**
 * Node types de saída que suportam `businessHours` (UI + validação backend).
 * `action_send_media` e `action_internal_notification` não têm interface de
 * config canônica neste pacote (fallback `Record<string, unknown>`) mas também
 * aceitam o campo — as interfaces locais vivem nos respectivos step factories.
 */
export declare const BUSINESS_HOURS_NODE_TYPES: readonly ["action_send_message", "action_send_template", "action_send_media", "action_send_email", "action_internal_notification", "ai_agent", "ai_agent_inline"];
export type BusinessHoursNodeType = (typeof BUSINESS_HOURS_NODE_TYPES)[number];
/**
 * Send Message Action Configuration
 */
export interface SendMessageActionConfig {
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
     *  - `variable`: contactId vem de `{{variável}}` do fluxo (ex.: saída de um node de busca)
     */
    contactSource?: 'context' | 'specific' | 'trigger_author' | 'variable';
    contactId?: string;
    messageType?: 'text' | 'image' | 'audio' | 'video' | 'document';
    message?: string;
    mediaUrl?: string;
    caption?: string;
    filename?: string;
    conversationId?: string;
    /** Janela de horário comercial — fora dela o run suspende até o próximo horário válido. */
    businessHours?: WorkflowBusinessHoursConfig;
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
    /** Janela de horário comercial — fora dela o run suspende até o próximo horário válido. */
    businessHours?: WorkflowBusinessHoursConfig;
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
    /**
     * Aguardar callback externo (2026-07): após disparar a requisição, o run
     * SUSPENDE e só retoma quando o provedor externo fizer POST no endpoint
     * público `/api/workflows/callbacks/:correlationId` (URL-capacidade — o
     * template `{{$.__callback.url}}` fica disponível para o body/headers) ou
     * quando `callbackTimeoutMs` expirar. Output do node vira
     * `{ outcome: 'success'|'error'|'timeout', body: <corpo do callback> }`.
     */
    awaitCallback?: boolean;
    /** Timeout da espera do callback em ms (default 20min). */
    callbackTimeoutMs?: number;
    /**
     * Predicado que precisa casar no corpo do callback para RETOMAR com sucesso
     * (ex.: Suno music `{path:'data.callbackType', equals:'complete'}`).
     * Ausente = qualquer callback retoma. Callbacks que não casam nem com
     * resumeWhen nem com failWhen são ignorados com 200 (estágios intermediários).
     */
    resumeWhen?: WorkflowCallbackPredicate;
    /**
     * Predicado de FALHA no corpo do callback (a Suno sinaliza erro no corpo,
     * não no HTTP — ex.: `{path:'data.status', equals:'fail'}`). Casou → retoma
     * pela saída de erro (`outcome:'error'`).
     */
    failWhen?: WorkflowCallbackPredicate;
}
/** Predicado simples caminho==valor avaliado no corpo de um callback externo. */
export interface WorkflowCallbackPredicate {
    /** Caminho dot-notation no corpo do callback (ex.: 'data.callbackType'). */
    path: string;
    /** Valor exato (comparação por String(valor) === equals). */
    equals: string;
}
/**
 * Retry Scope Control Configuration (2026-07)
 *
 * Subgrafo retentável: os nós FILHOS (React Flow `parentId`) formam um
 * sub-workflow que é reexecutado (Mastra `.dountil`) até a iteração terminar
 * sem falha ou `maxAttempts` esgotar. Falha de iteração = node interno lançou
 * erro OU awaitCallback saiu com `outcome` 'error'/'timeout'.
 */
export interface RetryScopeControlConfig {
    /** Máximo de tentativas do subgrafo (default 3, cap 5). */
    maxAttempts?: number;
    /** Delay entre tentativas em ms (default 5000, cap 60000 — inline sleep). */
    retryDelayMs?: number;
}
/**
 * Mirror Media Action Configuration (2026-07)
 *
 * Baixa uma URL externa (SSRF-guard aplicado) e re-hospeda no S3 do sistema —
 * necessário para mídias de APIs externas com URL expirável (ex.: Suno).
 * `trimSeconds` corta os primeiros N segundos de um MP3 (frame-walking JS,
 * sem re-encode) — usado para gerar prévias configuráveis.
 */
export interface MirrorMediaActionConfig {
    /** URL externa do arquivo (aceita templates). */
    url: string;
    /** Prefixo do nome do arquivo no S3 (default 'workflow-media'). */
    filenamePrefix?: string;
    /** Se definido, corta os primeiros N segundos do MP3 (prévia). */
    trimSeconds?: number;
}
/**
 * Voice Clone Action Configuration (2026-07)
 *
 * Clona a voz de uma URL de áudio no provider de TTS (ElevenLabs via
 * app-integrations) e gera uma amostra falada expressiva hospedada no S3.
 * O clone é EFÊMERO (registro + janitor no módulo voices) — deletar via
 * action_voice_clone_delete ao final do fluxo.
 */
export interface VoiceCloneActionConfig {
    /** URL pública do áudio com a voz a clonar (aceita templates). */
    voiceUrl: string;
    /** Texto da amostra gerada (default: texto expressivo pt-BR do sistema). */
    sampleText?: string;
    /** voice_settings do provider (fidelidade). */
    voiceSettings?: {
        stability?: number;
        similarityBoost?: number;
        style?: number;
        speakerBoost?: boolean;
    };
}
/** TTS com um clone efêmero existente → mp3 no S3. */
export interface VoiceTtsActionConfig {
    /** cloneId retornado pelo action_voice_clone (aceita templates). */
    cloneId: string;
    /** Texto a sintetizar (aceita templates — ex.: frase de verificação). */
    text: string;
}
/** Deleta um clone efêmero (libera slot no provider). */
export interface VoiceCloneDeleteActionConfig {
    /** cloneId a deletar (aceita templates). */
    cloneId: string;
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
     * - `variable`: o `contactId` vem de uma `{{variável}}` do fluxo — ex.: a
     *   saída de um node de busca de contato (`{{variables.clienteContato.contact.id}}`).
     *   Mesmo padrão do `SendMessageActionConfig.contactSource`.
     * @default 'context'
     */
    contactSource?: 'context' | 'specific' | 'variable';
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
    /** Reaproveita lead aberto (não won/lost) do contato no funil em vez de criar. */
    reuseOpenLead?: boolean;
    /** Onde procurar lead aberto ao reaproveitar: só no funil do node (default) ou em qualquer funil. */
    reuseScope?: 'funnel' | 'all';
    /** Unidade onde a venda/captura aconteceu — gravada em lead.capture.unitId (aceita {{variável}}). */
    unitId?: string;
    /** Origem do lead (ex.: 'erp'). Aceita {{variável}}. */
    origin?: string;
    /** Nome em variables onde a saída { lead, reused } é gravada. */
    saveAs?: string;
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
    /** Janela de horário comercial — fora dela o run suspende até o próximo horário válido. */
    businessHours?: WorkflowBusinessHoursConfig;
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
 * Create Checklist Action Configuration (modulo Checklists+Units)
 *
 * Dispara a criacao de um ou mais Checklists a partir de um Form template do
 * tipo 'checklist' (templateId), definindo o(s) destino(s) (units) e quem
 * fica responsavel (assignee) por cada instancia criada.
 */
/**
 * Alvo do node: SEMPRE unidades (sorteadas ou fixas).
 *
 * O modo `context_entity` (criar 1 checklist ligado ao lead/ticket do contexto)
 * foi REMOVIDO em 14/08/2026 por decisão do dono: nunca foi solicitado e só
 * fazia sentido em automação disparada por uma entidade. No gatilho agendado —
 * que é o caso de uso real, o sorteio diário — não existe entidade no contexto,
 * então a configuração salvava, ativava e não criava nada, em silêncio.
 */
export type CreateChecklistTarget = {
    mode: 'draw_units';
    count: number;
} | {
    mode: 'fixed_units';
    unitIds: string[];
};
export type CreateChecklistAssignee = {
    mode: 'unit_manager';
} | {
    mode: 'fixed_user';
    userId: string;
};
export interface CreateChecklistActionConfig {
    templateId: string;
    target: CreateChecklistTarget;
    assignee: CreateChecklistAssignee;
    dueHours?: number;
    addCreatorAsFollower?: boolean;
}
/** Node de busca: unidade por CNPJ/CPF. Saída { found, unit } gravada em variables[saveAs]. */
export interface FindUnitActionConfig {
    document: string;
    saveAs: string;
}
/** Node de busca: usuário por documento → código → email (cascata). Saída { found, user, matchedBy }. */
export interface FindUserActionConfig {
    document?: string;
    code?: string;
    email?: string;
    saveAs: string;
}
/** Node de busca/criação: contato por telefone → email. Saída { found, contact, created }. */
export interface FindContactActionConfig {
    phone?: string;
    email?: string;
    name?: string;
    createIfMissing?: boolean;
    saveAs: string;
}
/**
 * Url To Pdf Action Configuration (Task D2, 2026-08-26)
 *
 * Converte uma PÁGINA WEB em PDF (Gotenberg/Chromium) e hospeda o arquivo no
 * S3, devolvendo a URL pública — é o que anexa a NOTA FISCAL na mensagem de
 * pós-venda (a Linx devolve só o XML; o PDF sai da página pública da SEFAZ).
 * O node é genérico de propósito: serve contrato, proposta, catálogo, recibo.
 *
 * Saída gravada em `variables[saveAs]` (CLAUDE.md NUNCA #91):
 * `{ ok, url, filename, erro }` — `url`/`filename` vazios quando `ok: false`.
 * O node é FAIL-SOFT: nenhuma falha sobe como erro de execução.
 */
export interface UrlToPdfActionConfig {
    /** Página a converter. Aceita template: '{{triggerData.body.documentoFiscal.url}}'. */
    url: string;
    /** Nome do arquivo entregue no WhatsApp. Template. Default 'documento.pdf'. Extensão .pdf é garantida. */
    filename?: string;
    /** Espreme todo o conteúdo numa página só (bom para cupom/nota). Default false. */
    singlePage?: boolean;
    /** Nome da variável do fluxo onde o resultado é guardado (NUNCA #91). Obrigatório. */
    saveAs: string;
}
/**
 * Nfe Pdf Action Configuration (Task D8, 2026-08-26)
 *
 * Gera o PDF da NOTA FISCAL (DANFE NFC-e, modelo 65) a partir do XML
 * autorizado que o coletor do ERP entrega no webhook, hospeda no S3 e devolve
 * a URL pública — é o anexo que o cliente recebe no WhatsApp depois da compra.
 *
 * Diferente do `action_url_to_pdf`, que fotografa uma página de terceiro, aqui
 * o documento é montado por nós a partir do XML: a URL de consulta da SEFAZ
 * sai do próprio arquivo (`infNFeSupl/urlChave`), então uma nota do Rio Grande
 * do Sul nunca imprime o endereço de outro estado.
 *
 * Saída gravada em `variables[saveAs]` (CLAUDE.md NUNCA #91):
 * `{ ok, url, filename, numero, chave, erro }` — campos vazios quando
 * `ok: false`. O node é FAIL-SOFT: nenhuma falha sobe como erro de execução,
 * porque quando ele roda as mensagens de texto já foram entregues ao cliente.
 *
 * Modelo 55 (NF-e) é recusado com `ok: false` e motivo explícito: o DANFE dele
 * tem leiaute próprio (A4, quadros, código de barras) e fica para depois.
 */
export interface NfePdfActionConfig {
    /** XML completo da nota (`nfeProc`). Template: '{{triggerData.body.documentoFiscal.xml}}'. */
    xml: string;
    /** Nome do arquivo entregue no WhatsApp. Template. Default 'Nota fiscal {nNF}.pdf'. */
    filename?: string;
    /** Nome da variável do fluxo onde o resultado é guardado (NUNCA #91). Obrigatório. */
    saveAs: string;
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
 * Loop Control Configuration
 */
export interface LoopControlConfig {
    items?: string;
    maxIterations?: number;
    condition?: string;
}
/**
 * Até quando o node "Aguardar" espera. União discriminada por `mode` —
 * exatamente um dos três formatos.
 *
 * - `duration`: espera um tempo corrido. Teto de 72h (rejeitado no save,
 *   saturado em runtime).
 * - `time`: espera até o próximo HH:mm, no fuso resolvido. `weekdays` (0=Dom..6=Sáb)
 *   restringe os dias aceitos; ausente = qualquer dia.
 * - `business_hours`: espera até a próxima abertura da janela. Se já estiver
 *   DENTRO da janela, o node não suspende — segue na hora.
 */
export type WaitUntilConfig = {
    mode: 'duration';
    duration: number;
    unit: 'minutes' | 'hours' | 'days';
} | {
    mode: 'time';
    time: string;
    weekdays?: number[];
    timezone?: string;
} | {
    mode: 'business_hours';
    businessHours: WorkflowBusinessHoursConfig;
};
/**
 * Wait For Control Configuration (control_wait_for)
 * Espera até `until` OU até o evento de cancelamento — duas saídas: 'timeout' | 'event'.
 */
export interface WaitForControlConfig {
    /**
     * Até quando esperar. Ausente = fallback `{ mode: 'duration', duration: 24, unit: 'hours' }`.
     */
    until?: WaitUntilConfig;
    /** Cancelamento opcional — vale para os TRÊS modos de `until`. */
    cancelEvent?: {
        eventType: string;
        entityType?: string;
        matchField?: string;
        matchValue?: string;
    };
}
/** Teto de espera do modo `duration` (72h). Aplicado no save e em runtime. */
export declare const WAIT_UNTIL_MAX_DURATION_MS: number;
/**
 * Split Control Configuration (control_split — teste A/B)
 * sourceHandle das edges: 'path-0'..'path-N' (índice do path).
 */
export interface SplitControlConfig {
    paths: Array<{
        label: string;
        weight: number;
    }>;
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
    /** Janela de horário comercial — fora dela o run suspende até o próximo horário válido (o agente roda no horário, não de madrugada). */
    businessHours?: WorkflowBusinessHoursConfig;
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
    /**
     * Janela de horário comercial — fora dela o run suspende até o próximo horário
     * válido. Aplica-se ao node inteiro; nodes de ação conectados como TOOLS
     * ignoram o próprio businessHours (suspend indisponível no loop de tool-calling).
     */
    businessHours?: WorkflowBusinessHoursConfig;
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
export type NodeConfig = WebhookTriggerConfig | ScheduleTriggerConfig | EventTriggerConfig | AnyDateFieldTriggerConfig | InactivityTriggerConfig | InstagramCommentTriggerConfig | InstagramMentionTriggerConfig | SendMessageActionConfig | SendEmailActionConfig | HttpRequestActionConfig | QueryDatabaseActionConfig | CreateLeadActionConfig | UpdateLeadActionConfig | FindUnitActionConfig | FindUserActionConfig | FindContactActionConfig | UrlToPdfActionConfig | NfePdfActionConfig | SendTemplateActionConfig | CreateTicketActionConfig | UpdateContactActionConfig | AssignActionConfig | SetVariableActionConfig | IfControlConfig | SwitchControlConfig | LoopControlConfig | WaitForControlConfig | SplitControlConfig | AIAgentNodeConfig | AIAgentInlineConfig | CreateDatabaseDocumentActionConfig | RetryScopeControlConfig | MirrorMediaActionConfig | VoiceCloneActionConfig | VoiceTtsActionConfig | VoiceCloneDeleteActionConfig | SkillInputConfig | SkillOutputConfig | Record<string, unknown>;
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
/**
 * Classificação de uso de um workflow/pasta — 'automation' (default) ou
 * 'skill' (invocável por agentes IA). Workflows e pastas de cada tipo vivem
 * em árvores separadas nas telas de Workflows e de Skills.
 */
export type WorkflowUsageType = 'automation' | 'skill';
export interface WorkflowFolder {
    _id?: ObjectId;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: ObjectId;
    /**
     * Classificação de uso da pasta — separa a árvore de pastas de Workflows
     * (automation) da de Skills. Ausente em docs legados = 'automation'.
     */
    usageType?: WorkflowUsageType;
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
    /** Árvore a que a pasta pertence (Workflows × Skills). Default: 'automation' */
    usageType?: WorkflowUsageType;
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
    /** Filtra pela árvore (Workflows × Skills). Ausente = todas. */
    usageType?: WorkflowUsageType;
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
    /** Presente só quando a última pausa foi automática. Limpo ao reativar. */
    autoPause?: WorkflowAutoPauseInfo;
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
export interface WorkflowResponse extends Omit<Workflow, '_id' | 'folderId' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'autoPause'> {
    id: string;
    folderId?: string;
    appId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    autoPause?: WorkflowAutoPauseResponse;
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
    /**
     * Falha parcial (2026-08-27): pelo menos um galho de um leque paralelo
     * falhou E pelo menos um galho irmão entregou. O `status` continua
     * `'failed'` — o histórico não mente —, mas execuções assim ficam FORA do
     * contador de pausa automática (`getLastNExecutionStatuses`): telefone
     * errado de um contato não pode desligar o fluxo de vendas.
     */
    partialFailure?: boolean;
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
 *
 * Members under "Planned / no publisher yet" are offered by the trigger UI but
 * have no publish call site in the backend today — workflows subscribed to them
 * never fire. Kept in the union to avoid breaking existing consumers/configs;
 * adding a publisher promotes the member to its category group above.
 */
export type WorkflowEventType = 'message.received' | 'message.sent' | 'conversation.created' | 'conversation.updated' | 'conversation.closed' | 'conversation.assigned' | 'contact.created' | 'contact.updated' | 'contact.tag_added' | 'contact.tag_removed' | 'lead.created' | 'lead.updated' | 'lead.stage_changed' | 'lead.won' | 'lead.lost' | 'ticket.created' | 'ticket.updated' | 'ticket.status_changed' | 'ticket.assigned' | 'ticket.resolved' | 'ticket.closed' | 'calendar_event.created' | 'calendar_event.updated' | 'calendar_event.cancelled' | 'database.document.created' | 'database.document.updated' | 'form.submitted' | 'custom.event' | 'message.delivered' | 'message.read' | 'conversation.reopened' | 'conversation.inactive' | 'contact.deleted' | 'contact.birthday' | 'contact.inactive' | 'lead.inactive' | 'webhook.received' | 'instagram.comment.received' | 'instagram.mention.received' | 'facebook.comment.received';
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
    /** Classificação de uso. Default: 'automation' */
    usageType?: WorkflowUsageType | undefined;
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
    /** Classificação de uso (Workflows × Skills) — o backend já aceita no PATCH. */
    usageType?: WorkflowUsageType | undefined;
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
    /** Filtra pela classificação de uso (tela de Workflows × tela de Skills). Ausente = todos. */
    usageType?: WorkflowUsageType | undefined;
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
/**
 * Validação estrutural de workflow (2026-08-27).
 *
 * O backend é a única fonte de verdade das regras estruturais; o editor as
 * consome por `POST /api/workflows/validate`. `nodeIds` é o que permite ao
 * editor pintar de vermelho os nós culpados — o 422 do PATCH não carrega
 * essa informação (o errorHandler só serializa `fieldErrors`).
 */
export declare const WORKFLOW_VALIDATION_CODES: readonly ["NODE_TYPE_DESCONHECIDO", "ARESTA_ORFA", "SEM_ENTRADA", "MULTIPLAS_ENTRADAS", "CICLO", "IF_SEM_CAMINHO", "IF_HANDLE_INVALIDO", "SWITCH_SEM_HANDLE", "SPLIT_HANDLE_INVALIDO", "LOOP_SAIDAS", "WAIT_FOR_SAIDAS", "FANOUT_JUNCAO", "FANOUT_ESPERA", "FANOUT_HORARIO", "SWITCH_HANDLE_NAO_COMPILAVEL", "CONTROL_FLOW_EM_LOOP", "RETRY_SAIDAS", "CONTROL_FLOW_EM_RETRY", "FANOUT_HTTP_AGUARDA", "SEM_GATILHO", "NO_SOLTO", "CONFIG_INVALIDA", "LEGADO"];
export type WorkflowValidationCode = (typeof WORKFLOW_VALIDATION_CODES)[number];
export interface ValidationIssue {
    code: WorkflowValidationCode;
    /** Texto pronto para a tela, em português. */
    message: string;
    /** Nós que o editor deve destacar. Vazio quando o problema não é de um nó. */
    nodeIds: string[];
}
export interface WorkflowValidationResponse {
    isValid: boolean;
    issues: ValidationIssue[];
}
/**
 * `template` = template de MENSAGEM. `checklistTemplate` = modelo de checklist
 * (`Form` com `type: 'checklist'`) — são coleções diferentes, e tratar os dois
 * como `template` fazia o wizard de import oferecer templates de mensagem para
 * remapear o modelo do node "Criar Checklist".
 */
export type WorkflowRefType = 'channel' | 'funnel' | 'funnelStep' | 'pipeline' | 'pipelineStage' | 'agent' | 'template' | 'user' | 'team' | 'contact' | 'database' | 'checklistTemplate' | 'unit';
export interface WorkflowExportRef {
    token: string;
    type: WorkflowRefType;
    name: string | null;
    sourceId: string;
    required: boolean;
    dependsOn?: string;
}
export interface WorkflowExportFolder {
    tempId: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    /** Árvore da pasta na origem (Workflows × Skills). Ausente em arquivos antigos = 'automation'. */
    usageType?: WorkflowUsageType;
    parentTempId?: string;
}
export interface WorkflowExportEntry {
    name: string;
    description?: string;
    usageType?: 'automation' | 'skill';
    folderTempId?: string;
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
    resolved: boolean;
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
    mappings: Record<string, string>;
    targetFolderId?: string | null;
}
export interface WorkflowImportResult {
    createdWorkflowIds: string[];
    createdFolderIds: string[];
    warnings: string[];
}
