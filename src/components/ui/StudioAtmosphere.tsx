import { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface StudioAtmosphereProps {
  currentTheme?: 'zelda' | 'mario' | 'retro';
  bgStyle?: 'white' | 'parallax';
}

export function StudioAtmosphere({ currentTheme = 'zelda', bgStyle = 'white' }: StudioAtmosphereProps) {
  const { scrollY, scrollYProgress } = useScroll();

  // 1. Mouse Position Tracker Normalized [-1, 1] (Unconditional Hook Execution)
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Buttery-smooth spring physics (camera gimbal & joystick tilt inertia)
  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const mouseX = useSpring(rawMouseX, springConfig);
  const mouseY = useSpring(rawMouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rawMouseX.set(nx);
      rawMouseY.set(ny);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  // 2. Multi-Plane Horizontal Mouse Parallax Offsets
  const bgMouseX = useTransform(mouseX, [-1, 1], [-18, 18]);
  const midMouseX = useTransform(mouseX, [-1, 1], [-38, 38]);
  const controllersMouseX = useTransform(mouseX, [-1, 1], [-55, 55]);
  const keysMouseX = useTransform(mouseX, [-1, 1], [-75, 75]);
  const particlesMouseX = useTransform(mouseX, [-1, 1], [-95, 95]);
  const glareMouseX = useTransform(mouseX, [-1, 1], [-50, 50]);

  // Dynamic Joystick Tilt responding in real-time to mouse cursor position
  const joystickTiltX = useTransform(mouseX, [-1, 1], [-22, 22]);
  const joystickTiltY = useTransform(mouseY, [-1, 1], [-18, 18]);

  // 3. Multi-Plane Vertical Mouse Parallax Offsets
  const bgMouseY = useTransform(mouseY, [-1, 1], [-12, 12]);
  const midMouseY = useTransform(mouseY, [-1, 1], [-26, 26]);
  const controllersMouseY = useTransform(mouseY, [-1, 1], [-40, 40]);
  const keysMouseY = useTransform(mouseY, [-1, 1], [-58, 58]);
  const particlesMouseY = useTransform(mouseY, [-1, 1], [-75, 75]);
  const glareMouseY = useTransform(mouseY, [-1, 1], [-35, 35]);

  // 4. Multi-Plane Vertical Scroll Parallax Offsets
  const gridScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const controllersScrollY = useTransform(scrollY, [0, 3500], [0, -380]);
  const keysScrollY = useTransform(scrollY, [0, 3500], [0, -520]);
  const particlesScrollY = useTransform(scrollY, [0, 3500], [0, -680]);

  // Theme-specific decorative particles & items
  const getThemeParticleIcon = (index: number) => {
    switch (currentTheme) {
      case 'zelda':
        return index % 2 === 0 ? '🍃' : '💎';
      case 'mario':
        return index % 2 === 0 ? '🍄' : '⭐';
      case 'retro':
        return index % 2 === 0 ? '👾' : '✦';
      default:
        return '✦';
    }
  };

  // Diegetic Console Screen Model Branding
  const getConsoleModelName = () => {
    switch (currentTheme) {
      case 'zelda': return 'NINTENDO • DMG-01 // BACKLIT LCD';
      case 'retro': return 'GAME BOY ADVANCE SP // AGS-101 BRIGHT';
      default: return 'NINTENDO • CGB-001 // COLOR TFT';
    }
  };

  // Safe unconditional JSX return: When bgStyle is 'white', render clean pure white backdrop
  if (bgStyle === 'white') {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-white transition-opacity duration-300" 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* ========================================================
          CONSOLE CHASSIS SCREEN BEZEL & DIEGETIC HARDWARE FRAME
          ======================================================== */}
      <div className="absolute inset-0 border-[6px] sm:border-[10px] border-[#1E232B] rounded-none sm:rounded-[20px] pointer-events-none z-30 shadow-[inset_0_0_12px_rgba(0,0,0,0.55)]">
        {/* Top Console Hardware Bar */}
        <div className="absolute top-2.5 left-4 right-4 hidden xl:flex items-center justify-between font-pixel text-[8px] text-[#1E232B] font-black pointer-events-none z-30">
          <div className="flex items-center gap-1.5 bg-white/85 px-2.5 py-1 rounded-full border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-pulse shadow-sm" />
            <span>POWER / CH 1-1</span>
          </div>

          <div className="flex items-center gap-2 bg-white/85 px-2.5 py-1 rounded-full border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] backdrop-blur-xs">
            <span className="font-mono text-[9px] font-bold text-slate-800">60 FPS</span>
            <span className="text-[var(--theme-primary)]">■■■■</span>
            <span>BATTERY</span>
          </div>
        </div>

        {/* Bottom Console Hardware Status Bar */}
        <div className="absolute bottom-2 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between font-pixel text-[7px] sm:text-[8px] text-[#1E232B] font-black pointer-events-none z-30">
          <div className="bg-white/90 px-2.5 py-0.5 rounded-full border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] backdrop-blur-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
            <span>{getConsoleModelName()}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-white/90 px-2.5 py-0.5 rounded-full border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] backdrop-blur-xs">
            <span>PHONES</span>
            <span className="text-[var(--theme-accent)] tracking-tighter">◄ ❚❚❚❚❚ ►</span>
            <span>STEREO SOUND</span>
          </div>
        </div>

        {/* 4 Corner Screws */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#1E232B]/35 border border-[#1E232B]/60 hidden sm:block" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#1E232B]/35 border border-[#1E232B]/60 hidden sm:block" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#1E232B]/35 border border-[#1E232B]/60 hidden sm:block" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#1E232B]/35 border border-[#1E232B]/60 hidden sm:block" />
      </div>

      {/* ========================================================
          LAYER 1: RETRO GAME ENGINE BLUEPRINT & PIXEL MATRIX CANVAS
          (Pure 2D retro tech grid — No landscape / island elements)
          ======================================================== */}
      <motion.div
        style={{ y: gridScrollY }}
        className="absolute -inset-10 select-none will-change-transform"
      >
        <motion.div
          style={{ x: bgMouseX, y: bgMouseY }}
          className="w-full h-[120%] relative opacity-85"
        >
          {/* Subtle 2D Retro Developer Coordinate Crosshairs & Dot Mesh */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at center, rgba(30, 35, 43, 0.12) 1.5px, transparent 1.5px),
                linear-gradient(to right, rgba(30, 35, 43, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(30, 35, 43, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 80px 80px, 80px 80px',
            }}
          />

          {/* Faint Retro Dev Coordinate Stamp Watermarks (Moves on Mid-Plane Parallax) */}
          <motion.div 
            style={{ x: midMouseX, y: midMouseY }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-24 left-10 hidden xl:flex flex-col gap-1 font-pixel text-[8px] text-[#1E232B]/20 tracking-wider">
              <span>[ DEV_GRID // 320x240 VRAM ]</span>
              <span>POS: X:0000 Y:0000 Z:00</span>
              <span>BUFFER: 16-BIT RETRO COLOR</span>
            </div>

            <div className="absolute top-36 right-12 hidden xl:flex flex-col items-end gap-1 font-pixel text-[8px] text-[#1E232B]/20 tracking-wider">
              <span>[ SYSTEM: SPRITE ENGINE 2.0 ]</span>
              <span>LAYER: HARDWARE CONTROLLERS</span>
            </div>

            <div className="absolute bottom-28 left-12 hidden xl:flex flex-col gap-1 font-pixel text-[8px] text-[#1E232B]/20 tracking-wider">
              <span>[ AUDIO: 4-CH STEREO SYNTH ]</span>
              <span>SAMPLE RATE: 44.1 KHZ</span>
            </div>

            <div className="absolute bottom-28 right-16 hidden xl:flex flex-col items-end gap-1 font-pixel text-[8px] text-[#1E232B]/20 tracking-wider">
              <span>[ MEMORY: 64KB WRAM / 8KB VRAM ]</span>
              <span>REFRESH: 60 HZ SYNCHRONIZED</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          LAYER 2: 2D PIXEL GAMEPAD CONTROLLERS & ARCADE JOYSTICKS
          ======================================================== */}
      <motion.div
        style={{ y: controllersScrollY }}
        className="absolute inset-0 select-none will-change-transform pointer-events-none"
      >
        <motion.div
          style={{ x: controllersMouseX, y: controllersMouseY }}
          className="w-full h-full relative"
        >
          {/* Controller 1: Classic 2D NES / Famicom Pixel Gamepad (Floating on Mid-Left) */}
          <div className="absolute top-[22%] left-[3%] hidden lg:flex flex-col items-center opacity-75 animate-pixel-island">
            <div className="w-44 h-22 bg-[#D4D4D8] border-3 border-[#1E232B] rounded-xl shadow-[4px_5px_0px_#1E232B] p-2.5 flex items-center justify-between relative overflow-hidden">
              {/* Metallic Bezel Strip */}
              <div className="absolute inset-x-2 top-2 h-4 bg-[#71717A]/20 rounded-sm" />

              {/* Pixel Cross D-Pad [+] */}
              <div className="w-11 h-11 relative flex items-center justify-center z-10">
                <div className="w-4 h-11 bg-[#1E232B] rounded-xs shadow-xs" />
                <div className="h-4 w-11 bg-[#1E232B] rounded-xs absolute shadow-xs" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3F3F46] absolute z-20" />
              </div>

              {/* Center Select / Start Pills */}
              <div className="flex items-center gap-1.5 z-10 -mt-2">
                <div className="w-4 h-1.5 bg-[#1E232B] rounded-full rotate-[-25deg]" />
                <div className="w-4 h-1.5 bg-[#1E232B] rounded-full rotate-[-25deg]" />
              </div>

              {/* Action Buttons [B] [A] */}
              <div className="flex items-center gap-2.5 z-10 pr-1">
                <div className="w-5.5 h-5.5 rounded-full bg-[#E60012] border-2 border-[#1E232B] shadow-[1px_2px_0px_#1E232B] flex items-center justify-center text-[7px] font-pixel text-white font-black">
                  B
                </div>
                <div className="w-5.5 h-5.5 rounded-full bg-[#E60012] border-2 border-[#1E232B] shadow-[1px_2px_0px_#1E232B] flex items-center justify-center text-[7px] font-pixel text-white font-black -mt-3">
                  A
                </div>
              </div>
            </div>
            {/* Hanging Cord */}
            <div className="w-1.5 h-14 border-l-2 border-[#1E232B] -mt-1 opacity-70" />
            <span className="font-pixel text-[7px] text-[#1E232B] bg-white/85 px-2 py-0.5 rounded-full border border-[#1E232B] shadow-xs -mt-1">
              NES PAD
            </span>
          </div>

          {/* Controller 2: Interactive Real-Time Tilting Arcade Joystick Rig (Floating on Mid-Right) */}
          <div className="absolute top-[48%] right-[3%] hidden lg:flex flex-col items-center opacity-80 animate-pixel-island" style={{ animationDelay: '2.5s' }}>
            {/* Arcade Plate */}
            <div className="w-40 h-30 bg-[#1E293B] border-3 border-[#1E232B] rounded-2xl shadow-[4px_6px_0px_#1E232B] p-3 flex items-center justify-between relative overflow-hidden">
              {/* Corner Screw Rivets */}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />

              {/* The Joystick Rig: Tilts based on mouse cursor position! */}
              <div className="w-16 h-16 relative flex items-center justify-center">
                {/* Dust Washer Base Disk */}
                <div className="w-11 h-11 rounded-full bg-[#0F172A] border-2 border-[#1E232B] shadow-inner" />

                {/* Tilting Stick Shaft & Ball-Top Knob */}
                <motion.div
                  style={{
                    x: joystickTiltX,
                    y: joystickTiltY,
                  }}
                  className="absolute flex flex-col items-center z-20 pointer-events-none"
                >
                  {/* Ball-Top Knob */}
                  <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/60 absolute top-1 left-1" />
                  </div>
                  {/* Metallic Shaft */}
                  <div className="w-2 h-4.5 bg-slate-300 border-x border-[#1E232B] -mt-0.5" />
                </motion.div>
              </div>

              {/* 4 Arcade Pushbuttons */}
              <div className="grid grid-cols-2 gap-2 z-10 pr-1">
                <div className="w-5 h-5 rounded-full bg-[#3B82F6] border-2 border-[#1E232B] shadow-xs" />
                <div className="w-5 h-5 rounded-full bg-[#EF4444] border-2 border-[#1E232B] shadow-xs" />
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] border-2 border-[#1E232B] shadow-xs" />
                <div className="w-5 h-5 rounded-full bg-[var(--theme-primary)] border-2 border-[#1E232B] shadow-xs" />
              </div>
            </div>

            <span className="mt-1.5 font-pixel text-[7px] text-[#1E232B] bg-white/85 px-2 py-0.5 rounded-full border border-[#1E232B] shadow-xs">
              ARCADE STICK
            </span>
          </div>

          {/* Controller 3: Floating Retro Handheld Game Console (Bottom Left) */}
          <div className="absolute top-[78%] left-[4%] hidden md:flex flex-col items-center opacity-75 animate-pixel-island" style={{ animationDelay: '4.2s' }}>
            <div className="w-32 h-20 bg-[var(--theme-shelf-bg)] border-3 border-[#1E232B] rounded-xl shadow-[3px_4px_0px_#1E232B] p-2 flex flex-col items-center justify-between relative overflow-hidden">
              <div className="w-22 h-9 rounded-md bg-[#0F172A] border-2 border-[#1E232B] flex items-center justify-center">
                <span className="text-xs animate-pulse">👾</span>
              </div>
              <div className="w-full flex items-center justify-between px-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1E232B]" />
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
            <span className="mt-1 font-pixel text-[7px] text-[#1E232B] bg-white/85 px-2 py-0.5 rounded-full border border-[#1E232B] shadow-xs">
              HANDHELD DMG
            </span>
          </div>

          {/* Controller 4: Secondary Arcade Fight-Pad / Micro Stick (Bottom Right) */}
          <div className="absolute top-[82%] right-[5%] hidden lg:flex flex-col items-center opacity-70 animate-pixel-island" style={{ animationDelay: '1.2s' }}>
            <div className="w-32 h-18 bg-[#334155] border-3 border-[#1E232B] rounded-xl shadow-[3px_4px_0px_#1E232B] p-2 flex items-center justify-between relative overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-[#1E232B] border border-slate-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)]" />
              </div>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-[#1E232B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-[#1E232B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-[#1E232B]" />
              </div>
            </div>
            <span className="mt-1 font-pixel text-[7px] text-[#1E232B] bg-white/85 px-2 py-0.5 rounded-full border border-[#1E232B] shadow-xs">
              FIGHT PAD
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          LAYER 3: FLOATING 2D PIXEL ARCADE KEYS & GAMEPAD BUTTONS
          ======================================================== */}
      <motion.div
        style={{ y: keysScrollY }}
        className="absolute inset-0 select-none will-change-transform pointer-events-none"
      >
        <motion.div
          style={{ x: keysMouseX, y: keysMouseY }}
          className="w-full h-full relative"
        >
          {/* Key 1: D-Pad [ ▲ ] */}
          <div className="absolute top-[14%] left-[7%] hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E232B] text-white border-2 border-white/60 font-pixel text-[10px] shadow-[2px_3px_0px_#1E232B] rotate-[-8deg] opacity-75">
            ▲
          </div>

          {/* Key 2: Arcade Button [ A ] */}
          <div className="absolute top-[28%] right-[11%] hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--theme-primary)] text-white border-2 border-[#1E232B] font-pixel text-xs font-black shadow-[2px_4px_0px_#1E232B] rotate-12 opacity-80">
            A
          </div>

          {/* Key 3: Arcade Button [ B ] */}
          <div className="absolute top-[42%] left-[8%] hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-[#E60012] text-white border-2 border-[#1E232B] font-pixel text-[10px] font-black shadow-[2px_3px_0px_#1E232B] rotate-[-12deg] opacity-75">
            B
          </div>

          {/* Key 4: Action Button [ X ] */}
          <div className="absolute top-[60%] left-[11%] hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-[#3B82F6] text-white border-2 border-[#1E232B] font-pixel text-[9px] font-black shadow-[2px_3px_0px_#1E232B] rotate-8 opacity-75">
            X
          </div>

          {/* Key 5: Action Button [ Y ] */}
          <div className="absolute top-[65%] right-[9%] hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-[#F59E0B] text-white border-2 border-[#1E232B] font-pixel text-[9px] font-black shadow-[2px_3px_0px_#1E232B] rotate-[-10deg] opacity-75">
            Y
          </div>

          {/* Key 6: Shoulder Trigger [ R-TRIGGER ] */}
          <div className="absolute top-[72%] right-[12%] hidden lg:flex items-center justify-center px-3 py-1 rounded-md bg-slate-200 text-[#1E232B] border-2 border-[#1E232B] font-pixel text-[8px] font-bold shadow-[2px_3px_0px_#1E232B] rotate-6 opacity-75">
            R-TRIGGER
          </div>

          {/* Key 7: Shoulder Trigger [ L-TRIGGER ] */}
          <div className="absolute top-[34%] left-[12%] hidden xl:flex items-center justify-center px-3 py-1 rounded-md bg-slate-200 text-[#1E232B] border-2 border-[#1E232B] font-pixel text-[8px] font-bold shadow-[2px_3px_0px_#1E232B] rotate-[-6deg] opacity-75">
            L-TRIGGER
          </div>

          {/* Key 8: Directional D-Pad [ ► ] */}
          <div className="absolute top-[88%] right-[14%] hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E232B] text-white border-2 border-white/60 font-pixel text-[10px] shadow-[2px_3px_0px_#1E232B] rotate-[-6deg] opacity-75">
            ►
          </div>

          {/* Key 9: Directional D-Pad [ ▼ ] */}
          <div className="absolute top-[92%] left-[10%] hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E232B] text-white border-2 border-white/60 font-pixel text-[10px] shadow-[2px_3px_0px_#1E232B] rotate-4 opacity-75">
            ▼
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          LAYER 4: 8-BIT PIXEL ITEMS (HEARTS, COINS, STARS, SPRITES)
          ======================================================== */}
      <motion.div
        style={{ y: particlesScrollY }}
        className="absolute inset-0 select-none will-change-transform pointer-events-none"
      >
        <motion.div
          style={{ x: particlesMouseX, y: particlesMouseY }}
          className="w-full h-full relative"
        >
          {/* Pixel Stepped Cloud 1 */}
          <div className="absolute top-[6%] left-[14%] opacity-35 animate-cloud-drift will-change-transform">
            <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
              <rect x="16" y="8" width="48" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="24" y="2" width="32" height="10" fill="#FFFFFF" />
              <rect x="8" y="16" width="64" height="14" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Pixel Stepped Cloud 2 */}
          <div className="absolute top-[38%] right-[15%] opacity-30 animate-cloud-drift will-change-transform" style={{ animationDelay: '4s' }}>
            <svg width="72" height="32" viewBox="0 0 72 32" fill="none">
              <rect x="14" y="6" width="44" height="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="20" y="2" width="28" height="8" fill="#FFFFFF" />
              <rect x="6" y="14" width="58" height="12" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Pixel Heart 1 (8-bit Health Container) */}
          <div className="absolute top-[16%] right-[18%] opacity-80 animate-pulse hidden sm:block">
            <span className="text-xl filter drop-shadow select-none">❤️</span>
          </div>

          {/* Pixel Question Block Floating */}
          <div className="absolute top-[25%] left-[15%] hidden lg:flex items-center justify-center w-7 h-7 bg-[#F59E0B] border-2 border-[#1E232B] rounded shadow-[2px_2px_0px_#1E232B] font-pixel text-[10px] text-white opacity-70">
            ?
          </div>

          {/* Pixel Coin 1 */}
          <div className="absolute top-[32%] left-[17%] opacity-85 animate-pulse hidden md:block" style={{ animationDelay: '1.4s' }}>
            <span className="text-xl filter drop-shadow select-none">🪙</span>
          </div>

          {/* Pixel Star 1 */}
          <div className="absolute top-[48%] right-[16%] opacity-80 animate-pulse hidden sm:block" style={{ animationDelay: '2.6s' }}>
            <span className="text-xl filter drop-shadow select-none">⭐</span>
          </div>

          {/* Theme Dynamic Item */}
          <div className="absolute top-[70%] left-[14%] opacity-85 animate-pulse hidden md:block" style={{ animationDelay: '3.8s' }}>
            <span className="text-2xl filter drop-shadow select-none">
              {getThemeParticleIcon(2)}
            </span>
          </div>

          {/* 8-Bit Space Invader Alien */}
          <div className="absolute top-[86%] right-[18%] opacity-85 animate-pulse hidden sm:block" style={{ animationDelay: '2s' }}>
            <span className="text-2xl filter drop-shadow select-none">👾</span>
          </div>

          {/* Pixel Brick Block Floating */}
          <div className="absolute top-[76%] right-[13%] hidden lg:flex items-center justify-center w-7 h-7 bg-[#9A3412] border-2 border-[#1E232B] rounded shadow-[2px_2px_0px_#1E232B] font-pixel text-[9px] text-[#FED7AA] opacity-70">
            #
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          LAYER 5: AUTHENTIC CONSOLE SCREEN GLASS & OPTICAL SHADERS
          ======================================================== */}
      {/* Interactive Console Screen Glass Glare Sheen (Moves with cursor) */}
      <motion.div
        style={{
          x: glareMouseX,
          y: glareMouseY,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 60%)',
        }}
        className="absolute -inset-24 pointer-events-none z-10 opacity-40 select-none"
      />

      {/* CRT & LCD Scanline Matrix */}
      <div className="absolute inset-0 console-screen-scanlines z-20 opacity-30" />

      {/* Console Subpixel Dot Mesh */}
      <div className="absolute inset-0 console-screen-subpixel z-20 opacity-35" />

      {/* Console Screen Inner Glass Vignette & Depth */}
      <div className="absolute inset-0 console-screen-vignette z-20" />

      {/* Ambient Vignette & Readability Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 45%, var(--theme-bg) 95%)',
          opacity: 0.65,
        }}
      />
    </div>
  );
}
