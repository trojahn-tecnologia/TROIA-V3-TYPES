export type HistoryImportRunStatus = 'awaiting_qr' | 'capturing' | 'ready_for_selection' | 'ingesting' | 'importing_media' | 'completed' | 'failed' | 'aborted' | 'expired';
export interface HistoryImportRunCounters {
    chatsFound: number;
    chatsSelected: number;
    messagesFound: number;
    messagesInserted: number;
    messagesDuplicated: number;
    mediaTotal: number;
    mediaDone: number;
    mediaFailed: number;
}
export interface HistoryImportRun {
    id: string;
    channelId: string;
    providerId: string;
    status: HistoryImportRunStatus;
    periodDays: number;
    periodStart?: string;
    periodEnd?: string;
    requestedBy: string;
    counters: HistoryImportRunCounters;
    error?: string;
    createdAt: string;
    updatedAt: string;
    finishedAt?: string;
}
export interface HistoryImportChatSummary {
    chatId: string;
    name?: string;
    pushName?: string;
    msgCount: number;
    firstMsgAt: string;
    lastMsgAt: string;
    mediaCount: number;
    selected?: boolean;
    ingestedAt?: string;
}
export interface NormalizedHistoryMedia {
    mediaKey: string;
    directPath: string;
    fileSha256: string;
    fileEncSha256: string;
    fileLength: number;
    mimeType: string;
    fileName?: string;
    duration?: number;
    width?: number;
    height?: number;
}
export type NormalizedHistoryMessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contact';
export interface NormalizedHistoryMessage {
    chatId: string;
    providerMessageId: string;
    fromMe: boolean;
    senderName?: string;
    timestamp: number;
    type: NormalizedHistoryMessageType;
    text?: string;
    caption?: string;
    media?: NormalizedHistoryMedia;
}
export interface HistoryImportProgressEvent {
    runId: string;
    channelId: string;
    status: HistoryImportRunStatus;
    counters: HistoryImportRunCounters;
    percentComplete: number;
    timestamp: string;
}
export declare const HISTORY_IMPORT_SUPPORTED_PROVIDERS: readonly string[];
