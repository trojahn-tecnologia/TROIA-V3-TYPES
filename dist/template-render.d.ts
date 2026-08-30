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
import type { TemplateProviderConfig } from './templates';
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
export declare function renderTemplate(config: TemplateProviderConfig, variaveis: Record<string, string>, opcoes?: OpcoesRender): TemplateRenderizado;
