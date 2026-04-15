"use strict";
/**
 * Ticket-Pipelines-Users — Module Types
 *
 * Tabela pivot `ticket-pipelines-users` que associa usuários a pipelines
 * de ticket para responder três perguntas simultaneamente:
 *
 * 1. **Quem vê o pipeline na listagem?** (visibilidade do contexto)
 * 2. **Quem vê os tickets do pipeline?** (scope: own/team/all)
 * 3. **Quem recebe distribuição automática?** (role=attendant)
 *
 * Espelha `funnels-users` e `channels-users`. Sem abstração compartilhada
 * (D9b) — apenas enums de `role` e `scope` vêm de `context-users.ts`.
 *
 * Collection: `ticket-pipelines-users`
 */
Object.defineProperty(exports, "__esModule", { value: true });
