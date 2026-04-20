export async function generateHash(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function generateProofSignature(title, text, eventLog, timestamp) {
  const payload = JSON.stringify({
    title,
    text,
    eventLog,
    timestamp
  });
  return await generateHash(payload);
}
