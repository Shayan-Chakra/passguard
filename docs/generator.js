function secureRandomInt(max) {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max; // avoids bias
  do { crypto.getRandomValues(arr); } while (arr[0] >= limit);
  return arr[0] % max;
}

function generatePassword(length = 16, opts = {}) {
  const { upper = true, lower = true, numbers = true, symbols = true } = opts;
  let sets = [];
  if (lower)   sets.push("abcdefghijklmnopqrstuvwxyz");
  if (upper)   sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (numbers) sets.push("0123456789");
  if (symbols) sets.push("!@#$%^&*()-_=+[]{}");

  const all = sets.join("");
  // Guarantee at least one character from each chosen set
  let chars = sets.map(s => s[secureRandomInt(s.length)]);
  while (chars.length < length) chars.push(all[secureRandomInt(all.length)]);

  // Shuffle (Fisher-Yates) so guaranteed characters aren't always first
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}