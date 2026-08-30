/**
 * Renderizador único de template (2026-08-29).
 *
 * Antes desta função existiam CINCO implementações divergentes: o balão do
 * chat, um extrator que só lia o corpo, uma cópia homônima em campanhas que
 * nem substituía variável, um resumo para os cards e o render do backend.
 * Divergiam em coisas visíveis — o lado da bolha, quais provedores de e-mail
 * eram reconhecidos, e nenhuma delas mostrava cabeçalho, rodapé ou botões.
 *
 * Mora no pacote de tipos porque backend e frontend precisam do MESMO
 * resultado: o que a tela mostra tem de ser o que vai ser enviado.
 *
 * É PURA: sem React, sem rede, sem DOM (o pacote compila com lib ES2022).
 */
import type {
  TemplateProviderConfig,
  WhatsAppTemplateComponent,
  InstagramTemplateConfig,
} from './templates';

/** Formato do cabeçalho, já normalizado para a tela. */
export type FormatoCabecalho = 'texto' | 'imagem' | 'video' | 'documento' | 'localizacao';

export interface CabecalhoRenderizado {
  formato: FormatoCabecalho;
  texto?: string;
  url?: string;
  nomeArquivo?: string;
}

export interface BotaoRenderizado {
  tipo: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  texto: string;
  url?: string;
  telefone?: string;
}

export interface TemplateRenderizado {
  canal: 'whatsapp' | 'email' | 'instagram' | 'facebook';
  /** Só e-mail usa. Fica em campo próprio para não virar um cabeçalho falso. */
  assunto?: string;
  cabecalho?: CabecalhoRenderizado;
  /** Sempre presente. Texto puro — é o que o balão do chat desenha. */
  corpo: string;
  /**
   * Só e-mail, e só quando o template tem HTML. Vem com as variáveis já
   * substituídas E **escapadas** — o valor da variável nunca vira marcação.
   *
   * Existe porque a campanha SEMPRE mostrou o e-mail renderizado, e reduzir
   * tudo a texto era perda para quem já usava. Quem desenha decide: com HTML,
   * usa este; sem HTML, usa `corpo`.
   */
  corpoHtml?: string;
  rodape?: string;
  botoes?: BotaoRenderizado[];
}

export interface OpcoesRender {
  /**
   * Rótulo por posição. Quando a variável não tem valor, o texto mostra
   * `[Rótulo]` em vez de `{{1}}` — ajuda quem está montando o template.
   */
  rotulos?: Record<string, string>;
}

const PLACEHOLDER = /\{\{\s*(\d+)\s*\}\}/g;

/** Troca `{{n}}` pelo valor; sem valor, usa o rótulo entre colchetes ou deixa como está. */
function resolver(texto: string, variaveis: Record<string, string>, rotulos?: Record<string, string>): string {
  return texto.replace(PLACEHOLDER, (original, posicao: string) => {
    const valor = variaveis[posicao];
    if (valor !== undefined && valor !== '') return valor;
    const rotulo = rotulos?.[posicao];
    return rotulo !== undefined ? `[${rotulo}]` : original;
  });
}

/**
 * Escapa o que vira conteúdo dentro de HTML.
 *
 * O valor da variável é dado do cliente (nome, endereço, observação digitada).
 * Sem isto, um valor como `<b>x</b>` — ou pior, um `<script>` — deixaria de ser
 * texto e viraria marcação de verdade dentro do corpo do e-mail. No texto puro
 * o problema não existe (o React escapa sozinho); no HTML injetado, existe.
 */
function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Mesma troca do `resolver`, só que o valor entra escapado (vai para dentro de HTML). */
function resolverEmHtml(
  html: string,
  variaveis: Record<string, string>,
  rotulos?: Record<string, string>,
): string {
  return html.replace(PLACEHOLDER, (original, posicao: string) => {
    const valor = variaveis[posicao];
    if (valor !== undefined && valor !== '') return escaparHtml(valor);
    const rotulo = rotulos?.[posicao];
    return rotulo !== undefined ? escaparHtml(`[${rotulo}]`) : original;
  });
}

/**
 * Type guard em vez do `||` inline nos dois literais de `providerType`.
 * O `providerType` de `InstagramTemplateConfig` já é a união dos dois
 * literais ('instagram_direct' | 'facebook_messenger'), e o TypeScript
 * (verificado na 5.9.2 deste pacote) não consegue eliminar esse membro do
 * union `TemplateProviderConfig` fora do `if` quando os dois lados do `||`
 * comparam a MESMA propriedade contra os dois literais que já formam,
 * juntos, o tipo inteiro dela — o restante do union ficava com
 * `InstagramTemplateConfig` sobrando, e o ramo de e-mail (que roda depois)
 * quebrava o build achando que `subject`/`htmlBody` não existiam. Uma
 * função com predicado (`config is InstagramTemplateConfig`) narrowa
 * corretamente nos dois sentidos.
 */
