// Game Constants and Configuration

// NES Color Palette
export const COLORS = {
  white: '#fff',
  black: '#000',
  gray: '#808080',
  darkGray: '#404040',
  lightGray: '#c0c0c0',
  red: '#e00000',
  green: '#00a800',
  blue: '#0000e0',
  yellow: '#e0e000',
  orange: '#e06000',
  brown: '#8b4513',
  pink: '#ffb6c1',
  tan: '#d2b48c',
  lightBlue: '#87ceeb',
  lightGreen: '#90ee90',
  purple: '#bc00bc',
  sky: '#00e8fc'
};

// Tile colors mapping
export const tileColors = [
  COLORS.darkGray,  // 0 = road
  COLORS.gray,      // 1 = sidewalk
  COLORS.green,     // 2 = grass
  COLORS.brown,     // 3 = building
  COLORS.orange,    // 4 = bookshelf
  COLORS.lightBlue  // 5 = water
];

// Mobile detection
export let isMobile = false;

export function detectMobileDevice() {
  if (typeof window === 'undefined') return false;

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const narrowViewport = window.innerWidth <= 768;
  const hasCoarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const hasTouchPoints = typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0;
  const hasTouchEvent = 'ontouchstart' in window;

  return mobileUserAgent || (narrowViewport && (hasCoarsePointer || hasTouchPoints || hasTouchEvent));
}

export function refreshMobileDetection() {
  isMobile = detectMobileDevice();
  return isMobile;
}

if (typeof window !== 'undefined') {
  refreshMobileDetection();
}

// Game configuration
export const CONFIG = {
  canvasWidth: 256,
  canvasHeight: 240,
  tileSize: 16,
  keyDelay: 150,
  encounterRate: 0.02,
  encounterStepsMin: 50
};

// Maps considered part of the Beer Caves region
export const CAVE_MAPS = [
  'beer_caves',
  'beer_caves_depths_1',
  'beer_caves_depths_2',
  'beer_caves_depths_3'
];

// Shared entity taxonomy for NPC/enemy metadata and future classification rules.
export const ENTITY_CLASSIFICATIONS = {
  NPC: 'npc',
  ENEMY: 'enemy',
  LEGENDARY_CHARACTER: 'legendary_character'
};
