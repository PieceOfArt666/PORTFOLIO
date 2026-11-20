import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

interface NavbarProps {
  currentTheme?: 'zelda' | 'mario' | 'retro';
  onCycleTheme?: () => void;
  coins?: number;
  onAddCoin?: () => void;
  bgStyle?: 'white' | 'parallax';
  onToggleBgStyle?: () => void;
}

export function Navbar({ 
  currentTheme = 'zelda', 
  onCycleTheme, 
  coins: propCoins, 
  onAddCoin,
  bgStyle = 'parallax',
  onToggleBgStyle,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [localCoins, setLocalCoins] = useState(42);
  const coins = propCoins !== undefined ? propCoins : localCoins;
  const [showCoinPop, setShowCoinPop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'zelda': return '🌿';
      case 'retro': return '👾';
      default: return '🍄';
    }
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'zelda': return 'HYRULE';
      case 'retro': return 'GBA SP';
      default: return 'MARIO';
    }
  };

  const getCurrencyIcon = () => {
    switch (currentTheme) {
      case 'zelda': return '💎';
      case 'retro': return '⭐';
      default: return '🪙';
    }
  };

  const getPlayerBadge = () => {
    switch (currentTheme) {
      case 'zelda': return 'Z';
      case 'retro': return 'G';
      default: return 'M';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'projects', 'skills', 'contact'];
      const scrollY = window.scrollY;

      // If near bottom of page, highlight contact
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('contact');
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCoinClick = () => {
    soundEffects.playCoin();
    if (onAddCoin) {
      onAddCoin();
    } else {
      setLocalCoins((prev) => prev + 1);
    }
    setShowCoinPop(true);
    setTimeout(() => setShowCoinPop(false), 700);
  };

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEffects.playSelect();
    }
  };

  const getWorldCode = () => {
    switch (activeSection) {
      case 'hero': return 'WORLD 1-1';
      case 'about': return 'WORLD 1-2';
      case 'services': return 'WORLD 1-3';
      case 'projects': return 'WORLD 1-4';
      case 'skills': return 'WORLD 1-5';
      case 'contact': return 'CASTLE 1-6';
      default: return 'WORLD 1-1';
    }
  };

  const navLinks = [
    { id: 'hero', full: '1-1 START', med: 'START', short: '1-1' },
    { id: 'about', full: '1-2 ABOUT', med: 'ABOUT', short: '1-2' },
    { id: 'services', full: '1-3 CRAFT', med: 'CRAFT', short: '1-3' },
    { id: 'projects', full: '1-4 GAMES', med: 'GAMES', short: '1-4' },
    { id: 'skills', full: '1-5 SKILLS', med: 'SKILLS', short: '1-5' },
    { id: 'contact', full: '1-6 CASTLE', med: 'GOAL', short: '1-6' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 py-2.5 pointer-events-none">
      <nav className="max-w-6xl mx-auto bg-white border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] rounded-2xl px-3 sm:px-4 py-2 pointer-events-auto transition-all">
        {/* Desktop Single-Line Layout */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Left: 2D Nintendo Player 1 Name & Live HUD Score */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a 
              href="#hero" 
              onClick={() => soundEffects.playSelect()}
              className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0"
            >
              {/* 2D Mini 8-Bit Character Cap / Crest Icon */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--theme-primary)] border-2 border-[#1E232B] flex items-center justify-center text-white font-pixel text-xs shadow-[2px_2px_0px_#1E232B] group-hover:scale-115 group-hover:rotate-6 transition-all flex-shrink-0">
                {getPlayerBadge()}
              </div>

              <div>
                <div className="font-pixel text-[10px] sm:text-xs text-[#1E232B] tracking-wider font-black group-hover:text-[var(--theme-primary)] transition-colors leading-none whitespace-nowrap">
                  {PERSONAL_INFO.name.toUpperCase()}
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 mt-0.5 hidden 2xl:block">
                  SCORE: 094,200
                </div>
              </div>
            </a>

            {/* 2D Interactive Currency Counter (Coins / Rupees / Stars) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={handleCoinClick}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:scale-105 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E232B] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer select-none group"
                title={`Click to collect ${currentTheme === 'zelda' ? 'rupee' : currentTheme === 'retro' ? 'star' : 'coin'}!`}
              >
                <span className="text-[#F59E0B] font-bold text-xs leading-none group-hover:rotate-12 group-hover:scale-120 transition-transform inline-block">
                  {getCurrencyIcon()}
                </span>
                <span className="font-pixel text-[9px] text-[#1E232B]">
                  x{coins.toString().padStart(2, '0')}
                </span>
              </button>

              {/* Rising +100 Pop Animation */}
              {showCoinPop && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-pixel text-[10px] font-bold text-[var(--theme-primary)] pointer-events-none animate-coin-pop whitespace-nowrap">
                  +100
                </span>
              )}
            </div>

            {/* Active World Badge on Extra Large Screens (>= 1536px only) */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E0F2FE] border-2 border-[#1E232B] font-pixel text-[8px] text-[#0369A1] shadow-[2px_2px_0px_#1E232B] hover:scale-105 transition-transform cursor-default flex-shrink-0">
              <span>🚩</span>
              <span>{getWorldCode()}</span>
            </div>
          </div>

          {/* Center: 2D Level Warp Links (Visible on xl+ screens) */}
          <div className="hidden xl:flex items-center gap-1 xl:gap-1.5 text-xs font-bold no-scrollbar flex-shrink-0">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => soundEffects.playSelect()}
                  className={`px-2 xl:px-2.5 py-1 rounded-lg border-2 transition-all font-mono font-bold text-[10px] xl:text-[11px] whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--theme-primary)] text-white border-[#1E232B] shadow-[2px_2px_0px_#1E232B] font-black'
                      : 'border-transparent text-slate-700 hover:border-[#1E232B] hover:bg-slate-100 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#1E232B]'
                  }`}
                >
                  <span className="hidden 2xl:inline">{item.full}</span>
                  <span className="inline 2xl:hidden">{item.med}</span>
                </a>
              );
            })}
          </div>

          {/* Right: Background Toggle, Theme Switcher, Sound FX & Let's Talk CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Background Style Switcher */}
            <button
              onClick={() => {
                soundEffects.playSelect();
                onToggleBgStyle?.();
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:scale-105 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E232B] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer select-none font-pixel text-[8px] text-[#1E232B] group/bg flex-shrink-0"
              title={`Background: ${bgStyle === 'white' ? 'Pure White (Click for Console Parallax)' : 'Game Console Parallax (Click for Pure White)'}`}
            >
              {bgStyle === 'white' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full border border-[#1E232B] bg-white shadow-xs inline-block group-hover/bg:scale-125 transition-transform" />
                  <span className="hidden 2xl:inline font-bold">WHITE BG</span>
                </>
              ) : (
                <>
                  <span className="text-xs inline-block group-hover/bg:rotate-12 transition-transform">🎮</span>
                  <span className="hidden 2xl:inline font-bold">CONSOLE BG</span>
                </>
              )}
            </button>

            {/* 2D Theme Switcher Pill */}
            <button
              onClick={() => {
                soundEffects.playSelect();
                onCycleTheme?.();
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:scale-105 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E232B] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer select-none font-pixel text-[8px] text-[#1E232B] group/thm flex-shrink-0"
              title="Switch Theme: 🌿 Zelda ↔ 🍄 Mario ↔ 👾 GBA"
            >
              <span className="group-hover/thm:rotate-45 group-hover/thm:scale-120 transition-transform inline-block">{getThemeIcon()}</span>
              <span className="hidden 2xl:inline font-bold">{getThemeLabel()}</span>
            </button>

            {/* Sound FX Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:scale-110 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E232B] active:translate-y-0.5 active:shadow-none flex items-center justify-center text-[#1E232B] transition-all cursor-pointer group/snd flex-shrink-0"
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover/snd:scale-110 transition-transform" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[var(--theme-primary)] group-hover/snd:scale-120 transition-transform" />
              )}
            </button>

            {/* Let's Talk Button (GOAL) */}
            <a
              href="#contact"
              onClick={() => soundEffects.playPowerup()}
              className="btn-2d-red text-[10px] sm:text-xs py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full inline-flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 fill-white" />
              <span className="font-pixel text-[8px] sm:text-[9px]">GOAL</span>
            </a>
          </div>
        </div>

        {/* Mobile & Tablet Level Navigation Strip (< xl screens): Evenly distributed 6 level buttons, zero overflow, zero scrollbar */}
        <div className="flex xl:hidden items-center justify-between gap-1 pt-2 mt-1.5 border-t border-slate-100 no-scrollbar">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => soundEffects.playSelect()}
                className={`flex-1 text-center py-1 rounded-md border-2 transition-all font-mono font-bold text-[9px] sm:text-[10px] ${
                  isActive
                    ? 'bg-[var(--theme-primary)] text-white border-[#1E232B] shadow-[1px_1px_0px_#1E232B] font-black'
                    : 'border-transparent text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.med}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
