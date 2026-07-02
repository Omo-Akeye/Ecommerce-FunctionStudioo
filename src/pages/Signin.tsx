import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate} from 'react-router';
import { Toast } from '../components/Toast';
import { Footer } from '../components/Footer';
import slider1 from '../assets/sign-slider2.png';
import slider2 from '../assets/signin-slider2.png';
import slider3 from '../assets/sigin-slider3.png';
import slider4 from '../assets/sigin-slider4.png';

interface ToastItem {
  id: string;
  message: string;
}

const sliderImages = [slider1, slider2, slider3, slider4];

export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addToast = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      addToast('Please enter your email address.');
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Please enter a valid email address.');
      return;
    }

    // Simulated successful sign in
    addToast('Authentication link has been sent to your email.');
    setEmail('');
    
    // Optional: Redirect user after a short delay
    setTimeout(() => {
      navigate('/collections');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#30332D] text-white font-sans flex flex-col justify-between overflow-x-hidden relative pt-[10%] pb-12">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Close Button top-right */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 right-8 text-white hover:text-custom transition-all duration-300 cursor-pointer z-50 p-2"
        aria-label="Close"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
<main className="grow flex items-center justify-center px-8 mb-40.75">
  <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-16 xl:gap-20.75 w-full max-w-7xl">


    <div className="flex flex-col lg:items-start items-center lg:justify-self-end">
      <h1 className="text-white text-5xl md:text-[56px] font-semibold tracking-[-0.06em] uppercase mb-6 nowhitespace">
        SIGN IN
      </h1>
      <p className="text-xl text-white font-medium nowhitespace">
        Sign in or create an account
      </p>
    </div>

<div className="flex flex-col items-center gap-6 justify-self-center w-full">
  <div className="w-full h-auto max-w-95 max-h-119 aspect-380/476 overflow-hidden rounded-[30px] border border-white/5 relative flex items-center justify-center">
    <AnimatePresence mode="popLayout">
      <motion.img
        key={currentSlide}
        src={sliderImages[currentSlide]}
        alt={`Slide ${currentSlide + 1}`}
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </AnimatePresence>
  </div>

  <div className="flex gap-2">
    {sliderImages.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentSlide(idx)}
        className={`h-0.75 rounded-full transition-all duration-300 cursor-pointer ${
          currentSlide === idx ? 'w-8 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'
        }`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ))}
  </div>
</div>




<div className="flex flex-col lg:items-start items-center justify-center lg:justify-self-start w-full max-w-85">
  <form onSubmit={handleSubmit} className="flex flex-col gap-7 w-full">
    <div className="relative w-full">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-full font-semibold px-5 py-4 rounded-full bg-[#515251] h-14 text-white tracking-[-6%] leading-5.75 placeholder-white focus:outline-none focus:border-custom/50 focus:ring-1 focus:ring-custom/50 transition-all duration-300 text-lg"
        required
      />
    </div>
    <div className="w-full max-w-36 inline-block">
      <button
        type="submit"
        className="w-full bg-custom hover:bg-yellow-300 text-black underline font-semibold py-4 rounded-full transition-all duration-300 cursor-pointer text-xl uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
      >
        CONTINUE
      </button>
    </div>

    <p className="text-sm text-white tracking-wide text-center leading-[20.84px]">
      By continuing, you agree to our{' '}
      <a href="#" className="underline hover:text-white/40 transition-colors duration-200">
        TERMS AND CONDITIONS
      </a>
    </p>
  </form>
</div>

  </div>
</main>


   
      <Footer />
    </div>
  );
};
