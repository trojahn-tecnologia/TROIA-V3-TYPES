"use strict";
/**
 * Distribution — Shared Types
 *
 * Tipos da nova engine de distribuição automática que substitui o módulo
 * legado `assignments`. É consumida pelos services de domínio
 * (`conversationsService`, `leadsService`, `ticketsService`) e pelo
 * frontend (componente `DistributionConfigSection`).
 *
 * Este arquivo expõe apenas tipos — a implementação do motor vive em
 * `TROIA-V3-BACKEND/src/modules/distribution/`.
 *
 * Durante a migração (Fase 0 → Fase 10), este arquivo coexiste com o
 * legado `assignment.ts`. O legado será removido na Fase 10.
 *
 * Ver plano completo: DOCS/architecture/ASSIGNMENTS_REMOVAL.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
