"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_VALIDATION_CODES = exports.WORKFLOW_NODE_INPUT_RETENTION_DAYS = exports.WORKFLOW_NODE_INPUT_MAX_BYTES = exports.WORKFLOW_EXECUTION_SUMMARY_RING_SIZE = exports.WORKFLOW_EXECUTION_RETENTION_DAYS = exports.WORKFLOW_EXECUTION_STATS_BUCKETS = exports.WORKFLOW_EXECUTION_STATS_WINDOW_DAYS = exports.WAIT_UNTIL_MAX_DURATION_MS = exports.WAIT_CANCEL_EVENT_ACTORS = exports.WORKFLOW_WAIT_CANCELLED_HANDLE = exports.WORKFLOW_CANCELLATION_EVENT_TYPES = exports.WORKFLOW_CANCELLATION_EVENTS = exports.WORKFLOW_EVENT_ACTORS = exports.BUSINESS_HOURS_NODE_TYPES = exports.WORKFLOW_EXECUTION_IDENTIFIER_MAX_LENGTH = exports.WORKFLOW_CONDITION_OPERATORS = exports.WORKFLOW_EXECUTION_OPEN_STATUSES = exports.WORKFLOW_EXECUTION_STATUSES = exports.WORKFLOW_AUTO_PAUSE_REASONS = exports.WORKFLOW_FREQUENT_FAILURES_ALERT_INTERVAL_HOURS = exports.WORKFLOW_FREQUENT_FAILURES_THRESHOLD = exports.WORKFLOW_FREQUENT_FAILURES_WINDOW = exports.WORKFLOW_AUTO_PAUSE_CONSECUTIVE_FAILURES = exports.WORKFLOW_STATUSES = exports.WORKFLOW_SUCCESS_FAILURE_NODE_TYPES = exports.WORKFLOW_FAILURE_HANDLE = exports.WORKFLOW_SUCCESS_HANDLE = exports.WORKFLOW_FILTERABLE_NODE_TYPES = exports.WORKFLOW_NODE_TYPES = void 0;
exports.nodeTypeAcceptsFilters = nodeTypeAcceptsFilters;
exports.nodeTypeHasSuccessFailureOutputs = nodeTypeHasSuccessFailureOutputs;
exports.waitHasCancelledOutput = waitHasCancelledOutput;
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
    'action_transfer_conversation',
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
 * Nós que têm a aba Filtros em `data.filters` (spec 2026-09-14 §5.3): os que "fazem algo".
 * Gatilhos guardam os seus em `config.filters` (aplicados no DISPARO); Se/Selecionar/leque/
 * Repetir/Tentar de novo e skill_output já são a condição ou o fim, não filtram.
 */
exports.WORKFLOW_FILTERABLE_NODE_TYPES = exports.WORKFLOW_NODE_TYPES.filter((t) => t.startsWith('action_') || t === 'ai_agent' || t === 'ai_agent_inline' || t === 'control_wait_for' || t === 'skill_input');
function nodeTypeAcceptsFilters(type) {
    return exports.WORKFLOW_FILTERABLE_NODE_TYPES.includes(type);
}
/**
 * Saídas "Sucesso" e "Falha" (2026-09-23, nó Transferir conversa): nó de ação
 * que pode NÃO conseguir fazer o que promete ganha duas saídas, e o desenho
 * decide o que acontece em cada caso. Fonte ÚNICA para a tela (alças do nó),
 * o validador e o compilador.
 *
 * O nó devolve `{ success: boolean }`: `true` segue pela saída `success`,
 * `false` pela `failure`. Sem ligação na saída Falha o nó LANÇA quando não
 * consegue — a execução falha com o motivo, em vez de terminar calada.
 */
exports.WORKFLOW_SUCCESS_HANDLE = 'success';
exports.WORKFLOW_FAILURE_HANDLE = 'failure';
exports.WORKFLOW_SUCCESS_FAILURE_NODE_TYPES = ['action_transfer_conversation'];
function nodeTypeHasSuccessFailureOutputs(type) {
    return exports.WORKFLOW_SUCCESS_FAILURE_NODE_TYPES.includes(type);
}
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
/**
 * Aviso de falha frequente (2026-09-15). A pausa automática ignora falha
 * PARCIAL (galho paralelo quebrado com o irmão entregando) — e foi assim que o
 * workflow "AUTOMAÇÃO PÓS VENDA" falhou 3.790 vezes em 13 dias sem ninguém
 * saber. O aviso tem contagem PRÓPRIA: entre as últimas `WINDOW` execuções
 * finalizadas (fora teste, cancelada e falha por estado do cliente — falha
 * parcial CONTA), `THRESHOLD` ou mais falharam → avisa quem pode editar
 * workflows, no máximo 1 vez a cada `INTERVAL_HOURS` por workflow. Só avisa;
 * pausar pararia também o galho que funciona.
 */
