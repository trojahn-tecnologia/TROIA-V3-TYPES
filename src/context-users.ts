/**
 * Context Users — Shared Enums
 *
 * Os 3 módulos independentes (`channels-users`, `funnels-users`,
 * `ticket-pipelines-users`) compartilham os mesmos enums de `role` e `scope`
 * para que a semântica de atribuição e privacidade seja idêntica nos 3
 * contextos. Cada módulo define sua própria interface (com `channelId`,
 * `funnelId` ou `pipelineId`) — não existe abstração base comum.
 *
 * Ver plano completo: DOCS/architecture/ASSIGNMENTS_REMOVAL.md
 */

/**
 * Papel do usuário dentro do contexto (canal/funil/pipeline).
 *
 * - `attendant`: recebe distribuição automática e atendimento
 * - `viewer`: apenas visualiza o contexto, não recebe itens
 */
export type ContextUserRole = 'attendant' | 'viewer';

/**
 * Escopo de visualização dos itens (leads/conversas/tickets) do contexto.
 *
 * - `own`: vê apenas itens atribuídos a si mesmo (+ fila pública — itens sem
 *   assignee)
 * - `team`: vê itens atribuídos a membros das equipes do usuário (+ fila
 *   pública)
 * - `all`: vê todos os itens do contexto
 *
 * Itens onde o usuário é o próprio `assigneeId` sempre são visíveis,
 * independente do scope (regra universal D28).
 */
export type ContextUserScope = 'own' | 'team' | 'all';

/**
 * Status de ativação do vínculo usuário↔contexto.
 */
export type ContextUserStatus = 'active' | 'inactive';
