// Common types
export * from './common';

// Core modules
export * from './app';
export * from './companies';
export * from './user';
export * from './modules';
export * from './plans';
export * from './levels';
export * from './company-plans';

// Business modules
export * from './teams';
export * from './channels';
export * from './shifts';
export * from './skills';
export * from './company-integrations';
// Context-users (shared enums for channels-users / funnels-users / ticket-pipelines-users)
export * from './context-users';
// Distribution engine (replaces legacy assignments module — coexists with it until Phase 10)
export * from './distribution';
// Funnels-Users pivot (visibility + scope + attendant pool for funnels)
export * from './funnels-users';
// Ticket-Pipelines-Users pivot (visibility + scope + attendant pool for ticket pipelines)
export * from './ticket-pipelines-users';
export * from './app-integrations';
export * from './user-integrations';
export * from './api-keys';
export * from './email-templates';

// Provider system (shared between app & company integrations)
export * from './providers';
export * from './gateway';
export * from './ai';

// Email domains module (Resend integration)
export * from './email-domains';

// Queue system (shared between Backend & Gateway)
export * from './queue-jobs';

// Validation utilities (shared between Gateway & Backend)
export * from './validation';

// Communication system
export * from './communications';

// Socket.IO Events (shared between Frontend & Backend)
export * from './socket-events';

// Payment system
export * from './payments';
export * from './saved-cards';

// Customer service modules
export * from './contacts';
export * from './customers';
export * from './leads';
export * from './funnels';

// Ticket Pipelines & Stages
export * from './ticket-pipelines';

// Phase 2: Advanced customer service modules
export * from './tickets';
export * from './ticket-followers';
export * from './conversations';
export * from './conversation-messages';
export * from './chat-dashboard';
export * from './activities';
export * from './notifications';

// Calendar & Scheduling
export * from './calendar';

// Group conversation support
export * from './groups';
export * from './group-participants';

// RAG/Vector Search support
export * from './message-chunks';

// Marketing modules
export * from './templates';
export * from './campaigns';
export * from './audiences';

// Databases module (multi-purpose data segregation)
export * from './databases';

// AI Agents modules (Phase 1)
export * from './ai-agents';
export * from './escalation-rules';
export * from './custom-actions';
export * from './custom-action-logs';
export * from './agent-golden-cases';

// Lead Routing Rules (automatic lead assignment by conditions)
export * from './leads-routing-rules';

// Workflows/Automation module
export * from './workflows';
export * from './workflow-node-schemas';

// CRM Reports module
export * from './crm-reports';

// Websites module (website builder)
export * from './websites';

// Voices module (voice cloning for AI agents)
export * from './voices';

// Forms module (public form builder)
export * from './forms';

// Internal Team Chat (user-to-user chat, Redis-backed, 72h TTL)
export * from './internal-chat';

// MongoDB Document Models (ObjectId/Date types for repositories)
export * from './models';

// Theme overrides (tenant customization)
export * from './theme';

// Credits system (balance, transactions, subscriptions, cost table)
export * from './credits';

// Transfer requests (shared across conversations, tickets, leads transfer endpoints)
export * from './transfer';

// Assignment context (canonical metadata for assignment/transfer audit log)
export * from './assignment-context';

// Channel rate limits (GET/PATCH/DELETE /channels/:id/rate-limits)
export * from './channel-rate-limits';

// Goals module (Phase 3 — commercial dashboard targets for users/teams/company)
export * from './goals';

// Commercial Dashboard module (Phase 4 — request/response types for /api/dashboards/commercial)
export * from './dashboards-commercial';