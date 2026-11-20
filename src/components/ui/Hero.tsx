import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, User, ChevronDown, Gamepad2, Layers, Code2 } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import { MagneticText, BouncyInteractiveHeading } from './InteractiveProximityText';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Hero() {
  const [bouncedBlock, setBouncedBlock] = useState<number | null>(null);

  const handleBlockHit = (blockId: number) => {
    soundEffects.playCoin();
    setBouncedBlock(blockId);
    setTimeout(() => setBouncedBlock(null), 500);
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-4 sm:px-6 z-10">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Column: 2D Nintendo Title & Player 1 Editorial */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col items-start z-10"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-xl bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
            <span className="font-pixel text-[9px] text-[var(--theme-primary)]">WORLD 1-1</span>
            <span className="text-slate-300">•</span>
            <span className="font-pixel text-[9px] text-[#1E232B]">1P READY</span>
          </div>

          {/* Name in Bold 2D Nintendo Logo Typography with Proximity & Bouncy Movement */}
          <div className="relative mb-3 w-full max-w-full overflow-hidden">
            <MagneticText strength={16} rotationStrength={2} className="w-full max-w-full">
              <h1 className="font-display font-black text-[clamp(1.35rem,4.7vw,4.5rem)] text-[#1E232B] tracking-tight leading-none cursor-pointer whitespace-nowrap w-full">
                <BouncyInteractiveHeading text={PERSONAL_INFO.name.toUpperCase()} />
              </h1>
            </MagneticText>

            {/* 2D Nintendo Brick & Question Block Interactive Strip */}
            <div className="flex items-center gap-2 mt-4">
              {/* Question Block 1 */}
              <div className="relative group/q1">
                <button
                  onClick={() => handleBlockHit(1)}
                  className={`w-9 h-9 question-block flex items-center justify-center font-pixel text-sm text-white select-none transition-transform hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(245,158,11,0.8)] ${bouncedBlock === 1 ? '-translate-y-3' : ''
                    }`}
                  title="Hit Question Block for Coin!"
                >
                  <span className="group-hover/q1:scale-125 transition-transform inline-block">?</span>
                </button>
                {bouncedBlock === 1 && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-pixel text-[9px] font-black text-[#F59E0B] animate-coin-pop pointer-events-none whitespace-nowrap">
                    🪙+100
                  </span>
                )}
              </div>

              {/* Brick Block */}
              <div className="w-9 h-9 bg-[#9A3412] border-3 border-[#1E232B] rounded-lg shadow-[3px_3px_0px_#1E232B] flex items-center justify-center font-pixel text-[8px] text-[#FED7AA] select-none hover:rotate-3 hover:-translate-y-0.5 transition-transform cursor-pointer" title="Solid 16-bit Brick Block">
                #
              </div>

              {/* Question Block 2 */}
              <div className="relative group/q2">
                <button
                  onClick={() => handleBlockHit(2)}
                  className={`w-9 h-9 question-block flex items-center justify-center font-pixel text-sm text-white select-none transition-transform hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(245,158,11,0.8)] ${bouncedBlock === 2 ? '-translate-y-3' : ''
                    }`}
                  title="Hit Question Block for Coin!"
                >
                  <span className="group-hover/q2:scale-125 transition-transform inline-block">?</span>
                </button>
                {bouncedBlock === 2 && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-pixel text-[9px] font-black text-[#F59E0B] animate-coin-pop pointer-events-none whitespace-nowrap">
                    🪙+100
                  </span>
                )}
              </div>

              <span className="font-pixel text-[9px] text-slate-500 ml-2 hidden sm:inline">
                HIT [ ? ] BLOCKS!
              </span>
            </div>
          </div>

          {/* Role Subtitle with Proximity Tilt */}
          <MagneticText strength={14} rotationStrength={2}>
            <h2 className="text-xl sm:text-2xl font-sans font-black text-[#1E232B] mb-3">
              Game Designer
            </h2>
          </MagneticText>

          {/* Bio Description */}
          <p className="text-base sm:text-lg text-[#475569] font-medium leading-relaxed max-w-lg mb-7">
            {PERSONAL_INFO.shortBio}
          </p>

          {/* Action Buttons (Chunky 2D Arcade Style with High-Octane Hover Feedback) */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href="#projects"
              onClick={() => soundEffects.playJump()}
              className="btn-2d-red group text-sm py-3 px-6"
            >
              <span className="key-2d key-2d-red w-5 h-5 text-[9px] group-hover:rotate-12 group-hover:scale-110 transition-transform">A</span>
              <span className="font-pixel text-[10px]">PRESS START</span>
              <Play className="w-3.5 h-3.5 fill-white ml-0.5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#about"
              onClick={() => soundEffects.playSelect()}
              className="btn-2d-white group text-sm py-3 px-6"
            >
              <span className="key-2d w-5 h-5 text-[9px] group-hover:-rotate-12 group-hover:scale-110 transition-transform">B</span>
              <span className="font-pixel text-[10px]">GAME MANUAL</span>
              <User className="w-4 h-4 text-slate-600 group-hover:scale-115 transition-transform" />
            </a>
          </div>

          {/* Social Controller Buttons with Tactile Arcade Joypad Feel */}
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playSelect()}
              className="w-11 h-11 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] hover:-translate-y-1.5 hover:scale-110 hover:shadow-[5px_7px_0px_#1E232B] hover:border-black active:translate-y-[2px] active:scale-95 active:shadow-[1px_1px_0px_#1E232B] flex items-center justify-center text-[#1E232B] hover:text-[#000000] transition-all group/soc"
              title="GitHub Profile"
            >
              <div className="group-hover/soc:rotate-[-8deg] transition-transform">
                <GithubIcon className="w-5 h-5" />
              </div>
            </a>

            <a
              href={PERSONAL_INFO.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playSelect()}
              className="w-11 h-11 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] hover:-translate-y-1.5 hover:scale-110 hover:shadow-[5px_7px_0px_#FA5C5C] hover:border-[#FA5C5C] hover:bg-[#FEF2F2] active:translate-y-[2px] active:scale-95 active:shadow-[1px_1px_0px_#1E232B] flex items-center justify-center text-[#1E232B] hover:text-[#FA5C5C] transition-all group/soc"
              title="Itch.io Games"
            >
              <div className="group-hover/soc:rotate-8 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
            </a>

            {PERSONAL_INFO.instagramUrl && (
              <a
                href={PERSONAL_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playSelect()}
                className="w-11 h-11 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] hover:-translate-y-1.5 hover:scale-110 hover:shadow-[5px_7px_0px_#E1306C] hover:border-[#E1306C] hover:bg-[#FDF2F8] active:translate-y-[2px] active:scale-95 active:shadow-[1px_1px_0px_#1E232B] flex items-center justify-center text-[#1E232B] hover:text-[#E1306C] transition-all group/soc"
                title="Instagram"
              >
                <div className="group-hover/soc:rotate-[-8deg] transition-transform">
                  <InstagramIcon className="w-5 h-5" />
                </div>
              </a>
            )}

            <span className="font-pixel text-[8px] text-slate-500 ml-2 hidden sm:inline">
              SELECT LINK
            </span>
          </div>
        </motion.div>

        {/* Right Column: 2D Nintendo Platformer Stage Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 35, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-6 relative flex justify-center items-center"
        >
          {/* Floating Platform Stage with Organic Curved Island Aesthetic (No Square Box) */}
          <div className="relative w-full max-w-lg grassy-hill-shelf p-4 sm:p-5 border-x-4 border-b-4 border-[#1E232B] shadow-[6px_10px_0px_#1E232B] overflow-hidden group">
            {/* Scalloped Pixel Grass Fringe */}
            <div className="pixel-grass-fringe-bar w-full absolute top-0 left-0 right-0 z-10" />

            {/* Stage Screen Bezel */}
            <div className="game-screen-bezel aspect-[4/3] relative z-10 rounded-2xl overflow-hidden mt-1 shadow-[4px_5px_0px_#1E232B]">
              <img
                src="/images/game-dev-hero-showcase.jpg"
                alt="ABHIJITH XS - Game Designer Studio Showcase"
                className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 filter brightness-95"
                style={{ objectPosition: 'center' }}
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E232B]/85 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Telemetry Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                <div className="pixel-hud-plate px-3 py-1 font-pixel text-[8px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-ping" />
                  <span>60 FPS LOCKED</span>
                </div>

                <div className="pixel-hud-plate-red px-2.5 py-1 font-pixel text-[8px]">
                  UNITY LTS
                </div>
              </div>
            </div>

            {/* Earthen Cliff Platform Base Bottom Strip */}
            <div className="pixel-earth-footer w-full h-4 rounded-b-[20px] mt-2 border-t-2 border-[#1E232B]" />
          </div>
        </motion.div>
      </div>

      {/* Bottom 2D Player Inventory Hotbar (Hanging Wooden Signboard, Zero Square Card Boxes) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="max-w-5xl mx-auto w-full mt-10 mb-2"
      >
        <div className="wooden-sign p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-white">
          {/* Stat 1 */}
          <div
            onMouseEnter={() => soundEffects.playSelect()}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group/stat"
          >
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#E60012] font-black text-lg flex-shrink-0 group-hover/stat:scale-120 group-hover/stat:rotate-[-8deg] transition-transform">
              🍄
            </div>
            <div>
              <div className="font-pixel text-[11px] text-amber-200 group-hover/stat:text-white transition-colors">
                3 TITLES
              </div>
              <div className="text-xs font-bold text-amber-100/80 uppercase">
                Games Shipped
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div
            onMouseEnter={() => soundEffects.playSelect()}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group/stat"
          >
            <div className="w-10 h-10 rounded-full bg-[#E0F2FE] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#0099E5] font-black flex-shrink-0 group-hover/stat:scale-120 group-hover/stat:rotate-8 transition-transform">
              <Code2 className="w-5 h-5 text-[#0099E5]" />
            </div>
            <div>
              <div className="font-pixel text-[11px] text-amber-200 group-hover/stat:text-white transition-colors">
                UNITY / C#
              </div>
              <div className="text-xs font-bold text-amber-100/80 uppercase">
                Core Specialization
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div
            onMouseEnter={() => soundEffects.playSelect()}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group/stat"
          >
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#F59E0B] font-black flex-shrink-0 group-hover/stat:scale-120 group-hover/stat:rotate-[-8deg] transition-transform">
              <Layers className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <div className="font-pixel text-[11px] text-amber-200 group-hover/stat:text-white transition-colors">
                SYSTEMS
              </div>
              <div className="text-xs font-bold text-amber-100/80 uppercase">
                Mechanics & Tools
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div
            onMouseEnter={() => soundEffects.playSelect()}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group/stat"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--theme-primary-light)] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[var(--theme-primary)] font-black text-lg flex-shrink-0 group-hover/stat:scale-120 group-hover/stat:rotate-8 transition-transform">
              ❤️
            </div>
            <div>
              <div className="font-pixel text-[11px] text-amber-200 group-hover/stat:text-white transition-colors">
                3 LIVES
              </div>
              <div className="text-xs font-bold text-amber-100/80 uppercase">
                Game Feel Juice
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Next Prompt */}
        <div className="flex justify-center mt-6">
          <a
            href="#about"
            onClick={() => soundEffects.playSelect()}
            className="inline-flex items-center gap-2 font-pixel text-[9px] text-slate-600 hover:text-[var(--theme-primary)] transition-colors"
          >
            <span>STAGE 1-2 AHEAD</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[var(--theme-primary)]" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
