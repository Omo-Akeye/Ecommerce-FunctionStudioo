import { itemsInfo } from './data';

export type Cart = { [id: string]: number };


export const getCartCount = (cart: Cart): number =>
  Object.values(cart).reduce((sum, qty) => sum + qty, 0);


export const getIsCartEmpty = (cart: Cart): boolean =>
  getCartCount(cart) === 0;


export const getTotalPrice = (cart: Cart): number =>
  Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = itemsInfo[id];
    return sum + (item ? item.price * qty : 0);
  }, 0);


export const addItem = (cart: Cart, id: string): Cart => ({
  ...cart,
  [id]: (cart[id] || 0) + 1,
});


export const updateItem = (cart: Cart, id: string, delta: number): Cart => ({
  ...cart,
  [id]: Math.max(0, (cart[id] || 0) + delta),
});


export const clearItems = (): Cart => ({});

const STORAGE_KEY = 'ecommerce_cart';


export const loadCart = (): Cart => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cart) : {};
  } catch {
    return {};
  }
};


export const saveCart = (cart: Cart): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};
