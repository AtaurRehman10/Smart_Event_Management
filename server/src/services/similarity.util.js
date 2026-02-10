export function cosineSimilarity(vecA, vecB) {
     if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) return 0;

     let dot = 0, a = 0, b = 0;
     for (let i = 0; i < vecA.length; i++) {
          dot += vecA[i] * vecB[i];
          a += vecA[i] * vecA[i];
          b += vecB[i] * vecB[i];
     }
     const denom = Math.sqrt(a) * Math.sqrt(b);
     return denom === 0 ? 0 : dot / denom;
}

export function jaccardSimilarity(arrA = [], arrB = []) {
     const A = new Set(arrA.map(x => x.toLowerCase()));
     const B = new Set(arrB.map(x => x.toLowerCase()));
     const intersection = [...A].filter(x => B.has(x)).length;
     const union = new Set([...A, ...B]).size;
     return union === 0 ? 0 : intersection / union;
}
