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
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (window.innerWidth <= 768);

// Game configuration
export const CONFIG = {
  canvasWidth: 256,
  canvasHeight: 240,
  tileSize: 16,
  keyDelay: 150,
  encounterRate: 0.02,
  encounterStepsMin: 50
};
