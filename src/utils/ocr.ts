import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY ?? '';

export async function recognizeCardName(base64Image: string): Promise<string | null> {
  if (!API_KEY) {
    console.error('EXPO_PUBLIC_GOOGLE_VISION_API_KEY is not set');
    return null;
  }

  const { data } = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
      requests: [{
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION' }],
        imageContext: { languageHints: ['ja', 'en'] },
      }],
    },
  );

  const fullText: string = data.responses[0]?.textAnnotations?.[0]?.description ?? '';
  if (!fullText) return null;

  // Card name is the first substantial text line (printed at the top of every MTG card)
  const firstLine = fullText.split('\n').find((l: string) => l.trim().length > 1);
  return firstLine?.trim() ?? null;
}
