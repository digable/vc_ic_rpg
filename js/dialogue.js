// Dialogue System Module
import { game, actions } from './game-state.js';

export function startDialogue(dialogue, options = {}) {
  actions.dialogueStarted(dialogue, options);
}

export function advanceDialogue() {
  if (!game.dialogue) return;
  
  game.dialogue.currentIndex++;
  if (game.dialogue.currentIndex >= game.dialogue.messages.length) {
    // Check if there's an afterDialogue callback
    const callback = game.dialogue.afterDialogue;
    actions.dialogueCleared();
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
}
