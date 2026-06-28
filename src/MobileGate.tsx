import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';


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

    const resizeObserver = new ResizeObserver(() => resize());
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
      style={{ mixBlendMode: 'soft-light', opacity: 0.28 }}
    />
  );
};

export const MobileGate = () => {
  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden md:hidden"
      style={{ backgroundColor: '#0D0F0B' }}
    >
     
      <GrainEffect />

      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}
      />

 
      <div
        className="absolute -top-32 -left-32 w-120 h-120 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(254,236,4,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-10 max-w-xs"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Lavis"
          className="w-24 mb-12 select-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />

        {/* Divider */}
        <motion.div
          className="w-8 h-px mb-10"
          style={{ backgroundColor: 'rgba(254,236,4,0.6)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        />

        {/* Eyebrow */}
        <motion.p
          className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans font-medium mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Experience
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-serif font-light italic text-white text-[38px] leading-[1.1] tracking-[-0.02em] mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Crafted for<br />the Desktop
        </motion.h1>

        {/* Body */}
        <motion.p
          className="text-white/40 text-[11.5px] font-sans font-light leading-relaxed tracking-wide mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          This collection is best explored on a larger screen. Please revisit us on your laptop or
          desktop to enjoy the full immersive experience.
        </motion.p>

        {/* Desktop monitor icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <svg
            width="40"
            height="33"
            viewBox="0 0 40 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.25 }}
          >
            <rect x="1" y="1" width="38" height="24" rx="3" stroke="white" strokeWidth="1.5" />
            <path d="M14 32H26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 25V32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom brand stamp */}
      <motion.p
        className="absolute bottom-8 text-white/15 text-[9px] uppercase tracking-[0.35em] font-sans z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        Lavis — Since 1925
      </motion.p>
    </div>
  );
};
