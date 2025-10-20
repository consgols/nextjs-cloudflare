export interface ParsedPhoneNumber {
  e164: string;
  countryDialCode: string;
  national: string;
}

type ParseOpts = {
  /** The list of dial codes you support, e.g. ["63","46","47","1"] */
  allowedDialCodes: string[];
  /** If you already know which country is selected, pass its dial code to force the split */
  assumeDialCode?: string;
};

/**
 * Parses an E.164 phone (e.g. "+19760002104") into dial code + national.
 * Uses longest-prefix match against allowed dial codes; if assumeDialCode is
 * provided and matches the start, it is used directly.
 */
export function parsePhoneNumber(phone?: string, opts?: ParseOpts): ParsedPhoneNumber | undefined {
  if (!phone || typeof phone !== 'string') return undefined;

  const compact = phone.replace(/\s+/g, '');
  if (!compact.startsWith('+')) return undefined;

  const digits = compact.slice(1);
  if (!/^\d+$/.test(digits)) return undefined;

  const allowed = opts?.allowedDialCodes ?? [];
  // If the caller knows the selected code and it matches, use it.
  if (opts?.assumeDialCode && digits.startsWith(opts.assumeDialCode)) {
    const code = opts.assumeDialCode;
    return { e164: `+${digits}`, countryDialCode: code, national: digits.slice(code.length) };
  }

  // Longest-prefix match from the allowed list
  const code = allowed
    .slice()
    .sort((a, b) => b.length - a.length) // longest first
    .find(dc => digits.startsWith(dc));

  if (!code) return undefined;

  return {
    e164: `+${digits}`,
    countryDialCode: code,
    national: digits.slice(code.length),
  };
}
