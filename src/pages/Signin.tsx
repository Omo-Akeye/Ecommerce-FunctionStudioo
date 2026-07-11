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
    <div className="min-h-screen bg-charcoal text-white font-sans flex flex-col justify-between overflow-x-hidden relative pt-[10%] pb-12">
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
<main className="grow flex items-center justify-center px-6 md:px-8 w-full mb-20 md:mb-40.75">
  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16 w-full max-w-225">

    {/* Left Side: Slider */}
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full h-auto aspect-380/476 max-w-95 overflow-hidden rounded-[30px] relative flex items-center justify-center">
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

    {/* Right Side: Sign In Form */}
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col items-start mb-13">
        <h1 className="text-white text-4xl md:text-[56px] font-semibold tracking-[-0.06em] uppercase mb-5.5 leading-none">
          SIGN IN
        </h1>
        <p className="text-base text-white font-medium">
          Sign in or create an account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="relative w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full font-semibold px-6 py-4 rounded-full bg-smoke h-14 text-white placeholder-white focus:outline-none focus:border-custom/50 focus:ring-1 focus:ring-custom/50 transition-all duration-300 text-base"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="inline-block px-8 bg-custom hover:bg-yellow-400 text-black font-semibold py-3 rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
          >
            CONTINUE
          </button>
        </div>

        <p className="text-sm text-white mt-2">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-white/80 transition-colors duration-200">
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
