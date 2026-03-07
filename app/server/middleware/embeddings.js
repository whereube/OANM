import { pipeline, env } from '@xenova/transformers';


env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.simd = true;
env.backends.onnx.wasm.proxy = false;

env.useBrowserCache = false;
env.allowLocalModels = false;

let extractor = null;

export async function loadModel() {
  extractor = await pipeline(
    'feature-extraction',
    'Xenova/distiluse-base-multilingual-cased-v2'
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


export function cosineDistance(a, b) {
    return 1 - dot(a, b);
}