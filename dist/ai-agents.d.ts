import { ObjectId } from 'mongodb';
import { ActiveStatus, PaginationQuery } from './common';
/**
 * Keyword matching modes for message_received trigger
 */
export type KeywordMatchMode = 'any_message' | 'contains' | 'starts_with' | 'ends_with' | 'exact_match';
/**
 * Keyword matching logic (when multiple keywords are provided)
 */
export type KeywordMatchLogic = 'OR' | 'AND';
export interface AIAgent {
    _id?: ObjectId;
    id?: string;
    name: string;
    description?: string;
    systemPrompt: string;
    instructions?: string;
    model: string;
    temperature: number;
    maxTokens: number;
    delay: number;
    version?: string;
    triggers: AIAgentTriggers;
    customActionIds: string[];
    databases?: string[];
    voiceEnabled: boolean;
    voiceConfig?: {
        aiProviderId: string;
        voiceId?: string;
    };
    enabledCapabilities: AIAgentCapabilityConfig[];
    webhooks?: AIAgentWebhook[];
    responseStyle?: string;
    tone?: string;
    language?: string;
    fallbackResponse?: string;
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
            matchMode?: KeywordMatchMode;
            keywords?: string[];
            keywordLogic?: KeywordMatchLogic;
            channelIds?: string[];
            customerSegments?: string[];
            timeWindow?: {
                start: string;
                end: string;
            };
        };
    };
    message_sent?: {
        enabled: boolean;
        conditions?: {
            matchMode?: KeywordMatchMode;
            keywords?: string[];
            keywordLogic?: KeywordMatchLogic;
            channelIds?: string[];
        };
    };
    lead_stage_change?: {
        enabled: boolean;
        stages?: string[];
    };
    lead_created?: {
        enabled: boolean;
        sources?: string[];
        funnelIds?: string[];
        phoneChannelId?: string;
        emailChannelId?: string;
    };
    webhook_event?: {
        enabled: boolean;
        eventTypes?: string[];
    };
}
export type AIAgentCapability = 'text_generation' | 'sentiment_analysis' | 'intent_recognition' | 'entity_extraction' | 'language_translation' | 'conversation_summarization' | 'voice_interaction' | 'calendar_management' | 'lead_management' | 'conversation_transfer' | 'media_messaging' | 'contact_tag_management';
/**
 * Agent Capability Configuration
 * Configurações específicas para cada capability habilitada
 */
export interface AIAgentCapabilityConfig {
    capability: AIAgentCapability;
    enabled: boolean;
    config?: {
        allowedUserIds?: string[];
        funnelId?: string;
        allowedTransferUserIds?: string[];
        allowedTeamIds?: string[];
        transferMessage?: string;
        [key: string]: any;
    };
}
/**
 * AI Agent Webhook Configuration
 * Allows external systems to send data that will be processed by AI and injected into conversations
 */
export interface AIAgentWebhook {
    id: string;
    name: string;
    description?: string;
    method: 'POST' | 'PUT' | 'PATCH';
    prompt: string;
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
    databases?: string[];
    voiceEnabled?: boolean;
    voiceConfig?: {
        aiProviderId: string;
        voiceId?: string;
    };
    enabledCapabilities?: AIAgentCapabilityConfig[];
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
    databases?: string[];
    voiceEnabled?: boolean;
    voiceConfig?: {
        aiProviderId: string;
        voiceId?: string;
    };
    enabledCapabilities?: AIAgentCapabilityConfig[];
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
    version: string;
    systemPrompt: string;
    changePercentage: number;
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
export interface AgentVersionQuery extends PaginationQuery {
}
