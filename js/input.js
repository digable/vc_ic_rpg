// Input Handling Module
import { game, resetGameState, actions } from './game-state.js';
import { CONFIG, isMobile, refreshMobileDetection } from './constants.js';
import { startBackgroundMusic, stopBackgroundMusic } from './features/music/input.js';
import { pruneSystemMessage } from './features/ui/logic.js';
import {
  handleCambusState,
  handleDialogueState,
  handleExploreEscapeToggle,
  handleExploreState,
  handleBattleState,
  handleShopState,
  handleMagicTrainerState,
  handleYogaState,
  handleFoodCartState,
  handleGameOverState
} from './features/input/state-handlers.js';

// Input state
export const keys = {};
export let lastKeyTime = 0;
export const keyDelay = CONFIG.keyDelay;
export let spacePressed = false;

export function setLastKeyTime(time) {
  lastKeyTime = time;
}

export function setSpacePressed(value) {
  spacePressed = value;
}

export function setupInputHandlers() {
  const mobileControls = document.getElementById('mobile-controls');
  const startText = document.getElementById('start-text');
  const controlsText = document.getElementById('controls-text');

  const updateTitleControlsText = () => {
    if (!controlsText) return;

    if (isMobile) {
      controlsText.textContent = 'D-PAD: Move | A: Action | M: Menu';
      return;
    }

    controlsText.textContent = 'ARROW KEYS: Move | SPACE: Action/Advance Text | ESC: Menu';
  };

  const updateMobileMode = () => {
    const mobileMode = refreshMobileDetection();

    if (mobileControls) {
      mobileControls.classList.toggle('active', mobileMode);
    }

    if (startText) {
      startText.textContent = mobileMode ? 'PRESS A BUTTON TO START' : 'PRESS SPACE TO START';
    }

    updateTitleControlsText();
  };

  const startIntroStory = () => {
    const mobileMode = refreshMobileDetection();
    const introActionText = mobileMode ? 'A Button' : 'SPACE';

    if (game.musicEnabled) {
      startBackgroundMusic();
    }
    document.getElementById('title-screen').classList.add('hidden');
    actions.dialogueStarted([
        'Welcome to Iowa City!',
        'A dark corruption has spread across\nthe city, emanating from the historic\nOld Capitol building.',
        'As a student hero, you must explore\nIowa City, complete quests, and\ngrow stronger.',
        'Visit Kinnick Stadium, the Ped Mall,\nthe Old Capitol, Coralville Lake,\nthe mysterious Beer Caves, and more!',
        'Clear the Beer Caves, then reach\nLevel 10 to face the Corrupted\nAdministrator and save Iowa City!',
        `Good luck, hero!\nPress ${introActionText} to begin your adventure!`
      ], {
      type: 'story',
      afterDialogue: () => {
        actions.stateChanged('explore');
        actions.dialogueCleared();
      }
    });
  };

  // Handle touch events for virtual buttons
  document.querySelectorAll('.dpad-btn, .action-btn').forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.key;

      if (key === 'up') keys['ArrowUp'] = true;
      else if (key === 'down') keys['ArrowDown'] = true;
      else if (key === 'left') keys['ArrowLeft'] = true;
      else if (key === 'right') keys['ArrowRight'] = true;
      else if (key === 'action') {
        keys[' '] = true;
        spacePressed = true;

        if (game.state === 'title') {
          startIntroStory();
        }
      }
      else if (key === 'menu') keys['Escape'] = true;
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.key;

      if (key === 'up') keys['ArrowUp'] = false;
      else if (key === 'down') keys['ArrowDown'] = false;
      else if (key === 'left') keys['ArrowLeft'] = false;
      else if (key === 'right') keys['ArrowRight'] = false;
      else if (key === 'action') {
        keys[' '] = false;
        spacePressed = false;
      }
      else if (key === 'menu') keys['Escape'] = false;
    });

    btn.addEventListener('touchcancel', () => {
      const key = btn.dataset.key;

      if (key === 'up') keys['ArrowUp'] = false;
      else if (key === 'down') keys['ArrowDown'] = false;
      else if (key === 'left') keys['ArrowLeft'] = false;
      else if (key === 'right') keys['ArrowRight'] = false;
      else if (key === 'action') {
        keys[' '] = false;
        spacePressed = false;
      }
      else if (key === 'menu') keys['Escape'] = false;
    });
  });

  if (mobileControls) {
    mobileControls.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  updateMobileMode();
  window.addEventListener('resize', updateMobileMode);
  window.addEventListener('orientationchange', updateMobileMode);

  if (typeof window.matchMedia === 'function') {
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    if (typeof coarsePointerQuery.addEventListener === 'function') {
      coarsePointerQuery.addEventListener('change', updateMobileMode);
    } else if (typeof coarsePointerQuery.addListener === 'function') {
      coarsePointerQuery.addListener(updateMobileMode);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      if (spacePressed) return;
      spacePressed = true;
    }
    keys[e.key] = true;
    
    if (game.state === 'title' && e.key === ' ') {
      startIntroStory();
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') spacePressed = false;
  });

  // Handle mouse/touch clicks for game over screen
  document.addEventListener('click', (e) => {
    if (game.state === 'gameOver') {
      // Get canvas and calculate relative position
      const canvas = document.getElementById('game-canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      // Check if click is on restart button (80-176 x, 160-190 y)
      if (x >= 80 && x <= 176 && y >= 160 && y <= 190) {
        resetGameState();
        stopBackgroundMusic();
      }
    }
  });
}

export function handleInput() {
  const now = Date.now();
  const ctx = {
    keys,
    now,
    lastKeyTime,
    keyDelay,
    setLastKeyTime
  };

  pruneSystemMessage(now);

  if (game.licenseOpen && keys['Escape'] && now - lastKeyTime > keyDelay) {
    actions.gameStatePatched({ licenseOpen: false }, 'licenseOverlayClosed');
    setLastKeyTime(now);
    return;
  }

  if (game.state === 'cambus') {
    handleCambusState(ctx);
    return;
  }
  
  if (game.dialogue) {
    handleDialogueState(ctx);
    return;
  }

  if (game.state === 'explore' && keys['Escape']) {
    handleExploreEscapeToggle(ctx);
    return;
  }
  
  if (now - lastKeyTime < keyDelay) return;

  if (game.state === 'explore') {
    handleExploreState(ctx);
  } else if (game.state === 'battle') {
    handleBattleState(ctx);
  } else if (game.state === 'shop') {
    handleShopState(ctx);
  } else if (game.state === 'magic_trainer') {
    handleMagicTrainerState(ctx);
  } else if (game.state === 'yoga') {
    handleYogaState(ctx);
  } else if (game.state === 'food_cart') {
    handleFoodCartState(ctx);
  } else if (game.state === 'gameOver') {
    handleGameOverState(ctx);
  }
}

