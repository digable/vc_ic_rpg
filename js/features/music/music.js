let audioContext = null;
let masterGain = null;
let musicFilter = null;
let musicCompressor = null;
let schedulerId = null;
let nextNoteTime = 0;
let started = false;
let currentSectionIndex = 0;
let currentSectionStep = 0;
let currentSectionRepeat = 0;
let targetSectionRepeats = 1;
let sectionTransitions = 0;
let currentMode = 'explore';
let forcedSectionIndex = null;
let forcedSectionRepeats = 1;

const modeProfiles = {
  explore: {
    master: 0.132,
    lead: 0.9,
    harmony: 1.06,
    bass: 0.9,
    drums: 0.58,
    filterHz: 2850,
    tempoMul: 1,
    sectionBias: ['march', 'journey', 'twilight']
  },
  adventure: {
    master: 0.184,
    lead: 0.98,
    harmony: 0.62,
    bass: 1.76,
    drums: 1.56,
    filterHz: 2250,
    tempoMul: 1.46,
    sectionBias: ['twilight', 'bridge']
  },
  death: {
    master: 0.11,
    lead: 0.72,
    harmony: 1.12,
    bass: 0.78,
    drums: 0.18,
    filterHz: 2250,
    tempoMul: 0.84,
    sectionBias: ['twilight']
  }
};

const liveMix = {
  master: modeProfiles.explore.master,
  lead: modeProfiles.explore.lead,
  harmony: modeProfiles.explore.harmony,
  bass: modeProfiles.explore.bass,
  drums: modeProfiles.explore.drums,
  filterHz: modeProfiles.explore.filterHz,
  tempoMul: modeProfiles.explore.tempoMul
};

const baseTempo = 126;
const baseSecondsPerBeat = 60 / baseTempo;
const lookAhead = 0.12;
const scheduleWindowMs = 50;

