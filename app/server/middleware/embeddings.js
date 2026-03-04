import { pipeline } from '@xenova/transformers';

let extractor = null;

export async function loadModel() {
  extractor = await pipeline(
    'feature-extraction',
    'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
  );
  console.log("Embedding model loaded");
}

export function getExtractor() {
  if (!extractor) {
    throw new Error("Model not loaded yet");
  }
  return extractor;
}


export function dot(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vectors must be same length");
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}