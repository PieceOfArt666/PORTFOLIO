import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Sparkles, Cpu, Compass, Layers, CheckCircle } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { MagneticText } from './InteractiveProximityText';

const serviceDetails = [
  {
    title: "Game Design & Mechanics",
    tagline: "Gameplay Loops & Feel",
    desc: "Designing and architecting responsive 2D/3D gameplay experiences with thoughtful pacing and clean controllers in Unity.",
    color: "#E60012",
    bgColor: "#FEF2F2",
    icon: Gamepad2,
  },
  {
    title: "Kinetic Game Feel",
    tagline: "Juice, Weight & Feedback",
    desc: "Crafting satisfying kinetic inertia, coyote time, input buffering, camera damping, and micro-screenshake.",
    color: "#0099E5",
    bgColor: "#E0F2FE",
    icon: Sparkles,
  },
  {
    title: "Emergent Systems",
    tagline: "Rules that Intersect",
    desc: "Designing modular game mechanics that layer together naturally, enabling players to discover unscripted solutions.",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: Cpu,
  },
  {
    title: "Pacing & Level Flow",
    tagline: "Sightlines & Framing",
    desc: "Guiding player attention through environmental affordances, architectural sightlines, and rhythmic pacing beats.",
    color: "#16A34A",
    bgColor: "#DCFCE7",
    icon: Compass,
  },
  {
    title: "Clean Unity Architecture",
    tagline: "ScriptableObjects & Tools",
    desc: "Building maintainable event buses, state machines, and custom editor inspectors for rapid gameplay iteration.",
    color: "#E60012",
    bgColor: "#FEF2F2",
    icon: Layers,
  },
  {
    title: "Playtesting & Telemetry",
    tagline: "Observation & Data",
    desc: "Conducting blind playtesting and custom telemetry logging to eliminate friction points and polish intuitive flow.",
    color: "#0099E5",
    bgColor: "#E0F2FE",
    icon: CheckCircle,
  },
];

export function AboutPhilosophy() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping" />
            <span className="font-pixel text-[9px] text-[#F59E0B]">STAGE 1-3</span>
            <span className="text-slate-300">•</span>
            <span className="font-pixel text-[9px] text-[#1E232B]">LEVEL DESIGN & CRAFT</span>
          </div>

          <MagneticText strength={18} rotationStrength={3}>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1E232B] tracking-tight mb-3">
              Services & <span className="text-[var(--theme-primary)]">Design Craft</span>
            </h2>
          </MagneticText>

          <p className="text-base text-[#475569] font-medium">
            What I do – from tangible gameplay mechanics to intuitive, player-first game feel.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-12 rounded-sm bg-[var(--theme-primary)] border border-[#1E232B]" />
            <div className="h-2 w-4 rounded-sm bg-[#0099E5] border border-[#1E232B]" />
            <div className="h-2 w-2 rounded-sm bg-[#F59E0B] border border-[#1E232B]" />
          </div>
        </motion.div>

        {/* 6 2D Game Craft Milestones in Dialogue Speech Balloons (Zero Rectangular Box Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceDetails.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 35, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 220, damping: 20, delay: idx * 0.08 }}
                className="flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => soundEffects.playSelect()}
              >
                {/* Circular Stone Milestone Pedestal */}
                <div className="relative mb-4 flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full border-4 border-[#1E232B] shadow-[3px_5px_0px_#1E232B] flex items-center justify-center transition-all group-hover:scale-115 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_16px_rgba(0,0,0,0.15),3px_7px_0px_#1E232B] cursor-pointer"
                    style={{
                      backgroundColor: service.bgColor,
                      color: service.color,
                    }}
                  >
                    <IconComponent className="w-7 h-7 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                  </div>

                  <span className="mt-2 font-pixel text-[8px] px-3 py-1 rounded-full bg-slate-900 text-white border-2 border-[#1E232B] shadow-xs group-hover:scale-105 group-hover:-translate-y-1 transition-all">
                    WORLD 1-{idx + 1}
                  </span>
                </div>

                {/* Organic Speech Balloon Body (No Square Box) */}
                <div className="speech-bubble-tail game-card-hover p-6 bg-white w-full flex-1 flex flex-col justify-between group-hover:border-[#1E232B]">
                  <div>
                    <h3 className="font-display font-black text-xl text-[#1E232B] mb-1 group-hover:text-[var(--theme-primary)] transition-colors">
                      {service.title}
                    </h3>

                    <p
                      className="font-pixel text-[9px] mb-3 group-hover:scale-105 origin-left transition-transform"
                      style={{ color: service.color }}
                    >
                      {service.tagline}
                    </p>

                    <p className="text-sm text-[#475569] leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                    <span className="font-pixel text-[8px] text-slate-400">
                      DIFFICULTY: TUNED
                    </span>

                    <a
                      href="#contact"
                      onClick={() => soundEffects.playSelect()}
                      className="inline-flex items-center gap-1.5 font-pixel text-[9px] text-[#1E232B] group-hover:text-[var(--theme-primary)] transition-colors"
                    >
                      <span className="key-2d w-4 h-4 text-[7px] bg-slate-100 border border-[#1E232B] text-[#1E232B] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-colors">
                        A
                      </span>
                      <span>INSPECT</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
