"use strict";
// Lead Types - Sales system with universal source
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLeadChannel = exports.isLeadMedium = exports.isLeadSource = exports.getLeadChannelLabel = exports.getLeadMediumLabel = exports.getLeadSourceLabel = exports.LEAD_CHANNEL_LABELS = exports.LEAD_MEDIUM_LABELS = exports.LEAD_SOURCE_LABELS = exports.LEAD_CHANNELS = exports.LEAD_MEDIUMS = exports.LEAD_SOURCES = void 0;
// ============================================================================
// CANONICAL ENUMS — single source of truth para Lead.source / Lead.medium / Lead.channel
// ============================================================================
//
// Estes 3 enums vivem aqui (no @troia-v3/types) e são consumidos por:
// - Backend: Zod validation (`@/modules/leads/validation`), reports
// - Frontend: dropdowns de formulário, filtros, dashboards (CRM + Marketing),
//   ícones (`@/shared/icons/LeadSourceIcon`), labels pt-BR
//
// Adicionar novo valor aqui propaga: enum + type + label + Zod + UI options.
// NUNCA duplicar essas listas em outros arquivos — sempre importar daqui.
/** Plataforma/origem de marketing do lead (espelha campos UTM). */
exports.LEAD_SOURCES = [
    'meta',
    'google',
    'tiktok',
    'linkedin',
    'microsoft',
    'organic',
    'referral',
    'email',
    'offline',
    'partner',
    'outbound',
    'direct',
];
/** Tipo de tráfego (orgânico vs pago). */
exports.LEAD_MEDIUMS = ['organic', 'paid'];
/** Sub-canal semântico de captura (NÃO confundir com Channel collection / channelId). */
exports.LEAD_CHANNELS = [
    'whatsapp',
    'instagram',
    'facebook',
    'messenger',
    'telegram',
    'email',
    'website',
    'phone',
    'google',
    'youtube',
    'tiktok',
    'linkedin',
    'bing',
    'other',
];
/** Labels pt-BR canônicos por enum — único lugar onde a string é definida. */
exports.LEAD_SOURCE_LABELS = {
    meta: 'Meta',
    google: 'Google',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    microsoft: 'Microsoft',
    organic: 'Orgânico',
    referral: 'Indicação',
    email: 'Email',
    offline: 'Offline',
    partner: 'Parceiros',
    outbound: 'Outbound',
    direct: 'Direto',
};
exports.LEAD_MEDIUM_LABELS = {
    organic: 'Orgânico',
    paid: 'Pago',
};
exports.LEAD_CHANNEL_LABELS = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    messenger: 'Messenger',
    telegram: 'Telegram',
    email: 'Email',
    website: 'Website',
    phone: 'Telefone',
    google: 'Google',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    bing: 'Bing',
    other: 'Outro',
};
/** Helpers — retornam label canônico ou o próprio valor (defensivo contra valores legacy). */
const getLeadSourceLabel = (s) => exports.LEAD_SOURCE_LABELS[s] ?? s;
exports.getLeadSourceLabel = getLeadSourceLabel;
const getLeadMediumLabel = (m) => exports.LEAD_MEDIUM_LABELS[m] ?? m;
exports.getLeadMediumLabel = getLeadMediumLabel;
const getLeadChannelLabel = (c) => exports.LEAD_CHANNEL_LABELS[c] ?? c;
exports.getLeadChannelLabel = getLeadChannelLabel;
/** Type guards. */
const isLeadSource = (v) => exports.LEAD_SOURCES.includes(v);
exports.isLeadSource = isLeadSource;
const isLeadMedium = (v) => exports.LEAD_MEDIUMS.includes(v);
exports.isLeadMedium = isLeadMedium;
const isLeadChannel = (v) => exports.LEAD_CHANNELS.includes(v);
exports.isLeadChannel = isLeadChannel;
