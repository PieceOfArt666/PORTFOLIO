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
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-1.5 sm:py-2 pointer-events-none">
      {/* Main Sleek Single Pill Bar (Matches Image 2 exactly) */}
      <nav className="max-w-7xl w-full mx-auto bg-white border-2 border-[#1E232B] shadow-[2px_3px_0px_#1E232B] rounded-full px-2.5 sm:px-3.5 py-1 pointer-events-auto transition-all">
        <div className="flex items-center justify-between gap-1 sm:gap-2.5 w-full">
          {/* Left: Player Avatar, Name, Coin Counter, World Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <a 
              href="#hero" 
              onClick={() => soundEffects.playSelect()}
              className="flex items-center gap-1.5 group flex-shrink-0"
              title="Return to Hero"
            >
              {/* Mini Character Crest Badge */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[var(--theme-primary)] border-2 border-[#1E232B] flex items-center justify-center text-white font-pixel text-[10px] sm:text-xs shadow-[1px_1px_0px_#1E232B] group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0">
                {getPlayerBadge()}
              </div>

              <div className="font-pixel text-[9px] sm:text-[11px] text-[#1E232B] tracking-wider font-black group-hover:text-[var(--theme-primary)] transition-colors leading-none whitespace-nowrap">
                {PERSONAL_INFO.name.toUpperCase()}
              </div>
            </a>

            {/* Interactive Coin Pill */}
            <div className="relative flex-shrink-0">
              <button
                onClick={handleCoinClick}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none group"
                title={`Click to collect ${currentTheme === 'zelda' ? 'rupee' : currentTheme === 'retro' ? 'star' : 'coin'}!`}
              >
                <span className="text-[#F59E0B] font-bold text-[10px] leading-none group-hover:rotate-12 group-hover:scale-120 transition-transform inline-block">
                  {getCurrencyIcon()}
                </span>
                <span className="font-pixel text-[8px] sm:text-[9px] text-[#1E232B]">
                  x{coins.toString().padStart(2, '0')}
                </span>
              </button>

              {/* Rising +100 Pop Animation */}
              {showCoinPop && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-pixel text-[9px] font-bold text-[var(--theme-primary)] pointer-events-none animate-coin-pop whitespace-nowrap">
                  +100
                </span>
              )}
            </div>

            {/* Active World Badge [▶ WORLD 1-1] */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0F2FE] border-2 border-[#1E232B] font-pixel text-[8px] text-[#0369A1] shadow-[1px_1px_0px_#1E232B] cursor-default flex-shrink-0 whitespace-nowrap">
              <span className="text-[#E60012] text-[7px] leading-none">▶</span>
              <span className="font-bold">{getWorldCode()}</span>
            </div>
          </div>

          {/* Center: Single-Line Level Warp Links with '|' Separators (Desktop / Tablet lg+) */}
          <div className="hidden lg:flex items-center text-xs font-bold flex-shrink-0">
            {navLinks.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <div key={item.id} className="flex items-center">
                  {idx > 0 && (
                    <span className="text-[#1E232B]/35 font-mono font-bold text-[9px] xl:text-[10px] mx-1 xl:mx-1.5 select-none">
                      |
                    </span>
                  )}
                  <a
                    href={`#${item.id}`}
                    onClick={() => soundEffects.playSelect()}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)] text-white border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] font-pixel text-[8px] xl:text-[9px] font-black'
                        : 'px-1 py-0.5 font-mono font-bold text-[9px] xl:text-[10px] text-[#1E232B] hover:text-[var(--theme-primary)] hover:scale-105 transition-transform'
                    }`}
                  >
                    {item.full}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Right: Background Toggle, Theme Switcher, Sound FX & GOAL CTA */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Background Style Switcher [🎮 CONSOLE BG] / [○ WHITE BG] */}
            <button
              onClick={() => {
                soundEffects.playSelect();
                onToggleBgStyle?.();
              }}
              className="px-2 xl:px-2.5 py-0.5 rounded-full bg-slate-50 hover:bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none font-pixel text-[8px] text-[#1E232B] group/bg flex items-center gap-1 flex-shrink-0"
              title={`Background: ${bgStyle === 'white' ? 'White BG (Click for Console)' : 'Console BG (Click for White)'}`}
            >
              {bgStyle === 'white' ? (
                <>
                  <span className="w-2 h-2 rounded-full border border-[#1E232B] bg-white inline-block" />
                  <span className="hidden sm:inline font-bold">WHITE BG</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] inline-block">🎮</span>
                  <span className="hidden sm:inline font-bold">CONSOLE BG</span>
                </>
              )}
            </button>

            {/* Theme Switcher [🍄 MARIO BG] / [🌿 HYRULE BG] / [👾 GBA SP BG] */}
            <button
              onClick={() => {
                soundEffects.playSelect();
                onCycleTheme?.();
              }}
              className="px-2 xl:px-2.5 py-0.5 rounded-full bg-slate-50 hover:bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none font-pixel text-[8px] text-[#1E232B] group/thm flex items-center gap-1 flex-shrink-0"
              title="Switch Theme: 🌿 Zelda ↔ 🍄 Mario ↔ 👾 GBA"
            >
              <span className="text-[10px] inline-block">{getThemeIcon()}</span>
              <span className="hidden sm:inline font-bold">{getThemeLabel()} BG</span>
            </button>

            {/* Sound FX Toggle [🔊] */}
            <button
              onClick={handleToggleSound}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-50 hover:bg-slate-200 border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] flex items-center justify-center text-[#1E232B] transition-all cursor-pointer flex-shrink-0"
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-slate-400" />
              ) : (
                <Volume2 className="w-3 h-3 text-[var(--theme-primary)]" />
              )}
            </button>

            {/* GOAL Button [🔴 GOAL] */}
            <a
              href="#contact"
              onClick={() => soundEffects.playPowerup()}
              className="px-2.5 py-1 rounded-full bg-[#E60012] hover:bg-[#CC0010] text-white border-2 border-[#1E232B] shadow-[1px_1px_0px_#1E232B] flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-2.5 h-2.5 fill-white" />
              <span className="font-pixel text-[8px] sm:text-[9px]">GOAL</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile-Only Secondary Strip (Below lg): Compact, centered capsule pill, zero overflow */}
      <div className="flex lg:hidden max-w-sm mx-auto items-center justify-between gap-1 mt-1 px-2 py-0.5 bg-white/95 backdrop-blur-xs border-2 border-[#1E232B] rounded-full shadow-[2px_2px_0px_#1E232B] pointer-events-auto">
        {navLinks.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => soundEffects.playSelect()}
              className={`flex-1 text-center py-0.5 rounded-full transition-all font-mono font-bold text-[8px] ${
                isActive
                  ? 'bg-[var(--theme-primary)] text-white border border-[#1E232B] font-black'
                  : 'text-slate-600 hover:text-[var(--theme-primary)]'
              }`}
            >
              <span>{item.short}</span>
            </a>
          );
        })}
      </div>
    </header>
  );
}
