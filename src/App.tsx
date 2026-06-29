import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from './assets/bg.png';
import bg2 from './assets/bg2.png';
import logo from './assets/logo.png';
import yellowSvg from './assets/yellow.svg';
import { SidebarCart } from './SidebarCart';
import { MobileGate } from './MobileGate';


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
            className="w-full text-white text-[10px] tracking-wider font-bold py-2 transition-colors duration-200 cursor-pointer">
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
  const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ id: string, title: string, subtitle?: string, price: string } | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const justAddedRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const isCurrentlyEmpty = Object.values(prev).reduce((sum, qty) => sum + qty, 0) === 0;
      if (isCurrentlyEmpty) {
        setIsCartOpen(true);
      }
      return {
        ...prev,
        [id]: (prev[id] || 0) + 1,
      };
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return {
        ...prev,
        [id]: newQty,
      };
    });
  };



  const clearCart = () => {
    setCart({});
  };

  const displayItem = hoveredItem || selectedItem;

  const items = {
    chair: { id: 'chair', title: "ATELIER ELOWEN", subtitle: "VENTA CHAIR", price: "$1200" },
    vase: { id: 'vase', title: "BASSO UNO", subtitle: "STOOD", price: "$550" },
    frame: { id: 'frame', title: "MILANO LINEA", subtitle: "FRAMENTO", price: "$400" },
    table: { id: 'table', title: "Vetra Console", subtitle: "", price: "$2500" },
  };

  // Layout Constants (previously adjustable alignment parameters)
  const LEFT_OFFSET = -2;
  const RIGHT_OFFSET = -7;
  const ASPECT_LEFT = 1.193;
  const ASPECT_RIGHT = 1.412;

  // Calculate default split percentage dynamically based on screen width/height
  const [defaultSplit, setDefaultSplit] = useState(28.5);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

  
      const defaultSplitPercent = ((w - ASPECT_RIGHT * h) / w) * 100;

      // Clamp between 15% and 40% to preserve look on extreme screens
      setDefaultSplit(Math.max(15, Math.min(40, defaultSplitPercent)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seam position based on split state
  const splitPercent = isSplit ? 50 : defaultSplit;

  // Polygon Coordinates and Edit States
  const [polygons] = useState<{ [key: string]: { x: number; y: number }[] }>({
 
  "chair": [
    {
      "x": 36.4,
      "y": 82
    },
    {
      "x": 37.2,
      "y": 59.1
    },
    {
      "x": 49.6,
      "y": 45.1
    },
    {
      "x": 65.1,
      "y": 45.7
    },
    {
      "x": 64.8,
      "y": 58.5
    },
    {
      "x": 63.3,
      "y": 73.2
    },
    {
      "x": 63.6,
      "y": 83.3
    },
    {
      "x": 63.6,
      "y": 83.3
    }
  ],
  "vase": [
    {
      "x": 24.4,
      "y": 26.3
    },
    {
      "x": 35.2,
      "y": 28.3
    },
    {
      "x": 34,
      "y": 58
    },
    {
      "x": 34.1,
      "y": 55.7
    },
    {
      "x": 33.6,
      "y": 79.3
    },
    {
      "x": 27.5,
      "y": 78.5
    },
    {
      "x": 26.9,
      "y": 55.1
    },
    {
      "x": 31,
      "y": 58
    },
    {
      "x": 24.4,
      "y": 26.3
    },
    {
      "x": 35.2,
      "y": 28.3
    },
    {
      "x": 27.5,
      "y": 78.5
    }
  ],
  "frame": [
    {
      "x": 36.4,
      "y": 4
    },
    {
      "x": 54.5,
      "y": 3.8
    },
    {
      "x": 54.6,
      "y": 38.6
    },
    {
      "x": 36.7,
      "y": 40.3
    },
    {
      "x": 36.3,
      "y": 14.3
    },
    {
      "x": 36.7,
      "y": 40.3
    }
  ],
  "table": [
    {
      "x": 0,
      "y": 54
    },
    {
      "x": 22.7,
      "y": 54.4
    },
    {
      "x": 22.6,
      "y": 73.9
    },
    {
      "x": 0,
      "y": 73.5
    }
  ]


  });
  // Tracks cursor pixel position for hover, and a pinned position for click
  const [cursorPx, setCursorPx] = useState<{ x: number; y: number } | null>(null);
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number } | null>(null);
  // The tooltip position is: live cursor when hovering, or pinned position when clicked
  const tooltipPos = cursorPx ?? pinnedPos;
  const activeItem = hoveredItem || selectedItem;

  const handleBackgroundClick = () => {
    setSelectedItem(null);
    setPinnedPos(null);
  };

  return (
    <div className="relative w-screen h-screen bg-[#060606] font-sans overflow-hidden select-none" onClick={handleBackgroundClick}>

      {/* Mobile / tablet gate — hidden on lg+ */}
      <MobileGate />

      {/* Background Panels */}
      <div className="absolute inset-0 z-0">

        {/* Left Panel Container (0% to splitPercent%) */}
        <motion.div
          className="absolute left-0 top-0 h-full overflow-hidden"
          animate={{ width: `${splitPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          {/* Left Background Image (bg2.png) */}
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bg2})`,
              backgroundSize: 'auto 100%',
              width: `calc(${ASPECT_LEFT} * 100vh)`,
              right: `${LEFT_OFFSET}px`,
            }}
          >
            {/* Grain Overlay - Sized directly to this specific div */}
            <GrainEffect />

            {/* SVG Polygon Hitbox Overlay for Left Panel */}
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
  if (justAddedRef.current) return;  // ← add this guard
  setCursorPx({ x: e.clientX, y: e.clientY });
}}
                  onMouseLeave={() => {
  setHoveredItem(null);
  setCursorPx(null);
}}
onClick={(e) => {
  e.stopPropagation();
  addToCart(id);
  justAddedRef.current = true;

  // Clear everything immediately so tooltip disappears right away
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
          {/* Right Background Image (bg.png) */}
          <div
            className="absolute top-0 h-full max-w-none bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'auto 100%',
              width: `calc(${ASPECT_RIGHT} * 100vh)`,
              left: `${RIGHT_OFFSET}px`,
            }}
          >
            {/* Grain Overlay - Sized directly to this specific div */}
            <GrainEffect />

            {/* SVG Polygon Hitbox Overlay for Right Panel */}
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
  if (justAddedRef.current) return;  // ← add this guard
  setCursorPx({ x: e.clientX, y: e.clientY });
}}
  
                  
                   onMouseLeave={() => {
  setHoveredItem(null);
  setCursorPx(null);
}}
onClick={(e) => {
  e.stopPropagation();
  addToCart(id);
  justAddedRef.current = true;

  // Clear everything immediately so tooltip disappears right away
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

      {/* Single Fixed Tooltip — rendered above everything, follows cursor on hover or stays pinned on click */}
      <ItemTooltip
        screenX={tooltipPos?.x ?? 0}
        screenY={tooltipPos?.y ?? 0}
        isOpen={!!activeItem && !!tooltipPos}
        onAddToCart={() => {
          if (activeItem) {
            addToCart(activeItem.id);
          }
        }}
        onClose={() => { setSelectedItem(null); setPinnedPos(null); setCursorPx(null); }}
      />

   
      <div className="absolute inset-0 bg-linear-to-r from-[#21241E] from-25% via-55% to-50% via-[#24251D00] to-transparent pointer-events-none z-0"></div>
   
      <img
        src={yellowSvg}
        className="absolute top-[-10%] left-[-5%]  pointer-events-none z-0 opacity-100"
        style={{
          width: '1133px',
          height: '451px',
          mixBlendMode: 'plus-lighter',
        }}
        alt=""
      />
   

      {/* Logo Wrapper - elevated to z-[45] so it shows on top of the sidebar overlay */}
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

        {/* Top Section: Logo, Sidebar Nav, and Split Toggle Button */}
        <div className="flex justify-between items-start w-full">
          <div className="flex h-full">
            {/* Far Left: Logo & Icons */}
            <div className="flex flex-col items-center  pointer-events-auto" onClick={(e) => e.stopPropagation()}>
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
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.7675 5.35875C26.6736 5.24642 26.5562 5.15607 26.4236 5.09408C26.291 5.03209 26.1464 4.99998 26 5H5.835L5.075 0.82125C5.03314 0.590834 4.91174 0.382419 4.73196 0.232339C4.55218 0.0822584 4.32544 3.38465e-05 4.09125 0H1C0.734783 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734783 2 1 2H3.25L6.445 19.5362C6.53911 20.0563 6.76895 20.5423 7.11125 20.945C6.63881 21.3863 6.29781 21.9498 6.12607 22.573C5.95433 23.1962 5.95856 23.8549 6.13829 24.4759C6.31801 25.0968 6.66621 25.6559 7.14428 26.0911C7.62235 26.5263 8.2116 26.8205 8.8467 26.9412C9.48179 27.062 10.1379 27.0044 10.7423 26.775C11.3467 26.5456 11.8758 26.1533 12.2708 25.6416C12.6658 25.1299 12.9114 24.5187 12.9804 23.8759C13.0493 23.2332 12.9388 22.5838 12.6612 22H18.3387C18.115 22.4684 17.9993 22.981 18 23.5C18 24.1922 18.2053 24.8689 18.5899 25.4445C18.9744 26.0201 19.5211 26.4687 20.1606 26.7336C20.8001 26.9985 21.5039 27.0678 22.1828 26.9327C22.8617 26.7977 23.4854 26.4644 23.9749 25.9749C24.4644 25.4854 24.7977 24.8617 24.9327 24.1828C25.0678 23.5039 24.9985 22.8001 24.7336 22.1606C24.4687 21.5211 24.0201 20.9744 23.4445 20.5899C22.8689 20.2053 22.1922 20 21.5 20H9.39625C9.16206 20 8.93532 19.9177 8.75554 19.7677C8.57576 19.6176 8.45436 19.4092 8.4125 19.1787L8.01625 17H22.5162C23.2188 16.9999 23.8991 16.7532 24.4384 16.303C24.9777 15.8527 25.3419 15.2275 25.4675 14.5362L26.9875 6.17875C27.0132 6.0343 27.0069 5.88596 26.9688 5.74424C26.9308 5.60253 26.8621 5.47092 26.7675 5.35875ZM11 23.5C11 23.7967 10.912 24.0867 10.7472 24.3334C10.5824 24.58 10.3481 24.7723 10.074 24.8858C9.79994 24.9993 9.49833 25.0291 9.20736 24.9712C8.91639 24.9133 8.64912 24.7704 8.43934 24.5607C8.22956 24.3509 8.0867 24.0836 8.02882 23.7926C7.97094 23.5017 8.00065 23.2001 8.11418 22.926C8.22771 22.6519 8.41997 22.4176 8.66664 22.2528C8.91332 22.088 9.20333 22 9.5 22C9.89782 22 10.2794 22.158 10.5607 22.4393C10.842 22.7206 11 23.1022 11 23.5ZM23 23.5C23 23.7967 22.912 24.0867 22.7472 24.3334C22.5824 24.58 22.3481 24.7723 22.074 24.8858C21.7999 24.9993 21.4983 25.0291 21.2074 24.9712C20.9164 24.9133 20.6491 24.7704 20.4393 24.5607C20.2296 24.3509 20.0867 24.0836 20.0288 23.7926C19.9709 23.5017 20.0006 23.2001 20.1142 22.926C20.2277 22.6519 20.42 22.4176 20.6666 22.2528C20.9133 22.088 21.2033 22 21.5 22C21.8978 22 22.2794 22.158 22.5607 22.4393C22.842 22.7206 23 23.1022 23 23.5ZM23.5 14.1787C23.458 14.4098 23.3361 14.6187 23.1555 14.7689C22.975 14.919 22.7473 15.0008 22.5125 15H7.6525L6.19875 7H24.8012L23.5 14.1787Z" fill="currentColor" />
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
                  { id: '01', name: 'HOME', active: true },
                  { id: '02', name: 'SHOWROOM', active: false },
                  { id: '03', name: 'COLLECTIONS', active: false },
                  { id: '04', name: 'PROMO', active: false },
                  { id: '05', name: 'PROJECTS', active: false },
                  { id: '06', name: 'CONTACT', active: false },
                ].map((item) => (
                  <li key={item.id} className="flex items-center text-xs font-semibold tracking-widest cursor-pointer group gap-2">
                    <span className="text-[#00000052]  duration-200 xl:mr-2">{item.id}</span>
                    <span className={`${item.active ? 'text-[#9A7700]' : 'text-black'} group-hover:text-[#9A7700] transition-colors duration-200 flex items-center gap-2 mt-2`}>
                      {item.name}
                      <span className={`${item.active ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-200`}>
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.372 4.68477L6.43453 8.62228C6.35244 8.70437 6.2411 8.75049 6.125 8.75049C6.0089 8.75049 5.89756 8.70437 5.81547 8.62228C5.73338 8.54018 5.68726 8.42884 5.68726 8.31274C5.68726 8.19665 5.73338 8.08531 5.81547 8.00321L9.00648 4.81274H0.4375C0.321468 4.81274 0.210188 4.76665 0.128141 4.6846C0.0460937 4.60256 0 4.49128 0 4.37524C0 4.25921 0.0460937 4.14793 0.128141 4.06588C0.210188 3.98384 0.321468 3.93774 0.4375 3.93774H9.00648L5.81547 0.747275C5.73338 0.665182 5.68726 0.55384 5.68726 0.437743C5.68726 0.321647 5.73338 0.210305 5.81547 0.128212C5.89756 0.0461192 6.0089 0 6.125 0C6.2411 0 6.35244 0.0461192 6.43453 0.128212L10.372 4.06571C10.4127 4.10634 10.445 4.1546 10.467 4.20771C10.489 4.26082 10.5003 4.31775 10.5003 4.37524C10.5003 4.43274 10.489 4.48967 10.467 4.54278C10.445 4.59589 10.4127 4.64414 10.372 4.68477Z" fill="currentColor" />
                        </svg>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 bg-[#FEEC04] text-black text-xs font-semibold py-4 px-6 cursor-pointer flex justify-between items-center hover:bg-yellow-300 transition-colors duration-250">
                SIGN IN <span><svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.372 4.68477L6.43453 8.62228C6.35244 8.70437 6.2411 8.75049 6.125 8.75049C6.0089 8.75049 5.89756 8.70437 5.81547 8.62228C5.73338 8.54018 5.68726 8.42884 5.68726 8.31274C5.68726 8.19665 5.73338 8.08531 5.81547 8.00321L9.00648 4.81274H0.4375C0.321468 4.81274 0.210188 4.76665 0.128141 4.6846C0.0460937 4.60256 0 4.49128 0 4.37524C0 4.25921 0.0460937 4.14793 0.128141 4.06588C0.210188 3.98384 0.321468 3.93774 0.4375 3.93774H9.00648L5.81547 0.747275C5.73338 0.665182 5.68726 0.55384 5.68726 0.437743C5.68726 0.321647 5.73338 0.210305 5.81547 0.128212C5.89756 0.0461192 6.0089 0 6.125 0C6.2411 0 6.35244 0.0461192 6.43453 0.128212L10.372 4.06571C10.4127 4.10634 10.445 4.1546 10.467 4.20771C10.489 4.26082 10.5003 4.31775 10.5003 4.37524C10.5003 4.43274 10.489 4.48967 10.467 4.54278C10.445 4.59589 10.4127 4.64414 10.372 4.68477Z" fill="#1C1A1B" />
                </svg>
                </span>
              </div>
    </motion.div>
  )}
</AnimatePresence>

          </div>

          {/* Top Right: Split Toggle Button */}
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

        {/* Bottom Section: Typography */}
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

          <div className="text-right text-white text-xs font-semibold leading-relaxed uppercase pointer-events-auto  drop-shadow-md" onClick={(e) => e.stopPropagation()}>
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

      {/* Sidebar Cart Drawer */}
      <SidebarCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        clearCart={clearCart}
      />

    </div>
  );
};

export default App;