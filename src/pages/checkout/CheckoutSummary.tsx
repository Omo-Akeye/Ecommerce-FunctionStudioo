import { itemsInfo } from '../../data';

interface CheckoutSummaryProps {
  cart: { [key: string]: number };
}

export const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  const cartItemKeys = Object.keys(cart);
  const hasItems = cartItemKeys.length > 0;

  const displayItems = hasItems
    ? cartItemKeys.map((key) => ({ ...itemsInfo[key], qty: cart[key] }))
    : [{ ...itemsInfo.chair, qty: 2 }];

  const subtotal = displayItems.reduce((accumulator, item) => accumulator + item.price * item.qty, 0);
  const shipping = 60.0;
  const total = subtotal + shipping;

  return (
    <div className="w-full mt-10 lg:mt-0 relative">
      <div className="bg-cart-btn rounded-4xl p-8 sticky top-8">
        <div className="flex flex-col gap-6 mb-8">
          {displayItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">

                    <img
                      src={item.image || item.mainImage}
                      alt={item.title}
                      className="max-w-20 w-full max-h-full object-contain "
                    />
           
                  <div className="absolute -top-2 -right-2 bg-custom text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.qty}
                  </div>
                </div>
                <span className="text-base text-gray-200 max-w-37.5">{item.title}</span>
              </div>
              <span className="text-base">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Discount code"
            className="flex-1 bg-ash text-white px-6 py-4 rounded-full focus:outline-none focus:ring-1 focus:ring-custom/50 placeholder-gray-400"
          />
          <button className="bg-ash hover:bg-stone text-gray-300 hover:text-white px-8 py-4 rounded-full transition-colors cursor-pointer font-medium">
            APPLY
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm mb-6 pb-6 border-b border-gray-600/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Shipping</span>
            <span className="font-medium">${shipping.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};