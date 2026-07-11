import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 pt-16 max-w-415.75 mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
        <div className="xl:max-w-278.25 max-w-[70%]">
          <p className="text-mist text-xs font-medium text-left tracking-[-6%]">
            Since 1925, Venus believed that true luxury is never rushed—it is patiently shaped, refined, and perfected over generations. Every curve is intentional, every material carefully chosen, and every detail crafted to stand the test of time. Rooted in Italy's rich design heritage, our collections celebrate the harmony of timeless craftsmanship and contemporary living. More than furniture, each piece carries a legacy of history, elegance, and enduring character into the homes where life's most meaningful moments unfold.
          </p>
        </div>

        <div className="text-left md:text-right text-white text-xs tracking-wide leading-relaxed uppercase">
          <p className="font-semibold text-white/80">WESTON</p>
          <p>10 SUNTRACT ROAD, TORONTO, ON</p>
          <p>
            MONOPHONE NUMBER:{' '}
            <a
              href="tel:4162438300"
              className="underline underline-offset-4 hover:text-custom transition-colors duration-200"
            >
              416-243-8300
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px] text-white/30">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Lavis"
            className="w-33 h-auto hover:grayscale-0 transition-all duration-300"
          />
          <p className="text-white text-xs">© 2026 Lavis. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-white cursor-pointer transition-colors duration-250" title="TikTok">
            <FaTiktok size={20} />
          </span>
          <span className="text-white cursor-pointer transition-colors duration-250" title="Instagram">
            <FaInstagram size={20} />
          </span>
          <span className="text-white cursor-pointer transition-colors duration-250" title="Facebook">
            <FaFacebookF size={20} />
          </span>
          <span className="text-white cursor-pointer transition-colors duration-250" title="LinkedIn">
            <FaLinkedinIn size={20} />
          </span>
        </div>
      </div>
    </footer>
  );
};
