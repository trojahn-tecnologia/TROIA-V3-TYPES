import type { GamificationEventListItem, GamificationLevel, GamificationPeriod, RankingResponse } from './gamification';
import type { LeadCaptureSession } from './lead-capture';
import type { LeadResponse } from './leads';

/**
 * `GET /api/leads/seller-dashboard?period=today|week|month` — dashboard do
 * vendedor DENTRO do módulo CRM (D10). Recorte sempre `assigneeId = user.id`.
 */
export interface SellerDashboardResponse {
  periodKey: string;
  kpis: {
    leadsToday: number;
    leadsMonth: number;
    leadsTodayDelta: number;
    leadsMonthDeltaPct: number;
    periodPoints: number;
    pointsToday: number;
    position?: number;
    total?: number;
    level: GamificationLevel;
    nextLevel?: GamificationLevel;
    totalPoints: number;
  };
  recentLeads: LeadResponse[];
  ranking?: RankingResponse;
  pendingSessions: LeadCaptureSession[];
  /**
   * Últimos eventos do livro-caixa do vendedor JÁ ENRIQUECIDOS (`sourceName`
   * do lead/checklist, `userName`, `link`) — mesmo item da auditoria
   * (`GET /api/gamification/events`). O card "Últimos pontos" do mockup 07
   * mostra "Airto José Bona · hoje 17:41", ou seja precisa do NOME da origem,
   * que o `GamificationEvent` cru não carrega.
   */
  recentEvents: GamificationEventListItem[];
  /**
   * Período da gamificação configurado pela empresa (`week`/`month`/`quarter`)
   * — rotula "Pontos {na semana|no mês|no trimestre}". NÃO confundir com
   * `periodKey`, que é a janela do segmented Hoje·Semana·Mês do dashboard.
   */
  gamificationPeriod: GamificationPeriod;
  /** Chave do período da gamificação (`YYYY-MM` | `YYYY-Www` | `YYYY-Qn`). */
  gamificationPeriodKey: string;
  /** 1ª unidade ativa do vendedor (quando o ranking é `users_by_unit`) — subtítulo "Ranking da loja · {nome}". */
  unit?: { id: string; name: string };
}
