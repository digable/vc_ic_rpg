// Rendering Utilities - Helper Functions
import { COLORS, isMobile } from '../constants.js';

export let ctx;

// Helper function to get the correct button label based on platform
export function getButtonLabel(action = '') {
  if (isMobile) {
    return action ? `A Button: ${action}` : 'A';
  }
  return action ? `SPACE: ${action}` : 'SPACE';
}

export function getMenuLabel() {
  return isMobile ? 'M Button: Menu' : 'ESC: Menu';
}

export function setCtx(context) {
  if (context) {
    ctx = context;
  }
  return ctx;
}

export function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yPos = y;
  
  for (let word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, yPos);
      line = word + ' ';
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yPos);
}
