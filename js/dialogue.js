// Dialogue System Module
import { game } from './game-state.js';

export function startDialogue(dialogue) {
  game.dialogue = {
    messages: Array.isArray(dialogue) ? dialogue : [dialogue],
    currentIndex: 0
  };
}

export function advanceDialogue() {
  if (!game.dialogue) return;
  
  game.dialogue.currentIndex++;
  if (game.dialogue.currentIndex >= game.dialogue.messages.length) {
    game.dialogue = null;
  }
}
