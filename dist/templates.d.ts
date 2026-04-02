import { ObjectId } from 'mongodb';
/**
 * Template Status Lifecycle
 */
export declare enum TemplateStatus {
    DRAFT = "draft",// Em edição, não aprovado
    PENDING_APPROVAL = "pending_approval",// Enviado para aprovação (WhatsApp)
    APPROVED = "approved",// Aprovado (pronto para uso)
    REJECTED = "rejected",// Rejeitado pelo provider
    ARCHIVED = "archived"
}
/**
 * Template Category (WhatsApp requirement)
 */
export declare enum TemplateCategory {
    MARKETING = "MARKETING",// Promotional messages
    UTILITY = "UTILITY",// Transactional updates
    AUTHENTICATION = "AUTHENTICATION"
}
/**
 * Template Variable Definition
 * Variables use numeric positions ({{1}}, {{2}}, {{3}}) for Meta compliance
 */
export interface TemplateVariable {
    position: number;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
    example: string;
    description?: string;
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        enum?: string[];
    };
}
/**
 * WhatsApp Template Component (Meta format)
 */
export interface WhatsAppTemplateComponent {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION';
    text?: string;
    example?: {
        header_text?: string[];
        body_text?: string[][];
    };
    buttons?: Array<{
        type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
        text: string;
        url?: string;
        phone_number?: string;
    }>;
}
/**
 * WhatsApp Official Template Config (Requires Meta approval)
 */
export interface WhatsAppOfficialTemplateConfig {
    providerType: 'whatsapp_business';
    providerTemplateId?: string;
    category: TemplateCategory;
    language: string;
    components: WhatsAppTemplateComponent[];
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    submittedAt?: Date;
    approvedAt?: Date;
}
/**
 * Gateway Template Config (Free format - no approval)
 */
export interface GatewayTemplateConfig {
    providerType: 'whatsapp_gateway';
    messageData: {
        type: 'text' | 'media' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
        message?: string;
        mediaUrl?: string;
        mediaType?: 'image' | 'video' | 'audio' | 'document';
        caption?: string;
        filename?: string;
        location?: {
            latitude: number;
            longitude: number;
            name?: string;
            address?: string;
        };
        contact?: {
            name: string;
            phone?: string;
            email?: string;
        };
    };
}
/**
 * Email Template Config (HTML + Plain Text)
 */
export interface EmailTemplateConfig {
    providerType: 'email_smtp' | 'email_sendgrid' | 'email_resend' | 'email_ses' | 'gmail_api';
    subject?: string;
    htmlBody: string;
    plainTextBody?: string;
    attachments?: Array<{
        filename: string;
        url: string;
        contentType: string;
    }>;
    fromName?: string;
    replyTo?: string;
}
/**
 * Instagram/Facebook Template Config
 */
export interface InstagramTemplateConfig {
    providerType: 'instagram_direct' | 'facebook_messenger';
    messageData: {
        text?: string;
        attachment?: {
            type: 'image' | 'video' | 'audio' | 'file';
            url: string;
        };
        quick_replies?: Array<{
            content_type: 'text';
            title: string;
            payload?: string;
        }>;
    };
}
/**
 * Provider-Specific Configuration Types
 */
export type TemplateProviderConfig = WhatsAppOfficialTemplateConfig | GatewayTemplateConfig | EmailTemplateConfig | InstagramTemplateConfig;
/**
 * Template Submission Request (para envio ao provider)
 */
export interface TemplateSubmissionRequest {
    name: string;
    category: TemplateCategory;
    language: string;
    components: WhatsAppTemplateComponent[];
}
/**
 * Template Submission Response (retorno do provider)
 */
export interface TemplateSubmissionResponse {
    success: boolean;
    providerTemplateId?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedAt: string;
    message?: string;
    error?: string;
}
/**
 * Template Status Update (webhook do WhatsApp)
 */
