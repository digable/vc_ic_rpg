import { game, actions } from '../../game-state.js';
import { getNearbyNPC } from '../quests/input.js';
import { getNearbyExitDestinationName } from '../world/map-transition-service.js';

export function pruneSystemMessage(now = Date.now()) {
  if (!game.systemMessage || !game.systemMessage.text) {
    return;
  }

  if (now > game.systemMessage.expiresAt) {
    actions.systemMessageCleared();
  }
}

export function getHudPromptModel(formatButtonLabel = (label) => label) {
  const nearbyNPC = getNearbyNPC();
  const canInteractNow = game.state === 'explore' && !game.menuOpen && !game.dialogue;

  if (nearbyNPC) {
    if (nearbyNPC.type === 'cambus' && !canInteractNow) {
      return null;
    }

    const promptByNpcType = {
      shop: 'Enter Shop',
      healer: 'Get Free Refill',
      magic_trainer: 'Learn Magic',
      yoga: 'Yoga Training',
      cambus: 'Use Cambus',
      food_cart: 'Buy Food'
    };

    const prompt = promptByNpcType[nearbyNPC.type] || `Talk to ${nearbyNPC.name}`;
    return {
      text: formatButtonLabel(prompt),
      color: 'yellow'
    };
  }

  const nearbyExitDestination = getNearbyExitDestinationName();
  if (nearbyExitDestination) {
    return {
      text: `Entering: ${nearbyExitDestination}`,
      color: 'lightGreen'
    };
  }

  return null;
}
