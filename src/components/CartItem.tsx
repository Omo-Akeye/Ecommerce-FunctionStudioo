import type { CartItemProps } from "../types";


export const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

export const CartItem = ({ item, qty, onIncrement, onDecrement }: CartItemProps) => {
  const isTable = item.id === 'table';

  return (
    <div className="pt-8.25 px-8 pb-7.5 border-b border-cart-border flex flex-col">

      <h4 className="text-white text-lg font-medium mb-4.5 text-left">
        {item.title}
      </h4>

  
      <div className="w-full flex justify-center mb-6.5">
        <img
          src={item.image}
          alt={item.title}
          className={isTable ? '' : 'max-h-26 w-full object-contain'}
          style={
            isTable
              ? { width: '130px', height: '49px', objectFit: 'contain' }
              : undefined
          }
        />
      </div>

     
      <p className="text-sm text-cart-text font-light tracking-[-4%] mb-4 text-left">
        {item.description}
      </p>

  
      <div className="text-white font-serif italic text-2xl mb-3 text-left">
        {formatPrice(item.price)}
      </div>

    
      <div className="flex items-center gap-4.5 text-left">
        <button
          onClick={onDecrement}
          className="w-8 h-8 rounded-full bg-cart-btn hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer text-lg font-medium select-none"
          aria-label={`Decrease quantity of ${item.title}`}
        >
          &minus;
        </button>

        <span className="text-white text-lg font-medium select-none w-4 text-center">
          {qty}
        </span>

        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-full bg-cart-btn hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer text-lg font-medium select-none"
          aria-label={`Increase quantity of ${item.title}`}
        >
          +
        </button>
      </div>
    </div>
  );
};
