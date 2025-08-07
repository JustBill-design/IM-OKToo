
const nodeCrypto = require('crypto');
if (!(global as any).crypto) {
  (global as any).crypto = {
    getRandomValues: (arr: any) => nodeCrypto.randomFillSync(arr),
    subtle: nodeCrypto.webcrypto?.subtle,
    randomUUID: () => nodeCrypto.randomUUID(),
  };
}

if (!globalThis.crypto) {
  globalThis.crypto = (global as any).crypto;
}
if (!(global as any).TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util');
  (global as any).TextEncoder = TextEncoder;
  (global as any).TextDecoder = TextDecoder;
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

console.log('crypto polyfills loaded');
