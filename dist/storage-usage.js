"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BYTES_PER_GIGABYTE = exports.STORAGE_RETENTION_MONTHS = void 0;
/**
 * Janela de retenção da mídia de conversa, em meses.
 *
 * É promessa comercial ("guardamos 2 anos de histórico") e, ao mesmo tempo,
 * o que limita a conta de disco: sem apagar nada, o armazenamento cresce para
 * sempre e nenhuma cobrança por GB estabiliza. A regra de ciclo de vida no S3
 * precisa usar ESTE mesmo número — se as duas pontas discordarem, ou cobramos
 * o que já foi apagado, ou deixamos de cobrar o que ainda está lá.
 */
exports.STORAGE_RETENTION_MONTHS = 24;
/** 1 GB em bytes, base binária — a mesma que a AWS usa para faturar. */
exports.BYTES_PER_GIGABYTE = 1024 * 1024 * 1024;
