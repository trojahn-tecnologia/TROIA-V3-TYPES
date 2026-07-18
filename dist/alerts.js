"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_ALERT_DEFAULTS = void 0;
/** Default do sistema aplicado a funis/etapas sem config (dia 0). */
exports.SYSTEM_ALERT_DEFAULTS = {
    inactivity: { enabled: true, warningDays: 7, criticalDays: 14 },
    timeInStep: { enabled: true, warningDays: 14, criticalDays: 30 },
};
