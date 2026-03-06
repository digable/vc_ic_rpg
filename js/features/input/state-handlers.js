import { game, resetGameState, actions } from '../../game-state.js';
import { CAVE_MAPS } from '../../constants.js';
import { cambusRoutes, consumableItems, shopItems, magicTraining, yogaTechniques } from '../../data.js';
import {
  openShop,
  openMagicTrainer,
  openYoga,
  openCambus,
  handleShopPurchase,
  handleMagicTraining,
  handleYogaTraining,
  handleFoodCartPurchase,
  handleCambusTravel,
  healPlayer,
  interactBlackAngel
} from '../../interactions.js';
import { advanceDialogue, startDialogue } from '../../dialogue.js';
import { executeBattleAction, startBattle, executeSpell, useItemFromMenu, useItemInBattle } from '../battle/input.js';
import { checkNPCInteraction, maybeSpawnLegendVisitor, updateQuestProgress } from '../quests/input.js';
import { openFoodCart } from '../world/input.js';
import { commitPlayerMovement } from '../world/map-transition-service.js';
import { clearLocalSave, loadGameFromLocal, MAX_LOCAL_SAVES, saveGameToLocal } from '../../save.js';
import { startBackgroundMusic, stopBackgroundMusic } from '../music/input.js';

function resetSaveMenuState() {
  actions.gameStatePatched({
    saveMenuMode: 'actions',
    saveMenuAction: null,
    saveSlotSelection: 0
  }, 'saveMenuStateReset');
}

function resetQuestMenuState() {
  actions.gameStatePatched({
    questMenuSection: 0,
    questInProgressPage: 0,
    questCompletedPage: 0
  }, 'questMenuStateReset');
}

function showSystemMessage(text) {
  actions.systemMessageShown(text, Date.now() + 1800);
}

function patchInputState(patch, label) {
  actions.gameStatePatched(patch, label);
}

export function handleCambusState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const itemsPerPage = 6;
  const totalPages = Math.ceil(cambusRoutes.length / itemsPerPage);
  const startIdx = game.cambusPage * itemsPerPage;
  const pageItems = cambusRoutes.slice(startIdx, startIdx + itemsPerPage);

  if (keys['ArrowUp']) {
    patchInputState({ cambusSelection: Math.max(0, game.cambusSelection - 1) }, 'cambusSelectionMovedUp');
    keys['ArrowUp'] = false;
  }
  if (keys['ArrowDown']) {
    patchInputState({ cambusSelection: Math.min(pageItems.length, game.cambusSelection + 1) }, 'cambusSelectionMovedDown');
    keys['ArrowDown'] = false;
  }
  if (keys['ArrowLeft']) {
    if (game.cambusPage > 0) {
      patchInputState({ cambusPage: game.cambusPage - 1, cambusSelection: 0 }, 'cambusPageMovedLeft');
      keys['ArrowLeft'] = false;
    }
  }
  if (keys['ArrowRight']) {
    if (game.cambusPage < totalPages - 1) {
      patchInputState({ cambusPage: game.cambusPage + 1, cambusSelection: 0 }, 'cambusPageMovedRight');
      keys['ArrowRight'] = false;
    }
  }
  if (keys[' '] && now - lastKeyTime > keyDelay) {
    handleCambusTravel();
    setLastKeyTime(now);
  }
  if (keys['Escape'] && now - lastKeyTime > keyDelay) {
    actions.stateChanged('explore');
    actions.gameStatePatched({
      cambusOpen: false,
      cambusPage: 0,
      cambusSelection: 0
    }, 'cambusClosedFromInput');
    setLastKeyTime(now);
  }
}

export function handleDialogueState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  if (game.state !== 'dialogue') {
    actions.stateChanged('dialogue');
  }

  if (keys[' '] || keys['Enter']) {
    if (now - lastKeyTime > keyDelay) {
      advanceDialogue();
      if (!game.dialogue) {
        actions.levelUpDialogSet(null);
        actions.stateChanged('explore');
      }
      setLastKeyTime(now);
    }
  }

  if (keys['Escape']) {
    if (now - lastKeyTime > keyDelay) {
      actions.dialogueCleared();
      actions.levelUpDialogSet(null);
      actions.stateChanged('explore');
      setLastKeyTime(now);
    }
  }
}

