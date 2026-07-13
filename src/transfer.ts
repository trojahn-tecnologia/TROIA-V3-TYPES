/**
 * Payload para endpoints de transferência (conversations, tickets, leads).
 * XOR entre toUserId e toTeamId é validado no backend via Zod.
 *
 * Semântica tri-state dos campos opcionais:
 * - undefined (campo ausente): não alterar o assignee atual
 * - null: unassign explícito (remover atribuição)
 * - string (ObjectId): atribuir ao user/team
 *
 * toPipelineId/toStageId (Plano A — tickets): combináveis com toUserId/toTeamId.
 * Usado sozinho, muda apenas o pipeline/estágio sem alterar o assignee.
 * toStageId só é válido quando toPipelineId também é informado.
 */
export interface TransferRequest {
  toUserId?: string | null;
  toTeamId?: string | null;
  toPipelineId?: string;
  toStageId?: string;
  reason?: string;
  notes?: string;
}
