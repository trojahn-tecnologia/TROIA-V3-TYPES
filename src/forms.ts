import { ActorType, ListResponse, PaginationQuery, TenantAwareDocument } from './common';

// ============================================================
// FORM FIELD TYPES
// ============================================================

/**
 * FormFieldType - Tipos de campo suportados no builder
 */
export enum FormFieldType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  URL = 'url',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TIME = 'time',
  FILE_UPLOAD = 'file_upload',
  RATING = 'rating',
  LINEAR_SCALE = 'linear_scale',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  CPF = 'cpf',
  CNPJ = 'cnpj',
  PHOTO = 'photo',
  CONFORMITY = 'conformity'
}

/**
 * FormFieldOption - Opcao para campos de escolha (select, radio, checkbox)
 */
export interface FormFieldOption {
  id: string;
  label: string;
  value: string;
}

/**
 * FormFieldValidation - Regras de validacao por campo
 */
export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customErrorMessage?: string;
}

/**
 * ConditionalLogic - Logica condicional para exibicao de campos
 */
export interface FormConditionalLogic {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_empty';
  value: string;
}

/**
 * FormType - Diferencia formularios genericos de checklists (modulo Checklists+Units).
 * 'checklist' habilita ChecklistSettings no Form e os campos FormFieldType.PHOTO/CONFORMITY.
 */
export type FormType = 'form' | 'checklist';

/**
 * ChecklistSettings - Configuracoes especificas de um Form do tipo 'checklist'.
 */
export interface ChecklistSettings {
  requiresApproval: boolean;
  /** Prazo padrão das aplicações deste modelo, em MINUTOS. */
  defaultDueMinutes?: number;
  scoreEnabled: boolean;
  captureGps: boolean;
}

/**
 * CONFORMITY_VALUES - Valores aceitos pelo campo FormFieldType.CONFORMITY.
 */
export const CONFORMITY_VALUES = ['conforme', 'nao_conforme', 'na'] as const;
export type ConformityValue = (typeof CONFORMITY_VALUES)[number];

/**
 * PhotoFieldConfig - Configuracao do campo FormFieldType.PHOTO.
 */
export interface PhotoFieldConfig {
  source: 'any' | 'camera_only';
  maxPhotos?: number;
}

/**
 * FormField - Campo individual do formulario
 */
export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  conditionalLogic?: FormConditionalLogic;
  /**
   * Mapeamento para um campo da entidade destino (#263) — ex: `name`, `email`,
   * `phone`. Usado pela auto-criação a partir do `destination` do form.
   */
  mapsTo?: string;
  /** Configuracao do campo quando type === FormFieldType.PHOTO. */
  photoConfig?: PhotoFieldConfig;
}

// ============================================================
// FORM SETTINGS & STYLING
// ============================================================

/**
 * FormSettings - Configuracoes de comportamento do formulario
 */
export interface FormSettings {
  allowMultipleResponses: boolean;
  showProgressBar: boolean;
  shuffleFields: boolean;
  confirmationEmail?: {
    enabled: boolean;
    emailFieldId?: string;
    subject?: string;
    body?: string;
  };
  notifications?: {
    enabled: boolean;
    userIds: string[];
  };
}

/**
 * FormStyling - Personalizacao visual do formulario publico
 */
