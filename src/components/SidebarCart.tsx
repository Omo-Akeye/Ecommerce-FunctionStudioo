import { motion, AnimatePresence } from 'framer-motion';
import emptyCartImg from '../assets/emptycart.png';
import { CartItem, formatPrice } from '../components/CartItem';
import { itemsInfo } from '../data';
import { getTotalPrice, getIsCartEmpty } from '../cartUtils';

export interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { [key: string]: number };
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const SidebarCart = ({ isOpen, onClose, cart, updateQty, clearCart }: SidebarCartProps) => {
  const totalPrice = getTotalPrice(cart);
  const isCartEmpty = getIsCartEmpty(cart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
         
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pointer-events-auto"
            style={{
              background: 'linear-gradient(271.54deg, rgba(33, 36, 30, 0.85) 0%, #151713 100%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />

     
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed left-8 bottom-8 max-xl:bottom-6 right-129 max-w-7xl z-45 pointer-events-none hidden md:block"
          >
            <p className="text-[#FFFFFFA3] text-xs font-sans font-light leading-relaxed text-left tracking-[-6%]">
              Since 1925, we've believed that true luxury is never rushed—it is patiently shaped, refined, and perfected over generations. Every curve is intentional, every material carefully chosen, and every detail crafted to stand the test of time. Rooted in Italy's rich design heritage, our collections celebrate the harmony of timeless craftsmanship and contemporary living. More than furniture, each piece carries a legacy of artistry, bringing warmth, elegance, and enduring character into the homes where life's most meaningful moments unfold.
            </p>
          </motion.div>

          {/* Sidebar Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-121 max-w-full z-50 border-l border-[#FFFFFF29] flex flex-col text-white pointer-events-auto"
            style={{ backgroundColor: '#30332D' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="pb-6.5 pt-10 px-7.25 flex justify-between items-center border-b border-[#FFFFFF29]">
              <h3 className="text-2xl font-semibold tracking-[-6%] font-sans text-white">
                Proceed to checkout
              </h3>
              <div className="flex items-center gap-3">
                {/* Clear Cart Button & Tooltip */}
                {!isCartEmpty && (
                  <div className="relative flex flex-col items-center group">
                    <button
                      onClick={clearCart}
                      className="text-white hover:text-[#FEEC04] transition-colors duration-200 cursor-pointer p-1"
                      aria-label="Clear cart"
                    >
                      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.1328 22.8449C20.6653 21.6418 19.25 19.0627 19.25 15.7574V13.8674C19.251 13.5168 19.1461 13.174 18.9493 12.8839C18.7524 12.5937 18.4726 12.3697 18.1464 12.241L15.4219 11.1626C15.2075 11.0768 15.0358 10.9099 14.944 10.698C14.8522 10.4862 14.8479 10.2467 14.9319 10.0316L17.2638 4.23476C17.422 3.85429 17.5019 3.44579 17.4985 3.03373C17.4952 2.62167 17.4087 2.21452 17.2443 1.83667C17.0799 1.45882 16.8409 1.11804 16.5417 0.834729C16.2424 0.551419 15.8891 0.331412 15.5028 0.187882C14.7505 -0.0877814 13.9203 -0.0591803 13.1887 0.267607C12.4571 0.594394 11.8818 1.1936 11.585 1.93788C11.5846 1.94225 11.5846 1.94664 11.585 1.95101L9.28596 7.77194C9.20045 7.9873 9.03302 8.15994 8.82039 8.252C8.60776 8.34407 8.36729 8.34804 8.15174 8.26304L5.37143 7.13101C5.05087 7.00111 4.69884 6.96982 4.36039 7.04113C4.02195 7.11244 3.71248 7.28312 3.47159 7.53132C1.16815 9.89929 2.23674e-05 12.6665 2.23674e-05 15.7563C-0.00603094 18.9183 1.21679 21.9588 3.41033 24.2362C3.49252 24.3221 3.59135 24.3903 3.7008 24.4368C3.81024 24.4832 3.928 24.5069 4.0469 24.5063H22.75C22.9478 24.5061 23.1397 24.4389 23.2944 24.3157C23.449 24.1925 23.5574 24.0205 23.6018 23.8278C23.6462 23.6351 23.6241 23.433 23.5389 23.2545C23.4537 23.076 23.3106 22.9316 23.1328 22.8449ZM4.71846 8.75632L7.49768 9.88288C7.81849 10.0112 8.16148 10.075 8.50698 10.0705C8.85247 10.0659 9.19368 9.99327 9.51103 9.8566C9.82838 9.71992 10.1156 9.52194 10.3563 9.27401C10.5969 9.02607 10.7863 8.73306 10.9135 8.41179L13.2103 2.61491C13.4903 1.94663 14.2461 1.60101 14.898 1.84929C15.0642 1.91095 15.2162 2.00564 15.3448 2.12764C15.4734 2.24964 15.5759 2.39643 15.6462 2.55915C15.7166 2.72187 15.7532 2.89715 15.7539 3.07441C15.7547 3.25167 15.7195 3.42725 15.6505 3.59054L13.3099 9.38632C13.0536 10.0328 13.0644 10.7546 13.3398 11.3931C13.6152 12.0317 14.1327 12.5349 14.7788 12.7923L17.5 13.8674V15.7563C17.5 15.7924 17.5 15.8285 17.5 15.8657L3.47487 10.2559C3.84773 9.72287 4.26366 9.22135 4.71846 8.75632ZM9.96846 22.7563C8.66571 21.5067 7.74282 19.9142 7.30627 18.1626C7.24543 17.941 7.0999 17.7523 6.9011 17.6371C6.7023 17.522 6.46618 17.4896 6.24373 17.5471C6.02129 17.6045 5.83035 17.7471 5.71217 17.9442C5.59398 18.1412 5.55802 18.3768 5.61205 18.6001C5.9937 20.107 6.67683 21.5208 7.62018 22.7563H4.42315C2.69741 20.8337 1.74509 18.3399 1.75002 15.7563C1.73932 14.3875 2.02787 13.0328 2.59549 11.7871L17.6674 17.8159C17.9955 19.7846 18.8224 21.4777 20.0616 22.7552L9.96846 22.7563Z" fill="currentColor"/>
                      </svg>
                    </button>
                    {/* Yellow pill tooltip */}
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-[#FEEC04] text-[#1C1A1B] text-[11px] font-sans font-bold py-1.5 px-4 rounded-full shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
           
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FEEC04] rotate-45" />
                      <span className="relative z-10">Clear cart</span>
                    </div>
                  </div>
                )}
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="text-white hover:text-white/70 transition-colors duration-200 cursor-pointer p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 1L17 17M17 1L1 17" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              {isCartEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6 overflow-hidden rounded-[87.33px] " style={{ width: '262px', height: '175px' }}>
                    <img
                      src={emptyCartImg}
                      alt="Your cart is empty"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-[19px] font-normal mb-2 tracking-wide font-sans">
                    Your cart is empty
                  </p>
                  <button
                    onClick={onClose}
                    className="text-[#FEEC04] text-[13px] underline underline-offset-4 cursor-pointer hover:text-yellow-300 transition-colors font-medium font-sans"
                  >
                    View collections
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {Object.entries(cart).map(([id, qty]) => {
                    if (qty <= 0) return null;
                    const itemInfo = itemsInfo[id];
                    if (!itemInfo) return null;
                    return (
                      <CartItem
                        key={id}
                        item={itemInfo}
                        qty={qty}
                        onDecrement={() => updateQty(id, -1)}
                        onIncrement={() => updateQty(id, 1)}
                      />
                    );
                  })}
                </div>
              )}
           
            </div>

            {/* Footer */}
            <footer>

             {!isCartEmpty && (
                <div className="p-4 font-sans text-center text-[#FFFFFF8F] text-xs tracking-[-4%]  font-medium">
                  Free Shipping In Italy. Taxes Are Calculated At Next Step
                </div>
              )}
            <div className="px-7.25 py-8.5 bg-[#21241E] border-t border-[#FFFFFF29] flex items-center justify-between">
              <div className="font-serif italic text-[32px] leading-[100%] tracking-[-2%] text-white font-normal">
                {formatPrice(totalPrice)}
              </div>
              <div className="flex items-center gap-4">
           
                {isCartEmpty ? (
                  <button
                    disabled
                    className="w-26.75 h-9.5 flex items-center justify-center bg-[#FEEC04] text-[#1C1A1B] underline font-sans font-medium text-xs tracking-wider rounded-[20px] cursor-not-allowed select-none opacity-[0.12] shadow-lg"
                  >
                    CHECKOUT
                  </button>
                ) : (
                  <button className="w-26.75 h-9.5 flex items-center justify-center bg-[#FEEC04] text-[#1C1A1B] underline font-sans font-medium text-xs tracking-wider rounded-[20px] hover:bg-yellow-300 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg">
                    CHECKOUT
                  </button>
                )}
              </div>
            </div>
              </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