export function handleExploreEscapeToggle({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  if (now - lastKeyTime > keyDelay) {
    actions.menuToggled();
    if (game.menuOpen) {
      actions.gameStatePatched({ menuSelection: 0, menuTab: 0, settingsSelection: 0 }, 'menuOpenedSelectionReset');
      resetQuestMenuState();
      resetSaveMenuState();
    } else {
      resetQuestMenuState();
      resetSaveMenuState();
    }
    setLastKeyTime(now);
  }
}

export function handleExploreState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const speed = 16;
  let newX = game.player.x;
  let newY = game.player.y;
  let moved = false;

  if (!game.menuOpen) {
    if (keys['ArrowUp']) {
      newY -= speed;
      actions.playerPatched({ facing: 'up' }, 'playerFacingUp');
      moved = true;
    }
    if (keys['ArrowDown']) {
      newY += speed;
      actions.playerPatched({ facing: 'down' }, 'playerFacingDown');
      moved = true;
    }
    if (keys['ArrowLeft']) {
      newX -= speed;
      actions.playerPatched({ facing: 'left' }, 'playerFacingLeft');
      moved = true;
    }
    if (keys['ArrowRight']) {
      newX += speed;
      actions.playerPatched({ facing: 'right' }, 'playerFacingRight');
      moved = true;
    }
  }

  if (moved) {
    if (commitPlayerMovement(newX, newY)) {
      setLastKeyTime(now);

      updateQuestProgress('visit_location', game.map);
      maybeSpawnLegendVisitor();

      const caveEncountersDisabled = game.caveSovereignDefeated && CAVE_MAPS.includes(game.map);
      if (!caveEncountersDisabled && game.enemyEncounterSteps > 10 && Math.random() < 0.15) {
        startBattle();
        actions.gameStatePatched({ enemyEncounterSteps: 0 }, 'encounterCounterResetAfterBattleStart');
      }
    }
  }

  if (keys[' ']) {
    if (now - lastKeyTime > keyDelay && !game.menuOpen) {
      const npc = checkNPCInteraction();
      if (npc) {
        if (npc.type === 'shop') {
          openShop();
        } else if (npc.type === 'healer') {
          healPlayer();
        } else if (npc.type === 'magic_trainer') {
          openMagicTrainer();
        } else if (npc.type === 'yoga') {
          openYoga();
        } else if (npc.type === 'cambus') {
          openCambus();
        } else if (npc.type === 'food_cart') {
          openFoodCart(npc.vendorName || npc.name);
        } else if (npc.type === 'black_angel') {
          interactBlackAngel();
        } else if (npc.type === 'boss' && !game.caveSovereignDefeated) {
          if (!game.caveSovereignIntroSeen) {
            startDialogue([
              'Sovereign: You dare step into my chamber?'
            , 'You: Your reign ends here, Sovereign.'
            ], {
              afterDialogue: () => {
              actions.gameStatePatched({ caveSovereignIntroSeen: true }, 'caveSovereignIntroSeen');
              actions.stateChanged('explore');
              startBattle('Cave Sovereign');
              }
            });
          } else {
            startBattle('Cave Sovereign');
          }
        }
      }
      setLastKeyTime(now);
    }
  }

  if (game.menuOpen) {
    if (keys['ArrowLeft']) {
      patchInputState({ menuTab: Math.max(0, game.menuTab - 1) }, 'menuTabMovedLeft');
      if (game.menuTab !== 3) {
        resetQuestMenuState();
      }
      if (game.menuTab !== 4) {
        actions.gameStatePatched({ menuSelection: 0 }, 'menuSelectionResetOnTabChange');
        resetSaveMenuState();
      }
      setLastKeyTime(now);
    }
    if (keys['ArrowRight']) {
      patchInputState({ menuTab: Math.min(5, game.menuTab + 1) }, 'menuTabMovedRight');
      if (game.menuTab !== 3) {
        resetQuestMenuState();
      }
      if (game.menuTab !== 4) {
        actions.gameStatePatched({ menuSelection: 0 }, 'menuSelectionResetOnTabChange');
        resetSaveMenuState();
      }
      setLastKeyTime(now);
    }
    if (keys['ArrowUp'] && game.menuTab === 3) {
      const inProgressCount = game.quests.filter(q => q.status === 'active').length;
      const completedCount = game.quests.filter(q => q.status === 'completed').length;
      const inProgressPages = Math.max(1, Math.ceil(inProgressCount / 1));
      const completedPages = Math.max(1, Math.ceil(completedCount / 3));

      if (game.questMenuSection === 0) {
        if (game.questInProgressPage > 0) {
          patchInputState({ questInProgressPage: game.questInProgressPage - 1 }, 'questInProgressPageMovedUp');
        }
      } else {
        if (game.questCompletedPage > 0) {
          patchInputState({ questCompletedPage: game.questCompletedPage - 1 }, 'questCompletedPageMovedUp');
        } else {
          patchInputState({
            questMenuSection: 0,
            questInProgressPage: Math.max(0, inProgressPages - 1)
          }, 'questMenuSectionReturnedToInProgress');
        }
      }

      patchInputState({
        questInProgressPage: Math.min(game.questInProgressPage, inProgressPages - 1),
        questCompletedPage: Math.min(game.questCompletedPage, completedPages - 1)
      }, 'questPagesClampedAfterUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown'] && game.menuTab === 3) {
      const inProgressCount = game.quests.filter(q => q.status === 'active').length;
      const completedCount = game.quests.filter(q => q.status === 'completed').length;
      const inProgressPages = Math.max(1, Math.ceil(inProgressCount / 1));
      const completedPages = Math.max(1, Math.ceil(completedCount / 3));

      if (game.questMenuSection === 0) {
        if (game.questInProgressPage < inProgressPages - 1) {
          patchInputState({ questInProgressPage: game.questInProgressPage + 1 }, 'questInProgressPageMovedDown');
        } else {
          patchInputState({ questMenuSection: 1, questCompletedPage: 0 }, 'questMenuSectionMovedToCompleted');
        }
      } else {
        patchInputState({
          questCompletedPage: Math.min(completedPages - 1, game.questCompletedPage + 1)
        }, 'questCompletedPageMovedDown');
      }
      setLastKeyTime(now);
    }
    if (keys['ArrowUp'] && game.menuTab === 4) {
      if (game.saveMenuMode === 'slots') {
        patchInputState({ saveSlotSelection: Math.max(0, game.saveSlotSelection - 1) }, 'saveSlotSelectionMovedUp');
      } else {
        patchInputState({ menuSelection: Math.max(0, game.menuSelection - 1) }, 'saveMenuSelectionMovedUp');
      }
      setLastKeyTime(now);
    }
    if (keys['ArrowUp'] && game.menuTab === 5) {
      patchInputState({ settingsSelection: Math.max(0, game.settingsSelection - 1) }, 'settingsSelectionMovedUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown'] && game.menuTab === 4) {
      if (game.saveMenuMode === 'slots') {
        patchInputState({ saveSlotSelection: Math.min(2, game.saveSlotSelection + 1) }, 'saveSlotSelectionMovedDown');
      } else {
        patchInputState({ menuSelection: Math.min(2, game.menuSelection + 1) }, 'saveMenuSelectionMovedDown');
      }
      setLastKeyTime(now);
    }
    if (keys['ArrowDown'] && game.menuTab === 5) {
      patchInputState({ settingsSelection: Math.min(1, game.settingsSelection + 1) }, 'settingsSelectionMovedDown');
      setLastKeyTime(now);
    }
    if (keys['ArrowUp'] && game.menuTab === 2) {
      patchInputState({ itemMenuSelection: Math.max(0, game.itemMenuSelection - 1) }, 'itemMenuSelectionMovedUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown'] && game.menuTab === 2) {
      patchInputState({
        itemMenuSelection: Math.min(game.consumables.length - 1, game.itemMenuSelection + 1)
      }, 'itemMenuSelectionMovedDown');
      setLastKeyTime(now);
    }
    if (keys['Escape'] && game.menuTab === 4 && game.saveMenuMode === 'slots') {
      if (now - lastKeyTime > keyDelay) {
        resetSaveMenuState();
        setLastKeyTime(now);
      }
    }

    if (keys[' '] && game.menuTab === 4) {
      if (now - lastKeyTime > keyDelay) {
        if (game.saveMenuMode === 'actions') {
          if (game.menuSelection === 0) {
            patchInputState({ saveMenuMode: 'slots', saveMenuAction: 'save', saveSlotSelection: 0 }, 'saveModeSaveSelected');
          } else if (game.menuSelection === 1) {
            patchInputState({ saveMenuMode: 'slots', saveMenuAction: 'load', saveSlotSelection: 0 }, 'saveModeLoadSelected');
          } else if (game.menuSelection === 2) {
            patchInputState({ saveMenuMode: 'slots', saveMenuAction: 'delete', saveSlotSelection: 0 }, 'saveModeDeleteSelected');
          }
        } else if (game.saveMenuMode === 'slots' && game.saveMenuAction) {
          if (game.saveMenuAction === 'save') {
            const result = saveGameToLocal(game.saveSlotSelection);
            if (result.success) {
              showSystemMessage(`Saved to slot ${result.slot + 1} (${result.count}/${MAX_LOCAL_SAVES})`);
            } else {
              showSystemMessage('Save failed');
            }
          } else if (game.saveMenuAction === 'load') {
            const result = loadGameFromLocal(game.saveSlotSelection);
            if (result.success) {
              if (game.musicEnabled) {
                startBackgroundMusic();
              } else {
                stopBackgroundMusic();
              }
              showSystemMessage(`Loaded slot ${result.slot + 1}`);
            } else {
              showSystemMessage('No save in that slot');
            }
          } else if (game.saveMenuAction === 'delete') {
            const result = clearLocalSave(game.saveSlotSelection);
            if (result.success) {
              showSystemMessage(`Deleted slot ${result.slot + 1} (${result.count}/${MAX_LOCAL_SAVES})`);
            } else {
              showSystemMessage('No save in that slot');
            }
          }
          resetSaveMenuState();
        }
        setLastKeyTime(now);
      }
    }
    if (keys[' '] && game.menuTab === 2 && game.consumables.length > 0) {
      if (now - lastKeyTime > keyDelay) {
        useItemFromMenu();
        setLastKeyTime(now);
      }
    }
    if (keys[' '] && game.menuTab === 3) {
      if (now - lastKeyTime > keyDelay) {
        actions.gameStatePatched({ questMenuSection: game.questMenuSection === 0 ? 1 : 0 }, 'questMenuSectionToggled');
        setLastKeyTime(now);
      }
    }
    if (keys[' '] && game.menuTab === 5) {
      if (now - lastKeyTime > keyDelay) {
        if (game.settingsSelection === 0) {
          actions.musicToggled();
          if (game.musicEnabled) {
            startBackgroundMusic();
            showSystemMessage('Music: ON');
          } else {
            stopBackgroundMusic();
            showSystemMessage('Music: OFF');
          }
        } else {
          const nextQuality = game.graphicsQuality === 'low' ? 'high' : 'low';
          actions.graphicsQualitySet(nextQuality);
          showSystemMessage(`Graphics: ${nextQuality.toUpperCase()}`);
        }
        setLastKeyTime(now);
      }
    }
  }
}

