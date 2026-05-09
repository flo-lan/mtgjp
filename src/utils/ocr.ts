// rn-mlkit-ocr is a native-only module — not available in Expo Go or on web.
// Lazy-require it so a missing native binary degrades gracefully instead of crashing.
let recognizeText: ((uri: string) => Promise<{ blocks: any[] }>) | null = null;
try {
  recognizeText = require('rn-mlkit-ocr').recognizeText;
} catch {
  // Native build required
}

// Hiragana (3040–309F), katakana (30A0–30FF), CJK kanji (4E00–9FFF)
const JAPANESE_RE = /[぀-ゟ゠-ヿ一-鿿]/;

export async function recognizeCardName(imageUri: string): Promise<string | null> {
  if (!recognizeText) {
    console.log('[OCR] recognizeText module not loaded');
    return null;
  }

  const { blocks } = await recognizeText(imageUri);
  console.log('[OCR] blocks:', JSON.stringify(blocks, null, 2));

  const allElements = blocks
    .flatMap((b: any) => b.lines)
    .flatMap((l: any) => l.elements);
  console.log('[OCR] all elements:', JSON.stringify(allElements.map((e: any) => ({ text: e.text, h: e.frame?.height, x: e.frame?.x })), null, 2));

  const elements = allElements
    .filter((e: any) => JAPANESE_RE.test(e.text))
    .map((e: any) => ({ text: e.text, height: e.frame.height, x: e.frame.x }));

  console.log('[OCR] japanese elements:', JSON.stringify(elements, null, 2));

  if (elements.length === 0) return null;

  const maxH = Math.max(...elements.map((e: any) => e.height));
  const nameElements = elements
    .filter((e: any) => e.height >= maxH * 0.6)
    .sort((a: any, b: any) => a.x - b.x);

  const result = nameElements.map((e: any) => e.text).join('') || null;
  console.log('[OCR] result:', result);
  return result;
}
