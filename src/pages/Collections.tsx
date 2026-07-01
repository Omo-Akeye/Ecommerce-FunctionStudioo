import { useState, useCallback } from 'react';
import { motion} from 'framer-motion';
import { Link } from 'react-router';
import { itemsInfo } from '../data';
import logo from '../assets/logo.png';
import { getCartCount } from '../cartUtils';
import featured from '../assets/featured.png';
import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Toast } from '../components/Toast';

interface ToastItem { id: string; message: string; }

interface CollectionsProps {
  cart: { [key: string]: number };
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (id: string) => void;
}

export const Collections = ({
  cart,
  setIsCartOpen,
  addToCart,
}: CollectionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const cartCount = getCartCount(cart);

  const addToast = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);







  const products = Object.values(itemsInfo);


  const featuredProduct = itemsInfo.chair;

  return (
    <div className="min-h-screen bg-[#30332D] text-white font-sans pb-12 overflow-x-hidden">
      <Toast toasts={toasts} onDismiss={dismissToast} />
      


 {/* <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[1663px] mx-auto px-8 pt-8 pb-4 flex justify-between items-center bg-[#30332D]/90 backdrop-blur-md"> */}
      <header className=" max-w-415.75 mx-auto px-8 pt-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img src={logo} alt="Lavis" className="w-28 h-auto" />
        </Link>

     
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium  text-white">
          <span className="text-custom cursor-default ">COLLEZIONE AUREA</span>
          <span className="hover:text-custom cursor-pointer transition-colors duration-200">COLLEZIONE BELLAVISTA</span>
          <span className="hover:text-custom cursor-pointer transition-colors duration-200">COLLEZIONE MILANO</span>
          <span className="hover:text-custom cursor-pointer transition-colors duration-200">COLLEZIONE RINASCIMENTO</span>
        </nav>

    
        <div className="flex items-center">
        
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 text-white hover:text-custom transition-colors duration-200 cursor-pointer"
          >
           <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.7675 5.35875C26.6736 5.24642 26.5562 5.15607 26.4236 5.09408C26.291 5.03209 26.1464 4.99998 26 5H5.835L5.075 0.82125C5.03314 0.590834 4.91174 0.382419 4.73196 0.232339C4.55218 0.0822584 4.32544 3.38465e-05 4.09125 0H1C0.734783 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734783 2 1 2H3.25L6.445 19.5362C6.53911 20.0563 6.76895 20.5423 7.11125 20.945C6.63881 21.3863 6.29781 21.9498 6.12607 22.573C5.95433 23.1962 5.95856 23.8549 6.13829 24.4759C6.31801 25.0968 6.66621 25.6559 7.14428 26.0911C7.62235 26.5263 8.2116 26.8205 8.8467 26.9412C9.48179 27.062 10.1379 27.0044 10.7423 26.775C11.3467 26.5456 11.8758 26.1533 12.2708 25.6416C12.6658 25.1299 12.9114 24.5187 12.9804 23.8759C13.0493 23.2332 12.9388 22.5838 12.6612 22H18.3387C18.115 22.4684 17.9993 22.981 18 23.5C18 24.1922 18.2053 24.8689 18.5899 25.4445C18.9744 26.0201 19.5211 26.4687 20.1606 26.7336C20.8001 26.9985 21.5039 27.0678 22.1828 26.9327C22.8617 26.7977 23.4854 26.4644 23.9749 25.9749C24.4644 25.4854 24.7977 24.8617 24.9327 24.1828C25.0678 23.5039 24.9985 22.8001 24.7336 22.1606C24.4687 21.5211 24.0201 20.9744 23.4445 20.5899C22.8689 20.2053 22.1922 20 21.5 20H9.39625C9.16206 20 8.93532 19.9177 8.75554 19.7677C8.57576 19.6176 8.45436 19.4092 8.4125 19.1787L8.01625 17H22.5162C23.2188 16.9999 23.8991 16.7532 24.4384 16.303C24.9777 15.8527 25.3419 15.2275 25.4675 14.5362L26.9875 6.17875C27.0132 6.0343 27.0069 5.88596 26.9688 5.74424C26.9308 5.60253 26.8621 5.47092 26.7675 5.35875ZM11 23.5C11 23.7967 10.912 24.0867 10.7472 24.3334C10.5824 24.58 10.3481 24.7723 10.074 24.8858C9.79994 24.9993 9.49833 25.0291 9.20736 24.9712C8.91639 24.9133 8.64912 24.7704 8.43934 24.5607C8.22956 24.3509 8.0867 24.0836 8.02882 23.7926C7.97094 23.5017 8.00065 23.2001 8.11418 22.926C8.22771 22.6519 8.41997 22.4176 8.66664 22.2528C8.91332 22.088 9.20333 22 9.5 22C9.89782 22 10.2794 22.158 10.5607 22.4393C10.842 22.7206 11 23.1022 11 23.5ZM23 23.5C23 23.7967 22.912 24.0867 22.7472 24.3334C22.5824 24.58 22.3481 24.7723 22.074 24.8858C21.7999 24.9993 21.4983 25.0291 21.2074 24.9712C20.9164 24.9133 20.6491 24.7704 20.4393 24.5607C20.2296 24.3509 20.0867 24.0836 20.0288 23.7926C19.9709 23.5017 20.0006 23.2001 20.1142 22.926C20.2277 22.6519 20.42 22.4176 20.6666 22.2528C20.9133 22.088 21.2033 22 21.5 22C21.8978 22 22.2794 22.158 22.5607 22.4393C22.842 22.7206 23 23.1022 23 23.5ZM23.5 14.1787C23.458 14.4098 23.3361 14.6187 23.1555 14.7689C22.975 14.919 22.7473 15.0008 22.5125 15H7.6525L6.19875 7H24.8012L23.5 14.1787Z" fill="white"/>
</svg>

            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-custom text-black text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full"
              >
                {cartCount}
              </motion.div>
            )}
          </button>
        </div>
      </header>

     
      <main className="max-w-7xl mx-auto  mt-[14.1%] relative z-10">
        
   
        <section className="max-w-264.25 mb-18.5 flex flex-col items-center text-center mx-auto">
          <h1 className="text-white text-[116px] max-md:text-[50px] font-sans font-semibold leading-[100%] tracking-[-0.06em] uppercase mb-8 shrink-0 whitespace-nowrap">
            COLLEZIONE AUREA
          </h1>
          <p className="text-white text-xl font-medium leading-[20.84px] mb-6">
            Inspired by the <span className="text-custom">"Golden Ratio"</span> symbolizing perfect proportions and timeless design.
          </p>
          <div className="text-[#FFFFFFA3] text-sm leading-5.5 text-left flex flex-col w-full">
  <p>
    Some collections are designed for a season. Others are designed for a lifetime. Collezione Aurea was born from an enduring Italian belief: that beauty lies in perfect proportion. Inspired by the Golden Ratio—known in Italy as la proporzione aurea, the collection celebrates harmony between form, function, and emotion. Its story begins in the workshops of Northern Italy, where master craftsmen have spent generations refining the art of furniture making. Here, every curve is drawn with intention, every material selected for its character, and every finish applied by hand with patience that cannot be rushed. The result is not simply furniture, but objects that feel as though they have always belonged.
  </p>

  <motion.div
    initial={false}
    animate={{
      height: isExpanded ? 'auto' : 0,
      opacity: isExpanded ? 1 : 0,
      marginTop: isExpanded ? 16 : 0,
    }}
    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
    className="overflow-hidden flex flex-col gap-4"
  >
    <p>
      Warm oak, refined stone, brushed metals, luxurious fabrics, and sculptural silhouettes come together in quiet balance. Nothing demands attention, yet every piece commands admiration. It is a collection designed to age beautifully, growing richer with every passing year and every memory created around it.
    </p>
    <p>
      Whether it's the chair that welcomes your morning coffee, the console that anchors your living space, or the artwork that quietly defines a room, each piece contributes to a home where elegance is lived rather than displayed.
    </p>
    <p>
      Collezione Aurea is more than a collection. It is a philosophy of timeless Italian living—where craftsmanship meets contemporary design, where simplicity becomes luxury, and where every detail exists in perfect harmony.
    </p>
    <p>
      Because true perfection isn't about excess.
      <br />
      It's about balance.
    </p>
  </motion.div>

  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="text-custom cursor-pointer self-start hover:underline focus:outline-none"
  >
    {isExpanded ? 'Show less' : 'Show more'}
  </button>
