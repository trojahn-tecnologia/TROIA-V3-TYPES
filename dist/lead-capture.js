"use strict";
/**
 * Captura de leads por QR Code — sessão efêmera no Redis (D11: sem collection),
 * página pública e respostas da API autenticada do vendedor.
 *
 * Spec: DOCS/superpowers/specs/2026-08-20-qr-lead-capture-gamification-design.md §4.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEAD_CAPTURE_SESSION_TTL_SECONDS = void 0;
/** TTL da sessão no Redis — 7 dias (D2). */
exports.LEAD_CAPTURE_SESSION_TTL_SECONDS = 7 * 24 * 3600;
