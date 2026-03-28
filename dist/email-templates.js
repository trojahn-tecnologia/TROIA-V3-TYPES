"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLevel = exports.EmailTemplateType = void 0;
/**
 * Email Templates Types
 * Used for email template management system
 */
var EmailTemplateType;
(function (EmailTemplateType) {
    EmailTemplateType["PASSWORD_RESET"] = "password-reset";
    EmailTemplateType["WELCOME"] = "welcome";
    EmailTemplateType["EMAIL_VERIFICATION"] = "email-verification";
    EmailTemplateType["INVITATION"] = "invitation";
    EmailTemplateType["COMPANY_REGISTRATION"] = "company-registration";
    EmailTemplateType["SUBSCRIPTION_ACTIVATED"] = "subscription-activated";
    EmailTemplateType["SUBSCRIPTION_EXPIRED"] = "subscription-expired";
    EmailTemplateType["PLAN_CHANGED"] = "plan-changed";
    EmailTemplateType["SYSTEM_NOTIFICATION"] = "system-notification";
    EmailTemplateType["MAINTENANCE_NOTICE"] = "maintenance-notice";
    EmailTemplateType["PAYMENT_PENDING"] = "payment-pending";
    EmailTemplateType["PAYMENT_OVERDUE"] = "payment-overdue";
    EmailTemplateType["INVOICE_GENERATED"] = "invoice-generated";
})(EmailTemplateType || (exports.EmailTemplateType = EmailTemplateType = {}));
var TemplateLevel;
(function (TemplateLevel) {
    TemplateLevel["SYSTEM"] = "system";
    TemplateLevel["APP"] = "app";
    TemplateLevel["COMPANY"] = "company"; // Company-level customization
})(TemplateLevel || (exports.TemplateLevel = TemplateLevel = {}));
