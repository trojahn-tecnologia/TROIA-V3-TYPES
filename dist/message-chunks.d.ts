import { ObjectId } from 'mongodb';
/**
 * MessageChunk - Fragmento de mensagem para vector search
 *
 * Mensagens longas são divididas em chunks para:
 * - Respeitar limite de tokens do modelo de embedding
 * - Melhorar precisão da busca semântica (chunks menores = mais específicos)
 * - Permitir overlap entre chunks para manter contexto
 */
export interface MessageChunk {
    _id?: ObjectId;
    messageId: ObjectId;
    conversationId: ObjectId;
    chunkIndex: number;
    content: string;
    embedding: number[];
    embeddingsModel: string;
    hasOverlap: boolean;
    overlapSize?: number;
    appId: ObjectId;
    companyId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Response type para API
 */
export interface MessageChunkResponse extends Omit<MessageChunk, '_id' | 'messageId' | 'conversationId' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt'> {
    id: string;
    messageId: string;
    conversationId: string;
    appId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Request para criar chunk
 */
export interface CreateMessageChunkRequest {
    messageId: string;
    conversationId: string;
    chunkIndex: number;
    content: string;
    hasOverlap: boolean;
    overlapSize?: number;
}
/**
 * Configuração de chunking
 */
export interface ChunkingConfig {
    maxWordsPerChunk: number;
    overlapWords: number;
    minWordsForChunking: number;
}
/**
 * Resultado de busca semântica
 */
export interface SemanticSearchResult {
    chunkId: string;
    messageId: string;
    conversationId: string;
    content: string;
    score: number;
    chunkIndex: number;
    metadata?: Record<string, unknown>;
}
/**
 * Parâmetros para busca semântica
 */
export interface SemanticSearchQuery {
    query: string;
    appId: string;
    companyId: string;
    limit?: number;
    minScore?: number;
    conversationId?: string;
}
/**
 * TEMPORAL CHUNKING - Agregação de mensagens por tempo/sender
 * Diferente de MessageChunk (que divide mensagens longas)
 */
/**
 * TemporalChunk - Agrupamento temporal de mensagens para RAG
 */
export interface TemporalChunk {
    _id?: ObjectId;
    text: string;
    messageIds: ObjectId[];
    messageCount: number;
    conversationId: ObjectId;
    sender: {
        id: string;
        type: 'agent' | 'customer';
    };
    startTimestamp: Date;
    endTimestamp: Date;
    embedding?: number[];
    appId: ObjectId;
    companyId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Response type para API (Temporal Chunks)
 */
export interface TemporalChunkResponse extends Omit<TemporalChunk, '_id' | 'messageIds' | 'conversationId' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'startTimestamp' | 'endTimestamp'> {
    id: string;
    messageIds: string[];
    conversationId: string;
    appId: string;
    companyId: string;
    startTimestamp: string;
    endTimestamp: string;
    createdAt: string;
    updatedAt: string;
}