export interface TemplateStatusUpdate {
    providerTemplateId: string;
    templateId?: string;
    status: 'APPROVED' | 'REJECTED';
    reason?: string;
    approvedAt?: string;
    rejectedAt?: string;
}
/**
 * Main Template Document
 */
export interface Template {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    name: string;
    description?: string;
    status: TemplateStatus;
    providerId: ObjectId;
    channelId: ObjectId;
    providerConfig: TemplateProviderConfig;
    variables: TemplateVariable[];
    version?: string;
    usageCount: number;
    lastUsedAt?: Date;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * API Response Type (no ObjectId exposure)
 */
export interface TemplateResponse extends Omit<Template, '_id' | 'appId' | 'companyId' | 'providerId' | 'channelId' | 'createdBy'> {
    id: string;
    appId: string;
    companyId: string;
    providerId: string;
    channelId: string;
    createdBy: string;
}
/**
 * Create Template Request
 */
export interface CreateTemplateRequest {
    name: string;
    description?: string;
    channelId: string;
    providerConfig?: TemplateProviderConfig;
    variables: TemplateVariable[];
}
/**
 * Update Template Request
 */
export interface UpdateTemplateRequest {
    name?: string;
    description?: string;
    providerConfig?: TemplateProviderConfig;
    variables?: TemplateVariable[];
}
/**
 * Template Query Filters
 */
export interface TemplateQuery {
    status?: TemplateStatus | TemplateStatus[];
    providerId?: string;
    providerType?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'createdAt' | 'usageCount' | 'lastUsedAt';
    sortOrder?: 'asc' | 'desc';
}
/**
 * Template List Response
 */
export interface TemplateListResponse {
    items: TemplateResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
/**
 * Template Preview Request (with sample data)
 */
export interface TemplatePreviewRequest {
    templateId: string;
    sampleData: Record<number, string | number | boolean>;
}
/**
 * Template Preview Response
 */
export interface TemplatePreviewResponse {
    providerId: string;
    providerType: string;
    rendered: {
        components?: WhatsAppTemplateComponent[];
        messageData?: any;
        subject?: string;
        htmlBody?: string;
        plainTextBody?: string;
        text?: string;
        attachment?: any;
    };
    variablesUsed: Record<number, string | number | boolean>;
}
/**
 * Template Version Change Types (semantic versioning)
 */
export type TemplateVersionChangeType = 'major' | 'minor' | 'patch' | 'initial';
/**
 * Template Version Document
 * Immutable snapshot stored in `template-versions` collection
 */
export interface TemplateVersion {
    _id?: ObjectId;
    templateId: ObjectId | string;
    version: string;
    htmlBody: string;
    subject: string;
    changePercentage: number;
    changeType: TemplateVersionChangeType;
    appId: ObjectId | string;
    companyId: ObjectId | string;
    createdAt: Date | string;
}
/**
 * Template Version API Response
 */
export interface TemplateVersionResponse {
    id: string;
    templateId: string;
    version: string;
    htmlBody: string;
    subject: string;
    changePercentage: number;
    changeType: TemplateVersionChangeType;
    appId: string;
    companyId: string;
    createdAt: string;
}
/**
 * Template Version Query
 */
export interface TemplateVersionQuery {
    page?: number;
    limit?: number;
}
/**
 * Generate HTML Request (AI-powered)
 */
export interface GenerateHtmlRequest {
    instructions: string;
    currentHtml: string;
}
/**
 * Generate HTML Response
 */
export interface GenerateHtmlResponse {
    html: string;
}
/**
 * Submit Template for Approval Request (WhatsApp only)
 */
export interface SubmitTemplateApprovalRequest {
    templateId: string;
}
/**
 * Template Approval Status Response
 */
export interface TemplateApprovalStatusResponse {
    templateId: string;
    status: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    providerTemplateId?: string;
    rejectionReason?: string;
    submittedAt?: Date;
    approvedAt?: Date;
}
