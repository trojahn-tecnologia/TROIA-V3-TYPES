// ============================================================================
// SAVED CARDS TYPES
// ============================================================================

import { PaginationQuery, ListResponse } from './common';

// ================================
// CORE TYPES
// ================================

export interface SavedCard {
  id: string;
  userId: string;
  appId: string;
  companyId: string;

  // Provider information
  providerId: string;       // ProviderId enum value
  integrationId: string;    // Reference to app_integrations
  customerId: string;       // External customer ID in provider
  tokenId: string;          // External token ID in provider

  // Card display information
  maskedNumber: string;     // "**** **** **** 1234"
  brand: string;           // "visa", "mastercard", "amex", etc.
  expiryMonth: number;     // 1-12
  expiryYear: number;      // 2025
  holderName?: string;     // Cardholder name (masked if needed)

  // User preferences
  nickname?: string;       // "Cartão principal", "Cartão trabalho"
  isDefault: boolean;      // Default card for payments
  isActive: boolean;       // Card is active/inactive

  // Timestamps
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
  lastUsedAt?: string;     // ISO string - last payment date
}

// ================================
// REQUEST TYPES
// ================================

export interface SaveCardRequest {
  // Card data for tokenization
  cardData: {
    number: string;        // Full card number (will be tokenized)
    cvv: string;          // CVV code
    expiryMonth: number;  // 1-12
    expiryYear: number;   // 2025
    holderName?: string;  // Cardholder name
  };

  // User preferences
  nickname?: string;      // Optional nickname
  setAsDefault?: boolean; // Set as default card
}

export interface UpdateSavedCardRequest {
  nickname?: string;      // Update nickname
  isActive?: boolean;     // Activate/deactivate card
}

// ================================
// RESPONSE TYPES
// ================================

export interface SavedCardResponse extends SavedCard {}

export interface SaveCardResponse {
  savedCard: SavedCardResponse;
  message: string;
}

// ================================
// QUERY TYPES
// ================================

export interface SavedCardsQuery extends PaginationQuery {
  filters?: {
    isActive?: boolean;     // Filter by active/inactive
    brand?: string;         // Filter by card brand
    providerId?: string;    // Filter by provider
  };
}

export interface SavedCardsListResponse extends ListResponse<SavedCardResponse> {}

// ================================
// PAYMENT REQUEST TYPES
// ================================

export interface PaymentWithCardRequest {
  // Payment amount and details
  amount: number;
  currency?: string;      // Default: 'BRL'
  description: string;

  // Card selection (one of these must be provided)
  cardId?: string;        // Use saved card
  cardData?: {            // Or provide new card data
    number: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    holderName?: string;
  };

  // Options for new cards
  saveCard?: boolean;     // Save new card for future use
  cardNickname?: string;  // Nickname if saving card

  // Additional payment options
  installments?: number;  // Number of installments (if supported)
  dueDate?: string;      // Due date for boleto/pix (ISO string)
  externalReference?: string; // External reference ID
}

export interface PaymentWithCardResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: string;

  // Card information used
  cardInfo?: {
    maskedNumber: string;
    brand: string;
    nickname?: string;
  };

  // Saved card info (if card was saved)
  savedCard?: {
    nickname?: string;
    isDefault: boolean;
  };

  // Provider specific data
  providerData?: Record<string, unknown>;

  createdAt: string;
}

// ================================
// ERROR TYPES
// ================================

export interface SavedCardError {
  code: 'INVALID_CARD' | 'TOKENIZATION_FAILED' | 'PROVIDER_ERROR' | 'CARD_NOT_FOUND' | 'CARD_EXPIRED';
  message: string;
  details?: Record<string, unknown>;
}

// ================================
// PROVIDER INTEGRATION TYPES
// ================================

export interface CardTokenizationRequest {
  customerId: string;     // Customer ID in provider
  cardData: {
    number: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    holderName?: string;
  };
}

export interface CardTokenizationResponse {
  tokenId: string;        // Token ID from provider
  maskedNumber: string;   // Masked card number
  brand: string;          // Card brand
  expiryMonth: number;
  expiryYear: number;
  holderName?: string;

  // Provider specific data
  providerData?: Record<string, unknown>;
}

// ================================
// STATISTICS TYPES
// ================================

export interface SavedCardsStats {
  totalCards: number;
  activeCards: number;
  inactiveCards: number;
  cardsByBrand: Record<string, number>;
  cardsByProvider: Record<string, number>;
  lastCardAdded?: string; // ISO string
}