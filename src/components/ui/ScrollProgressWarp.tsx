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

      {/* 2. Floating 2D Green Warp Pipe / Quick-Elevator Button */}
      {showWarpButton && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={handleWarpTop}
            className="group flex flex-col items-center cursor-pointer focus:outline-none"
            title="Warp Pipe: Return to World 1-1 (Top)"
          >
            {/* Peeking Micro Power-up Creature On Hover */}
            <div className="text-sm opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none select-none">
              {getThemePeeker()}
            </div>

            {/* Pipe Lip / Portal */}
            <div className="pipe-rim px-3 py-1 flex items-center gap-1.5 shadow-[3px_4px_0px_#1E232B] group-hover:-translate-y-1 group-hover:shadow-[4px_6px_0px_#1E232B] group-active:translate-y-1 group-active:shadow-[1px_1px_0px_#1E232B] transition-all">
              <span className="font-pixel text-[8px] text-white animate-bounce group-hover:scale-125">▲</span>
              <span className="font-pixel text-[8px] text-white group-hover:tracking-wider transition-all">WARP 1-1</span>
            </div>

            {/* Pipe Neck */}
            <div className="pipe-body w-14 h-4 shadow-[3px_4px_0px_#1E232B]" />
          </button>
        </motion.div>
      )}
    </>
  );
}
