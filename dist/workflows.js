"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_VALIDATION_CODES = exports.WAIT_UNTIL_MAX_DURATION_MS = exports.WAIT_CANCEL_EVENT_ACTORS = exports.WORKFLOW_EVENT_ACTORS = exports.BUSINESS_HOURS_NODE_TYPES = exports.WORKFLOW_CONDITION_OPERATORS = exports.WORKFLOW_EXECUTION_STATUSES = exports.WORKFLOW_AUTO_PAUSE_REASONS = exports.WORKFLOW_AUTO_PAUSE_CONSECUTIVE_FAILURES = exports.WORKFLOW_STATUSES = exports.WORKFLOW_NODE_TYPES = void 0;
exports.readWaitCancelEvents = readWaitCancelEvents;
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
exports.WORKFLOW_NODE_TYPES = [
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
    'action_mirror_media',
    'action_voice_clone',
    'action_voice_tts',
    'action_voice_clone_delete',
    'action_create_checklist',
    'action_find_unit',
    'action_find_user',
    'action_find_contact',
    'action_url_to_pdf',
    'action_nfe_pdf',
    // Controls
    'control_if',
    'control_switch',
    'control_wait_for',
    'control_loop',
    'control_split',
    'control_retry_scope',
    // AI
    'ai_agent',
    'ai_agent_inline',
    // Skill
    'skill_input',
    'skill_output',
];
/**
 * Workflow Statuses — runtime constant + derived type.
 */
exports.WORKFLOW_STATUSES = ['active', 'inactive', 'draft', 'archived'];
/**
 * Pausa automática (2026-08-22): um workflow ativo vira `inactive` sozinho
 * quando as últimas N execuções terminadas (sem as de teste) falharam, ou
 * quando um canal que ele usa é excluído. `autoPause` guarda o motivo; é
 * limpo ao reativar.
 */
exports.WORKFLOW_AUTO_PAUSE_CONSECUTIVE_FAILURES = 10;
exports.WORKFLOW_AUTO_PAUSE_REASONS = ['consecutive_failures', 'channel_deleted'];
/**
 * Execution Statuses — runtime constant + derived type.
 */
exports.WORKFLOW_EXECUTION_STATUSES = ['pending', 'running', 'completed', 'failed', 'cancelled', 'suspended'];
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
exports.WORKFLOW_CONDITION_OPERATORS = [
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
    'greater_or_equal', // alias legado (UI) de greater_than_or_equal
    'less_or_equal', // alias legado (UI) de less_than_or_equal
    'is_empty',
    'is_not_empty',
    'is_null',
    'is_not_null',
    'in',
    'not_in',
    'matches_regex',
];
/**
 * Node types de saída que suportam `businessHours` (UI + validação backend).
 * `action_send_media` e `action_internal_notification` não têm interface de
 * config canônica neste pacote (fallback `Record<string, unknown>`) mas também
 * aceitam o campo — as interfaces locais vivem nos respectivos step factories.
 */
exports.BUSINESS_HOURS_NODE_TYPES = [
    'action_send_message',
    'action_send_template',
    'action_send_media',
    'action_send_email',
    'action_internal_notification',
    'ai_agent',
    'ai_agent_inline',
];
/**
 * Quem originou um evento observado pelo node "Aguardar".
 *
 * - `user`       — atendente humano
 * - `ai`         — agente de IA
 * - `automation` — workflow / automação do sistema
 * - `api`        — integração externa via API pública
 *
 * `api` já existe no vocabulário porque o catálogo foi desenhado para crescer
 * (ex.: "Lead criado → por API"), mas HOJE nenhum evento do
 * `WAIT_CANCEL_EVENT_ACTORS` o oferece: mensagem é o único evento com a origem
 * gravada no dado (`ConversationMessage.senderType`), e lá não existe API.
 * Ligar um evento novo exige antes gravar o autor na entidade — lead e contato
 * não guardam quem os criou.
 */
exports.WORKFLOW_EVENT_ACTORS = ['user', 'ai', 'automation', 'api'];
/**
 * FONTE ÚNICA dos eventos aceitos como cancelamento do node "Aguardar" e das
 * origens que cada um distingue. Lista vazia = o evento não distingue origem
 * (a UI não mostra o sub-select e o motor ignora `actors`).
 *
 * A UI (`WaitForConfig`) e o motor (`WaitForStepFactory`) leem daqui — evento
 * novo com origens é uma linha neste objeto, nos dois lados de uma vez.
 */
exports.WAIT_CANCEL_EVENT_ACTORS = {
    'message.received': [], // quem manda é sempre o contato
    'message.sent': ['user', 'ai', 'automation'],
    'lead.updated': [],
    'contact.updated': [],
};
/**
 * Lê a lista de eventos de cancelamento de um `cancelEvent`, aceitando o
 * formato novo (`events`) e o legado (`eventType`). Ponto ÚNICO da compat —
 * motor, validação e UI passam por aqui em vez de cada um reimplementar o
 * fallback e divergir.
 */
function readWaitCancelEvents(cancelEvent) {
    if (!cancelEvent)
        return [];
    if (Array.isArray(cancelEvent.events)) {
        return cancelEvent.events.filter((event) => typeof event?.type === 'string' && event.type.trim().length > 0);
    }
    const legado = cancelEvent.eventType;
    return typeof legado === 'string' && legado.trim().length > 0 ? [{ type: legado }] : [];
}
/** Teto de espera do modo `duration` (72h). Aplicado no save e em runtime. */
exports.WAIT_UNTIL_MAX_DURATION_MS = 72 * 60 * 60 * 1000;
/**
 * Validação estrutural de workflow (2026-08-27).
 *
 * O backend é a única fonte de verdade das regras estruturais; o editor as
 * consome por `POST /api/workflows/validate`. `nodeIds` é o que permite ao
 * editor pintar de vermelho os nós culpados — o 422 do PATCH não carrega
 * essa informação (o errorHandler só serializa `fieldErrors`).
 */
exports.WORKFLOW_VALIDATION_CODES = [
    'NODE_TYPE_DESCONHECIDO',
    'ARESTA_ORFA',
    'SEM_ENTRADA',
    'MULTIPLAS_ENTRADAS',
    'CICLO',
    'IF_SEM_CAMINHO',
    'IF_HANDLE_INVALIDO',
    'SWITCH_SEM_HANDLE',
    'SPLIT_HANDLE_INVALIDO',
    'LOOP_SAIDAS',
    'WAIT_FOR_SAIDAS',
    'FANOUT_JUNCAO',
    'FANOUT_ESPERA',
    'FANOUT_HORARIO',
    'SWITCH_HANDLE_NAO_COMPILAVEL',
    'CONTROL_FLOW_EM_LOOP',
    // 2026-08-27 (conserto final)
    /** "Tentar novamente" com nenhum/vários trechos a repetir, ou vários "Depois". */
    'RETRY_SAIDAS',
    /** Nó de controle dentro do trecho repetido por "Tentar novamente". */
    'CONTROL_FLOW_EM_RETRY',
    /** Requisição HTTP com "aguardar retorno" dentro de um leque (dorme igual à espera). */
    'FANOUT_HTTP_AGUARDA',
    /** Desenho sem nenhum gatilho (nem `skill_input`). */
    'SEM_GATILHO',
    /** Nó sem nenhuma ligação — nem entrando, nem saindo. */
    'NO_SOLTO',
    /** Campo obrigatório faltando ou fora do formato na configuração de um nó. */
    'CONFIG_INVALIDA',
    'LEGADO',
];