function ehInstagramOuFacebook(config: TemplateProviderConfig): config is InstagramTemplateConfig {
  return config.providerType === 'instagram_direct' || config.providerType === 'facebook_messenger';
}

function formatoDe(componente: WhatsAppTemplateComponent): FormatoCabecalho {
  switch (componente.format) {
    case 'IMAGE': return 'imagem';
    case 'VIDEO': return 'video';
    case 'DOCUMENT': return 'documento';
    case 'LOCATION': return 'localizacao';
    default: return 'texto';
  }
}

/** Reduz HTML a texto legível, sem DOM (o pacote não tem `document`). */
function htmlParaTexto(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function renderTemplate(
  config: TemplateProviderConfig,
  variaveis: Record<string, string>,
  opcoes?: OpcoesRender,
): TemplateRenderizado {
  const r = (t: string): string => resolver(t, variaveis, opcoes?.rotulos);

  if (config.providerType === 'whatsapp_business') {
    const componentes = config.components ?? [];
    const cabecalhoComp = componentes.find((c) => c.type === 'HEADER');
    const corpoComp = componentes.find((c) => c.type === 'BODY');
    const rodapeComp = componentes.find((c) => c.type === 'FOOTER');
    const botoesComp = componentes.find((c) => c.type === 'BUTTONS');

    let cabecalho: CabecalhoRenderizado | undefined;
    if (cabecalhoComp) {
      const formato = formatoDe(cabecalhoComp);
      if (formato === 'texto') {
        cabecalho = { formato, ...(cabecalhoComp.text ? { texto: r(cabecalhoComp.text) } : {}) };
      } else {
        // A URL do envio vem de headerMedia; na criação ela pode não existir
        // ainda (o template é aprovado com um arquivo de exemplo).
        const midia = config.headerMedia;
        cabecalho = {
          formato,
          ...(midia?.url ? { url: r(midia.url) } : {}),
          ...(midia?.filename ? { nomeArquivo: r(midia.filename) } : {}),
        };
      }
    }

    const botoes = botoesComp?.buttons?.map((b) => ({
      tipo: b.type,
      texto: r(b.text),
      ...(b.url ? { url: r(b.url) } : {}),
      ...(b.phone_number ? { telefone: b.phone_number } : {}),
    }));

    return {
      canal: 'whatsapp',
      ...(cabecalho ? { cabecalho } : {}),
      corpo: corpoComp?.text ? r(corpoComp.text) : '',
      ...(rodapeComp?.text ? { rodape: r(rodapeComp.text) } : {}),
      ...(botoes && botoes.length > 0 ? { botoes } : {}),
    };
  }

  if (config.providerType === 'whatsapp_gateway') {
    const d = config.messageData;
    const temMidia = d.mediaUrl !== undefined && d.mediaUrl !== '';
    const formato: FormatoCabecalho =
      d.mediaType === 'image' ? 'imagem'
      : d.mediaType === 'video' ? 'video'
      : d.mediaType === 'audio' ? 'documento'
      : d.type === 'document' ? 'documento'
      : d.type === 'image' ? 'imagem'
      : d.type === 'video' ? 'video'
      : 'documento';
    return {
      canal: 'whatsapp',
      ...(temMidia
        ? {
            cabecalho: {
              formato,
              url: r(d.mediaUrl as string),
              ...(d.filename ? { nomeArquivo: r(d.filename) } : {}),
            },
          }
        : {}),
      corpo: r(d.caption ?? d.message ?? ''),
    };
  }

  if (ehInstagramOuFacebook(config)) {
    const d = config.messageData;
    const botoes = d.quick_replies?.map((q) => ({ tipo: 'QUICK_REPLY' as const, texto: r(q.title) }));
    return {
      canal: config.providerType === 'instagram_direct' ? 'instagram' : 'facebook',
      ...(d.attachment
        ? {
            cabecalho: {
              formato: d.attachment.type === 'image' ? 'imagem' : d.attachment.type === 'video' ? 'video' : 'documento',
              url: r(d.attachment.url),
            } as CabecalhoRenderizado,
          }
        : {}),
      corpo: r(d.text ?? ''),
      ...(botoes && botoes.length > 0 ? { botoes } : {}),
    };
  }

  // Restam os 5 provedores de e-mail. O chat reconhecia 5 e campanhas só 2 —
  // aqui todos caem no mesmo caminho.
  // O texto puro continua existindo (é o que o chat desenha e a reserva de
  // quem não tem HTML); o HTML vai junto, para a campanha continuar mostrando
  // o e-mail como ele é.
  const corpo = config.plainTextBody ?? htmlParaTexto(config.htmlBody);
  const html = config.htmlBody
    ? resolverEmHtml(config.htmlBody, variaveis, opcoes?.rotulos)
    : '';
  return {
    canal: 'email',
    ...(config.subject ? { assunto: r(config.subject) } : {}),
    corpo: r(corpo),
    ...(html ? { corpoHtml: html } : {}),
  };
}