const songSections = [
  {
    id: 'march',
    melody: [
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'C5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'C5', b: 1 }, { n: 'C5', b: 1 }, { n: 'F5', b: 1 }, { n: 'F5', b: 1 },
      { n: 'A4', b: 1 }, { n: 'A4', b: 1 }, { n: 'C5', b: 1 }, { n: 'C5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'E5', b: 1 },
      { n: 'F5', b: 1 }, { n: 'F5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'F2', b: 1 }, { n: 'F2', b: 1 },
      { n: 'D2', b: 1 }, { n: 'D2', b: 1 }, { n: 'A2', b: 1 }, { n: 'A2', b: 1 },
      { n: 'G2', b: 1 }, { n: 'G2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'E2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    leadVol: 0.06,
    harmonyVol: 0.038,
    bassVol: 0.052,
    drumVol: 0.015,
    minRepeats: 2,
    maxRepeats: 3,
    next: [1, 2, 4]
  },
  {
    id: 'ascent',
    melody: [
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'B5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 },
      { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'C5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'F5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'C5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'F2', b: 1 }, { n: 'F2', b: 1 },
      { n: 'G2', b: 1 }, { n: 'G2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'D2', b: 1 }, { n: 'D2', b: 1 }, { n: 'G2', b: 1 }, { n: 'G2', b: 1 },
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'E2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0],
    leadVol: 0.062,
    harmonyVol: 0.04,
    bassVol: 0.052,
    drumVol: 0.016,
    minRepeats: 2,
    maxRepeats: 2,
    next: [2, 3, 4]
  },
  {
    id: 'journey',
    melody: [
      { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'B5', b: 1 }, { n: 'A5', b: 1 },
      { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'G5', b: 1 }, { n: 'F5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'E5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'B4', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'G2', b: 1 }, { n: 'G2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'D2', b: 1 }, { n: 'D2', b: 1 },
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'F2', b: 1 }, { n: 'F2', b: 1 },
      { n: 'G2', b: 1 }, { n: 'G2', b: 1 }, { n: 'E2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0],
    leadVol: 0.058,
    harmonyVol: 0.038,
    bassVol: 0.055,
    drumVol: 0.015,
    minRepeats: 2,
    maxRepeats: 3,
    next: [0, 1, 4]
  },
  {
    id: 'twilight',
    melody: [
      { n: 'A5', b: 1 }, { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'C5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'F5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'E5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'B4', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'D2', b: 1 }, { n: 'D2', b: 1 },
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'F2', b: 1 }, { n: 'F2', b: 1 },
      { n: 'G2', b: 1 }, { n: 'G2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'E2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    leadVol: 0.056,
    harmonyVol: 0.036,
    bassVol: 0.05,
    drumVol: 0.014,
    minRepeats: 1,
    maxRepeats: 2,
    next: [0, 2, 4]
  },
  {
    id: 'bridge',
    melody: [
      { n: 'C5', b: 1 }, { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'B5', b: 1 }, { n: 'A5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'D5', b: 1 },
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'A4', b: 1 }, { n: 'A4', b: 1 }, { n: 'C5', b: 1 }, { n: 'C5', b: 1 },
      { n: 'F5', b: 1 }, { n: 'F5', b: 1 }, { n: 'E5', b: 1 }, { n: 'E5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'D5', b: 1 }, { n: 'C5', b: 1 }, { n: 'C5', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'F2', b: 1 }, { n: 'F2', b: 1 },
      { n: 'D2', b: 1 }, { n: 'D2', b: 1 }, { n: 'G2', b: 1 }, { n: 'G2', b: 1 },
      { n: 'E2', b: 1 }, { n: 'E2', b: 1 }, { n: 'C2', b: 1 }, { n: 'C2', b: 1 },
      { n: 'D2', b: 1 }, { n: 'E2', b: 1 }, { n: 'F2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    leadVol: 0.064,
    harmonyVol: 0.04,
    bassVol: 0.054,
    drumVol: 0.016,
    minRepeats: 1,
    maxRepeats: 1,
    next: [1, 2, 5]
  },
  {
    id: 'summit',
    melody: [
      { n: 'A5', b: 1 }, { n: 'B5', b: 1 }, { n: 'C6', b: 1 }, { n: 'B5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'G5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'E5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'B5', b: 1 },
      { n: 'C6', b: 1 }, { n: 'A5', b: 1 }, { n: 'E5', b: 1 }, { n: 'REST', b: 1 }
    ],
    harmony: [
      { n: 'F5', b: 1 }, { n: 'G5', b: 1 }, { n: 'A5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'F5', b: 1 }, { n: 'E5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 },
      { n: 'D5', b: 1 }, { n: 'E5', b: 1 }, { n: 'F5', b: 1 }, { n: 'G5', b: 1 },
      { n: 'A5', b: 1 }, { n: 'F5', b: 1 }, { n: 'D5', b: 1 }, { n: 'REST', b: 1 }
    ],
    bass: [
      { n: 'A2', b: 1 }, { n: 'A2', b: 1 }, { n: 'G2', b: 1 }, { n: 'G2', b: 1 },
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'D2', b: 1 }, { n: 'D2', b: 1 }, { n: 'E2', b: 1 }, { n: 'E2', b: 1 },
      { n: 'F2', b: 1 }, { n: 'F2', b: 1 }, { n: 'E2', b: 1 }, { n: 'REST', b: 1 }
    ],
    drums: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    leadVol: 0.066,
    harmonyVol: 0.042,
    bassVol: 0.056,
    drumVol: 0.017,
    minRepeats: 1,
    maxRepeats: 1,
    next: [0, 1, 2]
  }
];

const noteMap = {
  B4: 493.88,
  A4: 440,
  C2: 65.41,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  G2: 98,
  A2: 110,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  REST: 0
};

const adventureAccentPatterns = [
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1]
];

let adventurePatternIndex = 0;
let lastBattleStingerAt = -100;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createNoiseBuffer(ctx, durationSeconds) {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function schedulePulse(freq, startTime, durationSeconds, volume, dutyStyle = 'square', detuneCents = 0) {
  if (!audioContext || !masterGain || freq <= 0) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = dutyStyle;
  osc.frequency.setValueAtTime(freq, startTime);
  osc.detune.setValueAtTime(detuneCents, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.005);
  gain.gain.linearRampToValueAtTime(volume * 0.74, startTime + durationSeconds * 0.62);
  gain.gain.linearRampToValueAtTime(0.0001, startTime + durationSeconds);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + durationSeconds + 0.01);
}

function scheduleNoiseHit(startTime, durationSeconds, volume) {
  if (!audioContext || !masterGain) return;
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = createNoiseBuffer(audioContext, durationSeconds);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);
  source.connect(gain);
  gain.connect(masterGain);
  source.start(startTime);
  source.stop(startTime + durationSeconds + 0.01);
}

function chooseNextSection() {
  if (forcedSectionIndex !== null) {
    currentSectionIndex = forcedSectionIndex;
    currentSectionStep = 0;
    currentSectionRepeat = 0;
    targetSectionRepeats = forcedSectionRepeats;
    forcedSectionIndex = null;
    sectionTransitions++;
    return;
  }

  const current = songSections[currentSectionIndex];
  if (!current) {
    currentSectionIndex = 0;
    return;
  }

  let candidates = current.next || [0];

  if (sectionTransitions > 0 && sectionTransitions % 6 === 0) {
    candidates = [5];
  }

  const mode = modeProfiles[currentMode] || modeProfiles.explore;
  const preferred = candidates.filter((index) => mode.sectionBias.includes(songSections[index]?.id));
  const pool = preferred.length > 0 && Math.random() < 0.72 ? preferred : candidates;

  let nextSection = pickRandomFrom(pool);
  if (nextSection === currentSectionIndex && candidates.length > 1) {
    nextSection = pickRandomFrom(pool.filter((index) => index !== currentSectionIndex));
  }

  currentSectionIndex = nextSection;
  currentSectionStep = 0;
  currentSectionRepeat = 0;

  const next = songSections[currentSectionIndex];
  targetSectionRepeats = randomInt(next.minRepeats || 1, next.maxRepeats || 1);
  if (currentMode === 'adventure') {
    targetSectionRepeats = randomInt(3, 5);
    adventurePatternIndex = randomInt(0, adventureAccentPatterns.length - 1);
  }
  sectionTransitions++;
}

function updateLiveMix() {
  const target = modeProfiles[currentMode] || modeProfiles.explore;

  liveMix.master += (target.master - liveMix.master) * 0.08;
  liveMix.lead += (target.lead - liveMix.lead) * 0.08;
  liveMix.harmony += (target.harmony - liveMix.harmony) * 0.08;
  liveMix.bass += (target.bass - liveMix.bass) * 0.08;
  liveMix.drums += (target.drums - liveMix.drums) * 0.08;
  liveMix.filterHz += (target.filterHz - liveMix.filterHz) * 0.08;
  liveMix.tempoMul += (target.tempoMul - liveMix.tempoMul) * 0.08;

  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(liveMix.master, audioContext.currentTime, 0.18);
  }
  if (musicFilter && audioContext) {
    musicFilter.frequency.setTargetAtTime(liveMix.filterHz, audioContext.currentTime, 0.2);
  }
}

function scheduleLeadEcho(note, startTime, section, melodyDuration) {
  if (note === 'REST') return;
  const secondsPerBeat = baseSecondsPerBeat / Math.max(0.65, liveMix.tempoMul);
  const echoScale = currentMode === 'adventure' ? 0.1 : 1;
  if (echoScale <= 0) return;
  const echoDelay = secondsPerBeat * 0.48;
  const echoDuration = Math.max(secondsPerBeat * 0.34, melodyDuration * 0.52);
  schedulePulse(noteMap[note], startTime + echoDelay, echoDuration, section.leadVol * 0.28 * liveMix.lead * echoScale, 'square', -3);
}

function getBattleLeadFrequency(note, localIndex) {
  const base = noteMap[note];
  if (!base) return 0;

  if (base >= noteMap.C5) {
    if (localIndex % 3 === 0) return base * 0.5;
    if (localIndex % 3 === 1) return base * 0.667;
    return base * 0.75;
  }

  return base;
}

function scheduleStep(startTime) {
  const secondsPerBeat = baseSecondsPerBeat / Math.max(0.65, liveMix.tempoMul);
  const section = songSections[currentSectionIndex] || songSections[0];
  const localIndex = currentSectionStep;
  const m = section.melody[localIndex % section.melody.length];
  const h = section.harmony[localIndex % section.harmony.length];
  const b = section.bass[localIndex % section.bass.length];

  const isAdventure = currentMode === 'adventure';
  const isAdventureDroneBar = isAdventure && Math.floor((localIndex % section.melody.length) / 4) % 2 === 1;
  const attackTightness = isAdventure ? 0.78 : 1;

  const melodyDuration = m.b * secondsPerBeat * 0.9 * attackTightness;
  const harmonyDuration = h.b * secondsPerBeat * 0.86 * attackTightness;
  const bassDuration = b.b * secondsPerBeat * 0.88 * attackTightness;

  const leadBaseFrequency = isAdventure ? getBattleLeadFrequency(m.n, localIndex) : noteMap[m.n];

  if (m.n !== 'REST' && !isAdventureDroneBar) {
    schedulePulse(leadBaseFrequency, startTime, melodyDuration, section.leadVol * liveMix.lead, 'square', 0);
    schedulePulse(leadBaseFrequency, startTime, melodyDuration * 0.92, section.leadVol * 0.38 * liveMix.lead, 'square', 6);
    scheduleLeadEcho(m.n, startTime, section, melodyDuration);
  }
  if (h.n !== 'REST' && !isAdventureDroneBar) schedulePulse(noteMap[h.n], startTime, harmonyDuration, section.harmonyVol * liveMix.harmony, 'square');
  if (b.n !== 'REST') schedulePulse(noteMap[b.n], startTime, bassDuration, section.bassVol * liveMix.bass, 'triangle');

  if (isAdventureDroneBar && b.n !== 'REST') {
    schedulePulse(noteMap[b.n] * 0.5, startTime, secondsPerBeat * 0.92, section.bassVol * liveMix.bass * 0.55, 'triangle', -10);
  }

  if (section.drums[localIndex % section.drums.length]) {
    scheduleNoiseHit(startTime, secondsPerBeat * 0.08, section.drumVol * liveMix.drums);
  }

  // Extra battle-mode percussion accents for sharper contrast from exploration.
  if (isAdventure && (localIndex % 4 === 1 || localIndex % 4 === 2)) {
    scheduleNoiseHit(startTime + secondsPerBeat * 0.22, secondsPerBeat * 0.052, section.drumVol * liveMix.drums * 0.72);
  }

  if (isAdventure) {
    const accentPattern = adventureAccentPatterns[adventurePatternIndex % adventureAccentPatterns.length];
    const accentOn = accentPattern[localIndex % accentPattern.length] === 1;

    if (accentOn && m.n !== 'REST' && !isAdventureDroneBar) {
      // Menacing minor-second cluster (very close dissonance, dark and tense).
      schedulePulse(leadBaseFrequency * 1.059, startTime + secondsPerBeat * 0.055, melodyDuration * 0.24, section.leadVol * liveMix.lead * 0.22, 'square', -12);
      schedulePulse(leadBaseFrequency * 1.122, startTime + secondsPerBeat * 0.095, melodyDuration * 0.2, section.leadVol * liveMix.lead * 0.18, 'square', -20);
    }

    if (b.n !== 'REST' && localIndex % 2 === 1) {
      schedulePulse(noteMap[b.n], startTime + secondsPerBeat * 0.26, bassDuration * 0.3, section.bassVol * liveMix.bass * 0.86, 'square', -14);
      schedulePulse(noteMap[b.n] * 0.5, startTime + secondsPerBeat * 0.02, bassDuration * 0.6, section.bassVol * liveMix.bass * 0.62, 'triangle', -3);
    }

    if (localIndex % 8 === 7 && m.n !== 'REST' && !isAdventureDroneBar) {
      schedulePulse(leadBaseFrequency * 1.059, startTime + secondsPerBeat * 0.11, melodyDuration * 0.18, section.leadVol * liveMix.lead * 0.14, 'triangle', -18);
    }

    if (localIndex % 4 === 0 && b.n !== 'REST') {
      schedulePulse(noteMap[b.n] * 0.707, startTime, bassDuration * 0.44, section.bassVol * liveMix.bass * 0.58, 'square', -18);
      schedulePulse(noteMap[b.n] * 0.5, startTime + secondsPerBeat * 0.08, bassDuration * 0.5, section.bassVol * liveMix.bass * 0.5, 'triangle', -6);
      schedulePulse(noteMap[b.n] * 0.529, startTime + secondsPerBeat * 0.04, bassDuration * 0.36, section.bassVol * liveMix.bass * 0.42, 'square', -24);
    }

    if (localIndex % 8 === 0 && b.n !== 'REST') {
      schedulePulse(noteMap[b.n] * 0.5, startTime, secondsPerBeat * 1.9, section.bassVol * liveMix.bass * 0.44, 'triangle', -8);
      schedulePulse(noteMap[b.n] * 0.375, startTime + secondsPerBeat * 0.1, secondsPerBeat * 1.6, section.bassVol * liveMix.bass * 0.36, 'square', -24);
    }
  }

  const stepDuration = m.b * secondsPerBeat;

  currentSectionStep = (currentSectionStep + 1) % section.melody.length;
  if (currentSectionStep === 0) {
    currentSectionRepeat++;
    if (currentSectionRepeat >= targetSectionRepeats) {
      chooseNextSection();
    }
  }

  return stepDuration;
}

function scheduler() {
  if (!audioContext) return;
  updateLiveMix();
  while (nextNoteTime < audioContext.currentTime + lookAhead) {
    const stepDuration = scheduleStep(nextNoteTime);
    nextNoteTime += stepDuration;
  }
}

function ensureAudioGraph() {
  if (audioContext) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext = new AudioCtx();

  musicFilter = audioContext.createBiquadFilter();
  musicFilter.type = 'lowpass';
  musicFilter.frequency.value = 3400;
  musicFilter.Q.value = 0.7;

  musicCompressor = audioContext.createDynamicsCompressor();
  musicCompressor.threshold.value = -24;
  musicCompressor.knee.value = 18;
  musicCompressor.ratio.value = 2.8;
  musicCompressor.attack.value = 0.01;
  musicCompressor.release.value = 0.22;

  masterGain = audioContext.createGain();
  masterGain.gain.value = liveMix.master;
  masterGain.connect(musicFilter);
  musicFilter.connect(musicCompressor);
  musicCompressor.connect(audioContext.destination);

  nextNoteTime = audioContext.currentTime + 0.04;
  currentSectionIndex = 0;
  currentSectionStep = 0;
  currentSectionRepeat = 0;
  sectionTransitions = 0;
  targetSectionRepeats = randomInt(songSections[0].minRepeats || 1, songSections[0].maxRepeats || 1);
}

export async function startBackgroundMusic() {
  ensureAudioGraph();
  if (!audioContext || !masterGain) return;

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  if (started) return;

  started = true;
  scheduler();
  schedulerId = window.setInterval(scheduler, scheduleWindowMs);
}

export function stopBackgroundMusic() {
  if (schedulerId) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
  started = false;
}

export function setBackgroundMusicVolume(volume) {
  if (!masterGain) return;
  const clamped = Math.max(0, Math.min(1, volume));
  masterGain.gain.setValueAtTime(clamped, audioContext.currentTime);
}

export function setBackgroundMusicMode(mode) {
  const previousMode = currentMode;
  if (mode !== 'explore' && mode !== 'adventure' && mode !== 'death') {
    currentMode = 'explore';
    return;
  }
  currentMode = mode;

  if (previousMode !== 'adventure' && currentMode === 'adventure') {
    adventurePatternIndex = randomInt(0, adventureAccentPatterns.length - 1);
  }
}

function forceSectionById(sectionId, repeats = 1, startDelaySeconds = 0.02) {
  const sectionIndex = songSections.findIndex((section) => section.id === sectionId);
  if (sectionIndex === -1) return;

  const safeRepeats = Math.max(1, repeats);

  // Immediate jump so the player hears context changes (battle/explore/death) right away.
  currentSectionIndex = sectionIndex;
  currentSectionStep = 0;
  currentSectionRepeat = 0;
  targetSectionRepeats = safeRepeats;
  forcedSectionIndex = null;
  forcedSectionRepeats = safeRepeats;

  if (audioContext) {
    nextNoteTime = audioContext.currentTime + Math.max(0.005, startDelaySeconds);
  }
}

function scheduleBattleStinger(startTime) {
  if (!audioContext || !masterGain) return;

  scheduleNoiseHit(startTime, 0.06, 0.08);
  schedulePulse(noteMap.C5, startTime + 0.01, 0.08, 0.072, 'square', -10);
  schedulePulse(noteMap.B4, startTime + 0.07, 0.09, 0.074, 'square', -14);
  schedulePulse(noteMap.G2, startTime + 0.02, 0.18, 0.098, 'triangle', -4);
  schedulePulse(noteMap.D2, startTime + 0.05, 0.2, 0.092, 'triangle', -6);
}

export function triggerBattleMusicCue() {
  if (audioContext && audioContext.currentTime - lastBattleStingerAt > 0.5) {
    scheduleBattleStinger(audioContext.currentTime + 0.005);
    lastBattleStingerAt = audioContext.currentTime;
  }
  forceSectionById('summit', 2, 0.18);
}

export function triggerExploreMusicCue() {
  forceSectionById(Math.random() < 0.5 ? 'march' : 'journey', 1);
}

export function triggerDeathMusicCue() {
  forceSectionById('twilight', 2);
}