export function handleBattleState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const battleItemsPerPage = 4;

  if (game.battleState.inSpellMenu) {
    if (keys['ArrowUp']) {
      actions.battleStatePatched({ selectedSpell: Math.max(0, game.battleState.selectedSpell - 1) }, 'battleSpellSelectionUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown']) {
      actions.battleStatePatched({ selectedSpell: Math.min(game.spells.length, game.battleState.selectedSpell + 1) }, 'battleSpellSelectionDown');
      setLastKeyTime(now);
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        executeSpell();
        setLastKeyTime(now);
      }
    }
    if (keys['Escape']) {
      actions.battleStatePatched({ inSpellMenu: false, selectedSpell: 0 }, 'battleSpellMenuClosed');
      setLastKeyTime(now);
    }
  } else if (game.battleState.inItemMenu) {
    const totalPages = Math.max(1, Math.ceil(game.consumables.length / battleItemsPerPage));
    const currentPage = Math.min(game.battleState.itemMenuPage || 0, totalPages - 1);
    const startIdx = currentPage * battleItemsPerPage;
    const pageItems = game.consumables.slice(startIdx, startIdx + battleItemsPerPage);

    if (keys['ArrowUp']) {
      actions.battleStatePatched({ selectedItem: Math.max(0, game.battleState.selectedItem - 1) }, 'battleItemSelectionUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown']) {
      actions.battleStatePatched({ selectedItem: Math.min(pageItems.length, game.battleState.selectedItem + 1) }, 'battleItemSelectionDown');
      setLastKeyTime(now);
    }
    if (keys['ArrowLeft']) {
      if (currentPage > 0) {
        actions.battleStatePatched({ itemMenuPage: currentPage - 1, selectedItem: 0 }, 'battleItemPageMovedLeft');
        setLastKeyTime(now);
      }
    }
    if (keys['ArrowRight']) {
      if (currentPage < totalPages - 1) {
        actions.battleStatePatched({ itemMenuPage: currentPage + 1, selectedItem: 0 }, 'battleItemPageMovedRight');
        setLastKeyTime(now);
      }
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        useItemInBattle();
        setLastKeyTime(now);
      }
    }
    if (keys['Escape']) {
      actions.battleStatePatched({ inItemMenu: false, itemMenuPage: 0, selectedItem: 0 }, 'battleItemMenuClosed');
      setLastKeyTime(now);
    }
  } else {
    if (keys['ArrowUp']) {
      actions.battleStatePatched({ selectedAction: Math.max(0, game.battleState.selectedAction - 1) }, 'battleActionSelectionUp');
      setLastKeyTime(now);
    }
    if (keys['ArrowDown']) {
      actions.battleStatePatched({ selectedAction: Math.min(3, game.battleState.selectedAction + 1) }, 'battleActionSelectionDown');
      setLastKeyTime(now);
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        executeBattleAction();
        setLastKeyTime(now);
      }
    }
  }
}

