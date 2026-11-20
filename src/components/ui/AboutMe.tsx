import { motion } from 'framer-motion';
import { Play, Download, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import { MagneticText } from './InteractiveProximityText';

export function AboutMe() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-md bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
            <span className="font-pixel text-[9px] text-[var(--theme-primary)]">STAGE 1-2</span>
            <span className="text-slate-300">•</span>
            <span className="font-pixel text-[9px] text-[#1E232B]">PLAYER ATTRIBUTES</span>
          </div>

          <MagneticText strength={18} rotationStrength={3}>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#1E232B] tracking-tight mb-3">
              Hi, I'm <span className="text-[var(--theme-primary)]">{PERSONAL_INFO.name}</span>
            </h2>
          </MagneticText>

          <MagneticText strength={12} rotationStrength={2}>
            <p className="text-base sm:text-lg font-black text-[#1E232B] mb-4">
              Game Designer &nbsp;|&nbsp; Gameplay Mechanics &nbsp;|&nbsp; Rapid Prototyping
            </p>
          </MagneticText>

          <p className="text-base text-[#475569] leading-relaxed mb-6 font-medium">
            I build interactive, immersive, and playful experiences at the intersection of game design, kinetic feel, and emergent systems. I love turning ideas into impactful, engaging, and responsive playable experiences in Unity.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            <a 
              href="#projects" 
              onClick={() => soundEffects.playJump()}
              className="btn-2d-red group text-sm py-2.5 px-5"
            >
              <span className="key-2d key-2d-red w-4 h-4 text-[8px] group-hover:rotate-12 group-hover:scale-110 transition-transform">A</span>
              <span className="font-pixel text-[9px]">VIEW WORK</span>
              <Play className="w-3.5 h-3.5 fill-white group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={PERSONAL_INFO.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playSelect()}
              className="btn-2d-white group text-sm py-2.5 px-5"
            >
              <span className="key-2d w-4 h-4 text-[8px] group-hover:-rotate-12 group-hover:scale-110 transition-transform">Y</span>
              <span className="font-pixel text-[9px]">ITCH.IO GAMES</span>
              <Download className="w-4 h-4 text-slate-600 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* 3 Interactive Power-Up Dioramas in Speech Balloons (Zero Rectangular Box Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Item 1: Super Mushroom */}
          <motion.div 
            initial={{ opacity: 0, y: 45, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
            className="flex flex-col items-center text-center group cursor-pointer"
            onMouseEnter={() => soundEffects.playSelect()}
          >
            {/* Floating Mystery Block + Mushroom Icon */}
            <div className="relative mb-5 flex flex-col items-center">
              <button 
                onClick={() => soundEffects.playPowerup()}
                className="w-16 h-16 rounded-full bg-[#FEF2F2] border-4 border-[#1E232B] shadow-[4px_5px_0px_#1E232B] flex items-center justify-center text-[#E60012] group-hover:scale-115 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_16px_rgba(230,0,18,0.4),4px_8px_0px_#1E232B] active:scale-95 transition-all cursor-pointer select-none"
                title="Tap to collect Super Mushroom!"
              >
                <span className="text-3xl group-hover:scale-120 group-hover:rotate-[-8deg] transition-transform inline-block">🍄</span>
              </button>
              <span className="mt-2 font-pixel text-[8px] px-3 py-1 rounded-full bg-[var(--theme-primary)] text-white border-2 border-[#1E232B] shadow-xs group-hover:scale-105 group-hover:-translate-y-1 transition-all">
                POWER-UP 01
              </span>
            </div>

            {/* Organic Speech Balloon Body (No Square Box) */}
            <div className="speech-bubble-tail game-card-hover p-6 bg-white w-full flex-1 flex flex-col justify-between group-hover:border-[#E60012]">
              <div>
                <h3 className="font-display font-black text-xl text-[#1E232B] mb-2 group-hover:text-[#E60012] transition-colors">
                  Game Development
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-medium">
                  Designing & building engaging gameplay experiences with responsive character controllers and polished game feel in Unity.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-center gap-1.5 font-pixel text-[9px] text-[#E60012]">
                <CheckCircle2 className="w-4 h-4 text-[#E60012] group-hover:rotate-12 transition-transform" />
                <span>FULL LOOP DESIGN</span>
              </div>
            </div>
          </motion.div>

          {/* Item 2: Fire Flower */}
          <motion.div 
            initial={{ opacity: 0, y: 45, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.2 }}
            className="flex flex-col items-center text-center group cursor-pointer"
            onMouseEnter={() => soundEffects.playSelect()}
          >
            {/* Floating Mystery Block + Fire Flower Icon */}
            <div className="relative mb-5 flex flex-col items-center">
              <button 
                onClick={() => soundEffects.playPowerup()}
                className="w-16 h-16 rounded-full bg-[#E0F2FE] border-4 border-[#1E232B] shadow-[4px_5px_0px_#1E232B] flex items-center justify-center text-[#0099E5] group-hover:scale-115 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_16px_rgba(0,153,229,0.4),4px_8px_0px_#1E232B] active:scale-95 transition-all cursor-pointer select-none"
                title="Tap to collect Fire Flower!"
              >
                <span className="text-3xl group-hover:scale-120 group-hover:rotate-12 transition-transform inline-block">🔥</span>
              </button>
              <span className="mt-2 font-pixel text-[8px] px-3 py-1 rounded-full bg-[#0099E5] text-white border-2 border-[#1E232B] shadow-xs group-hover:scale-105 group-hover:-translate-y-1 transition-all">
                POWER-UP 02
              </span>
            </div>

            {/* Organic Speech Balloon Body (No Square Box) */}
            <div className="speech-bubble-tail game-card-hover p-6 bg-white w-full flex-1 flex flex-col justify-between group-hover:border-[#0099E5]">
              <div>
                <h3 className="font-display font-black text-xl text-[#1E232B] mb-2 group-hover:text-[#0099E5] transition-colors">
                  Mechanics &amp; Feel
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-medium">
                  Tuning acceleration curves, input buffering, coyote-time, micro-screenshake, and kinetic player feedback loops.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-center gap-1.5 font-pixel text-[9px] text-[#0099E5]">
                <CheckCircle2 className="w-4 h-4 text-[#0099E5] group-hover:rotate-12 transition-transform" />
                <span>KINETIC JUICE</span>
              </div>
            </div>
          </motion.div>

          {/* Item 3: Super Star */}
          <motion.div 
            initial={{ opacity: 0, y: 45, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.3 }}
            className="flex flex-col items-center text-center group cursor-pointer"
            onMouseEnter={() => soundEffects.playSelect()}
          >
            {/* Floating Mystery Block + Star Icon */}
            <div className="relative mb-5 flex flex-col items-center">
              <button 
                onClick={() => soundEffects.playCoin()}
                className="w-16 h-16 rounded-full bg-[#FEF3C7] border-4 border-[#1E232B] shadow-[4px_5px_0px_#1E232B] flex items-center justify-center text-[#F59E0B] group-hover:scale-115 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5),4px_8px_0px_#1E232B] active:scale-95 transition-all cursor-pointer select-none"
                title="Tap to collect Super Star!"
              >
                <span className="text-3xl group-hover:scale-125 group-hover:rotate-[-12deg] transition-transform inline-block">⭐</span>
              </button>
              <span className="mt-2 font-pixel text-[8px] px-3 py-1 rounded-full bg-[#F59E0B] text-[#1E232B] border-2 border-[#1E232B] shadow-xs font-bold group-hover:scale-105 group-hover:-translate-y-1 transition-all">
                POWER-UP 03
              </span>
            </div>

            {/* Organic Speech Balloon Body (No Square Box) */}
            <div className="speech-bubble-tail game-card-hover p-6 bg-white w-full flex-1 flex flex-col justify-between group-hover:border-[#F59E0B]">
              <div>
                <h3 className="font-display font-black text-xl text-[#1E232B] mb-2 group-hover:text-[#F59E0B] transition-colors">
                  Tech &amp; Tooling
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-medium">
                  Building custom Unity editor tools, node graphs, ScriptableObject workflows, and modular event-driven C# codebases.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-center gap-1.5 font-pixel text-[9px] text-[#F59E0B]">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] group-hover:rotate-12 transition-transform" />
                <span>EDITOR GRAPHVIEW</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2D Nintendo Hanging Wooden Signboard (Not a Flat White Rectangle Box) */}
        <div className="wooden-sign p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white group/sign hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4">
            <span className="text-3xl filter drop-shadow group-hover/sign:scale-125 group-hover/sign:rotate-[-6deg] transition-transform inline-block">💾</span>
            <div>
              <div className="font-pixel text-[8px] text-amber-200 uppercase font-bold tracking-wider">
                SAVE FILE // PLAYER_1_DATA
              </div>
              <div className="font-display font-black text-sm sm:text-base text-white drop-shadow">
                READY TO JOIN GAME STUDIOS &amp; INDIE DEVELOPMENT TEAMS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-pixel text-[9px] px-3.5 py-1.5 rounded-full bg-slate-900/70 border-2 border-[#1E232B] text-amber-300 font-bold hover:scale-105 hover:-translate-y-0.5 transition-transform cursor-pointer">
              EXP: 99,999
            </span>
            <span className="font-pixel text-[9px] px-3.5 py-1.5 rounded-full bg-[#E60012] border-2 border-[#1E232B] text-white font-bold hover:scale-105 hover:-translate-y-0.5 transition-transform cursor-pointer">
              HP: 100/100
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
