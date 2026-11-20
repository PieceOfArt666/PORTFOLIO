import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Code2, Compass, Terminal } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import { MagneticText } from './InteractiveProximityText';

const tabIcons = [
  <Gamepad2 key="gamepad" className="w-4 h-4" />,
  <Code2 key="code" className="w-4 h-4" />,
  <Compass key="compass" className="w-4 h-4" />,
];

export function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const currentCategory = SKILL_CATEGORIES[activeTab];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0099E5] animate-ping" />
            <span className="font-pixel text-[9px] text-[#0099E5]">STAGE 1-5</span>
            <span className="text-slate-300">•</span>
            <span className="font-pixel text-[9px] text-[#1E232B]">POWER-UP INVENTORY</span>
          </div>

          <MagneticText strength={18} rotationStrength={3}>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1E232B] tracking-tight mb-2">
              Technical <span className="text-[var(--theme-primary)]">Skill Tree</span>
            </h2>
          </MagneticText>

          <p className="text-base text-[#475569] font-medium">
            Proficient across gameplay scripting, Unity architecture, and tactile 2D/3D game feel iteration.
          </p>
        </motion.div>

        {/* 2D Tab Selector Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {SKILL_CATEGORIES.map((cat, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playSelect();
                  setActiveTab(idx);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-pixel text-[9px] transition-all cursor-pointer group/tab ${
                  isActive
                    ? 'bg-[var(--theme-primary)] text-white border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] font-black -translate-y-0.5'
                    : 'bg-white text-slate-700 hover:text-[#1E232B] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] hover:-translate-y-1 hover:scale-105 hover:shadow-[3px_4px_0px_#1E232B]'
                }`}
              >
                <span className="group-hover/tab:rotate-12 transition-transform inline-block">{tabIcons[idx]}</span>
                <span>{cat.category.toUpperCase()}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Active Tab Skills Diorama (Zero Rectangular Box Cards) */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="grassy-hill-shelf p-6 sm:p-10 mb-8 border-x-4 border-b-4 border-[#1E232B] shadow-[6px_10px_0px_#1E232B] overflow-hidden relative"
          onMouseEnter={() => soundEffects.playSelect()}
        >
          {/* Scalloped Pixel Grass Fringe */}
          <div className="pixel-grass-fringe-bar w-full absolute top-0 left-0 right-0 z-10" />

          <div className="flex items-center justify-between pb-5 mb-8 border-b-3 border-[#1E232B] flex-wrap gap-4 pt-3 relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--theme-primary-light)] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[var(--theme-primary)] hover:scale-110 transition-transform cursor-pointer">
                {tabIcons[activeTab]}
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#1E232B]">
                {currentCategory.category}
              </h3>
            </div>

            <span className="font-pixel text-[8px] text-[var(--theme-primary)] bg-[var(--theme-primary-light)] border-2 border-[#1E232B] px-3.5 py-1.5 rounded-full shadow-xs hover:scale-105 transition-transform cursor-default">
              {currentCategory.skills.length} CORE MODULES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {currentCategory.skills.map((skill, sIdx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 20, delay: sIdx * 0.08 }}
                className="speech-bubble-tail game-card-hover p-5 bg-white transition-all group cursor-pointer hover:border-[var(--theme-primary)]"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-display font-black text-lg text-[#1E232B] group-hover:text-[var(--theme-primary)] transition-colors">
                    {skill.name}
                  </h4>

                  <span className="font-pixel text-[8px] px-2.5 py-0.5 rounded-full bg-slate-100 border border-[#1E232B] text-slate-700 whitespace-nowrap group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-colors">
                    {skill.level}
                  </span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed font-medium mb-3">
                  {skill.note}
                </p>

                {/* 2D Star Meter with Interactive Hover Staggered Bounce */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                  <span className="font-pixel text-[8px] text-slate-400 group-hover:text-[var(--theme-primary)] transition-colors">
                    MASTERY
                  </span>
                  <div className="flex items-center gap-1 text-[#F59E0B] text-xs select-none">
                    <span className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-125 inline-block">★</span>
                    <span className="transition-transform duration-200 delay-75 group-hover:-translate-y-1.5 group-hover:scale-125 inline-block">★</span>
                    <span className="transition-transform duration-200 delay-100 group-hover:-translate-y-1 group-hover:scale-125 inline-block">★</span>
                    <span className="transition-transform duration-200 delay-150 group-hover:-translate-y-1.5 group-hover:scale-125 inline-block">★</span>
                    <span className={`transition-transform duration-200 delay-200 group-hover:-translate-y-1 group-hover:scale-125 inline-block ${sIdx === 0 ? 'text-[#F59E0B]' : 'text-slate-300'}`}>★</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Earthen Cliff Platform Base Bottom Strip */}
          <div className="pixel-earth-footer w-full h-4 rounded-b-[20px] mt-6 border-t-2 border-[#1E232B]" />
        </motion.div>

        {/* 2D Nintendo Hanging Wooden Signboard (Not a Flat Rectangle Box) */}
        <div className="wooden-sign p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E60012] border-2 border-white flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="font-pixel text-[8px] sm:text-[9px]">
              <span className="text-[#86EFAC]">▲ ▲ ▼ ▼ ◄ ► ◄ ► B A : </span>
              <span className="text-amber-100">UNITY 2022 LTS • 60 FPS TUNED</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#86EFAC] animate-ping" />
            <span className="font-pixel text-[8px] text-amber-200">
              DEBUG: PASS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
