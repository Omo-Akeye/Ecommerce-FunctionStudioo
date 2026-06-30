export interface CartItemData {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  mainImage: string;
}

export interface CartItemProps {
  item: CartItemData;
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
}