exports.WORKFLOW_FREQUENT_FAILURES_WINDOW = 20;
exports.WORKFLOW_FREQUENT_FAILURES_THRESHOLD = 5;
exports.WORKFLOW_FREQUENT_FAILURES_ALERT_INTERVAL_HOURS = 24;
exports.WORKFLOW_AUTO_PAUSE_REASONS = ['consecutive_failures', 'channel_deleted'];
/**
 * Execution Statuses — runtime constant + derived type.
 */
exports.WORKFLOW_EXECUTION_STATUSES = ['pending', 'running', 'completed', 'failed', 'cancelled', 'suspended'];
/**
 * Status em que a execução ainda está VIVA e pode mudar. Tudo fora daqui
 * (`completed`, `failed`, `cancelled`) é final e NUNCA é sobrescrito — é o que
 * impede o fim normal de um run (ou uma retomada atrasada) de transformar um
 * "cancelado" em "concluído" (spec 2026-09-14, invariante I2).
 */
exports.WORKFLOW_EXECUTION_OPEN_STATUSES = ['pending', 'running', 'suspended'];
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
/** Tamanho máximo do `identifier` aceito pelo gatilho de webhook. */
exports.WORKFLOW_EXECUTION_IDENTIFIER_MAX_LENGTH = 200;
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
 * FONTE ÚNICA dos eventos da aba Cancelamento (spec 2026-09-14 §1.2): UI,
 * validação e motor leem daqui. Só entram eventos que apontam para alguém.
 * `calendar_event.cancelled` entra porque o publisher carrega `eventId` e
 * `contactId` antes de apagar (o vigia casa pelo id, não precisa da entidade).
 */
exports.WORKFLOW_CANCELLATION_EVENTS = {
    'message.received': { entity: 'conversation', idField: 'conversationId', actors: [] },
    'message.sent': { entity: 'conversation', idField: 'conversationId', actors: ['user', 'ai', 'automation'] },
    'conversation.created': { entity: 'conversation', idField: 'conversationId', actors: [] },
    'conversation.updated': { entity: 'conversation', idField: 'conversationId', actors: [] },
    'conversation.closed': { entity: 'conversation', idField: 'conversationId', actors: [] },
    'conversation.assigned': { entity: 'conversation', idField: 'conversationId', actors: [] },
    'contact.created': { entity: 'contact', idField: 'contactId', actors: [] },
    'contact.updated': { entity: 'contact', idField: 'contactId', actors: [] },
    'lead.created': { entity: 'lead', idField: 'leadId', actors: [] },
    'lead.updated': { entity: 'lead', idField: 'leadId', actors: [] },
    'lead.stage_changed': { entity: 'lead', idField: 'leadId', actors: [] },
    'lead.won': { entity: 'lead', idField: 'leadId', actors: [] },
    'lead.lost': { entity: 'lead', idField: 'leadId', actors: [] },
    'ticket.created': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'ticket.updated': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'ticket.status_changed': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'ticket.assigned': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'ticket.resolved': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'ticket.closed': { entity: 'ticket', idField: 'ticketId', actors: [] },
    'calendar_event.created': { entity: 'event', idField: 'eventId', actors: [] },
    'calendar_event.updated': { entity: 'event', idField: 'eventId', actors: [] },
    'calendar_event.cancelled': { entity: 'event', idField: 'eventId', actors: [] },
};
exports.WORKFLOW_CANCELLATION_EVENT_TYPES = Object.keys(exports.WORKFLOW_CANCELLATION_EVENTS);
/**
 * Marca (`sourceHandle`) da saída vermelha "Cancelado" do nó Aguardar
 * (spec 2026-09-20 §7.1, Fase 4b).
 *
 * NÃO pode ser `'event'`: essa era a marca da saída "Cancelado" ANTIGA, e a
 * migração `2026-09-14-001` apaga toda ligação que sai dela — junto com a
 * árvore de nós atrás dela. Também não pode ser `'timeout'`, que é a saída
 * que segue depois da espera.
 */
