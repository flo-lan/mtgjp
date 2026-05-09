// rn-mlkit-ocr is native-only — not available in Expo Go or on web.
let recognizeText: ((uri: string, language: string) => Promise<{ blocks: any[] }>) | null = null;
try {
  recognizeText = require('rn-mlkit-ocr').recognizeText;
} catch {
  // Native build required
}

// Hiragana (3040–309F), katakana (30A0–30FF), CJK kanji (4E00–9FFF)
const JAPANESE_RE = /[぀-ゟ゠-ヿ一-鿿]/;

export async function recognizeCardName(imageUri: string): Promise<string | null> {
  if (!recognizeText) return null;

  const { blocks } = await recognizeText(imageUri, 'japanese');

  const elements = blocks
    .flatMap((b: any) => b.lines)
    .flatMap((l: any) => l.elements)
    .filter((e: any) => JAPANESE_RE.test(e.text))
    .map((e: any) => ({ text: e.text, height: e.frame.height, x: e.frame.x }));

  if (elements.length === 0) return null;

  // Card name symbols are the tallest; furigana is ~50% height, 60% threshold separates them.
  const maxH = Math.max(...elements.map((e: any) => e.height));
  const nameElements = elements
    .filter((e: any) => e.height >= maxH * 0.6)
    .sort((a: any, b: any) => a.x - b.x);

  return nameElements.map((e: any) => e.text).join('') || null;
}
