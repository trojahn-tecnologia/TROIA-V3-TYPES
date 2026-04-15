"use strict";
/**
 * Funnels-Users — Module Types
 *
 * Tabela pivot `funnels-users` que associa usuários a funis para responder
 * três perguntas simultaneamente:
 *
 * 1. **Quem vê o funil na listagem?** (visibilidade do contexto)
 * 2. **Quem vê os leads do funil?** (scope: own/team/all)
 * 3. **Quem recebe distribuição automática?** (role=attendant)
 *
 * Este é o análogo ao `channels-users` já existente, replicado para funis
 * conforme decisão D9 do plano `@DOCS/architecture/ASSIGNMENTS_REMOVAL.md`.
 * Não há abstração compartilhada (D9b) — apenas os enums de `role` e
 * `scope` vêm do arquivo `context-users.ts`.
 *
 * Collection: `funnels-users`
 *
 * Regra "público se vazio" (D11): se um funil não possui NENHUM registro
 * em `funnels-users` ativo, ele é visível para todos os usuários da company.
 * Assim que pelo menos 1 usuário é cadastrado, o funil passa a ser restrito.
 */
Object.defineProperty(exports, "__esModule", { value: true });
