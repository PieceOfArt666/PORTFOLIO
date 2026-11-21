import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MonsoonChaiGame } from './MonsoonChaiGame';
import { DeskTerrariumGame } from './DeskTerrariumGame';
import { BentoKeepsakesGame } from './BentoKeepsakesGame';
import { TravelersSketchbookGame } from './TravelersSketchbookGame';

export type CozyGameId = 'monsoon-chai' | 'desk-terrarium' | 'bento-keepsakes' | 'travelers-sketchbook';

interface CozyGameDef {
  id: CozyGameId;
  title: string;
  subtitle: string;
  icon: string;
  status: 'PLAYABLE' | 'UP NEXT' | 'COMING SOON';
  themeColor: string;
  description: string;
}

const COZY_GAMES: CozyGameDef[] = [
  {
    id: 'monsoon-chai',
    title: 'Monsoon Chai',
    subtitle: 'Tactile Drink-Crafting • Kerala Verandah',
    icon: '☕',
    status: 'PLAYABLE',
    themeColor: '#D97706',
    description: 'Crush fresh cardamom & ginger in a brass mortar, simmer rich milk over a stove, and pull frothy meter chai on a rainy afternoon.'
  },
  {
    id: 'desk-terrarium',
    title: 'Desk Terrarium & Bonsai',
    subtitle: 'Zen Garden Pruning • Lo-Fi Radio',
    icon: '🪴',
    status: 'PLAYABLE',
    themeColor: '#059669',
    description: 'Shape and water a miniature desktop bonsai, prune budding leaves with snips, and listen to cozy ambient rain & lullabies.'
  },
  {
    id: 'bento-keepsakes',
    title: 'Bento & Keepsakes',
    subtitle: 'Satisfying Packing • Geometric Fits',
    icon: '🍱',
    status: 'PLAYABLE',
    themeColor: '#EA580C',
    description: 'Fit rounded onigiri, brass keys, and retro Game Boy cartridges snugly into wooden compartments with weighted click physics.'
  },
  {
    id: 'travelers-sketchbook',
    title: "Traveler's Sketchbook",
    subtitle: 'Vintage Stamps • Postcard Studio',
    icon: '📖',
    status: 'PLAYABLE',
    themeColor: '#7C3AED',
    description: 'Dip carved wooden stamps in matcha and terracotta inks, arrange stationery on cream pages, and export your cozy postcard.'
  }
];

export function CozyArcadeHub() {
  const [selectedGameId, setSelectedGameId] = useState<CozyGameId>('travelers-sketchbook');

  return (
    <section id="cozy-arcade" className="py-20 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-ping" />
              <span className="font-pixel text-[9px] text-[#059669]">WORLD 1-4.5</span>
              <span className="text-slate-300">•</span>
              <span className="font-pixel text-[9px] text-[#1E232B]">COZY BROWSER GAMES LAB</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1E232B] tracking-tight mb-2">
              Playable <span className="text-[#059669]">Cozy Micro-Games</span>
            </h2>

            <p className="text-base text-slate-600 max-w-xl font-medium">
              Zero stress, zero game-overs. Tactile interactive experiments built to be played right inside the browser.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-mono font-bold self-start sm:self-auto shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ALL 4 GAMES PLAYABLE NOW</span>
          </div>
        </motion.div>

        {/* Game Cartridge Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {COZY_GAMES.map((game) => {
            const isSelected = selectedGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border-3 border-[#1E232B] transition-all text-left cursor-pointer group relative ${
                  isSelected
                    ? 'bg-white shadow-[4px_6px_0px_#1E232B] -translate-y-1'
                    : 'bg-[#F5F5F4] hover:bg-white hover:-translate-y-0.5 shadow-[2px_3px_0px_#1E232B]'
                }`}
              >
                {/* Active selection indicator bar */}
                {isSelected && (
                  <div 
                    className="absolute top-0 inset-x-0 h-1.5 rounded-t-xl"
                    style={{ backgroundColor: game.themeColor }}
                  />
                )}

                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className={`font-pixel text-[7px] px-2 py-0.5 rounded-full border ${
                    game.status === 'PLAYABLE'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold'
                      : 'bg-stone-200 text-stone-600 border-stone-300'
                  }`}>
                    {game.status}
                  </span>
                </div>

                <span className="font-bold text-sm text-stone-800 leading-tight">
                  {game.title}
                </span>
                <span className="text-[11px] text-stone-500 font-medium line-clamp-1 mt-0.5">
                  {game.subtitle.split('•')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Game Container Area */}
        <div className="w-full">
          {selectedGameId === 'monsoon-chai' ? (
            <MonsoonChaiGame />
          ) : selectedGameId === 'desk-terrarium' ? (
            <DeskTerrariumGame />
          ) : selectedGameId === 'bento-keepsakes' ? (
            <BentoKeepsakesGame />
          ) : (
            <TravelersSketchbookGame />
          )}
        </div>
      </div>
    </section>
  );
}
