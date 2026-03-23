"use strict";
// TROIA-V3-TYPES/src/credits.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREDIT_CATEGORIES = exports.CreditCategory = void 0;
// === Credit Categories (enum — single source of truth for debit calls) ===
var CreditCategory;
(function (CreditCategory) {
    CreditCategory["MESSAGE_CHAT"] = "message.chat";
    CreditCategory["MESSAGE_AI"] = "message.ai";
    CreditCategory["MESSAGE_CAMPAIGN"] = "message.campaign";
    CreditCategory["MESSAGE_NOTIFICATION"] = "message.notification";
    CreditCategory["AI_TOKENS_INPUT"] = "ai.tokens.input";
    CreditCategory["AI_TOKENS_OUTPUT"] = "ai.tokens.output";
    CreditCategory["AI_TOOL_EXECUTION"] = "ai.tool.execution";
    CreditCategory["AI_VOICE_CLONE"] = "ai.voice.clone";
    CreditCategory["CRM_LEAD_CREATED"] = "crm.lead.created";
    CreditCategory["CRM_TICKET_OPENED"] = "crm.ticket.opened";
    CreditCategory["CRM_CONTACT_CREATED"] = "crm.contact.created";
    CreditCategory["AUTOMATION_WORKFLOW_EXECUTED"] = "automation.workflow.executed";
    CreditCategory["AUTOMATION_FORM_RESPONSE"] = "automation.form.response";
    CreditCategory["INFRA_USER_ACTIVE"] = "infra.user.active";
    CreditCategory["INFRA_CHANNEL_ACTIVE"] = "infra.channel.active";
    CreditCategory["INFRA_EMAIL_DOMAIN"] = "infra.email.domain";
    CreditCategory["INFRA_DATABASE_SYNC"] = "infra.database.sync";
    CreditCategory["WEBSITE_SITE_PUBLISHED"] = "website.site.published";
    CreditCategory["API_EXTERNAL_CALL"] = "api.external.call";
})(CreditCategory || (exports.CreditCategory = CreditCategory = {}));
exports.CREDIT_CATEGORIES = {
    [CreditCategory.MESSAGE_CHAT]: { label: 'Mensagem de chat', unit: 'per_action', hasDirection: true, hasProviderId: true, providerType: 'messaging' },
    [CreditCategory.MESSAGE_AI]: { label: 'Mensagem de IA', unit: 'per_action', hasDirection: true, hasProviderId: true, providerType: 'messaging' },
    [CreditCategory.MESSAGE_CAMPAIGN]: { label: 'Mensagem de campanha', unit: 'per_action', hasDirection: false, hasProviderId: true, providerType: 'messaging' },
    [CreditCategory.MESSAGE_NOTIFICATION]: { label: 'Notificação', unit: 'per_action', hasDirection: false, hasProviderId: true, providerType: 'messaging' },
    [CreditCategory.AI_TOKENS_INPUT]: { label: 'Tokens IA (input)', unit: 'per_1k_tokens', hasDirection: false, hasProviderId: true, providerType: 'ai_model' },
    [CreditCategory.AI_TOKENS_OUTPUT]: { label: 'Tokens IA (output)', unit: 'per_1k_tokens', hasDirection: false, hasProviderId: true, providerType: 'ai_model' },
    [CreditCategory.AI_TOOL_EXECUTION]: { label: 'Execução de tool IA', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.AI_VOICE_CLONE]: { label: 'Voz Clonada', unit: 'per_month', hasDirection: false, hasProviderId: false },
    [CreditCategory.CRM_LEAD_CREATED]: { label: 'Lead criado', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.CRM_TICKET_OPENED]: { label: 'Ticket aberto', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.CRM_CONTACT_CREATED]: { label: 'Contato criado', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.AUTOMATION_WORKFLOW_EXECUTED]: { label: 'Workflow executado', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.AUTOMATION_FORM_RESPONSE]: { label: 'Resposta de formulário', unit: 'per_action', hasDirection: false, hasProviderId: false },
    [CreditCategory.INFRA_USER_ACTIVE]: { label: 'Usuário ativo', unit: 'per_month', hasDirection: false, hasProviderId: false },
    [CreditCategory.INFRA_CHANNEL_ACTIVE]: { label: 'Canal ativo', unit: 'per_month', hasDirection: false, hasProviderId: false },
    [CreditCategory.INFRA_EMAIL_DOMAIN]: { label: 'Domínio de email', unit: 'per_month', hasDirection: false, hasProviderId: false },
    [CreditCategory.INFRA_DATABASE_SYNC]: { label: 'Sync de database', unit: 'per_day', hasDirection: false, hasProviderId: false },
    [CreditCategory.WEBSITE_SITE_PUBLISHED]: { label: 'Site publicado', unit: 'per_month', hasDirection: false, hasProviderId: false },
    [CreditCategory.API_EXTERNAL_CALL]: { label: 'Chamada API externa', unit: 'per_action', hasDirection: false, hasProviderId: false },
};
