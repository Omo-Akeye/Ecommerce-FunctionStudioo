import { motion, AnimatePresence } from 'framer-motion';
import chairImg from './assets/chair.png';
import consoleImg from './assets/console.png';
import frameImg from './assets/frame.png';
import stoodImg from './assets/stood.png';
import emptyCartImg from './assets/emptycart.png';

export interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { [key: string]: number };
  updateQty: (id: string, delta: number) => void;
}

const itemsInfo: {
  [key: string]: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  };
} = {
  chair: {
    id: 'chair',
    title: 'Atelier Elowen Venta Chair',
    description: 'A contemporary Italian lounge chair featuring premium upholstery, plush cushioning, and sleek black wooden legs for exceptional comfort and timeless style.',
    price: 1200,
    image: chairImg,
  },
  vase: {
    id: 'vase',
    title: 'Basso Uno Stood',
    description: 'A Handcrafted Ceramic Vase With An Organic Textured Surface, A Warm Matte Finish, And Sophisticated Silhouettes Perfect For Modern Accents.',
    price: 550,
    image: stoodImg,
  },
  frame: {
    id: 'frame',
    title: 'Milano Linea Framento',
    description: 'A Minimalist Fine Art Frame Featuring A Solid Oak Border, Museum-Grade Acrylic Glazing, And Elegant Mount Details.',
    price: 400,
    image: frameImg,
  },
  table: {
    id: 'table',
    title: 'Vetra Console',
    description: 'A minimalist Italian TV console with a matte white finish, open shelving, concealed storage, and elegant gold metal legs.',
    price: 2500,
    image: consoleImg,
  },
};

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export const SidebarCart = ({ isOpen, onClose, cart, updateQty }: SidebarCartProps) => {
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = itemsInfo[id];
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const isCartEmpty = Object.values(cart).reduce((sum, qty) => sum + qty, 0) === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay with custom gradient background */}
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

          {/* Bottom text on the overlay */}
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
              <button
                onClick={onClose}
                className="text-white hover:text-white/70 transition-colors duration-200 cursor-pointer p-1"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 1L17 17M17 1L1 17" strokeLinecap="round" />
                </svg>
              </button>
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
                      <div key={id} className="pt-8.25 px-8 pb-7.5 border-b border-[#FFFFFF29] flex flex-col">
                        <h4 className="text-white text-lg font-medium mb-4.5 text-left">
                          {itemInfo.title}
                        </h4>
                        <div className="w-full flex justify-center mb-6.5">
                          <img
                            src={itemInfo.image}
                            alt={itemInfo.title}
                            className="max-h-26 w-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-[#FFFFFF8F] font-light tracking-[-4%] mb-4 text-left">
                          {itemInfo.description}
                        </p>
                        <div className="text-white font-serif italic text-2xl mb-3 text-left">
                          {formatPrice(itemInfo.price)}
                        </div>
                        <div className="flex items-center gap-4.5 text-left">
                          <button
                            onClick={() => updateQty(id, -1)}
                            className="w-8 h-8 rounded-full bg-[#21241E] hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer text-lg font-medium select-none"
                          >
                            &minus;
                          </button>
                          <span className="text-white text-lg font-medium select-none w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQty(id, 1)}
                            className="w-8 h-8 rounded-full bg-[#21241E] hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer text-lg font-medium select-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
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
