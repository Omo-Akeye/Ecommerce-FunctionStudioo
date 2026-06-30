import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

import bgImage from '../assets/bg.png';
import bg2 from '../assets/bg2.png';
import logo from '../assets/logo.png';
import yellowSvg from '../assets/yellow.svg';
import { getCartCount } from '../cartUtils';

interface HomeProps {
  cart: { [key: string]: number };
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
}

const ItemTooltip = ({
  screenX,
  screenY,
  isOpen,
  onAddToCart,
  onClose,
}: {
  screenX: number;
  screenY: number;
  isOpen: boolean;
  onAddToCart: () => void;
  onClose: () => void;
}) => {
  const halfW = 77.5;
  const halfH = 40;
  const clampedX = Math.max(halfW, Math.min(window.innerWidth - halfW, screenX));
  const clampedY = Math.max(halfH, Math.min(window.innerHeight - halfH, screenY));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed z-100 pointer-events-auto w-38.75 bg-[#0000008F] backdrop-blur-[7.61px] text-black p-4 rounded-[57px]"
          style={{
            left: clampedX,
            top: clampedY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
              onClose();
            }}
            className="w-full text-white text-[10px] tracking-wider font-bold py-2 transition-colors duration-200 cursor-pointer"
          >
            ADD TO CART
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getPointsString = (points: { x: number; y: number }[], isLeft: boolean) => {
  return points.map(pt => `${isLeft ? 100 - pt.x : pt.x},${pt.y}`).join(' ');
};

const GrainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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

export const Home = ({
  cart,
  isCartOpen,
  setIsCartOpen,
  addToCart,
}: HomeProps) => {
  const [isSplit, setIsSplit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const cartCount = getCartCount(cart);
  const justAddedRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddToCart = (id: string) => {
    const isCurrentlyEmpty = getCartCount(cart) === 0;
    if (isCurrentlyEmpty) setIsCartOpen(true);
    addToCart(id);
  };

  const displayItem = hoveredItem || selectedItem;

  const items = {
    chair: { id: 'chair', title: "ATELIER ELOWEN", subtitle: "VENTA CHAIR", price: "$1200" },
    vase: { id: 'vase', title: "BASSO UNO", subtitle: "STOOD", price: "$550" },
    frame: { id: 'frame', title: "MILANO LINEA", subtitle: "FRAMENTO", price: "$400" },
    table: { id: 'table', title: "Vetra Console", subtitle: "", price: "$2500" },
  };

  const LEFT_OFFSET = -2;
  const RIGHT_OFFSET = -7;
  const ASPECT_LEFT = 1.193;
  const ASPECT_RIGHT = 1.412;

  const [defaultSplit, setDefaultSplit] = useState(28.5);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const defaultSplitPercent = ((w - ASPECT_RIGHT * h) / w) * 100;
      setDefaultSplit(Math.max(15, Math.min(40, defaultSplitPercent)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitPercent = isSplit ? 50 : defaultSplit;

  const [polygons] = useState<{ [key: string]: { x: number; y: number }[] }>({
    chair: [
      { x: 36.4, y: 82 },
      { x: 37.2, y: 59.1 },
      { x: 49.6, y: 45.1 },
      { x: 65.1, y: 45.7 },
      { x: 64.8, y: 58.5 },
      { x: 63.3, y: 73.2 },
      { x: 63.6, y: 83.3 },
      { x: 63.6, y: 83.3 }
    ],
    vase: [
      { x: 24.4, y: 26.3 },
      { x: 35.2, y: 28.3 },
      { x: 34, y: 58 },
      { x: 34.1, y: 55.7 },
      { x: 33.6, y: 79.3 },
      { x: 27.5, y: 78.5 },
      { x: 26.9, y: 55.1 },
      { x: 31, y: 58 },
      { x: 24.4, y: 26.3 },
      { x: 35.2, y: 28.3 },
      { x: 27.5, y: 78.5 }
    ],
    frame: [
      { x: 36.4, y: 4 },
      { x: 54.5, y: 3.8 },
      { x: 54.6, y: 38.6 },
      { x: 36.7, y: 40.3 },
      { x: 36.3, y: 14.3 },
      { x: 36.7, y: 40.3 }
    ],
    table: [
      { x: 0, y: 54 },
      { x: 22.7, y: 54.4 },
      { x: 22.6, y: 73.9 },
      { x: 0, y: 73.5 }
    ]
  });

  const [cursorPx, setCursorPx] = useState<{ x: number; y: number } | null>(null);
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number } | null>(null);
  const tooltipPos = cursorPx ?? pinnedPos;
  const activeItem = hoveredItem || selectedItem;

  const handleBackgroundClick = () => {
    setSelectedItem(null);
    setPinnedPos(null);
  };

  return (
    <div className="relative w-screen h-screen bg-[#060606] font-sans overflow-hidden select-none" onClick={handleBackgroundClick}>
      {/* Background Panels */}
      <div className="absolute inset-0 z-0">
        {/* Left Panel Container (0% to splitPercent%) */}
        <motion.div
          className="absolute left-0 top-0 h-full overflow-hidden"
          animate={{ width: `${splitPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bg2})`,
              backgroundSize: 'auto 100%',
              width: `calc(${ASPECT_LEFT} * 100vh)`,
              right: `${LEFT_OFFSET}px`,
            }}
          >
            <GrainEffect />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {Object.entries(polygons).map(([id, points]) => {
                const pointsStr = getPointsString(points, true);
                return (
                  <polygon
                    key={id}
                    points={pointsStr}
                    className="cursor-none"
                    style={{
                      fill: 'transparent',
                      stroke: 'transparent',
                      strokeWidth: 0,
                      pointerEvents: isSplit ? 'auto' : 'none',
                    }}
                    onMouseEnter={() => {
                      if (justAddedRef.current) return;
                      setHoveredItem(items[id as keyof typeof items]);
                    }}
                    onMouseMove={(e) => {
                      if (justAddedRef.current) return;
                      setCursorPx({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHoveredItem(null);
                      setCursorPx(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(id);
                      justAddedRef.current = true;
                      setHoveredItem(null);
                      setCursorPx(null);
                      setSelectedItem(null);
                      setPinnedPos(null);

                      setTimeout(() => {
                        justAddedRef.current = false;
                      }, 600);
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Right Panel Container (splitPercent% to 100%) */}
        <motion.div
          className="absolute right-0 top-0 h-full overflow-hidden"
          animate={{ left: `${splitPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'auto 100%',
              width: `calc(${ASPECT_RIGHT} * 100vh)`,
              left: `${RIGHT_OFFSET}px`,
            }}
          >
            <GrainEffect />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {Object.entries(polygons).map(([id, points]) => {
                const pointsStr = getPointsString(points, false);
                return (
                  <polygon
                    key={id}
                    points={pointsStr}
                    className="cursor-none"
                    style={{
                      fill: 'transparent',
                      stroke: 'transparent',
                      strokeWidth: 0,
                    }}
                    onMouseEnter={() => {
                      if (justAddedRef.current) return;
                      setHoveredItem(items[id as keyof typeof items]);
                    }}
                    onMouseMove={(e) => {
                      if (justAddedRef.current) return;
                      setCursorPx({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHoveredItem(null);
                      setCursorPx(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(id);
                      justAddedRef.current = true;
                      setHoveredItem(null);
                      setCursorPx(null);
                      setSelectedItem(null);
                      setPinnedPos(null);

                      setTimeout(() => {
                        justAddedRef.current = false;
                      }, 600);
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </motion.div>
      </div>

      <ItemTooltip
        screenX={tooltipPos?.x ?? 0}
        screenY={tooltipPos?.y ?? 0}
        isOpen={!!activeItem && !!tooltipPos}
        onAddToCart={() => {
          if (activeItem) {
            handleAddToCart(activeItem.id);
          }
        }}
        onClose={() => { setSelectedItem(null); setPinnedPos(null); setCursorPx(null); }}
      />

      <div className="absolute inset-0 bg-linear-to-r from-cart-btn from-25% via-55% to-50% via-[#24251D00] to-transparent pointer-events-none z-0"></div>
   
      <img
        src={yellowSvg}
        className="absolute top-[-10%] left-[-5%] pointer-events-none z-0 opacity-100"
        style={{
          width: '1133px',
          height: '451px',
          mixBlendMode: 'plus-lighter',
        }}
        alt=""
      />

      {/* Logo Wrapper */}
      <div className="fixed top-8 left-8 z-45 pointer-events-none">
        <img
          src={logo}
          alt="Lavis"
          className={`w-27.75 h-19 transition-all duration-300 ${
            isCartOpen
              ? 'pointer-events-none'
              : 'pointer-events-auto hover:scale-105 cursor-pointer'
          }`}
        />
      </div>

      {/* UI Overlay Container */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 max-xl:pb-6">
        {/* Top Section */}
        <div className="flex justify-between items-start w-full">
          <div className="flex h-full">
            <div className="flex flex-col items-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="w-27.75 h-19 mb-8" />
              <button
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(o => !o); }}
                className="mb-6 text-white hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.svg
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 1L21 21M21 1L1 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                      width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H23C23.2652 0 23.5196 0.105357 23.7071 0.292893C23.8946 0.48043 24 0.734784 24 1C24 1.26522 23.8946 1.51957 23.7071 1.70711C23.5196 1.89464 23.2652 2 23 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1ZM1 10H10C10.2652 10 10.5196 9.89464 10.7071 9.70711C10.8946 9.51957 11 9.26522 11 9C11 8.73478 10.8946 8.48043 10.7071 8.29289C10.5196 8.10536 10.2652 8 10 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10ZM12 16H1C0.734784 16 0.48043 16.1054 0.292893 16.2929C0.105357 16.4804 0 16.7348 0 17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H12C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16ZM25.7075 17.7075C25.6146 17.8005 25.5043 17.8742 25.3829 17.9246C25.2615 17.9749 25.1314 18.0008 25 18.0008C24.8686 18.0008 24.7385 17.9749 24.6171 17.9246C24.4957 17.8742 24.3854 17.8005 24.2925 17.7075L21.75 15.17C20.716 15.8522 19.4657 16.1262 18.2412 15.9391C17.0167 15.752 15.9052 15.117 15.1222 14.1572C14.3392 13.1973 13.9403 11.981 14.0029 10.7439C14.0655 9.50672 14.5851 8.33686 15.461 7.46096C16.3369 6.58505 17.5067 6.06546 18.7439 6.00288C19.981 5.94029 21.1973 6.33915 22.1572 7.12219C23.117 7.90522 23.752 9.01667 23.9391 10.2412C24.1262 11.4657 23.8522 12.716 23.17 13.75L25.7075 16.2875C25.8012 16.3805 25.8756 16.4911 25.9264 16.6129C25.9772 16.7348 26.0033 16.8655 26.0033 16.9975C26.0033 17.1295 25.9772 17.2602 25.9264 17.3821C25.8756 17.5039 25.8012 17.6145 25.7075 17.7075ZM19 14C19.5933 14 20.1734 13.8241 20.6667 13.4944C21.1601 13.1648 21.5446 12.6962 21.7716 12.1481C21.9987 11.5999 22.0581 10.9967 21.9424 10.4147C21.8266 9.83278 21.5409 9.29824 21.1213 8.87868C20.7018 8.45912 20.1672 8.1734 19.5853 8.05764C19.0033 7.94189 18.4001 8.0013 17.8519 8.22836C17.3038 8.45542 16.8352 8.83994 16.5056 9.33329C16.1759 9.82664 16 10.4067 16 11C16 11.7956 16.3161 12.5587 16.8787 13.1213C17.4413 13.6839 18.2044 14 19 14Z" fill="currentColor"/>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCartOpen(true);
                }}
                className="relative text-white hover:text-yellow-400 transition-colors duration-200 cursor-pointer pointer-events-auto animate-bounce-subtle"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.7675 7.35875C28.6736 7.24642 28.5562 7.15607 28.4236 7.09408C28.291 7.03209 28.1464 6.99998 28 7H7.835L7.075 2.82125C7.03314 2.59083 6.91174 2.38242 6.73196 2.23234C6.55218 2.08226 6.32544 2.00003 6.09125 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3C2 3.26522 2.10536 3.51957 2.29289 3.70711C2.48043 3.89464 2.73478 4 3 4H5.25L8.445 21.5362C8.53911 22.0563 8.76895 22.5423 9.11125 22.945C8.63881 23.3863 8.29781 23.9498 8.12607 24.573C7.95433 25.1962 7.95856 25.8549 8.13829 26.4759C8.31801 27.0968 8.66621 27.6559 9.14428 28.0911C9.62235 28.5263 10.2116 28.8205 10.8467 28.9412C11.4818 29.062 12.1379 29.0044 12.7423 28.775C13.3467 28.5456 13.8758 28.1533 14.2708 27.6416C14.6658 27.1299 14.9114 26.5187 14.9804 25.8759C15.0493 25.2332 14.9388 24.5838 14.6612 24H20.3387C20.115 24.4684 19.9993 24.981 20 25.5C20 26.1922 20.2053 26.8689 20.5899 27.4445C20.9744 28.0201 21.5211 28.4687 22.1606 28.7336C22.8001 28.9985 23.5039 29.0678 24.1828 28.9327C24.8617 28.7977 25.4854 28.4644 25.9749 27.9749C26.4644 27.4854 26.7977 26.8617 26.9327 26.1828C27.0678 25.5039 26.9985 24.8001 26.7336 24.1606C26.4687 23.5211 26.0201 22.9744 25.4445 22.5899C24.8689 22.2053 24.1922 22 23.5 22H11.3962C11.1621 22 10.9353 21.9177 10.7555 21.7677C10.5758 21.6176 10.4544 21.4092 10.4125 21.1787L10.0162 19H24.5162C25.2188 18.9999 25.8991 18.7532 26.4384 18.303C26.9777 17.8527 27.3419 17.2275 27.4675 16.5362L28.9875 8.17875C29.0132 8.0343 29.0069 7.88596 28.9688 7.74424C28.9308 7.60253 28.8621 7.47092 28.7675 7.35875ZM13 25.5C13 25.7967 12.912 26.0867 12.7472 26.3334C12.5824 26.58 12.3481 26.7723 12.074 26.8858C11.7999 26.9993 11.4983 27.0291 11.2074 26.9712C10.9164 26.9133 10.6491 26.7704 10.4393 26.5607C10.2296 26.3509 10.0867 26.0836 10.0288 25.7926C9.97094 25.5017 10.0006 25.2001 10.1142 24.926C10.2277 24.6519 10.42 24.4176 10.6666 24.2528C10.9133 24.088 11.2033 24 11.5 24C11.8978 24 12.2794 24.158 12.5607 24.4393C12.842 24.7206 13 25.1022 13 25.5ZM25 25.5C25 25.7967 24.912 26.0867 24.7472 26.3334C24.5824 26.58 24.3481 26.7723 24.074 26.8858C23.7999 26.9993 23.4983 27.0291 23.2074 26.9712C22.9164 26.9133 22.6491 26.7704 22.4393 26.5607C22.2296 26.3509 22.0867 26.0836 22.0288 25.7926C21.9709 25.5017 22.0006 25.2001 22.1142 24.926C22.2277 24.6519 22.42 24.4176 22.6666 24.2528C22.9133 24.088 23.2033 24 23.5 24C23.8978 24 24.2794 24.158 24.5607 24.4393C24.842 24.7206 25 25.1022 25 25.5ZM25.5 16.1787C25.458 16.4098 25.3361 16.6187 25.1555 16.7689C24.975 16.919 24.7473 17.0008 24.5125 17H9.6525L8.19875 9H26.8012L25.5 16.1787Z" fill="currentColor" />
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
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="ml-4 flex flex-col pointer-events-auto absolute top-0 xl:left-[10%] left-[15%] w-48 h-[60%] xl:max-h-146.75 overflow-hidden pt-4"
                  style={{
                    background: 'linear-gradient(179.98deg, #E0E0CF 54.59%, rgba(255, 255, 255, 0) 79.5%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="flex flex-col py-5 px-6 gap-5">
                    {[
                      { id: '01', name: 'HOME', active: true, to: '/' },
                      { id: '02', name: 'SHOWROOM', active: false, to: '#' },
                      { id: '03', name: 'COLLECTIONS', active: false, to: '/collections' },
                      { id: '04', name: 'PROMO', active: false, to: '#' },
                      { id: '05', name: 'PROJECTS', active: false, to: '#' },
                      { id: '06', name: 'CONTACT', active: false, to: '#' },
                    ].map((item) => (
                      <li key={item.id} className="flex items-center text-xs font-semibold tracking-widest cursor-pointer group gap-2">
                        <span className="text-[#00000052] duration-200 xl:mr-2">{item.id}</span>
                        {item.to.startsWith('#') ? (
                          <span className="text-black group-hover:text-[#9A7700] transition-colors duration-200 flex items-center gap-2 mt-2">
                            {item.name}
                          </span>
                        ) : (
                          <Link
                            to={item.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={`${item.active ? 'text-[#9A7700]' : 'text-black'} group-hover:text-[#9A7700] transition-colors duration-200 flex items-center gap-2 mt-2`}
                          >
                            {item.name}
                            <span className={`${item.active ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-200`}>
                              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.372 4.68477L6.43453 8.62228C6.35244 8.70437 6.2411 8.75049 6.125 8.75049C6.0089 8.75049 5.89756 8.70437 5.81547 8.62228C5.73338 8.54018 5.68726 8.42884 5.68726 8.31274C5.68726 8.19665 5.73338 8.08531 5.81547 8.00321L9.00648 4.81274H0.4375C0.321468 4.81274 0.210188 4.76665 0.128141 4.6846C0.0460937 4.60256 0 4.49128 0 4.37524C0 4.25921 0.0460937 4.14793 0.128141 4.06588C0.210188 3.98384 0.321468 3.93774 0.4375 3.93774H9.00648L5.81547 0.747275C5.73338 0.665182 5.68726 0.55384 5.68726 0.437743C5.68726 0.321647 5.73338 0.210305 5.81547 0.128212C5.89756 0.0461192 6.0089 0 6.125 0C6.2411 0 6.35244 0.0461192 6.43453 0.128212L10.372 4.06571C10.4127 4.10634 10.445 4.1546 10.467 4.20771C10.489 4.26082 10.5003 4.31775 10.5003 4.37524C10.5003 4.43274 10.489 4.48967 10.467 4.54278C10.445 4.59589 10.4127 4.64414 10.372 4.68477Z" fill="currentColor" />
                              </svg>
                            </span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 bg-custom text-black text-xs font-semibold py-4 px-6 cursor-pointer flex justify-between items-center hover:bg-yellow-300 transition-colors duration-250">
                    SIGN IN <span><svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.372 4.68477L6.43453 8.62228C6.35244 8.70437 6.2411 8.75049 6.125 8.75049C6.0089 8.75049 5.89756 8.70437 5.81547 8.62228C5.73338 8.54018 5.68726 8.42884 5.68726 8.31274C5.68726 8.19665 5.73338 8.08531 5.81547 8.00321L9.00648 4.81274H0.4375C0.321468 4.81274 0.210188 4.76665 0.128141 4.6846C0.0460937 4.60256 0 4.49128 0 4.37524C0 4.25921 0.0460937 4.14793 0.128141 4.06588C0.210188 3.98384 0.321468 3.93774 0.4375 3.93774H9.00648L5.81547 0.747275C5.73338 0.665182 5.68726 0.55384 5.68726 0.437743C5.68726 0.321647 5.73338 0.210305 5.81547 0.128212C5.89756 0.0461192 6.0089 0 6.125 0C6.2411 0 6.35244 0.0461192 6.43453 0.128212L10.372 4.06571C10.4127 4.10634 10.445 4.1546 10.467 4.20771C10.489 4.26082 10.5003 4.31775 10.5003 4.37524C10.5003 4.43274 10.489 4.48967 10.467 4.54278C10.445 4.59589 10.4127 4.64414 10.372 4.68477Z" fill="#1C1A1B" />
                    </svg>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Right */}
          <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
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

        {/* Bottom Section */}
        <div className="w-full flex justify-between items-end z-100">
          <div className="max-w-111 select-none">
            {displayItem ? (
              <motion.div
                key={displayItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                <h2 className="text-white xl:text-[45.73px] text-[40px] font-semibold leading-[100%] tracking-[-4%] uppercase">
                  {displayItem.title}
                  {displayItem.subtitle && (
                    <>
                      <br />
                      {displayItem.subtitle}
                    </>
                  )}
                </h2>
                <h1 className="text-white xl:text-[245.7px] text-[200px] font-serif font-normal leading-[100%] tracking-[-0.04em] italic mt-2">
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

          <div className="text-right text-white text-xs font-semibold leading-relaxed uppercase pointer-events-auto drop-shadow-md" onClick={(e) => e.stopPropagation()}>
            <p>WESTON</p>
            <p>10 SUNTRACT ROAD,</p>
            <p>TORONTO, ON</p>
            <p>M9N3N8 PHONE NUMBER:</p>
            <p className="underline underline-offset-4 cursor-pointer transition-colors duration-200">
              416-243-8300
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