export interface FormStyling {
  logoUrl?: string;
  coverUrl?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

// ============================================================
// FORM STATUS
// ============================================================

/**
 * FormStatus - Status do formulario
 */
export enum FormStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// ============================================================
// FORM DOCUMENT
// ============================================================

/**
 * Form - Documento principal do formulario
 */
/**
 * Destino do formulário (#261) — para onde as respostas apontam. Capturado no
 * drawer "Novo formulário". A auto-criação da entidade na submissão é
 * consumida por workflows via o evento `form.submitted` (que carrega o
 * `destination`).
 */
export interface FormDestination {
  targetType: 'lead' | 'contact' | 'ticket';
  funnelId?: string; // quando targetType='lead'
  pipelineId?: string; // quando targetType='ticket'
}

export interface Form extends TenantAwareDocument {
  name: string;
  description?: string;
  slug: string;
  type: FormType;
  status: FormStatus;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  checklistSettings?: ChecklistSettings;
  destination?: FormDestination;
  thankYouMessage?: string;
  thankYouRedirectUrl?: string;
  maxResponses?: number;
  expiresAt?: Date;
  responsesCount: number;
  viewsCount: number;
  /**
   * Quem criou o formulário. OPCIONAL desde 2026-08-30.
   *
   * Era declarado obrigatório e NENHUM caminho gravava; o mapper usava
   * `toIdRequired`, que devolve `''` quando o campo não existe — a API
   * respondia string vazia como se fosse um id. Mentir no tipo foi o que
   * produziu o `""`.
   */
  createdBy?: string;
  /**
   * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
   * Ausente = registro anterior a 2026-08-30 (a informação não existia).
   */
  createdByType?: ActorType;
}

/**
 * FormResponse - Response type sem _id
 */
export interface FormResponse extends Omit<Form, '_id'> {
  id: string;
}

/**
 * FormListResponse
 */
export interface FormListResponse extends ListResponse<FormResponse> {}

// ============================================================
// FORM REQUESTS
// ============================================================

/**
 * CreateFormRequest
 */
export interface CreateFormRequest {
  name: string;
  description?: string;
  slug?: string;
  type?: FormType;
  fields: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  checklistSettings?: ChecklistSettings;
  destination?: FormDestination;
  thankYouMessage?: string;
  thankYouRedirectUrl?: string;
  maxResponses?: number;
  expiresAt?: string;
}

/**
 * UpdateFormRequest
 */
export interface UpdateFormRequest {
  name?: string;
  description?: string;
  slug?: string;
  type?: FormType;
  status?: FormStatus;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  checklistSettings?: ChecklistSettings;
  destination?: FormDestination;
  thankYouMessage?: string;
  thankYouRedirectUrl?: string;
  maxResponses?: number | null;
  expiresAt?: string | null;
}

/**
 * FormQuery
 */
export interface FormQuery extends PaginationQuery {
  status?: FormStatus;
  search?: string;
  /**
   * Separa as duas listagens que compartilham a collection: Formulários
   * (`'form'`) e Modelos de checklist (`'checklist'`). O backend já aceitava o
   * filtro; sem o campo tipado aqui, o frontend precisava de um workaround
   * local para mandá-lo.
   */
  type?: FormType;
}

// ============================================================
// FORM SUBMISSION (Respostas)
// ============================================================

/**
 * FormAnswer - Resposta individual de um campo
 */
export interface FormAnswer {
  fieldId: string;
  fieldType: FormFieldType;
  fieldLabel: string;
  value: string | string[] | number | boolean | null;
}

/**
 * FormSubmissionMetadata - Metadados da submissao
 */
export interface FormSubmissionMetadata {
  ip?: string;
  userAgent?: string;
  referrer?: string;
  completionTimeSeconds?: number;
}

/**
 * FormSubmission - Documento de resposta individual
 */
export interface FormSubmission extends TenantAwareDocument {
  formId: string;
  answers: FormAnswer[];
  metadata: FormSubmissionMetadata;
  submittedAt: Date;
  contactId?: string;
}

/**
 * FormSubmissionResponse - Response type sem _id
 */
export interface FormSubmissionResponse extends Omit<FormSubmission, '_id'> {
  id: string;
}

/**
 * FormSubmissionListResponse
 */
export interface FormSubmissionListResponse extends ListResponse<FormSubmissionResponse> {}

// ============================================================
// FORM SUBMISSION REQUESTS
// ============================================================

/**
 * SubmitFormRequest - Request publica para enviar resposta
 */
export interface SubmitFormRequest {
  answers: { fieldId: string; value: string | string[] | number | boolean | null }[];
  metadata?: Partial<FormSubmissionMetadata>;
}

/**
 * FormSubmissionQuery
 */
export interface FormSubmissionQuery extends PaginationQuery {
  formId: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================
// FORM STATS (Relatorio)
// ============================================================

/**
 * FormFieldOptionStats - Estatistica de uma opcao de campo de escolha
 */
export interface FormFieldOptionStats {
  option: string;
  count: number;
  percentage: number;
}

/**
 * FormFieldStats - Estatisticas por campo
 */
export interface FormFieldStats {
  fieldId: string;
  fieldLabel: string;
  fieldType: FormFieldType;
  totalAnswered: number;
  skipped: number;
  optionCounts?: FormFieldOptionStats[];
  average?: number;
  min?: number;
  max?: number;
}

/**
 * FormResponsesByDate - Respostas agrupadas por dia
 */
export interface FormResponsesByDate {
  date: string;
  count: number;
}

/**
 * FormStats - Estatisticas completas do formulario
 */
export interface FormStats {
  totalResponses: number;
  todayResponses: number;
  averageCompletionTime: number;
  completionRate: number;
  viewsCount: number;
  fieldStats: FormFieldStats[];
  responsesByDate: FormResponsesByDate[];
}

// ============================================================
// FORM PUBLIC (Dados para renderizacao publica)
// ============================================================

/**
 * FormPublicData - Dados retornados na rota publica (sem dados sensiveis)
 */
export interface FormPublicData {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: {
    showProgressBar: boolean;
    shuffleFields: boolean;
  };
  styling: FormStyling;
  thankYouMessage?: string;
  thankYouRedirectUrl?: string;
  isExpired: boolean;
  isMaxResponsesReached: boolean;
  isAcceptingResponses: boolean;
}
