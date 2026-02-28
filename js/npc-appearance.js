function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toHex(value) {
  const safe = clamp(Math.floor(value), 0, 255);
  return safe.toString(16).padStart(2, '0');
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function colorFromSeed(seed, minChannel = 40, maxChannel = 220) {
  const span = Math.max(1, maxChannel - minChannel + 1);
  const r = minChannel + ((seed >>> 0) & 0xff) % span;
  const g = minChannel + ((seed >>> 8) & 0xff) % span;
  const b = minChannel + ((seed >>> 16) & 0xff) % span;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darkenHex(hexColor, amount) {
  const safe = hexColor.replace('#', '');
  const r = clamp(parseInt(safe.slice(0, 2), 16) - amount, 0, 255);
  const g = clamp(parseInt(safe.slice(2, 4), 16) - amount, 0, 255);
  const b = clamp(parseInt(safe.slice(4, 6), 16) - amount, 0, 255);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const skinTones = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac', '#d4a574'];

export function getNpcAppearance(npc) {
  const baseKey = `${npc.name || ''}|${npc.type || ''}|${npc.vendorName || ''}|${npc.hasQuest || ''}`;
  const seedA = hashString(baseKey);
  const seedB = hashString(`${baseKey}|b`);
  const seedC = hashString(`${baseKey}|c`);
  const seedD = hashString(`${baseKey}|d`);

  const outfitColor = colorFromSeed(seedA, 45, 205);
  const hairColor = colorFromSeed(seedB, 20, 160);
  const accentColor = colorFromSeed(seedC, 80, 240);
  const legColor = darkenHex(outfitColor, 55);

  return {
    skinColor: skinTones[seedA % skinTones.length],
    hairColor,
    outfitColor,
    legColor,
    accentColor,
    eyeColor: '#101010',
    accessoryType: seedD % 6,
    accessorySide: seedC % 2 === 0 ? 'left' : 'right'
  };
}

export function getNpcAppearanceSignature(npc) {
  const appearance = getNpcAppearance(npc);
  return [
    appearance.skinColor,
    appearance.hairColor,
    appearance.outfitColor,
    appearance.legColor,
    appearance.accentColor,
    appearance.accessoryType,
    appearance.accessorySide
  ].join('|');
}
