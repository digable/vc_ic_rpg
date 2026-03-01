// World & Map Module
import { game, actions } from '../../game-state.js';

export function openFoodCart(vendor) {
  actions.currentVendorSet(vendor);
  actions.vendorScreenOpened('food_cart', 'foodCartOpen', {
    foodCartSelection: 0
  });
}
