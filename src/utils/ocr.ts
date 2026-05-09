import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY ?? "";

// Hiragana (3040–309F), katakana (30A0–30FF), CJK kanji (4E00–9FFF)
const JAPANESE_RE = /[぀-ゟ゠-ヿ一-鿿]/;

interface SymbolInfo {
  text: string;
  height: number;
  minX: number;
}

export async function recognizeCardName(
  base64Image: string,
): Promise<string | null> {
  if (!API_KEY) {
    console.error("EXPO_PUBLIC_GOOGLE_VISION_API_KEY is not set");
    return null;
  }

  const { data } = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          imageContext: { languageHints: ["ja"] },
        },
      ],
    },
  );

  const response = data.responses[0];
  if (!response) return null;

  const pages = response.fullTextAnnotation?.pages;
  if (!pages?.length) return null;

  // Collect every Japanese symbol with its bounding-box height.
  // The image is already cropped to the name strip, so the only Japanese text
  // present is the card name (large) and its furigana reading (small, ~50% height).
  const symbols: SymbolInfo[] = [];

  for (const block of pages[0].blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const word of paragraph.words ?? []) {
        for (const symbol of word.symbols ?? []) {
          if (!JAPANESE_RE.test(symbol.text ?? "")) continue;

          const verts = symbol.boundingBox?.vertices;
          if (!verts || verts.length < 2) continue;

          const ys = verts
            .map((v: { y?: number }) => v.y)
            .filter((y: number | undefined): y is number => y !== undefined);
          const xs = verts
            .map((v: { x?: number }) => v.x)
            .filter((x: number | undefined): x is number => x !== undefined);
          if (ys.length < 2 || xs.length < 2) continue;

          const height = Math.max(...ys) - Math.min(...ys);
          if (height <= 0) continue;

          symbols.push({ text: symbol.text!, height, minX: Math.min(...xs) });
        }
      }
    }
  }

  if (symbols.length === 0) return null;

  // The card name characters are the tallest Japanese symbols in the strip.
  // Furigana is ~50% of that height, so a 60% threshold cleanly separates them.
  const maxH = Math.max(...symbols.map((s) => s.height));
  const nameChars = symbols
    .filter((s) => s.height >= maxH * 0.6)
    .sort((a, b) => a.minX - b.minX);

  return nameChars.map((s) => s.text).join("") || null;
}
