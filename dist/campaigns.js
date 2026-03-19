"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignMessageStatus = exports.SchedulingType = exports.AudienceType = exports.CampaignStatus = void 0;
/**
 * Campaign Status
 */
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["IN_PROGRESS"] = "in_progress";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["FAILED"] = "failed";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
/**
 * Audience Type - Tipo de audiência da campanha
 */
var AudienceType;
(function (AudienceType) {
    AudienceType["LEADS"] = "leads";
    AudienceType["CONTACTS"] = "contacts"; // Contacts collection
})(AudienceType || (exports.AudienceType = AudienceType = {}));
/**
 * Scheduling Type - Tipo de agendamento
 */
var SchedulingType;
(function (SchedulingType) {
    SchedulingType["IMMEDIATE"] = "immediate";
    SchedulingType["SCHEDULED"] = "scheduled";
    SchedulingType["RECURRING"] = "recurring"; // Enviar periodicamente
})(SchedulingType || (exports.SchedulingType = SchedulingType = {}));
// ============================================================
// CAMPAIGN MESSAGES - Tracking de mensagens individuais
// ============================================================
/**
 * Campaign Message Status - Status de cada mensagem individual
 */
var CampaignMessageStatus;
(function (CampaignMessageStatus) {
    CampaignMessageStatus["PENDING"] = "pending";
    CampaignMessageStatus["QUEUED"] = "queued";
    CampaignMessageStatus["SENDING"] = "sending";
    CampaignMessageStatus["SENT"] = "sent";
    CampaignMessageStatus["DELIVERED"] = "delivered";
    CampaignMessageStatus["READ"] = "read";
    CampaignMessageStatus["FAILED"] = "failed";
    CampaignMessageStatus["CANCELLED"] = "cancelled"; // Cancelado (campanha pausada/cancelada)
})(CampaignMessageStatus || (exports.CampaignMessageStatus = CampaignMessageStatus = {}));
