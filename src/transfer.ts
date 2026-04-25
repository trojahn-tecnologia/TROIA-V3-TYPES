/**
 * Payload para endpoints de transferência (conversations, tickets, leads).
 * XOR entre toUserId e toTeamId é validado no backend via Zod.
 *
 * Semântica tri-state dos campos opcionais:
 * - undefined (campo ausente): não alterar o assignee atual
 * - null: unassign explícito (remover atribuição)
 * - string (ObjectId): atribuir ao user/team
 */
export interface TransferRequest {
  toUserId?: string | null;
  toTeamId?: string | null;
  reason?: string;
  notes?: string;
}
