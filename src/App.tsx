import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from './assets/bg.png';
import bg2 from './assets/bg2.png';
import logo from './assets/logo.png';

const Hotspot = ({
  top,
  left,
  alignRight = false,
  onAddToCart,
  onClick,
  onHover,
  onLeave,
}: {
  top: string;
  left: string;
  alignRight?: boolean;
  onAddToCart: () => void;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute z-20"
      style={{ top, left }}
      onClick={() => {
        setIsActive(!isActive);
        onClick();
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onLeave?.();
      }}
    >
      {/* Pulsing Dot */}
      <div className="relative flex items-center justify-center cursor-pointer group">
        <div className="absolute w-8 h-8 bg-yellow-400 rounded-full opacity-40 animate-ping"></div>
        <div className="relative w-4 h-4 bg-white border-2 border-yellow-400 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125"></div>

        {/* Add to Cart Tooltip */}
        <AnimatePresence>
          {(isActive || isHovered) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: alignRight ? 16 : -16, y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: alignRight ? 24 : -24, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: alignRight ? 16 : -16, y: '-50%' }}
              transition={{ duration: 0.2 }}
              className={`absolute top-1/2 w-38.75 bg-[#0000008F] backdrop-blur-[7.61px] text-black p-4 rounded-[57px] ${alignRight ? 'left-4' : 'right-4'
                }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                  setIsActive(false);
                  setIsHovered(false);
                }}
                className="w-full  text-white text-[10px] tracking-wider font-bold py-2  transition-colors duration-200 cursor-pointer">
                ADD TO CART
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Updated GrainEffect component to match bg-grain.html exactly
const GrainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Target the specific background div that wraps the canvas
    const parent = canvas.parentElement;
    if (!parent) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    const renderGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w > 0 && h > 0) {
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = (Math.random() * 255) | 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      animationFrameId = requestAnimationFrame(renderGrain);
    };

    // ResizeObserver correctly mimics tracking the image width/height 
    // dynamically, similar to img.onload and window resize in the HTML file
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    
    resizeObserver.observe(parent);
    
    resize();
    renderGrain();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        mixBlendMode: 'soft-light',
        opacity: 0.28,
      }}
    />
  );
};

const App = () => {
  // Layout States
  const [isSplit, setIsSplit] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const displayItem = hoveredItem || selectedItem;

  const items = {
    chair: { id: 'chair', title: "ATELIER ELOWEN", subtitle: "VENTA CHAIR", price: "$1200" },
    vase: { id: 'vase', title: "BASSO UNO", subtitle: "", price: "$550" },
    frame: { id: 'frame', title: "MILANO LINEA", subtitle: "", price: "$400" },
    table: { id: 'table', title: "Vetra Console", subtitle: "", price: "$2500" },
  };

  // Alignment Parameters (Adjustable via debug panel)
  const [leftOffset, setLeftOffset] = useState(-2);
  const [rightOffset, setRightOffset] = useState(-7);
  const [aspectLeft, setAspectLeft] = useState(1.193);
  const [aspectRight, setAspectRight] = useState(1.412);

  // Hotspot Positions (Adjustable via debug panel)
  const [chairX, setChairX] = useState(55.2);
  const [chairY, setChairY] = useState(53.3);
  const [vaseX, setVaseX] = useState(31.8);
  const [vaseY, setVaseY] = useState(45.0);
  const [frameX, setFrameX] = useState(42.8);
  const [frameY, setFrameY] = useState(23.0);
  const [tableX, setTableX] = useState(17.8);
  const [tableY, setTableY] = useState(59.3);

  // Calculate default split percentage dynamically based on screen width/height
  const [defaultSplit, setDefaultSplit] = useState(28.5);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // The right image (bg.png) has width = aspectRight * height
      // To align it to the right edge, its left edge is at (w - aspectRight * h)
      // The split seam as a percentage of width is:
      const defaultSplitPercent = ((w - aspectRight * h) / w) * 100;

      // Clamp between 15% and 40% to preserve look on extreme screens
      setDefaultSplit(Math.max(15, Math.min(40, defaultSplitPercent)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [aspectRight]);

  // Seam position based on split state
  const splitPercent = isSplit ? 50 : defaultSplit;

  // Toggle debug panel with 'd' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#060606] font-sans overflow-hidden select-none">

      {/* Background Panels */}
      <div className="absolute inset-0 z-0">

        {/* Left Panel Container (0% to splitPercent%) */}
        <motion.div
          className="absolute left-0 top-0 h-full overflow-hidden border-r border-yellow-400/20"
          animate={{ width: `${splitPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          {/* Left Background Image (bg2.png) */}
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bg2})`,
              backgroundSize: 'auto 100%',
              width: `calc(${aspectLeft} * 100vh)`,
              right: `${leftOffset}px`,
            }}
          >
            {/* Grain Overlay - Sized directly to this specific div */}
            <GrainEffect />

            {/* Mirroring Hotspots on Left Image */}
            <Hotspot
              top={`${chairY}%`}
              left={`${100 - chairX}%`}
              alignRight={true}
              onClick={() => setSelectedItem(items.chair)}
              onHover={() => setHoveredItem(items.chair)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${vaseY}%`}
              left={`${100 - vaseX}%`}
              alignRight={true}
              onClick={() => setSelectedItem(items.vase)}
              onHover={() => setHoveredItem(items.vase)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${frameY}%`}
              left={`${100 - frameX}%`}
              alignRight={true}
              onClick={() => setSelectedItem(items.frame)}
              onHover={() => setHoveredItem(items.frame)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${tableY}%`}
              left={`${100 - tableX}%`}
              alignRight={true}
              onClick={() => setSelectedItem(items.table)}
              onHover={() => setHoveredItem(items.table)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
          </div>
        </motion.div>

        {/* Right Panel Container (splitPercent% to 100%) */}
        <motion.div
          className="absolute right-0 top-0 h-full overflow-hidden"
          animate={{ left: `${splitPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          {/* Right Background Image (bg.png) */}
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'auto 100%',
              width: `calc(${aspectRight} * 100vh)`,
              left: `${rightOffset}px`,
            }}
          >
            {/* Grain Overlay - Sized directly to this specific div */}
            <GrainEffect />

            {/* Hotspots on Right Image */}
            <Hotspot
              top={`${chairY}%`}
              left={`${chairX}%`}
              onClick={() => setSelectedItem(items.chair)}
              onHover={() => setHoveredItem(items.chair)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${vaseY}%`}
              left={`${vaseX}%`}
              onClick={() => setSelectedItem(items.vase)}
              onHover={() => setHoveredItem(items.vase)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${frameY}%`}
              left={`${frameX}%`}
              onClick={() => setSelectedItem(items.frame)}
              onHover={() => setHoveredItem(items.frame)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
            <Hotspot
              top={`${tableY}%`}
              left={`${tableX}%`}
              onClick={() => setSelectedItem(items.table)}
              onHover={() => setHoveredItem(items.table)}
              onLeave={() => setHoveredItem(null)}
              onAddToCart={() => setCartCount(c => c + 1)}
            />
          </div>
        </motion.div>
      </div>

      {/* Shadow Overlay for the whole viewport to merge with dark sidebar */}
      <div className="absolute inset-0 bg-linear-to-r from-black from-25% via-33% to-50% via-black/40 to-transparent pointer-events-none z-0"></div>

      {/* Subtle Yellow Ambient Spotlight */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* UI Overlay Container */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">

        {/* Top Section: Logo, Sidebar Nav, and Split Toggle Button */}
        <div className="flex justify-between items-start w-full">
          <div className="flex h-full">
            {/* Far Left: Logo & Icons */}
            <div className="flex flex-col items-center  pointer-events-auto">
              <img src={logo} alt="Lavis" className="w-27.75 h-19 mb-8 hover:scale-105 transition-transform duration-300" />

              <button className="mb-6 text-white hover:text-yellow-400 transition-colors duration-200 cursor-pointer">
                <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H23C23.2652 0 23.5196 0.105357 23.7071 0.292893C23.8946 0.48043 24 0.734784 24 1C24 1.26522 23.8946 1.51957 23.7071 1.70711C23.5196 1.89464 23.2652 2 23 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1ZM1 10H10C10.2652 10 10.5196 9.89464 10.7071 9.70711C10.8946 9.51957 11 9.26522 11 9C11 8.73478 10.8946 8.48043 10.7071 8.29289C10.5196 8.10536 10.2652 8 10 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10ZM12 16H1C0.734784 16 0.48043 16.1054 0.292893 16.2929C0.105357 16.4804 0 16.7348 0 17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H12C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16ZM25.7075 17.7075C25.6146 17.8005 25.5043 17.8742 25.3829 17.9246C25.2615 17.9749 25.1314 18.0008 25 18.0008C24.8686 18.0008 24.7385 17.9749 24.6171 17.9246C24.4957 17.8742 24.3854 17.8005 24.2925 17.7075L21.75 15.17C20.716 15.8522 19.4657 16.1262 18.2412 15.9391C17.0167 15.752 15.9052 15.117 15.1222 14.1572C14.3392 13.1973 13.9403 11.981 14.0029 10.7439C14.0655 9.50672 14.5851 8.33686 15.461 7.46096C16.3369 6.58505 17.5067 6.06546 18.7439 6.00288C19.981 5.94029 21.1973 6.33915 22.1572 7.12219C23.117 7.90522 23.752 9.01667 23.9391 10.2412C24.1262 11.4657 23.8522 12.716 23.17 13.75L25.7075 16.2875C25.8012 16.3805 25.8756 16.4911 25.9264 16.6129C25.9772 16.7348 26.0033 16.8655 26.0033 16.9975C26.0033 17.1295 25.9772 17.2602 25.9264 17.3821C25.8756 17.5039 25.8012 17.6145 25.7075 17.7075ZM19 14C19.5933 14 20.1734 13.8241 20.6667 13.4944C21.1601 13.1648 21.5446 12.6962 21.7716 12.1481C21.9987 11.5999 22.0581 10.9967 21.9424 10.4147C21.8266 9.83278 21.5409 9.29824 21.1213 8.87868C20.7018 8.45912 20.1672 8.1734 19.5853 8.05764C19.0033 7.94189 18.4001 8.0013 17.8519 8.22836C17.3038 8.45542 16.8352 8.83994 16.5056 9.33329C16.1759 9.82664 16 10.4067 16 11C16 11.7956 16.3161 12.5587 16.8787 13.1213C17.4413 13.6839 18.2044 14 19 14Z" fill="white" />
                </svg>

              </button>

              <button className="relative text-white hover:text-yellow-400 transition-colors duration-200 cursor-pointer">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.7675 5.35875C26.6736 5.24642 26.5562 5.15607 26.4236 5.09408C26.291 5.03209 26.1464 4.99998 26 5H5.835L5.075 0.82125C5.03314 0.590834 4.91174 0.382419 4.73196 0.232339C4.55218 0.0822584 4.32544 3.38465e-05 4.09125 0H1C0.734783 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734783 2 1 2H3.25L6.445 19.5362C6.53911 20.0563 6.76895 20.5423 7.11125 20.945C6.63881 21.3863 6.29781 21.9498 6.12607 22.573C5.95433 23.1962 5.95856 23.8549 6.13829 24.4759C6.31801 25.0968 6.66621 25.6559 7.14428 26.0911C7.62235 26.5263 8.2116 26.8205 8.8467 26.9412C9.48179 27.062 10.1379 27.0044 10.7423 26.775C11.3467 26.5456 11.8758 26.1533 12.2708 25.6416C12.6658 25.1299 12.9114 24.5187 12.9804 23.8759C13.0493 23.2332 12.9388 22.5838 12.6612 22H18.3387C18.115 22.4684 17.9993 22.981 18 23.5C18 24.1922 18.2053 24.8689 18.5899 25.4445C18.9744 26.0201 19.5211 26.4687 20.1606 26.7336C20.8001 26.9985 21.5039 27.0678 22.1828 26.9327C22.8617 26.7977 23.4854 26.4644 23.9749 25.9749C24.4644 25.4854 24.7977 24.8617 24.9327 24.1828C25.0678 23.5039 24.9985 22.8001 24.7336 22.1606C24.4687 21.5211 24.0201 20.9744 23.4445 20.5899C22.8689 20.2053 22.1922 20 21.5 20H9.39625C9.16206 20 8.93532 19.9177 8.75554 19.7677C8.57576 19.6176 8.45436 19.4092 8.4125 19.1787L8.01625 17H22.5162C23.2188 16.9999 23.8991 16.7532 24.4384 16.303C24.9777 15.8527 25.3419 15.2275 25.4675 14.5362L26.9875 6.17875C27.0132 6.0343 27.0069 5.88596 26.9688 5.74424C26.9308 5.60253 26.8621 5.47092 26.7675 5.35875ZM11 23.5C11 23.7967 10.912 24.0867 10.7472 24.3334C10.5824 24.58 10.3481 24.7723 10.074 24.8858C9.79994 24.9993 9.49833 25.0291 9.20736 24.9712C8.91639 24.9133 8.64912 24.7704 8.43934 24.5607C8.22956 24.3509 8.0867 24.0836 8.02882 23.7926C7.97094 23.5017 8.00065 23.2001 8.11418 22.926C8.22771 22.6519 8.41997 22.4176 8.66664 22.2528C8.91332 22.088 9.20333 22 9.5 22C9.89782 22 10.2794 22.158 10.5607 22.4393C10.842 22.7206 11 23.1022 11 23.5ZM23 23.5C23 23.7967 22.912 24.0867 22.7472 24.3334C22.5824 24.58 22.3481 24.7723 22.074 24.8858C21.7999 24.9993 21.4983 25.0291 21.2074 24.9712C20.9164 24.9133 20.6491 24.7704 20.4393 24.5607C20.2296 24.3509 20.0867 24.0836 20.0288 23.7926C19.9709 23.5017 20.0006 23.2001 20.1142 22.926C20.2277 22.6519 20.42 22.4176 20.6666 22.2528C20.9133 22.088 21.2033 22 21.5 22C21.8978 22 22.2794 22.158 22.5607 22.4393C22.842 22.7206 23 23.1022 23 23.5ZM23.5 14.1787C23.458 14.4098 23.3361 14.6187 23.1555 14.7689C22.975 14.919 22.7473 15.0008 22.5125 15H7.6525L6.19875 7H24.8012L23.5 14.1787Z" fill="white" />
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      {cartCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Vertical Menu */}
            <div className="ml-4 flex flex-col pointer-events-auto bg-[#E0E0CF] absolute top-0 left-[8%] backdrop-blur-md border  w-48 h-96.75 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden pt-4">
              <ul className="flex flex-col py-6 px-6 gap-8">
                {[
                  { id: '01', name: 'HOME', active: true },
                  { id: '02', name: 'SHOWROOM', active: false },
                  { id: '03', name: 'COLLECTIONS', active: false },
                  { id: '04', name: 'PROMO', active: false },
                  { id: '05', name: 'PROJECTS', active: false },
                  { id: '06', name: 'CONTACT US', active: false },
                ].map((item) => (
                  <li key={item.id} className="flex items-center text-xs font-semibold tracking-widest cursor-pointer group gap-5">
                    <span className="text-[#00000052] group-hover:text-yellow-400 transition-colors duration-200">{item.id}</span>
                    <span className={`${item.active ? 'text-[#9A7700]' : 'text-black'} group-hover:text-[#9A7700] transition-colors duration-200`}>
                      {item.name} {item.active && '→'}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 bg-[#FEEC04] text-black text-xs font-semibold py-4 px-6 cursor-pointer flex justify-between items-center hover:bg-yellow-300 transition-colors duration-250">
                SIGN IN <span><svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.372 4.68477L6.43453 8.62228C6.35244 8.70437 6.2411 8.75049 6.125 8.75049C6.0089 8.75049 5.89756 8.70437 5.81547 8.62228C5.73338 8.54018 5.68726 8.42884 5.68726 8.31274C5.68726 8.19665 5.73338 8.08531 5.81547 8.00321L9.00648 4.81274H0.4375C0.321468 4.81274 0.210188 4.76665 0.128141 4.6846C0.0460937 4.60256 0 4.49128 0 4.37524C0 4.25921 0.0460937 4.14793 0.128141 4.06588C0.210188 3.98384 0.321468 3.93774 0.4375 3.93774H9.00648L5.81547 0.747275C5.73338 0.665182 5.68726 0.55384 5.68726 0.437743C5.68726 0.321647 5.73338 0.210305 5.81547 0.128212C5.89756 0.0461192 6.0089 0 6.125 0C6.2411 0 6.35244 0.0461192 6.43453 0.128212L10.372 4.06571C10.4127 4.10634 10.445 4.1546 10.467 4.20771C10.489 4.26082 10.5003 4.31775 10.5003 4.37524C10.5003 4.43274 10.489 4.48967 10.467 4.54278C10.445 4.59589 10.4127 4.64414 10.372 4.68477Z" fill="#1C1A1B" />
                </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Split Toggle Button */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setIsSplit(!isSplit)}
              className="flex items-center justify-center w-12 h-12 bg-black/50 hover:bg-yellow-400 hover:text-black text-white rounded-full border border-white/10 backdrop-blur-md transition-all duration-350 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group"
              title="Toggle split view"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-500 ${isSplit ? 'rotate-180' : ''}`}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Section: Typography */}
        <div className="w-full flex justify-between items-end ">
          <div className="max-w-111 select-none">
            {displayItem ? (
              <motion.div
                key={displayItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                <h2 className="text-white text-[45.73px] font-semibold leading-[100%] tracking-[-4%] uppercase">
                  {displayItem.title}

                </h2>
                <h1 className="text-white text-[245.7px] font-serif font-normal leading-[100%] tracking-[-0.04em] italic mt-2">
                  {displayItem.price}
                </h1>
              </motion.div>
            ) : (
              <h1 className="text-white text-[98.81px] font-serif font-normal leading-25 tracking-[-0.04em] drop-shadow-lg">
                ITALIAN <br />
                PERFECTION. <br />
                <span className="italic font-light ">SINCE 1925.</span>
              </h1>
            )}
          </div>

          <div className="text-right text-white text-xs font-semibold leading-relaxed uppercase pointer-events-auto  drop-shadow-md">
            <p >WESTON</p>
            <p>10 SUNTRACT ROAD,</p>
            <p>TORONTO, ON</p>
            <p className="">M9N3N8 PHONE NUMBER:</p>
            <p className="underline underline-offset-4 cursor-pointer transition-colors duration-200">
              416-243-8300
            </p>
          </div>
        </div>

      </div>

      {/* Debug Control Panel (Press 'd' to toggle) */}
      {showDebug && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/90 text-white p-6 rounded-xl border border-white/20 w-96 text-xs max-h-[85vh] overflow-y-auto shadow-2xl">
          <h3 className="font-bold text-sm mb-4 border-b border-white/20 pb-2 flex justify-between">
            <span>Alignment & Hotspot Adjuster</span>
            <button onClick={() => setShowDebug(false)} className="text-red-400">Close</button>
          </h3>

          <div className="space-y-4">
            {/* Split Toggle */}
            <div className="flex justify-between items-center bg-white/5 p-2 rounded">
              <span>View Mode:</span>
              <button
                onClick={() => setIsSplit(!isSplit)}
                className="bg-yellow-400 text-black px-3 py-1 rounded font-bold"
              >
                {isSplit ? 'Split 50/50' : 'Default View'}
              </button>
            </div>

            {/* Left Image Offset */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Left Image Offset (X):</span>
                <span className="font-mono text-yellow-400 font-bold">{leftOffset}px</span>
              </div>
              <input
                type="range" min="-300" max="300" step="1"
                value={leftOffset}
                onChange={(e) => setLeftOffset(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
            </div>

            {/* Right Image Offset */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Right Image Offset (X):</span>
                <span className="font-mono text-yellow-400 font-bold">{rightOffset}px</span>
              </div>
              <input
                type="range" min="-300" max="300" step="1"
                value={rightOffset}
                onChange={(e) => setRightOffset(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
            </div>

            {/* Left Aspect Ratio */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Left Image Aspect:</span>
                <span className="font-mono text-yellow-400 font-bold">{aspectLeft}</span>
              </div>
              <input
                type="range" min="1.0" max="1.5" step="0.001"
                value={aspectLeft}
                onChange={(e) => setAspectLeft(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
            </div>

            {/* Right Aspect Ratio */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Right Image Aspect:</span>
                <span className="font-mono text-yellow-400 font-bold">{aspectRight}</span>
              </div>
              <input
                type="range" min="1.0" max="1.5" step="0.001"
                value={aspectRight}
                onChange={(e) => setAspectRight(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
            </div>

            <div className="border-t border-white/10 pt-3">
              <h4 className="font-bold mb-2">Hotspots Positions (%):</h4>

              {/* Chair Hotspot */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Chair Position:</span>
                  <span className="font-mono text-yellow-400">X: {chairX}%, Y: {chairY}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={chairX}
                  onChange={(e) => setChairX(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={chairY}
                  onChange={(e) => setChairY(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Vase Hotspot */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Vase Position:</span>
                  <span className="font-mono text-yellow-400">X: {vaseX}%, Y: {vaseY}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={vaseX}
                  onChange={(e) => setVaseX(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={vaseY}
                  onChange={(e) => setVaseY(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Frame Hotspot */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Frame Position:</span>
                  <span className="font-mono text-yellow-400">X: {frameX}%, Y: {frameY}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={frameX}
                  onChange={(e) => setFrameX(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={frameY}
                  onChange={(e) => setFrameY(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Table Hotspot */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Table Position:</span>
                  <span className="font-mono text-yellow-400">X: {tableX}%, Y: {tableY}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={tableX}
                  onChange={(e) => setTableX(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <input
                  type="range" min="0" max="100" step="0.1"
                  value={tableY}
                  onChange={(e) => setTableY(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>
            </div>

            <div className="bg-white/5 p-2 rounded text-[10px] font-mono leading-normal">
              <p>Current Seam: {splitPercent.toFixed(1)}%</p>
              <p>Default Seam: {defaultSplit.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;