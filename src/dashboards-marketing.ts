import type { DashboardPeriodMode, KpiValue } from './dashboards-commercial';
import type { LeadSource } from './leads';

/**
 * Alias retrocompatível. `MarketingSource` é semanticamente equivalente a
 * `LeadSource` — mantido pra não quebrar imports existentes do dashboard,
 * mas o canônico vive em `./leads` (alinhado com `Lead.source`).
 *
 * Em código novo: prefira `LeadSource` direto.
 */
export type MarketingSource = LeadSource;

/**
 * Query params do endpoint `GET /api/dashboards/marketing`.
 *
 * Modos de período seguem mesmo contrato do commercial:
 * - week    → últimos 7 dias rolling (sem extras)
 * - month   → exige `year` + `month` (1-12)
 * - year    → exige `year`
 * - custom  → exige `startDate` + `endDate` (ISO YYYY-MM-DD)
 *
 * Filtros opcionais:
 * - `funnelId` — restringe a leads de um funil específico
 * - `source`   — restringe a uma plataforma de marketing
 */
export interface MarketingDashboardQuery {
  period: DashboardPeriodMode;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  funnelId?: string;
  source?: MarketingSource;
}


export type FunnelStageKey = 'visitors' | 'leads' | 'opportunities' | 'won';

export interface FunnelStageScore {
  key: FunnelStageKey;
  label: string;
  count: number;
  /** 0-100. Saúde da etapa. */
  score: number;
  /** % de conversão para o próximo estágio. `null` no estágio final. */
  conversionToNext: number | null;
  /** Meta de conversão (%). `null` quando não há meta configurada. */
  meta: number | null;
}

export interface FunnelNarrative {
  /** Score consolidado (0-100), média ponderada das 4 etapas. */
  consolidatedScore: number;
  /** Delta vs período anterior em pontos percentuais. */
  consolidatedScoreDelta: number;
  stages: FunnelStageScore[];
}

export type ChannelDiagnosisSeverity = 'good' | 'warning' | 'critical';

export interface ChannelFunnelDiagnosis {
  severity: ChannelDiagnosisSeverity;
  message: string;
}

export interface ChannelFunnelStages {
  visitors: number;
  leads: number;
  leadsConvPct: number;
  opportunities: number;
  oppsConvPct: number;
  won: number;
  wonConvPct: number;
}

export interface ChannelFunnel {
  source: MarketingSource;
  label: string;
  activeCampaigns: number;
  spend: number;
  cpl: number;
  revenue: number;
  roas: number;
  /** % do total de leads atribuído a este canal. */
  leadsSharePct: number;
  funnel: ChannelFunnelStages;
  diagnosis: ChannelFunnelDiagnosis;
}

export type MarketingCampaignStatus = 'active' | 'paused' | 'ended' | 'continuous';

export interface CampaignMasterRow {
  id: string;
  rank: number;
  name: string;
  status: MarketingCampaignStatus;
  source: MarketingSource;
  spend: number;
  leads: number;
  qualified: number;
  leadToQualifiedPct: number;
  opportunities: number;
  qualifiedToOppPct: number;
  won: number;
  oppToWonPct: number;
  revenue: number;
  roas: number;
  lastActivityIso: string;
  daysSinceLastActivity: number;
}

export type LeakageTransitionKey =
  | 'visitors_to_leads'
  | 'leads_to_opportunities'
  | 'opportunities_to_won';

export interface LeakageStage {
  key: FunnelStageKey;
  label: string;
  count: number;
  /** % do entrante (visitantes = 100). */
  sharePct: number;
  /** Quantos NÃO avançaram para o próximo estágio. */
  lostToNext: number;
  lostPct: number;
}

export interface LeakageReason {
  reason: string;
  count: number;
}

export interface LeakageReasonsByTransition {
  visitors_to_leads: LeakageReason[];
  leads_to_opportunities: LeakageReason[];
  opportunities_to_won: LeakageReason[];
}

export interface LeakageCascade {
  stages: LeakageStage[];
  reasonsByTransition: LeakageReasonsByTransition;
}

export type ChannelLeakageDiagnosisKey =
  | 'healthy'
  | 'cold_leads'
  | 'capture_low'
  | 'cold_audience'
  | 'mixed';

export interface ChannelLeakage {
  source: MarketingSource;
  label: string;
  visitToLeadLossPct: number;
  leadToOppLossPct: number;
  oppToWonLossPct: number;
  totalLost: number;
  diagnosis: ChannelLeakageDiagnosisKey;
  diagnosisLabel: string;
}

export interface MarketingDashboardKpis {
  visitors: KpiValue;
  leads: KpiValue;
  opportunities: KpiValue;
  won: KpiValue;
  revenue: KpiValue;
}

export interface MarketingDashboardWarnings {
  visitorsIsProxy?: boolean;
  leakageReasonsAreSynthetic?: boolean;
  /**
   * `true` quando a tenant não tem integração ativa com plataformas de ads
   * (Meta Ads / Google Ads), então `spend`, `cpl` e `roas` em channelFunnels
   * e campaignsMaster vêm como `0`. Frontend deve mostrar "—" ou esconder.
   */
  noAdSpendData?: boolean;
}

export interface MarketingDashboardResponse {
  period: {
    type: DashboardPeriodMode;
    start: string;
    end: string;
    label: string;
  };
  kpis: MarketingDashboardKpis;
  funnelNarrative: FunnelNarrative;
  channelFunnels: ChannelFunnel[];
  campaignsMaster: CampaignMasterRow[];
  leakageCascade: LeakageCascade;
  channelLeakage: ChannelLeakage[];
  /** Sinaliza quais blocos vieram com proxies/dados sintéticos (ex: visitors). */
  warnings?: MarketingDashboardWarnings;
}
