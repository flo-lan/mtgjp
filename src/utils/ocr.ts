import { recognizeText } from 'rn-mlkit-ocr';

// Hiragana (3040–309F), katakana (30A0–30FF), CJK kanji (4E00–9FFF)
const JAPANESE_RE = /[぀-ゟ゠-ヿ一-鿿]/;

export async function recognizeCardName(imageUri: string): Promise<string | null> {
  const { blocks } = await recognizeText(imageUri);

  // Flatten to elements (word-level units), keep only Japanese text.
  // Numbers and Latin from mana cost / collector number are excluded automatically.
  const elements = blocks
    .flatMap((b) => b.lines)
    .flatMap((l) => l.elements)
    .filter((e) => JAPANESE_RE.test(e.text))
    .map((e) => ({ text: e.text, height: e.frame.height, x: e.frame.x }));

  if (elements.length === 0) return null;

  // The card name characters are the tallest Japanese elements in the strip.
  // Furigana renders at ~50% of name height, so 60% cleanly separates them.
  const maxH = Math.max(...elements.map((e) => e.height));
  const nameElements = elements
    .filter((e) => e.height >= maxH * 0.6)
    .sort((a, b) => a.x - b.x);

  return nameElements.map((e) => e.text).join('') || null;
}
