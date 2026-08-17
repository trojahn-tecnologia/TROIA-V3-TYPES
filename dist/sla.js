"use strict";
/**
 * Motor de SLA — contratos compartilhados (spec §6, contrato de interfaces §1).
 *
 * Três decisões estruturais estão codificadas aqui e não devem ser desfeitas:
 *
 * 1. `targets` é LISTA de linhas `(clockKey, priority)`, não dicionário de
 *    chaves fixas por prioridade. É o que permite acrescentar um relógio novo
 *    (próxima resposta, atualização periódica) sem migrar forma — o erro que
 *    travou o contrato público da API do Freshdesk (spec §6.1).
 * 2. `useBusinessHours` e `pausesOn` vivem NA LINHA do alvo, não na política.
 *    É o que expressa "primeira resposta em horário comercial, resolução 24x7"
 *    dentro da mesma prioridade, e "resolução pausa em aguardando, primeira
 *    resposta não" (decisões 6 e 7 da spec §9).
 * 3. `policyId`/`policyVersion` vivem DENTRO de `SlaClock`, nunca na raiz de
 *    `SlaState`. A spec §7.3 prevê explicitamente dois relógios do MESMO
 *    chamado vindos de políticas diferentes (fallback real do estágio 2 da
 *    resolução) — com os campos na raiz, a prova contratual mentiria para um
 *    dos dois relógios.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLA_DEFAULT_POLICY_ORDER = exports.SLA_CLOCK_KEYS = void 0;
/**
 * Ordem de iteração canônica dos relógios. `resolvePolicy` percorre esta lista
 * para decidir o que ainda falta resolver — um relógio novo entra AQUI e no
 * tipo acima, e a resolução passa a considerá-lo sem mais nenhuma mudança.
 */
exports.SLA_CLOCK_KEYS = ['first_response', 'resolution'];
/** `order` da política padrão semeada — sempre a última a ser avaliada. */
exports.SLA_DEFAULT_POLICY_ORDER = 999;