export function handleShopState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(shopItems.length / itemsPerPage);
  const startIdx = game.shopPage * itemsPerPage;
  const pageItems = shopItems.slice(startIdx, startIdx + itemsPerPage);

  if (keys['ArrowUp']) {
    patchInputState({ shopSelection: Math.max(0, game.shopSelection - 1) }, 'shopSelectionMovedUp');
    setLastKeyTime(now);
  }
  if (keys['ArrowDown']) {
    patchInputState({ shopSelection: Math.min(pageItems.length, game.shopSelection + 1) }, 'shopSelectionMovedDown');
    setLastKeyTime(now);
  }
  if (keys['ArrowLeft']) {
    if (game.shopPage > 0) {
      patchInputState({ shopPage: game.shopPage - 1, shopSelection: 0 }, 'shopPageMovedLeft');
      setLastKeyTime(now);
    }
  }
  if (keys['ArrowRight']) {
    if (game.shopPage < totalPages - 1) {
      patchInputState({ shopPage: game.shopPage + 1, shopSelection: 0 }, 'shopPageMovedRight');
      setLastKeyTime(now);
    }
  }
  if (keys[' ']) {
    if (now - lastKeyTime > keyDelay) {
      const actualSelection = game.shopSelection + (game.shopPage * itemsPerPage);
      if (game.shopSelection === pageItems.length) {
        actions.stateChanged('explore');
        actions.gameStatePatched({ shopOpen: false }, 'shopClosedFromExitSelection');
      } else if (actualSelection < shopItems.length) {
        handleShopPurchase();
      }
      setLastKeyTime(now);
    }
  }
  if (keys['Escape']) {
    actions.stateChanged('explore');
    actions.gameStatePatched({
      shopOpen: false,
      shopPage: 0,
      shopSelection: 0
    }, 'shopClosedFromEscape');
    setLastKeyTime(now);
  }
}

