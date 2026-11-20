import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

export interface GameSectionDividerProps {
  stageFrom: string;
  stageFromName: string;
  stageTo: string;
  stageToName: string;
  toSectionId: string;
  flavor?: 'mario' | 'zelda' | 'arcade' | 'dungeon' | 'castle';
  onCoinCollect?: (amount?: number) => void;
}

export function GameSectionDivider({
  stageFrom,
  stageFromName,
  stageTo,
  stageToName,
  toSectionId,
  flavor = 'mario',
  onCoinCollect,
}: GameSectionDividerProps) {
  // State for interactive question blocks (each block can be struck once for a coin!)
  const [leftHit, setLeftHit] = useState(false);
  const [rightHit, setRightHit] = useState(false);
  const [centerHit, setCenterHit] = useState(false);

  const [leftCoinPop, setLeftCoinPop] = useState(false);
  const [rightCoinPop, setRightCoinPop] = useState(false);
  const [centerPowerPop, setCenterPowerPop] = useState(false);

  const handleHitLeftBlock = () => {
    if (leftHit) {
      soundEffects.playSelect();
      return;
    }
    setLeftHit(true);
    setLeftCoinPop(true);
    soundEffects.playCoin();
    onCoinCollect?.(1);
    setTimeout(() => setLeftCoinPop(false), 900);
  };

  const handleHitRightBlock = () => {
    if (rightHit) {
      soundEffects.playSelect();
      return;
    }
    setRightHit(true);
    setRightCoinPop(true);
    soundEffects.playCoin();
    onCoinCollect?.(1);
    setTimeout(() => setRightCoinPop(false), 900);
  };

  const handleHitCenterBlock = () => {
    if (centerHit) {
      soundEffects.playSelect();
      return;
    }
    setCenterHit(true);
    setCenterPowerPop(true);
    soundEffects.playPowerup();
    onCoinCollect?.(5);
    setTimeout(() => setCenterPowerPop(false), 1200);
  };

  // Center power-up icon by flavor
  const getCenterIcon = () => {
    switch (flavor) {
      case 'zelda': return '💎';
      case 'arcade': return '🎮';
      case 'dungeon': return '⚡';
      case 'castle': return '👑';
      default: return '🍄';
    }
  };

  const getCenterLabel = () => {
    switch (flavor) {
      case 'zelda': return 'RUPEE';
      case 'arcade': return '1-UP';
      case 'dungeon': return 'SUPER';
      case 'castle': return 'GOAL';
      default: return 'POWER';
    }
  };

  return (
    <div className="relative w-full py-10 my-4 flex flex-col items-center justify-center select-none z-20">
      {/* 1. Vertical Connecting Path Guideline (Animated Chevrons) */}
      <div className="flex flex-col items-center mb-4 opacity-75">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] mb-1" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] mb-1 opacity-60" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] mb-2 opacity-30" />
        <ChevronDown className="w-4 h-4 text-[var(--theme-primary)] animate-bounce" />
      </div>

      {/* 2. Authentic Floating 2D Game Blocks Formation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 py-2"
      >
        {/* Block 1: Outer Brick / Stone */}
        <div 
          onClick={() => soundEffects.playSelect()}
          className="w-11 h-11 sm:w-12 sm:h-12 game-brick-block flex items-center justify-center group"
          title="Classic 2D Brick Block"
        >
          <div className="w-2 h-2 rounded-full bg-[#7C2D12] opacity-60" />
        </div>

        {/* Block 2: Interactive Mystery Question Block [?] */}
        <div className="relative">
          <button
            onClick={handleHitLeftBlock}
            className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all ${
              leftHit 
                ? 'game-hit-empty-block cursor-default' 
                : 'question-block group hover:scale-110 active:scale-95'
            }`}
            title={leftHit ? "Block Hit! (Empty)" : "Hit Question Block for a Coin!"}
          >
            {leftHit ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#451A03] border border-[#92400E]" />
            ) : (
              <span className="font-pixel text-base sm:text-lg text-white font-black drop-shadow group-hover:scale-125 transition-transform">
                ?
              </span>
            )}
          </button>

          {/* Floating Rising Coin Pop */}
          {leftCoinPop && (
            <div className="absolute left-1/2 top-0 pointer-events-none animate-block-coin-rise flex flex-col items-center">
              <span className="text-xl filter drop-shadow">🪙</span>
              <span className="font-pixel text-[9px] text-[#F59E0B] font-black whitespace-nowrap bg-white/90 px-1 rounded border border-[#1E232B]">
                +100
              </span>
            </div>
          )}
        </div>

        {/* Block 3: Center Special Power-up Block */}
        <div className="relative">
          <button
            onClick={handleHitCenterBlock}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-xl border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] flex flex-col items-center justify-center transition-all cursor-pointer ${
              centerHit 
                ? 'bg-amber-100 border-[#1E232B] shadow-[1px_2px_0px_#1E232B]' 
                : 'bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] hover:scale-110 active:scale-95 hover:shadow-[4px_6px_0px_#1E232B]'
            }`}
            title={`Hit to claim ${getCenterLabel()} Power-up!`}
          >
            <span className={`text-xl sm:text-2xl filter drop-shadow ${centerHit ? 'grayscale-50' : 'animate-bounce'}`}>
              {getCenterIcon()}
            </span>
          </button>

          {/* Special Power-up Pop */}
          {centerPowerPop && (
            <div className="absolute left-1/2 top-0 pointer-events-none animate-block-coin-rise flex flex-col items-center">
              <span className="text-2xl filter drop-shadow">⭐</span>
              <span className="font-pixel text-[10px] text-[var(--theme-primary)] font-black whitespace-nowrap bg-white px-2 py-0.5 rounded-full border-2 border-[#1E232B] shadow-sm">
                LEVEL UP +5!
              </span>
            </div>
          )}
        </div>

        {/* Block 4: Second Interactive Mystery Question Block [?] */}
        <div className="relative">
          <button
            onClick={handleHitRightBlock}
            className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all ${
              rightHit 
                ? 'game-hit-empty-block cursor-default' 
                : 'question-block group hover:scale-110 active:scale-95'
            }`}
            title={rightHit ? "Block Hit! (Empty)" : "Hit Question Block for a Coin!"}
          >
            {rightHit ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#451A03] border border-[#92400E]" />
            ) : (
              <span className="font-pixel text-base sm:text-lg text-white font-black drop-shadow group-hover:scale-125 transition-transform">
                ?
              </span>
            )}
          </button>

          {/* Floating Rising Coin Pop */}
          {rightCoinPop && (
            <div className="absolute left-1/2 top-0 pointer-events-none animate-block-coin-rise flex flex-col items-center">
              <span className="text-xl filter drop-shadow">💎</span>
              <span className="font-pixel text-[9px] text-[#0284C7] font-black whitespace-nowrap bg-white/90 px-1 rounded border border-[#1E232B]">
                +100
              </span>
            </div>
          )}
        </div>

        {/* Block 5: Outer Stone / Brick */}
        <div 
          onClick={() => soundEffects.playSelect()}
          className="w-11 h-11 sm:w-12 sm:h-12 game-stone-dungeon-block flex items-center justify-center group"
          title="2D Fortress Stone Block"
        >
          <div className="w-2 h-2 rounded-full bg-[#1E293B] opacity-60" />
        </div>
      </motion.div>

      {/* 3. Hanging 2D Wooden Milestone Level Gate Signboard */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-3 max-w-xl mx-auto w-full px-4"
      >
        <div className="wooden-sign p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shadow-[4px_5px_0px_#1E232B] group/sign hover:-translate-y-0.5 transition-transform">
          {/* Level Transition Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center font-pixel text-xs flex-shrink-0">
              🚩
            </div>
            <div>
              <div className="font-pixel text-[8px] text-amber-200 tracking-wider">
                {stageFrom} CLEARED • {stageFromName}
              </div>
              <div className="font-display font-black text-xs sm:text-sm text-white drop-shadow flex items-center gap-1.5">
                <span>NEXT:</span>
                <span className="text-amber-100">{stageTo}</span>
                <span className="text-white/60">•</span>
                <span className="text-white uppercase">{stageToName}</span>
              </div>
            </div>
          </div>

          {/* Quick Jump Action Button */}
          <a
            href={`#${toSectionId}`}
            onClick={() => soundEffects.playJump()}
            className="btn-2d-white text-xs py-1.5 px-3.5 rounded-full flex items-center gap-1.5 shadow-sm group-hover/sign:scale-105 transition-transform flex-shrink-0"
            title={`Descend to ${stageTo}`}
          >
            <span className="key-2d w-4 h-4 text-[7px]">▼</span>
            <span className="font-pixel text-[8px] whitespace-nowrap">ENTER {stageTo}</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#1E232B] animate-bounce" />
          </a>
        </div>
      </motion.div>

      {/* 4. Bottom Connecting Dots */}
      <div className="flex items-center gap-1.5 mt-3 opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
        <span className="w-2.5 h-1 rounded-sm bg-[var(--theme-primary)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
      </div>
    </div>
  );
}
