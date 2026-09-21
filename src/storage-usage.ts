import { ObjectId } from 'mongodb';

/**
 * Quanto disco cada empresa ocupa, mês a mês.
 *
 * # Por que existe uma collection em vez de um contador
 *
 * O contador único (`companies.storageBytes` com `$inc`) só funciona enquanto
 * nada é apagado. A política de retenção de 24 meses apaga — e aí o contador
 * precisaria de um decremento que ninguém dispara na hora certa, porque quem
 * apaga é uma regra de ciclo de vida do S3, do lado da AWS, sem avisar o
 * sistema.
 *
 * Guardando um documento por MÊS o problema some: "quanto a empresa ocupa
 * hoje" é a soma dos meses dentro da janela de retenção, e o mês que sai da
 * janela deixa de contar sozinho, sem nenhum evento. O número se corrige
 * sem manutenção.
 *
 * De quebra, sobra auditoria: dá para responder "em que mês esta empresa
 * subiu 40 GB" olhando as linhas, que é a pergunta que aparece quando alguém
 * contesta a fatura.
 *
 * Ver `DOCS/modules/CREDITS_REPRICING.md` § "Duas categorias novas".
 */
export interface StorageUsage {
  appId: ObjectId;
  companyId: ObjectId;
  /** Mês de competência no formato `YYYY-MM` (fuso de São Paulo). */
  period: string;
  /** Bytes acrescentados ao bucket neste mês por esta empresa. */
  bytes: number;
  /** Quantos objetos entraram — serve para conferir a média por arquivo. */
  objects: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageUsageResponse {
  id: string;
  period: string;
  bytes: number;
  objects: number;
}

/** Resumo do que a empresa ocupa dentro da janela de retenção. */
export interface StorageUsageSummary {
  /** Soma dos bytes dos meses ainda dentro da janela. */
  bytes: number;
  /** O mesmo em GB, que é a unidade da cobrança. */
  gigabytes: number;
  /** Quantos meses a janela cobre (hoje, 24). */
  retentionMonths: number;
  /** Detalhe mês a mês, do mais recente para o mais antigo. */
  months: StorageUsageResponse[];
}

/**
 * Janela de retenção da mídia de conversa, em meses.
 *
 * É promessa comercial ("guardamos 2 anos de histórico") e, ao mesmo tempo,
 * o que limita a conta de disco: sem apagar nada, o armazenamento cresce para
 * sempre e nenhuma cobrança por GB estabiliza. A regra de ciclo de vida no S3
 * precisa usar ESTE mesmo número — se as duas pontas discordarem, ou cobramos
 * o que já foi apagado, ou deixamos de cobrar o que ainda está lá.
 */
export const STORAGE_RETENTION_MONTHS = 24;

/** 1 GB em bytes, base binária — a mesma que a AWS usa para faturar. */
export const BYTES_PER_GIGABYTE = 1024 * 1024 * 1024;