export function handleMagicTrainerState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(magicTraining.length / itemsPerPage);
  const startIdx = game.magicTrainerPage * itemsPerPage;
  const pageItems = magicTraining.slice(startIdx, startIdx + itemsPerPage);

  if (keys['ArrowUp']) {
    patchInputState({ magicTrainerSelection: Math.max(0, game.magicTrainerSelection - 1) }, 'magicTrainerSelectionMovedUp');
    setLastKeyTime(now);
  }
  if (keys['ArrowDown']) {
    patchInputState({ magicTrainerSelection: Math.min(pageItems.length, game.magicTrainerSelection + 1) }, 'magicTrainerSelectionMovedDown');
    setLastKeyTime(now);
  }
  if (keys['ArrowLeft']) {
    if (game.magicTrainerPage > 0) {
      patchInputState({ magicTrainerPage: game.magicTrainerPage - 1, magicTrainerSelection: 0 }, 'magicTrainerPageMovedLeft');
      setLastKeyTime(now);
    }
  }
  if (keys['ArrowRight']) {
    if (game.magicTrainerPage < totalPages - 1) {
      patchInputState({ magicTrainerPage: game.magicTrainerPage + 1, magicTrainerSelection: 0 }, 'magicTrainerPageMovedRight');
      setLastKeyTime(now);
    }
  }

  if (keys[' ']) {
    if (now - lastKeyTime > keyDelay) {
      handleMagicTraining();
      setLastKeyTime(now);
    }
  }
  if (keys['Escape']) {
    actions.stateChanged('explore');
    actions.gameStatePatched({
      magicTrainerOpen: false,
      magicTrainerPage: 0,
      magicTrainerSelection: 0
    }, 'magicTrainerClosedFromEscape');
    setLastKeyTime(now);
  }
}

