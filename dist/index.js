"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Common types
__exportStar(require("./common"), exports);
// Core modules
__exportStar(require("./app"), exports);
__exportStar(require("./companies"), exports);
__exportStar(require("./user"), exports);
__exportStar(require("./modules"), exports);
__exportStar(require("./plans"), exports);
__exportStar(require("./levels"), exports);
__exportStar(require("./company-plans"), exports);
__exportStar(require("./user-permissions"), exports);
// Business modules
__exportStar(require("./teams"), exports);
__exportStar(require("./channels"), exports);
__exportStar(require("./shifts"), exports);
__exportStar(require("./skills"), exports);
__exportStar(require("./company-integrations"), exports);
__exportStar(require("./assignment"), exports);
__exportStar(require("./app-integrations"), exports);
__exportStar(require("./user-integrations"), exports);
__exportStar(require("./api-keys"), exports);
__exportStar(require("./email-templates"), exports);
// Provider system (shared between app & company integrations)
__exportStar(require("./providers"), exports);
__exportStar(require("./gateway"), exports);
__exportStar(require("./ai"), exports);
// Email domains module (Resend integration)
__exportStar(require("./email-domains"), exports);
// Queue system (shared between Backend & Gateway)
__exportStar(require("./queue-jobs"), exports);
// Validation utilities (shared between Gateway & Backend)
__exportStar(require("./validation"), exports);
// Communication system
__exportStar(require("./communications"), exports);
// Socket.IO Events (shared between Frontend & Backend)
__exportStar(require("./socket-events"), exports);
// Payment system
__exportStar(require("./payments"), exports);
__exportStar(require("./saved-cards"), exports);
// Customer service modules
__exportStar(require("./contacts"), exports);
__exportStar(require("./customers"), exports);
__exportStar(require("./leads"), exports);
__exportStar(require("./funnels"), exports);
// Ticket Pipelines & Stages
__exportStar(require("./ticket-pipelines"), exports);
// Phase 2: Advanced customer service modules
__exportStar(require("./tickets"), exports);
__exportStar(require("./conversations"), exports);
__exportStar(require("./conversation-messages"), exports);
__exportStar(require("./chat-dashboard"), exports);
__exportStar(require("./activities"), exports);
__exportStar(require("./notifications"), exports);
// Calendar & Scheduling
__exportStar(require("./calendar"), exports);
// Group conversation support
__exportStar(require("./groups"), exports);
__exportStar(require("./group-participants"), exports);
// RAG/Vector Search support
__exportStar(require("./message-chunks"), exports);
// Marketing modules
__exportStar(require("./templates"), exports);
__exportStar(require("./campaigns"), exports);
// Databases module (multi-purpose data segregation)
__exportStar(require("./databases"), exports);
// AI Agents modules (Phase 1)
__exportStar(require("./ai-agents"), exports);
__exportStar(require("./escalation-rules"), exports);
__exportStar(require("./custom-actions"), exports);
__exportStar(require("./custom-action-logs"), exports);
// Lead Routing Rules (automatic lead assignment by conditions)
__exportStar(require("./leads-routing-rules"), exports);
// Workflows/Automation module
__exportStar(require("./workflows"), exports);
__exportStar(require("./workflow-node-schemas"), exports);
// CRM Reports module
__exportStar(require("./crm-reports"), exports);
// Websites module (website builder)
__exportStar(require("./websites"), exports);
// Voices module (voice cloning for AI agents)
__exportStar(require("./voices"), exports);
// Forms module (public form builder)
__exportStar(require("./forms"), exports);
// MongoDB Document Models (ObjectId/Date types for repositories)
__exportStar(require("./models"), exports);