exports.WORKFLOW_WAIT_CANCELLED_HANDLE = 'cancelled';
/**
 * O Aguardar tem a saída "Cancelado"? Fonte ÚNICA para tela, validação e
 * compilador (spec 2026-09-20 §7.1): a saída existe quando o nó tem regra
 * PRÓPRIA na aba Cancelamento — regra de outro nó (ou do gatilho) não desenha
 * saída aqui, mesmo que também desvie a execução por esta (D13).
 */
function waitHasCancelledOutput(node) {
    if (node.type !== 'control_wait_for')
        return false;
    return (node.data.cancellation?.rules ?? []).length > 0;
}
/**
 * @deprecated recorte do catálogo novo com os 4 eventos que o Aguardar antigo
 * aceitava. Some junto com `WaitCancelEvent`.
 */
exports.WAIT_CANCEL_EVENT_ACTORS = {
    'message.received': exports.WORKFLOW_CANCELLATION_EVENTS['message.received'].actors,
    'message.sent': exports.WORKFLOW_CANCELLATION_EVENTS['message.sent'].actors,
    'lead.updated': exports.WORKFLOW_CANCELLATION_EVENTS['lead.updated'].actors,
    'contact.updated': exports.WORKFLOW_CANCELLATION_EVENTS['contact.updated'].actors,
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
/** Janela, em dias, dos contadores de execução da listagem de workflows. */
exports.WORKFLOW_EXECUTION_STATS_WINDOW_DAYS = 30;
/** Baldes em que a listagem classifica uma execução (a régua da pausa automática). */
exports.WORKFLOW_EXECUTION_STATS_BUCKETS = ['completed', 'failed', 'customerFailed', 'cancelled', 'running', 'interrupted'];
/** Por quantos dias uma execução em status FINAL fica guardada antes de expirar. */
exports.WORKFLOW_EXECUTION_RETENTION_DAYS = 30;
/** Quantas execuções elegíveis o resumo do workflow guarda no anel (`executionSummary.recentOutcomes`). */
exports.WORKFLOW_EXECUTION_SUMMARY_RING_SIZE = 20;
// ============================================================
// WORKFLOW NODE RUN INPUTS — o "Visualizar contexto" do nó (F2)
// ============================================================
/** Teto, em bytes, do que se guarda de entrada de UM nó numa execução. */
exports.WORKFLOW_NODE_INPUT_MAX_BYTES = 32_768;
/** Por quantos dias a entrada de um nó fica guardada. */
exports.WORKFLOW_NODE_INPUT_RETENTION_DAYS = 30;
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
    /**
     * Regra da aba Cancelamento inválida (spec 2026-09-14, Fase 2): evento fora
     * do catálogo, origem que o evento não distingue/não oferece, "A quem se
     * refere" que não é template nem id, ou regra repetida para o mesmo alvo.
     */
    'CANCELAMENTO_INVALIDO',
    /**
     * Aresta que ainda sai pela saída "Cancelado" (aposentada) do node Aguardar
     * (D2, spec 2026-09-14) — o desenho precisa ser refeito sem essa saída.
     */
    'WAIT_FOR_SAIDA_ANTIGA',
    /**
     * Filtro inválido na aba Filtros de um nó (spec 2026-09-16, Fase 3): condição
     * mal formada, campo/operador incompatível, ou nó que não aceita filtros mas
     * tem `data.filters` preenchido.
     */
    'FILTRO_INVALIDO',
    /**
     * Ligação na saída "Cancelado" de um Aguardar que não tem regra própria na
     * aba Cancelamento (spec 2026-09-20 §7.1, D12) — a saída só existe com regra.
     */
    'WAIT_FOR_CANCELADO_SEM_REGRA',
    /**
     * Ligação presa num ponto de saída que não é "Sucesso" nem "Falha", num nó
     * que tem essas duas saídas (`nodeTypeHasSuccessFailureOutputs`, 2026-09-23).
     */
    'SUCESSO_FALHA_HANDLE_INVALIDO',
];
