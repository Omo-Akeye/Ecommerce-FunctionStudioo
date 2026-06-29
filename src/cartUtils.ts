import { itemsInfo } from './data';

export type Cart = { [id: string]: number };

// Total number of items across all products
export const getCartCount = (cart: Cart): number =>
  Object.values(cart).reduce((sum, qty) => sum + qty, 0);

// Whether the cart has no items at all
export const getIsCartEmpty = (cart: Cart): boolean =>
  getCartCount(cart) === 0;

// Total price across all cart lines
export const getTotalPrice = (cart: Cart): number =>
  Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = itemsInfo[id];
    return sum + (item ? item.price * qty : 0);
  }, 0);

// Return a new cart with one more of `id`
export const addItem = (cart: Cart, id: string): Cart => ({
  ...cart,
  [id]: (cart[id] || 0) + 1,
});

// Return a new cart with qty of `id` changed by `delta` (min 0)
export const updateItem = (cart: Cart, id: string, delta: number): Cart => ({
  ...cart,
  [id]: Math.max(0, (cart[id] || 0) + delta),
});

// Return an empty cart
export const clearItems = (): Cart => ({});
