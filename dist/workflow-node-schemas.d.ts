/**
 * WORKFLOW NODE TYPE SCHEMAS - Type Definitions
 *
 * Interfaces e tipos para o sistema de schemas de nodes de workflow.
 * Define estruturas para validação de contexto e opções condicionais.
 *
 * NOTA: Este arquivo contém APENAS tipos (interface, type).
 * As constantes e funções runtime estão em:
 * - Frontend: src/modules/workflows/utils/node-schemas.ts
 * - Backend: (quando necessário)
 */
import type { WorkflowNodeType } from './workflows';
/**
 * Contexto disponível durante execução do workflow
 * Define quais entidades estão disponíveis em cada ponto do fluxo
 */
export interface AvailableContext {
    /** Conversa atual disponível no contexto */
    conversation: boolean;
    /** Contato disponível no contexto */
    contact: boolean;
    /** Lead disponível no contexto */
    lead: boolean;
    /** Ticket disponível no contexto */
    ticket: boolean;
    /** AI Processor output disponível no contexto ({{ai.message}}, etc.) */
    ai?: boolean;
    /** Calendar event context (date-field trigger with entityType 'event') */
    event?: boolean;
}
/**
 * Schema de output de um node
 * Define quais contextos o node fornece ao ser executado
 */
export interface NodeOutputSchema {
    /** Contextos que este node fornece/disponibiliza */
    providesContext: AvailableContext;
}
/**
 * Schema de input de um node
 * Define quais contextos são necessários para o node funcionar
 */
export interface NodeInputSchema {
    /** Contextos obrigatórios para este node funcionar */
    requiresContext?: Partial<AvailableContext>;
    /** Contextos opcionais que melhoram o funcionamento */
    optionalContext?: Partial<AvailableContext>;
}
/**
 * Opção condicional baseada em contexto
 * Define quando uma opção específica deve estar disponível
 */
export interface ConditionalOption {
    /** Nome do campo/opção */
    field: string;
    /** Valor da opção */
    value: string;
    /** Label para exibição */
    label: string;
    /** Contexto necessário para esta opção estar disponível */
    requiresContext: Partial<AvailableContext>;
    /** Descrição da opção */
    description?: string;
}
/**
 * Schema completo de um tipo de node
 * Define inputs, outputs e opções condicionais
 */
export interface NodeTypeSchema {
    /** Tipo do node */
    type: WorkflowNodeType;
    /** Categoria do node */
    category: 'triggers' | 'actions' | 'controls' | 'ai';
    /** Label do node */
    label: string;
    /** Descrição do node */
    description: string;
    /** Schema de input - contextos necessários */
    input: NodeInputSchema;
    /** Schema de output - contextos fornecidos */
    output: NodeOutputSchema;
    /** Opções condicionais baseadas em contexto */
    conditionalOptions?: ConditionalOption[];
}
