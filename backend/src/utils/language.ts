const LANGUAGE_MAP: Record<string, string> = {
  // ISO-639-3 → BCP-47 (prefer ISO-639-1 when available)
  eng: 'en',
  rus: 'ru',
  deu: 'de',
  ger: 'de',
  dut: 'nl',
  fra: 'fr',
  fre: 'fr',
  ara: 'ar',
  fas: 'fa',
  per: 'fa',
  spa: 'es',
  ita: 'it',
  por: 'pt',
  nld: 'nl',
  ukr: 'uk',
  pol: 'pl',
  ces: 'cs',
  cze: 'cs',
  slk: 'sk',
  slo: 'sk',
  slv: 'sl',
  hrv: 'hr',
  srp: 'sr',
  bos: 'bs',
  bul: 'bg',
  ron: 'ro',
  rum: 'ro',
  hun: 'hu',
  swe: 'sv',
  nor: 'no',
  dan: 'da',
  fin: 'fi',
  ell: 'el',
  gre: 'el',
  tur: 'tr',
  heb: 'he',
  hin: 'hi',
  urd: 'ur',
  ben: 'bn',
  tam: 'ta',
  tel: 'te',
  mal: 'ml',
  kan: 'kn',
  mar: 'mr',
  guj: 'gu',
  pan: 'pa',
  ind: 'id',
  msa: 'ms',
  tgl: 'tl',
  vie: 'vi',
  tha: 'th',
  jpn: 'ja',
  kor: 'ko',
  zho: 'zh',
  cmn: 'zh',
  yue: 'yue',

  // Common names/aliases → BCP-47
  english: 'en',
  russian: 'ru',
  german: 'de',
  french: 'fr',
  arabic: 'ar',
  farsi: 'fa',
  persian: 'fa',
  spanish: 'es',
  italian: 'it',
  portuguese: 'pt',
  dutch: 'nl',
  ukrainian: 'uk',
  polish: 'pl',
  czech: 'cs',
  slovak: 'sk',
  slovenian: 'sl',
  croatian: 'hr',
  serbian: 'sr',
  bosnian: 'bs',
  bulgarian: 'bg',
  romanian: 'ro',
  hungarian: 'hu',
  swedish: 'sv',
  norwegian: 'no',
  danish: 'da',
  finnish: 'fi',
  greek: 'el',
  turkish: 'tr',
  hebrew: 'he',
  hindi: 'hi',
  urdu: 'ur',
  bengali: 'bn',
  tamil: 'ta',
  telugu: 'te',
  malayalam: 'ml',
  kannada: 'kn',
  marathi: 'mr',
  gujarati: 'gu',
  punjabi: 'pa',
  indonesian: 'id',
  malay: 'ms',
  filipino: 'tl',
  tagalog: 'tl',
  vietnamese: 'vi',
  thai: 'th',
  japanese: 'ja',
  korean: 'ko',
  chinese: 'zh',
  mandarin: 'zh',
  cantonese: 'yue',
};

const DEFAULT_LANGUAGE = 'en';
const isBcp47Like = (code: string) => /^[a-z]{2}(-[a-z]{2})?$/i.test(code);

/**
 * Maps ISO-639-3 codes or common language names to BCP-47 (e.g., eng/jpn/english → en/ja).
 * Returns a fallback (English) if no mapping is found.
 */
export const mapLanguageToBcp47 = (language?: string | null): string => {
  if (!language) return DEFAULT_LANGUAGE;

  const normalized = language.trim().toLowerCase();
  if (!normalized) return DEFAULT_LANGUAGE;

  if (LANGUAGE_MAP[normalized]) return LANGUAGE_MAP[normalized];
  if (isBcp47Like(normalized)) return normalized;

  return DEFAULT_LANGUAGE;
};

export default mapLanguageToBcp47;