</div>
        </section>

      </main>
     
           <section className="mb-21.5 max-w-415.75 relative rounded-[20px] mx-8 min-[1700px]:mx-auto px-12.25 py-15.25 bg-cart-btn max-h-133 flex items-center justify-between">
 

            <main className="flex flex-col md:flex-row items-center justify-between xl:gap-10 gap-8">

          
          
            <div className="min-[1380px]:max-w-89 max-w-75 h-auto flex flex-col items-center justify-center relative">
              <motion.img
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                src={featuredProduct.mainImage}
                alt={featuredProduct.title}
                className="min-[1380px]:max-w-89 max-w-75 h-full object-contain hover:scale-105 transition-transform duration-500"
              />
               <p className="text-[#FFFFFFB8] text-xs mt-5 tracking-wider uppercase font-medium">
                  {featuredProduct.title}
                </p>
            </div>

            <div className=" pointer-events-none">
              <h2 className="font-serif italic font-normal min-[1380px]:text-[173.38px] text-[120px] leading-[80%] tracking-[-0.04em] text-white select-none ">
                feel <br />timeless <br />comfort
              </h2>
            </div>
              </main>

     
            <div className="self-stretch flex flex-col items-end justify-between w-full py-2">
              
          
              <div className="min-[1380px]:w-100.25 max-w-[80%]  cursor-pointer group transition-all duration-300 relative overflow-hidden">
             <img src={featured} alt="featured product" />
              </div>

           
              <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
               
                <p className="text-custom font-serif text-[40px] tracking-[-0.04em]">
                  ${featuredProduct.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(featuredProduct.id)}
                  className="w-37 h-14 bg-custom hover:bg-yellow-300 text-black text-lg px-3 font-semibold  py-4 underline rounded-full transition-all duration-300 cursor-pointer  hover:shadow-yellow-400/10 hover:scale-105 active:scale-95 uppercase"
                >
                  ADD TO CART
                </button>
              </div>

            </div>

       
        </section>


  
        <section className="mb-24 max-w-360 mx-auto px-8">
      
          
         


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map((prod, index) => (
    <motion.div
      key={prod.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center p-8 h-full transition-all duration-300"
    >
     
      <div className="h-92.5 flex items-center justify-center mb-14 relative w-full">
        <img
          src={prod.mainImage}
          alt={prod.title}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>


      <h3 className="text-white text-2xl font-medium text-center px-2 mb-4">
        {prod.title}
      </h3>

    
      <div className="mt-auto flex flex-col items-center w-full">
        <p className="text-white font-serif text-3xl font-light italic mb-4 tracking-[-2%]">
          ${prod.price.toFixed(2)}
        </p>

        <button
          onClick={() => { addToCart(prod.id); addToast(`${prod.title} added to cart`); }}
          className="bg-custom hover:bg-yellow-300 text-black  font-semibold underline  px-5 py-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 uppercase"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  ))}
