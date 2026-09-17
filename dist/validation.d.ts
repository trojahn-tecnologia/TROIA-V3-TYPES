/**
 * Validation Utilities
 * Funções de validação compartilhadas entre Gateway e Backend
 */
/**
 * Phone Number Validation Result
 */
export interface PhoneValidationResult {
    isValid: boolean;
    formattedPhone?: string;
    countryCode?: string;
    areaCode?: string;
    number?: string;
    error?: string;
}
/**
 * Valida e formata telefone no padrão internacional
 *
 * REGRAS:
 * - Somente números (remove +, -, espaços, parênteses)
 * - Formato: DDI+DDD+NUMERO
 * - DDI Brasil: 55 → total de 12 ou 13 dígitos (55 + DDD + 8/9)
 * - Demais países: janela E.164, 8 a 15 dígitos
 *
 * ⚠️ 2026-09-17: o piso era 12 dígitos, número tirado da conta brasileira —
 * e reprovava TODO internacional mais curto (Chile +56, Peru +51, Bolívia
 * +591, Armênia +374 fecham em 11). No caminho de webhook isso fazia o
 * contato nascer com `identifiers.phone: []`, visível só pelo JID. A janela
 * 8-15 é a mesma que `phone-utils.ts` (backend) já usa para wa_id.
 *
 * O preço do piso menor: um número NACIONAL sem DDI ("47992239929") não é
 * mais distinguível de um estrangeiro do mesmo comprimento, e passa a ser
 * aceito. Esta função é um portão de FORMA, para identificador que já vem em
 * E.164 do provedor. Quem valida entrada de usuário (onde o DDI pode faltar)
 * precisa de `normalizePhoneE164` + awesome-phonenumber, que resolve o país
 * pela região da company.
 *
 * @param phone - Telefone para validar
 * @returns PhoneValidationResult
 *
 * @example
 * validatePhone("+55 (47) 99223-9929") // ✅ Valid: "5547992239929"
 * validatePhone("5547992239929")        // ✅ Valid: "5547992239929"
 * validatePhone("37498190136")          // ✅ Valid: DDI 374 (Armênia)
 * validatePhone("1234567")              // ❌ Invalid: abaixo do piso E.164
 */
export declare function validatePhone(phone: string | undefined): PhoneValidationResult;
/**
 * Extrai phone do WhatsApp JID
 *
 * IMPORTANTE: Funciona APENAS com JID, NÃO com LID
 *
 * @param jid - WhatsApp JID (e.g., "5547992239929@s.whatsapp.net")
 * @returns Phone number ou undefined se não puder extrair
 *
 * @example
 * extractPhoneFromJid("5547992239929@s.whatsapp.net") // "5547992239929"
 * extractPhoneFromJid("213782781983172@lid")           // undefined (LID não tem phone)
 */
export declare function extractPhoneFromJid(jid: string | undefined): string | undefined;
