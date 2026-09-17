/**
 * Validation Utilities
 * Funções de validação compartilhadas entre Gateway e Backend
 */

/**
 * Phone Number Validation Result
 */
export interface PhoneValidationResult {
  isValid: boolean;
  formattedPhone?: string;  // DDI+DDD+NUMERO (somente números)
  countryCode?: string;     // DDI extraído
  areaCode?: string;        // DDD extraído
  number?: string;          // NUMERO extraído
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
export function validatePhone(phone: string | undefined): PhoneValidationResult {
  // Null/undefined check
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Validação de comprimento mínimo (piso E.164 — ver docblock)
  if (cleanPhone.length < 8) {
    return {
      isValid: false,
      error: 'Phone number too short. Format: DDI+NUMBER (min 8 digits, E.164)'
    };
  }

  // Validação de comprimento máximo
  if (cleanPhone.length > 15) {
    return {
      isValid: false,
      error: 'Phone number too long. Format: DDI+DDD+NUMBER (max 15 digits)'
    };
  }

  // Validação específica para Brasil (DDI 55)
  if (cleanPhone.startsWith('55')) {
    // Brasil: 55 + DDD (2 dígitos) + Número (8 ou 9 dígitos)
    const expectedLength = [12, 13]; // 55 + 2 + 8 ou 55 + 2 + 9

    if (!expectedLength.includes(cleanPhone.length)) {
      return {
        isValid: false,
        error: 'Invalid Brazilian phone number. Format: 55+DDD+NUMBER (12-13 digits total)'
      };
    }

    const countryCode = cleanPhone.substring(0, 2);    // 55
    const areaCode = cleanPhone.substring(2, 4);       // DDD
    const number = cleanPhone.substring(4);            // Número

    return {
      isValid: true,
      formattedPhone: cleanPhone,
      countryCode,
      areaCode,
      number
    };
  }

  // Validação genérica para outros países
  // Assume DDI de 1-3 dígitos + restante do número
  return {
    isValid: true,
    formattedPhone: cleanPhone
  };
}

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
export function extractPhoneFromJid(jid: string | undefined): string | undefined {
  if (!jid) return undefined;

  // LID não contém phone number
  if (jid.includes('@lid')) {
    return undefined;
  }

  // Extrair phone de JID
  const phoneMatch = jid.match(/^(\d+)@/);
  return phoneMatch ? phoneMatch[1] : undefined;
}
