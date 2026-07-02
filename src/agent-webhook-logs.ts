import { ObjectId } from 'mongodb';
import { PaginationQuery } from './common';

/**
 * Agent Webhook Log - Records each request received by an AI Agent webhook
 * (POST /api/webhooks/agents/:webhookId/:conversationId)
 */
export interface AgentWebhookLog {
  _id?: ObjectId;
  id?: string;
  webhookId: string;
  webhookName: string;
  agentId: string;
  conversationId?: string;

  request: {
    body?: unknown;
    headers?: Record<string, string>;
  };

  aiProcessing?: {
    prompt: string;
    result?: string;
    error?: string;
  };

  /** Resultado da execução fire-and-forget do agente, atualizado de forma assíncrona após a resposta HTTP já ter sido enviada. Ausente enquanto a execução não terminou. */
  agentExecution?: {
    success: boolean;
    error?: string;
  };

  success: boolean;
  error?: string;
  executionTime: number;

  appId: ObjectId | string;
  companyId: ObjectId | string;
  createdAt: Date | string;
}

export interface AgentWebhookLogResponse extends Omit<AgentWebhookLog, '_id'> {
  id: string;
}

export interface AgentWebhookLogQuery extends PaginationQuery {
  webhookId: string;
}

export interface AgentWebhookLogStats {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgExecutionTime: number;
  lastExecutionAt: string | null;
}