export function handleYogaState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(yogaTechniques.length / itemsPerPage);
  const startIdx = game.yogaPage * itemsPerPage;
  const pageItems = yogaTechniques.slice(startIdx, startIdx + itemsPerPage);

  if (keys['ArrowUp']) {
    patchInputState({ yogaSelection: Math.max(0, game.yogaSelection - 1) }, 'yogaSelectionMovedUp');
    setLastKeyTime(now);
  }
  if (keys['ArrowDown']) {
    patchInputState({ yogaSelection: Math.min(pageItems.length, game.yogaSelection + 1) }, 'yogaSelectionMovedDown');
    setLastKeyTime(now);
  }
  if (keys['ArrowLeft']) {
    if (game.yogaPage > 0) {
      patchInputState({ yogaPage: game.yogaPage - 1, yogaSelection: 0 }, 'yogaPageMovedLeft');
      setLastKeyTime(now);
    }
  }
  if (keys['ArrowRight']) {
    if (game.yogaPage < totalPages - 1) {
      patchInputState({ yogaPage: game.yogaPage + 1, yogaSelection: 0 }, 'yogaPageMovedRight');
      setLastKeyTime(now);
    }
  }
  if (keys[' ']) {
    if (now - lastKeyTime > keyDelay) {
      const actualSelection = game.yogaSelection + (game.yogaPage * itemsPerPage);
      if (game.yogaSelection === pageItems.length) {
        actions.stateChanged('explore');
        actions.gameStatePatched({ yogaOpen: false }, 'yogaClosedFromExitSelection');
      } else if (actualSelection < yogaTechniques.length) {
        handleYogaTraining();
      }
      setLastKeyTime(now);
    }
  }
  if (keys['Escape']) {
    actions.stateChanged('explore');
    actions.gameStatePatched({
      yogaOpen: false,
      yogaPage: 0,
      yogaSelection: 0
    }, 'yogaClosedFromEscape');
    setLastKeyTime(now);
  }
}

export function handleFoodCartState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  const vendorItems = consumableItems.filter(item => {
    if (!item.vendor || !game.currentVendor) return false;
    return item.vendor.toString().trim().toLowerCase() === String(game.currentVendor).trim().toLowerCase();
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vendorItems.length / itemsPerPage);
  const startIdx = game.foodCartPage * itemsPerPage;
  const pageItems = vendorItems.slice(startIdx, startIdx + itemsPerPage);

  if (keys['ArrowUp']) {
    patchInputState({ foodCartSelection: Math.max(0, game.foodCartSelection - 1) }, 'foodCartSelectionMovedUp');
    setLastKeyTime(now);
  }
  if (keys['ArrowDown']) {
    patchInputState({ foodCartSelection: Math.min(pageItems.length, game.foodCartSelection + 1) }, 'foodCartSelectionMovedDown');
    setLastKeyTime(now);
  }
  if (keys['ArrowLeft']) {
    if (game.foodCartPage > 0) {
      patchInputState({ foodCartPage: game.foodCartPage - 1, foodCartSelection: 0 }, 'foodCartPageMovedLeft');
      setLastKeyTime(now);
    }
  }
  if (keys['ArrowRight']) {
    if (game.foodCartPage < totalPages - 1) {
      patchInputState({ foodCartPage: game.foodCartPage + 1, foodCartSelection: 0 }, 'foodCartPageMovedRight');
      setLastKeyTime(now);
    }
  }
  if (keys[' ']) {
    if (now - lastKeyTime > keyDelay) {
      const actualSelection = game.foodCartSelection + (game.foodCartPage * itemsPerPage);
      if (game.foodCartSelection === pageItems.length) {
        actions.stateChanged('explore');
        actions.gameStatePatched({ foodCartOpen: false }, 'foodCartClosedFromExitSelection');
      } else if (actualSelection < vendorItems.length) {
        handleFoodCartPurchase();
      }
      setLastKeyTime(now);
    }
  }
  if (keys['Escape']) {
    actions.stateChanged('explore');
    actions.gameStatePatched({
      foodCartOpen: false,
      foodCartPage: 0,
      foodCartSelection: 0
    }, 'foodCartClosedFromEscape');
    setLastKeyTime(now);
  }
}

export function handleGameOverState({ keys, now, lastKeyTime, keyDelay, setLastKeyTime }) {
  if (keys[' '] || keys['Enter']) {
    if (now - lastKeyTime > keyDelay) {
      resetGameState();
      stopBackgroundMusic();
      setLastKeyTime(now);
    }
  }
}