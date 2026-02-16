// Game State Module - Game over and state-specific rendering
import { COLORS, isMobile } from '../constants.js';
import { setCtx } from './utils.js';

export function drawGameOver() {
  const ctx = setCtx();
  
  // Semi-transparent black overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, 256, 240);
  
  // Game Over text
  ctx.fillStyle = COLORS.red;
  ctx.font = 'bold 16px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', 128, 60);
  
  // Message
  ctx.fillStyle = COLORS.white;
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('You were defeated!', 128, 100);
  ctx.fillText('Your adventure ends here...', 128, 115);
  
  // Restart button
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2;
  ctx.fillStyle = COLORS.darkGray;
  ctx.fillRect(80, 160, 96, 30);
  ctx.strokeRect(80, 160, 96, 30);
  
  ctx.fillStyle = COLORS.yellow;
  ctx.font = 'bold 8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('RESTART GAME', 128, 182);
  
  // Instructions
  ctx.fillStyle = COLORS.gray;
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText(isMobile ? 'Tap button to restart' : 'Press SPACE or click button', 128, 210);
}
