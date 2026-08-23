import { config } from '../config/env';

export interface EmbeddingResult {
  embedding: number[];
  provider: 'openai' | 'gemini' | 'local-tfidf';
  dimension: number;
}

export class EmbeddingsService {
  private static VECTOR_DIM = 384;

  /**
   * Main entry point to generate vector embedding for any text string.
   * Handles API keys if available, otherwise uses local deterministic vector engine.
   */
  public static async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const cleanText = text.trim();
    
    // 1. Try OpenAI if API Key present
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            input: cleanText,
            model: 'text-embedding-3-small',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const embedding = data?.data?.[0]?.embedding;
          if (Array.isArray(embedding)) {
            return {
              embedding,
              provider: 'openai',
              dimension: embedding.length,
            };
          }
        }
      } catch (err) {
        console.warn('[EmbeddingsService] OpenAI API embedding failed, falling back to local engine:', err);
      }
    }

    // 2. Try Gemini / Google AI if API Key present
    const googleApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (googleApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${googleApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'models/text-embedding-004',
              content: { parts: [{ text: cleanText }] },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const embedding = data?.embedding?.values;
          if (Array.isArray(embedding)) {
            return {
              embedding,
              provider: 'gemini',
              dimension: embedding.length,
            };
          }
        }
      } catch (err) {
        console.warn('[EmbeddingsService] Gemini API embedding failed, falling back to local engine:', err);
      }
    }

    // 3. Fallback to Local Deterministic Vectorizer
    const localVec = this.generateLocalVector(cleanText, this.VECTOR_DIM);
    return {
      embedding: localVec,
      provider: 'local-tfidf',
      dimension: this.VECTOR_DIM,
    };
  }

  /**
   * Deterministic Hashing & Term-Frequency N-Gram Vectorizer.
   * Converts text into a normalized L2 float vector for cosine similarity retrieval.
   */
  private static generateLocalVector(text: string, dim: number): number[] {
    const vector = new Array(dim).fill(0);
    const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = normalized.split(/\s+/).filter((w) => w.length > 0);

    // Extract word unigrams and bigrams for semantic capture
    const tokens: string[] = [...words];
    for (let i = 0; i < words.length - 1; i++) {
      tokens.push(`${words[i]}_${words[i + 1]}`);
    }

    // Hash tokens into vector buckets with term weighting
    for (const token of tokens) {
      const hash1 = this.hashString(token);
      const hash2 = this.hashString(token + '_alt');

      const index1 = Math.abs(hash1) % dim;
      const index2 = Math.abs(hash2) % dim;

      const sign1 = hash1 % 2 === 0 ? 1 : -1;
      const sign2 = hash2 % 2 === 0 ? 1 : -1;

      // Weight longer words and bigrams slightly higher
      const weight = token.includes('_') ? 1.5 : Math.log(token.length + 1);

      vector[index1] += sign1 * weight;
      vector[index2] += sign2 * (weight * 0.7);
    }

    // L2 Normalize Vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;

    return vector.map((val) => val / norm);
  }

  /**
   * Simple non-cryptographic string hash function (Fowler-Noll-Vo / DJB2 mix)
   */
  private static hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  /**
   * Cosine Similarity calculation between two numerical vectors.
   * Returns a score between 0.0 and 1.0 (or -1 to 1 normalized).
   */
  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    // Bound similarity score to [0, 1] range for intuitive confidence mapping
    return Math.max(0, Math.min(1, (sim + 1) / 2));
  }
}
