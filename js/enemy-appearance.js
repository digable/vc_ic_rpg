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

function colorFromSeed(seed, minChannel = 30, maxChannel = 235) {
  const span = Math.max(1, maxChannel - minChannel + 1);
  const r = minChannel + ((seed >>> 0) & 0xff) % span;
  const g = minChannel + ((seed >>> 8) & 0xff) % span;
  const b = minChannel + ((seed >>> 16) & 0xff) % span;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function parseHexColor(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function colorFromBase(baseHex, seed, variance = 24) {
  const base = parseHexColor(baseHex);
  const shiftR = ((seed >>> 0) & 0x1f) - 15;
  const shiftG = ((seed >>> 8) & 0x1f) - 15;
  const shiftB = ((seed >>> 16) & 0x1f) - 15;

  const r = clamp(base.r + Math.floor((shiftR / 15) * variance), 0, 255);
  const g = clamp(base.g + Math.floor((shiftG / 15) * variance), 0, 255);
  const b = clamp(base.b + Math.floor((shiftB / 15) * variance), 0, 255);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const ENEMY_ARCHETYPES = {
  academic: {
    aura: '#6f5ad6',
    sigil: '#d5ceff',
    eye: '#ffe58a',
    crestType: 0,
    radius: 13
  },
  cave: {
    aura: '#4d6f8f',
    sigil: '#9be6ff',
    eye: '#74f5ff',
    crestType: 2,
    radius: 14
  },
  undead: {
    aura: '#4f6b58',
    sigil: '#b9d7c0',
    eye: '#b8ffde',
    crestType: 3,
    radius: 14
  },
  aquatic: {
    aura: '#2f6aa3',
    sigil: '#8fd8ff',
    eye: '#dbf6ff',
    crestType: 4,
    radius: 13
  },
  sports: {
    aura: '#9c5a2a',
    sigil: '#ffd86f',
    eye: '#fff4a8',
    crestType: 1,
    radius: 12
  },
  urban: {
    aura: '#6a6a6a',
    sigil: '#d4d4d4',
    eye: '#ffe39b',
    crestType: 5,
    radius: 12
  },
  boss: {
    aura: '#8b2e2e',
    sigil: '#ff9b9b',
    eye: '#ffe1e1',
    crestType: 6,
    radius: 18
  }
};

function inferArchetype(enemy) {
  if (!enemy || !enemy.name) return 'urban';
  if (enemy.isBoss) return 'boss';

  const name = enemy.name.toLowerCase();
  const location = (enemy.location || '').toLowerCase();

  if (location.includes('beer_caves') || /cave|drake|golem|crystal|fungal|mycelium|tunnel|warden|bat|spider|mushroom|leech/.test(name)) {
    return 'cave';
  }

  if (location.includes('oakland_cemetery') || /ghost|zombie|witch|skeletal|raven|wisp|haunted/.test(name)) {
    return 'undead';
  }

  if (location.includes('coralville_lake') || location.includes('city_park_pool') || /lake|goose|catfish|cannonball|lane|whistle|splash/.test(name)) {
    return 'aquatic';
  }

  if (location.includes('kinnick_stadium') || /fan|football|mascot/.test(name)) {
    return 'sports';
  }

  if (location.includes('old_capitol') || /assignment|exam|project|thesis|administrator|portrait/.test(name)) {
    return 'academic';
  }

  return 'urban';
}

export function getEnemyAppearance(enemy) {
  const key = `${enemy.name || ''}|${enemy.location || ''}|${enemy.specialAttack ? enemy.specialAttack.name : ''}|${enemy.isBoss ? 'boss' : 'mob'}`;
  const seedA = hashString(key);
  const seedB = hashString(`${key}|b`);
  const seedC = hashString(`${key}|c`);
  const seedD = hashString(`${key}|d`);

  const archetype = inferArchetype(enemy);
  const base = ENEMY_ARCHETYPES[archetype] || ENEMY_ARCHETYPES.urban;

  return {
    archetype,
    auraColor: colorFromBase(base.aura, seedA, enemy.isBoss ? 16 : 22),
    sigilColor: colorFromBase(base.sigil, seedB, 20),
    eyeGlowColor: colorFromBase(base.eye, seedC, 18),
    crestType: (base.crestType + (seedD % 2)) % 8,
    auraRadius: base.radius + (seedB % 4),
    markVariant: seedD % 7
  };
}

export function getEnemyAppearanceSignature(enemy) {
  const appearance = getEnemyAppearance(enemy);
  return [
    appearance.archetype,
    appearance.auraColor,
    appearance.sigilColor,
    appearance.eyeGlowColor,
    appearance.crestType,
    appearance.auraRadius,
    appearance.markVariant
  ].join('|');
}
