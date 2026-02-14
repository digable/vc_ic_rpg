// Iowa City Quest - Complete Main Game Module
// Imports all data modules and contains complete game logic

import { COLORS, tileColors, isMobile, CONFIG } from './constants.js';
import { shopItems, magicTraining, yogaTechniques, spellData, consumableItems, cambusRoutes } from './data.js';
import { questDatabase } from './quests.js';
import { enemies } from './enemies.js';
import { maps } from './maps.js';
import { game } from './game-state.js';

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

// Disable image smoothing
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

