import { PaginationQuery, ListResponse } from './common';
export interface SavedCard {
    id: string;
    userId: string;
    appId: string;
    companyId: string;
    providerId: string;
    integrationId: string;
    customerId: string;
    tokenId: string;
    maskedNumber: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    holderName?: string;
    nickname?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastUsedAt?: string;
}
export interface SaveCardRequest {
    cardData: {
        number: string;
        cvv: string;
        expiryMonth: number;
        expiryYear: number;
        holderName?: string;
    };
    nickname?: string;
    setAsDefault?: boolean;
}
export interface UpdateSavedCardRequest {
    nickname?: string;
    isActive?: boolean;
}
export interface SavedCardResponse extends SavedCard {
}
export interface SaveCardResponse {
    savedCard: SavedCardResponse;
    message: string;
}
export interface SavedCardsQuery extends PaginationQuery {
    filters?: {
        isActive?: boolean;
        brand?: string;
        providerId?: string;
    };
}
export interface SavedCardsListResponse extends ListResponse<SavedCardResponse> {
}
export interface PaymentWithCardRequest {
    amount: number;
    currency?: string;
    description: string;
    cardId?: string;
    cardData?: {
        number: string;
        cvv: string;
        expiryMonth: number;
        expiryYear: number;
        holderName?: string;
    };
    saveCard?: boolean;
    cardNickname?: string;
    installments?: number;
    dueDate?: string;
    externalReference?: string;
}
export interface PaymentWithCardResponse {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    cardInfo?: {
        maskedNumber: string;
        brand: string;
        nickname?: string;
    };
    savedCard?: {
        nickname?: string;
        isDefault: boolean;
    };
    providerData?: Record<string, unknown>;
    createdAt: string;
}
export interface SavedCardError {
    code: 'INVALID_CARD' | 'TOKENIZATION_FAILED' | 'PROVIDER_ERROR' | 'CARD_NOT_FOUND' | 'CARD_EXPIRED';
    message: string;
    details?: Record<string, unknown>;
}
export interface CardTokenizationRequest {
    customerId: string;
    cardData: {
        number: string;
        cvv: string;
        expiryMonth: number;
        expiryYear: number;
        holderName?: string;
    };
}
export interface CardTokenizationResponse {
    tokenId: string;
    maskedNumber: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    holderName?: string;
    providerData?: Record<string, unknown>;
}
export interface SavedCardsStats {
    totalCards: number;
    activeCards: number;
    inactiveCards: number;
    cardsByBrand: Record<string, number>;
    cardsByProvider: Record<string, number>;
    lastCardAdded?: string;
}
