/**
 * Views — visitas medidas por uma fonte externa.
 *
 * Uma "view" aqui não é necessariamente um clique: é uma MEDIÇÃO, o par
 * `(intervalo, contagem)`. Um hit individual de site é uma medição de duração
 * zero com `views: 1`; um contador de fluxo de loja entrega fatias de 15
 * minutos com `views: N`. O mesmo formato serve os dois — não há campo
 * discriminador de granularidade, porque toda leitura é `$sum` sobre `views`
 * dentro de um range, e um campo `granularity` seria uma mentira esperando
 * apodrecer (e buckets de 5 minutos? horários?).
 *
 * `ViewIngestBatch` é O SEAM que torna o módulo agnóstico a provider: o worker
 * que puxa da Best Flow, o beacon do script de site e o endpoint público da API
 * produzem exatamente este objeto. Um provider nativo futuro (Google Analytics)
 * vira um caller novo do mesmo método — não um refactor.
 */
import type { LeadChannel, LeadMedium, LeadSource } from './leads';
/**
 * Fontes de visita reconhecidas. Coincidem por desenho com os valores de
 * `ProviderId` da categoria `views` — o mesmo slug dos dois lados faz a chave
 * de dedupe ser idêntica, então trocar o caminho de ingestão (ex.: coletor
 * externo → provider nativo) faz upsert em cima do histórico em vez de duplicá-lo.
 */
export declare const VIEW_PROVIDER_IDS: readonly ["views-best-flow", "views-google-analytics", "views-troia-tracker", "views-api"];
export type ViewProviderId = typeof VIEW_PROVIDER_IDS[number];
/** Uma medição normalizada, do jeito que qualquer fonte precisa entregar. */
export interface ViewMeasurementInput {
    /**
     * Ponto de medição CRU do provedor, como ele mesmo identifica
     * (ex.: `"02.455.036/0105-81|Porta Principal"`). Compõe a chave de dedupe
     * depois de normalizado pelo backend — o caller manda o valor original.
     */
    sourceKey: string;
    /** ISO 8601 COM offset. Início da janela, ou o instante do hit. */
    startedAt: string;
    /** ISO 8601 com offset. Ausente = hit pontual (o backend usa `startedAt`). */
    endedAt?: string;
    /**
     * As linhas CRUAS do provedor para esta janela, sem pré-soma.
     *
     * É array e não número de propósito: a Best Flow devolve a mesma janela duas
     * vezes com valores diferentes em pelo menos um sensor, e não dá pra saber
     * sem perguntar ao fornecedor se são dois sensores (somar) ou uma duplicata
     * (escolher um). Mandando as linhas cruas, a política fica no backend — em
     * uma linha — e é reversível sem re-baixar o histórico.
     */
    entries: number[];
    /** Rótulo humano do ponto (nome da loja, hostname). Cai no `defaultOrigin` se ausente. */
    origin?: string;
    /** CPF/CNPJ da unidade, com ou sem máscara. O backend normaliza e resolve o `unitId`. */
    unitDocument?: string;
    /** Quando o PROVEDOR publicou esta medição. Não é o nosso relógio — ver `@DOCS/modules/VIEWS.md`. */
    publishedAt?: string;
    /**
     * Chave própria do provedor, quando ele tem uma (o beacon manda um UUID por
     * hit). Ausente = o backend deriva de `providerId + sourceKey + startedAt`.
     */
    externalId?: string;
    metadata?: Record<string, string | number | boolean>;
}
/** Lote de medições de UMA fonte. Contrato único de ingestão. */
export interface ViewIngestBatch {
    providerId: ViewProviderId;
    source: LeadSource;
    medium: LeadMedium;
    channel: LeadChannel;
    /** Usado quando a medição não traz `origin` próprio. */
    defaultOrigin?: string;
    measurements: ViewMeasurementInput[];
}
/** Desfecho de UMA medição do lote, na ordem enviada. */
export type ViewIngestItemStatus = 'created' | 'updated' | 'skipped' | 'rejected';
export interface ViewIngestItemResult {
    index: number;
    status: ViewIngestItemStatus;
    /** Preenchido só em `rejected`. */
    error?: string;
}
/**
 * Resultado do lote. Espelha o formato de `SyncResult` que os providers de
 * database já usam, mais `skipped` (duplicata idempotente, não é erro) e a
 * lista de documentos que não casaram com unidade nenhuma.
 */
export interface ViewIngestResult {
    summary: {
        received: number;
        created: number;
        updated: number;
        skipped: number;
        rejected: number;
    };
    results: ViewIngestItemResult[];
    /**
     * CNPJs sem unidade correspondente. As medições foram gravadas MESMO ASSIM,
     * sem `unitId` — o total continua certo, só a quebra por unidade fica
     * incompleta até alguém completar o cadastro. Descartar o dado perderia o
     * número que mais importa.
     */
    unmatchedDocuments: string[];
}
