"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefaultNotificationPreferences = buildDefaultNotificationPreferences;
const notifications_1 = require("./notifications");
/**
 * Preferências de notificação **de fábrica** (2026-08-17).
 *
 * Fonte única do que um usuário novo recebe. Consumida pelo backend na criação
 * do usuário (`UsersRepository.create`) e pela migração `2026-08-17-002`, que
 * grava a mesma lista nos canais sem lista dos usuários já existentes.
 *
 * `enabled` preserva exatamente os defaults históricos (sino/push/som e e-mail
 * ligados, WhatsApp desligado); o que muda é `types`, que agora nasce EXPLÍCITO
 * em todo canal — sino/push/som com a lista de fábrica, e-mail/WhatsApp vazios.
 */
function buildDefaultNotificationPreferences() {
    return {
        email: { enabled: true, types: (0, notifications_1.getDefaultNotificationTypesForChannel)('email') },
        whatsapp: { enabled: false, types: (0, notifications_1.getDefaultNotificationTypesForChannel)('whatsapp') },
        push: { enabled: true, types: (0, notifications_1.getDefaultNotificationTypesForChannel)('push') },
        inApp: { enabled: true, types: (0, notifications_1.getDefaultNotificationTypesForChannel)('inApp') },
        sound: { enabled: true, types: (0, notifications_1.getDefaultNotificationTypesForChannel)('sound') },
    };
}
