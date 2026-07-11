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
      <div className="bg-cart-btn rounded-[22px] py-8 px-9 sticky top-8">
        <div className="flex flex-col gap-6 mb-6">
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
                <span className="text-sm text-white max-w-[200px] font-medium">{item.title}</span>
              </div>
              <span className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Discount code"
            className="flex-1 bg-ash text-white p-3.5 rounded-full focus:outline-none focus:ring-1 focus:ring-custom/50 placeholder-gray-400"
          />
          <button className="bg-[#FEEC04] underline hover:bg-stone text-black hover:text-white py-3.5 px-[30px] rounded-full transition-colors cursor-pointer font-medium">
            APPLY
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm mb-6 pb-6 border-b border-gray-600/50">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm font-medium">Subtotal</span>
            <span className="font-medium text-sm">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm font-medium">Shipping</span>
            <span className="font-medium text-sm">${shipping.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-medium">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};