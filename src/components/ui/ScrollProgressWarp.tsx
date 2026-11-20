import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { soundEffects } from '../../utils/soundEffects';

interface ScrollProgressWarpProps {
  currentTheme?: 'zelda' | 'mario' | 'retro';
}

export function ScrollProgressWarp({ currentTheme = 'zelda' }: ScrollProgressWarpProps) {
  const { scrollYProgress, scrollY } = useScroll();
  const [showWarpButton, setShowWarpButton] = useState(false);

  const getThemePeeker = () => {
    switch (currentTheme) {
      case 'zelda': return '🌿';
      case 'retro': return '👾';
      default: return '🍄';
    }
  };

  // Smooth, springy 2D progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowWarpButton(latest > 350);
    });
  }, [scrollY]);

  const handleWarpTop = () => {
    soundEffects.playJump();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. 2D Quest Scroll Progress HUD Track (At the very top edge) */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-[60] pointer-events-none bg-slate-900/10">
        <motion.div
          className="h-full bg-[var(--theme-primary)] origin-left shadow-[0_0_10px_var(--theme-primary)] relative"
          style={{ scaleX }}
        >
          {/* Leading Star / Coin Tracker Head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[var(--theme-accent)] border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] flex items-center justify-center text-[7px] text-white">
            ★
          </div>
        </motion.div>
      </div>

      {/* 2. Floating Console Warp Button (Positioned cleanly directly above PHONES STEREO bar) */}
      {showWarpButton && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-10 sm:bottom-9 right-3 sm:right-5 z-40 pointer-events-auto"
        >
          <button
            onClick={handleWarpTop}
            className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60012] hover:bg-[#CC0010] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:shadow-[3px_3px_0px_#1E232B] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer select-none text-white focus:outline-none"
            title="Warp 1-1: Return to Top"
          >
            {/* Peeking Micro Power-up Creature */}
            <span className="text-[10px] group-hover:-translate-y-0.5 group-hover:scale-125 transition-transform duration-200 select-none">
              {getThemePeeker()}
            </span>
            <span className="font-pixel text-[8px] text-white flex items-center gap-1 font-black tracking-wide">
              <span className="text-[7px] animate-bounce">▲</span>
              <span>WARP 1-1</span>
            </span>
          </button>
        </motion.div>
      )}
    </>
  );
}