</div>

        </section>

   
      <footer className="border-t border-white/5 pt-16 max-w-415.75 mx-auto px-8">

        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          
    
          <div className="xl:max-w-278.25 max-w-[70%]">
            <p className="text-[#FFFFFFA3] text-xs font-medium  text-left tracking-[-6%]">
              Since 1925, Venus believed that true luxury is never rushed—it is patiently shaped, refined, and perfected over generations. Every curve is intentional, every material carefully chosen, and every detail crafted to stand the test of time. Rooted in Italy's rich design heritage, our collections celebrate the harmony of timeless craftsmanship and contemporary living. More than furniture, each piece carries a legacy of history, elegance, and enduring character into the homes where life's most meaningful moments unfold.
            </p>
          </div>

      
          <div className="text-left md:text-right text-white text-xs tracking-wide leading-relaxed uppercase">
            <p className="font-semibold text-white/80">WESTON</p>
            <p>10 SUNTRACT ROAD, TORONTO, ON</p>
            <p>MONOPHONE NUMBER:   <a href="tel:4162438300" className="underline underline-offset-4 hover:text-custom transition-colors duration-200">
              416-243-8300
            </a>
            </p>
          
          </div>

        </div>

     
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px] text-white/30">
          
         
          <div className="flex items-center gap-4">
            <img src={logo} alt="Lavis" className="w-33 h-auto hover:grayscale-0 transition-all duration-300" />
            <p className="text-white text-xs">© 2026 Lavis. All rights reserved.</p>
          </div>

        
          <div className="flex items-center gap-5">
            <span className="text-white cursor-pointer transition-colors duration-250" title="TikTok"><FaTiktok size={20} /></span>
            <span className="text-white cursor-pointer transition-colors duration-250" title="Instagram"><FaInstagram size={20} /></span>
            <span className="text-white cursor-pointer transition-colors duration-250" title="Facebook"><FaFacebookF size={20} /></span>
            <span className="text-white cursor-pointer transition-colors duration-250" title="LinkedIn"><FaLinkedinIn size={20} /></span>
          </div>

        </div>

      </footer>

    </div>
  );
};
