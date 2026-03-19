import { ObjectId } from 'mongodb';
import { ActiveStatus, PaginationQuery } from './common';

/**
 * Keyword matching modes for message_received trigger
 */
export type KeywordMatchMode =
  | 'any_message'        // Trigger on any message (no keyword filtering)
  | 'contains'           // Message contains any of the keywords
  | 'starts_with'        // Message starts with any of the keywords
  | 'ends_with'          // Message ends with any of the keywords
  | 'exact_match';       // Message exactly matches any of the keywords

/**
 * Keyword matching logic (when multiple keywords are provided)
 */
export type KeywordMatchLogic =
  | 'OR'   // Match if ANY keyword matches (default)
  | 'AND'; // Match if ALL keywords match

export interface AIAgent {
  _id?: ObjectId;
  id?: string;
  name: string;
  description?: string;
  systemPrompt: string;
  instructions?: string;                    // Custom instructions for agent behavior
  model: string;
  temperature: number;
  maxTokens: number;
  delay: number;                            // Debounce delay in seconds (10-120) before agent responds
  version?: string;                         // Semver version (e.g., "1.0.0")
  triggers: AIAgentTriggers;
  customActionIds: string[];
  databases?: string[];                     // Database IDs that the agent can access
  voiceEnabled: boolean;
  voiceConfig?: {
    aiProviderId: string;
    voiceId?: string;  // ✅ ID da voz específica (ex: 'alloy', 'nova', 'shimmer' para OpenAI, ou voice ID do ElevenLabs)
  };
  enabledCapabilities: AIAgentCapabilityConfig[];  // ✅ UNIFIED: Capabilities + Configurations
  webhooks?: AIAgentWebhook[];                     // Webhook configurations for external data injection
  responseStyle?: string;                   // Agent response style (professional, casual, etc.)
  tone?: string;                            // Agent tone (helpful, formal, friendly, etc.)
  language?: string;                        // Preferred language for responses
  fallbackResponse?: string;                // Default response when confidence is low
  appId: ObjectId | string;
  companyId: ObjectId | string;
  status: ActiveStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}

export interface AIAgentTriggers {
  message_received?: {
    enabled: boolean;
    conditions?: {
      matchMode?: KeywordMatchMode;          // How to match keywords (default: 'any_message')
      keywords?: string[];                   // Keywords to match
      keywordLogic?: KeywordMatchLogic;      // AND/OR logic for multiple keywords (default: 'OR')
      channelIds?: string[];                 // Filter by specific channel IDs - trigger only fires if message channel is in this list
      customerSegments?: string[];           // Filter by customer segments
      timeWindow?: {
        start: string;
        end: string;
      };
    };
  };
  message_sent?: {
    enabled: boolean;
    conditions?: {
      matchMode?: KeywordMatchMode;          // How to match keywords (default: 'any_message')
      keywords?: string[];                   // Keywords to match
      keywordLogic?: KeywordMatchLogic;      // AND/OR logic for multiple keywords (default: 'OR')
      channelIds?: string[];                 // Filter by specific channel IDs
    };
  };
  lead_stage_change?: {
    enabled: boolean;
    stages?: string[];
  };
  lead_created?: {
    enabled: boolean;
    sources?: string[];
    funnelIds?: string[];        // Filtrar por funis específicos (vazio = todos)
    phoneChannelId?: string;     // Canal para leads COM telefone
    emailChannelId?: string;     // Canal para leads COM email (sem telefone)
  };
  webhook_event?: {
    enabled: boolean;
    eventTypes?: string[];
  };
}

export type AIAgentCapability =
  | 'text_generation'
  | 'sentiment_analysis'
  | 'intent_recognition'
  | 'entity_extraction'
  | 'language_translation'
  | 'conversation_summarization'
  | 'voice_interaction'
  // Tool-based capabilities
  | 'calendar_management'
  | 'lead_management'
  | 'conversation_transfer'   // Transfer conversation to user or team
  | 'media_messaging'
  | 'contact_tag_management'; // Add/remove tags from contacts

/**
 * Agent Capability Configuration
 * Configurações específicas para cada capability habilitada
 */
export interface AIAgentCapabilityConfig {
  capability: AIAgentCapability;
  enabled: boolean;
  config?: {
    // Calendar Management
    allowedUserIds?: string[];           // IDs de usuários permitidos para agendamento

    // Lead Management
    funnelId?: string;                   // Funil selecionado para criar leads

    // Conversation Transfer (for user and team transfers)
    allowedTransferUserIds?: string[];   // Usuários para os quais pode transferir
    allowedTeamIds?: string[];           // Equipes para as quais pode transferir
    transferMessage?: string;            // Mensagem padrão ao transferir

    // Generic config for future capabilities
    [key: string]: any;
  };
}

/**
 * AI Agent Webhook Configuration
 * Allows external systems to send data that will be processed by AI and injected into conversations
 */
export interface AIAgentWebhook {
  id: string;                                  // UUID v4 generated by backend
  name: string;                                // Descriptive name (e.g., "Notificação CRM")
  description?: string;                        // Optional description
  method: 'POST' | 'PUT' | 'PATCH';           // Accepted HTTP method
  prompt: string;                              // AI prompt to process received JSON
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AIAgentResponse extends Omit<AIAgent, '_id'> {
  id: string;
  totalInteractions?: number;
}

export interface CreateAIAgentRequest {
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  delay?: number;
  triggers: AIAgentTriggers;
  customActionIds?: string[];
  databases?: string[];                     // Database IDs that the agent can access
  voiceEnabled?: boolean;
  voiceConfig?: {
    aiProviderId: string;
    voiceId?: string;
  };
  enabledCapabilities?: AIAgentCapabilityConfig[];  // ✅ UNIFIED: Capabilities + Configurations
  webhooks?: Omit<AIAgentWebhook, 'createdAt' | 'updatedAt'>[];
}

export interface UpdateAIAgentRequest {
  name?: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  delay?: number;
  triggers?: AIAgentTriggers;
  customActionIds?: string[];
  databases?: string[];                     // Database IDs that the agent can access
  voiceEnabled?: boolean;
  voiceConfig?: {
    aiProviderId: string;
    voiceId?: string;
  };
  enabledCapabilities?: AIAgentCapabilityConfig[];  // ✅ UNIFIED: Capabilities + Configurations
  webhooks?: Omit<AIAgentWebhook, 'createdAt' | 'updatedAt'>[];
}

export interface AIAgentQuery extends PaginationQuery {
  status?: ActiveStatus;
  voiceEnabled?: boolean;
}

/**
 * Agent version change type
 */
export type AgentVersionChangeType = 'major' | 'minor' | 'patch' | 'initial';

/**
 * Agent Version - Snapshot of agent systemPrompt at a specific version
 */
export interface AgentVersion {
  _id?: ObjectId;
  agentId: ObjectId | string;
  version: string;                    // Semver "1.0.0"
  systemPrompt: string;
  changePercentage: number;           // 0-100
  changeType: AgentVersionChangeType;
  appId: ObjectId | string;
  companyId: ObjectId | string;
  createdAt: Date | string;
}

/**
 * Agent Version API Response
 */
export interface AgentVersionResponse extends Omit<AgentVersion, '_id'> {
  id: string;
}

/**
 * Query parameters for agent versions
 */
export interface AgentVersionQuery extends PaginationQuery {}
