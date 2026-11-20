import { useState, useEffect } from 'react';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/ui/Hero';
import { AboutMe } from './components/ui/AboutMe';
import { AboutPhilosophy } from './components/ui/AboutPhilosophy';
import { Projects } from './components/ui/Projects';
import { Skills } from './components/ui/Skills';
import { Contact } from './components/ui/Contact';
import { StudioAtmosphere } from './components/ui/StudioAtmosphere';
import { ScrollProgressWarp } from './components/ui/ScrollProgressWarp';
import { GameSectionDivider } from './components/ui/GameSectionDivider';

export type ThemeMode = 'zelda' | 'mario' | 'retro';
export type BgStyle = 'white' | 'parallax';

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abhijith-theme') as ThemeMode;
      if (saved && ['zelda', 'mario', 'retro'].includes(saved)) {
        return saved;
      }
    }
    return 'mario'; // Default to Mario theme matching reference header!
  });

  // Background style state: Default is now Game Console Parallax!
  const [bgStyle, setBgStyle] = useState<BgStyle>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abhijith-bg-style-v2') as BgStyle;
      if (saved && ['white', 'parallax'].includes(saved)) {
        return saved;
      }
    }
    return 'parallax'; // Default is Game Console Parallax as requested!
  });

  const [coins, setCoins] = useState(42);

  const handleCollectCoin = (amount = 1) => {
    setCoins((prev) => prev + amount);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('abhijith-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bg-style', bgStyle);
    localStorage.setItem('abhijith-bg-style-v2', bgStyle);
  }, [bgStyle]);

  const handleCycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'zelda') return 'mario';
      if (prev === 'mario') return 'retro';
      return 'zelda';
    });
  };

  const handleToggleBgStyle = () => {
    setBgStyle((prev) => (prev === 'white' ? 'parallax' : 'white'));
  };

  return (
    <div className={`relative min-h-screen text-[var(--theme-text)] selection:bg-[var(--theme-primary)] selection:text-white font-sans overflow-x-hidden transition-colors duration-300 ${bgStyle === 'white' ? 'bg-white' : ''}`}>
      {/* 1. 2D Nintendo Platformer Atmosphere with Dual-Axis Parallax */}
      <StudioAtmosphere currentTheme={theme} bgStyle={bgStyle} />

      {/* 2. 2D Nintendo HUD Top Bar with Background Switcher, Theme Switcher & Global Coin Score */}
      <Navbar 
        currentTheme={theme} 
        onCycleTheme={handleCycleTheme} 
        coins={coins} 
        onAddCoin={() => handleCollectCoin(1)}
        bgStyle={bgStyle}
        onToggleBgStyle={handleToggleBgStyle}
      />

      {/* 2b. Scroll Quest Progress Bar & Warp Pipe Elevator */}
      <ScrollProgressWarp currentTheme={theme} />

      {/* 3. Main 2D Nintendo Game Developer Content with Authentic Section Divider Blocks */}
      <main className="relative z-10 flex flex-col">
        <Hero />

        {/* Level Transition 1: 1-1 START ➜ 1-2 ABOUT */}
        <GameSectionDivider
          stageFrom="WORLD 1-1"
          stageFromName="PLAYER SPAWN"
          stageTo="WORLD 1-2"
          stageToName="PLAYER ATTRIBUTES"
          toSectionId="about"
          flavor="mario"
          onCoinCollect={handleCollectCoin}
        />

        <AboutMe />

        {/* Level Transition 2: 1-2 ABOUT ➜ 1-3 CRAFT */}
        <GameSectionDivider
          stageFrom="WORLD 1-2"
          stageFromName="PLAYER ATTRIBUTES"
          stageTo="WORLD 1-3"
          stageToName="GAME CRAFT & SYSTEMS"
          toSectionId="services"
          flavor="zelda"
          onCoinCollect={handleCollectCoin}
        />

        <AboutPhilosophy />

        {/* Level Transition 3: 1-3 CRAFT ➜ 1-4 GAMES */}
        <GameSectionDivider
          stageFrom="WORLD 1-3"
          stageFromName="CRAFT & PHILOSOPHY"
          stageTo="WORLD 1-4"
          stageToName="SHIPPED GAMES"
          toSectionId="projects"
          flavor="arcade"
          onCoinCollect={handleCollectCoin}
        />

        <Projects />

        {/* Level Transition 4: 1-4 GAMES ➜ 1-5 SKILLS */}
        <GameSectionDivider
          stageFrom="WORLD 1-4"
          stageFromName="GAMES SHOWCASE"
          stageTo="WORLD 1-5"
          stageToName="CORE SKILLS & TECH"
          toSectionId="skills"
          flavor="dungeon"
          onCoinCollect={handleCollectCoin}
        />

        <Skills />

        {/* Level Transition 5: 1-5 SKILLS ➜ 1-6 CASTLE GOAL */}
        <GameSectionDivider
          stageFrom="WORLD 1-5"
          stageFromName="TOOLBOX & ARCHITECTURE"
          stageTo="WORLD 1-6"
          stageToName="THE CASTLE GOAL"
          toSectionId="contact"
          flavor="castle"
          onCoinCollect={handleCollectCoin}
        />

        <Contact />
      </main>
    </div>
  );
}

export default App;
