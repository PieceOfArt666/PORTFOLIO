import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, RotateCw, CheckCircle2 } from 'lucide-react';
import { bentoAudio } from './bentoAudio';

type PuzzleTheme = 'bento' | 'keepsakes';

interface BentoItemDef {
  id: string;
  name: string;
  category: string;
  icon: string;
  w: number; // width in grid units (1 to 3)
  h: number; // height in grid units (1 to 3)
  color: string;
  bgGradient: string;
  borderColor: string;
  desc: string;
}

interface PlacedItem {
  id: string;
  itemDefId: string;
  x: number; // top-left column
  y: number; // top-left row
  w: number;
  h: number;
}

const BENTO_THEMES: Record<PuzzleTheme, { title: string; subtitle: string; icon: string; boxBg: string; gridColor: string; items: BentoItemDef[] }> = {
  bento: {
    title: 'Artisan Bento Box',
    subtitle: 'Delicious Japanese Lunch Packing • 4x4 Grid',
    icon: '🍱',
    boxBg: 'bg-[#451A03]',
    gridColor: '#78350F',
    items: [
      { id: 'onigiri', name: 'Onigiri Rice Ball', category: 'Main', icon: '🍙', w: 2, h: 2, color: '#FFFFFF', bgGradient: 'from-stone-100 to-stone-200', borderColor: '#1E232B', desc: 'Warm sushi rice wrapped in crisp roasted nori' },
      { id: 'tamago', name: 'Tamagoyaki Omelet', category: 'Side', icon: '🍳', w: 2, h: 1, color: '#FBBF24', bgGradient: 'from-amber-200 to-yellow-400', borderColor: '#B45309', desc: 'Sweet rolled layered Japanese egg omelet' },
      { id: 'ebi', name: 'Ebi Fry Prawn', category: 'Crisp', icon: '🍤', w: 3, h: 1, color: '#D97706', bgGradient: 'from-amber-400 to-orange-500', borderColor: '#78350F', desc: 'Golden panko-crusted crispy tempura prawn' },
      { id: 'edamame', name: 'Edamame Pods', category: 'Green', icon: '🫛', w: 1, h: 2, color: '#10B981', bgGradient: 'from-emerald-300 to-green-500', borderColor: '#064E3B', desc: 'Steamed salted fresh young soybeans' },
      { id: 'takoyaki', name: 'Takoyaki Ball', category: 'Street', icon: '🧆', w: 1, h: 1, color: '#B45309', bgGradient: 'from-amber-600 to-yellow-700', borderColor: '#451A03', desc: 'Savory battered octopus ball with bonito flakes' },
      { id: 'tomato', name: 'Cherry Tomatoes', category: 'Fresh', icon: '🍅', w: 1, h: 1, color: '#EF4444', bgGradient: 'from-rose-400 to-red-600', borderColor: '#991B1B', desc: 'Sweet sun-ripened red cherry tomatoes' },
      { id: 'plum', name: 'Pickled Umeboshi', category: 'Sour', icon: '🟣', w: 1, h: 1, color: '#A855F7', bgGradient: 'from-purple-300 to-fuchsia-500', borderColor: '#6B21A8', desc: 'Tart pickled salted Japanese mountain plum' },
      { id: 'daifuku', name: 'Strawberry Mochi', category: 'Sweet', icon: '🍓', w: 1, h: 1, color: '#F472B6', bgGradient: 'from-pink-200 to-rose-400', borderColor: '#9D174D', desc: 'Soft chewy rice cake with sweet strawberry filling' },
    ]
  },
  keepsakes: {
    title: "Grandfather's Keepsakes",
    subtitle: 'Nostalgic Memorabilia • The Summer Reverie',
    icon: '🗝️',
    boxBg: 'bg-[#1E1B4B]',
    gridColor: '#312E81',
    items: [
      { id: 'cartridge', name: 'Game Boy Cartridge', category: 'Retro', icon: '🎮', w: 2, h: 2, color: '#9CA3AF', bgGradient: 'from-slate-300 to-stone-400', borderColor: '#1E232B', desc: 'Vintage gray 8-bit handheld game cartridge' },
      { id: 'key', name: 'Brass Skeleton Key', category: 'Antique', icon: '🗝️', w: 2, h: 1, color: '#F59E0B', bgGradient: 'from-amber-300 to-yellow-600', borderColor: '#78350F', desc: 'Ornate heirloom brass key to the ancestral study' },
      { id: 'compass', name: 'Pocket Compass', category: 'Travel', icon: '🧭', w: 2, h: 2, color: '#D97706', bgGradient: 'from-amber-400 to-orange-600', borderColor: '#451A03', desc: 'Polished nautical compass with trembling magnetic needle' },
      { id: 'crane', name: 'Origami Crane', category: 'Paper', icon: '🕊️', w: 1, h: 1, color: '#60A5FA', bgGradient: 'from-sky-200 to-blue-400', borderColor: '#1E40AF', desc: 'Carefully folded sky-blue paper peace crane' },
      { id: 'stamp', name: '1984 Kerala Stamp', category: 'Post', icon: '🏷️', w: 1, h: 1, color: '#34D399', bgGradient: 'from-emerald-200 to-teal-400', borderColor: '#065F46', desc: 'Vintage postal stamp depicting backwater canoes' },
      { id: 'pebble', name: 'River Skipping Stone', category: 'Nature', icon: '🪨', w: 1, h: 1, color: '#6B7280', bgGradient: 'from-stone-300 to-stone-500', borderColor: '#1F2937', desc: 'Ultra-smooth water-weathered river pebble' },
      { id: 'marble', name: 'Glass Swirl Marble', category: 'Play', icon: '🔮', w: 1, h: 1, color: '#818CF8', bgGradient: 'from-indigo-300 to-purple-500', borderColor: '#3730A3', desc: 'Translucent cat-eye glass playing marble' },
      { id: 'watch', name: 'Pocket Watch', category: 'Time', icon: '⏱️', w: 1, h: 1, color: '#FBBF24', bgGradient: 'from-yellow-200 to-amber-500', borderColor: '#92400E', desc: 'Ticking brass timepiece handed down through generations' },
    ]
  }
};

const GRID_SIZE = 4; // 4x4 = 16 cells

export function BentoKeepsakesGame() {
  const [theme, setTheme] = useState<PuzzleTheme>('bento');
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>('onigiri');
  const [isRotated, setIsRotated] = useState(false);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);

  const currentThemeData = BENTO_THEMES[theme];

  // Currently selected item definition
  const currentItemDef = currentThemeData.items.find(i => i.id === selectedItemId);

  // Compute effective width & height based on rotation
  const itemW = isRotated && currentItemDef ? currentItemDef.h : currentItemDef ? currentItemDef.w : 1;
  const itemH = isRotated && currentItemDef ? currentItemDef.w : currentItemDef ? currentItemDef.h : 1;

  // Build grid occupancy matrix (4x4)
  const occupancy: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

  placedItems.forEach(item => {
    for (let r = item.y; r < item.y + item.h; r++) {
      for (let c = item.x; c < item.x + item.w; c++) {
        if (r < GRID_SIZE && c < GRID_SIZE) {
          occupancy[r][c] = item.id;
        }
      }
    }
  });

  // Calculate total cells filled
  const totalCellsFilled = placedItems.reduce((acc, it) => acc + it.w * it.h, 0);
  const isPuzzleComplete = totalCellsFilled === GRID_SIZE * GRID_SIZE;

  // Check if item can fit at (x, y)
  const canFitAt = (gx: number, gy: number, w: number, h: number): boolean => {
    if (gx + w > GRID_SIZE || gy + h > GRID_SIZE) return false;
    for (let r = gy; r < gy + h; r++) {
      for (let c = gx; c < gx + w; c++) {
        if (occupancy[r][c] !== null) return false;
      }
    }
    return true;
  };

  // Place item in grid
  const handleCellClick = (gx: number, gy: number) => {
    if (!currentItemDef || !selectedItemId) return;

    if (canFitAt(gx, gy, itemW, itemH)) {
      bentoAudio.playItemSnap();
      const newItem: PlacedItem = {
        id: `${selectedItemId}-${Date.now()}`,
        itemDefId: selectedItemId,
        x: gx,
        y: gy,
        w: itemW,
        h: itemH,
      };

      const updated = [...placedItems, newItem];
      setPlacedItems(updated);

      // Select next unplaced item if available
      const nextUnplaced = currentThemeData.items.find(
        it => !updated.some(p => p.itemDefId === it.id)
      );
      setSelectedItemId(nextUnplaced ? nextUnplaced.id : null);
      setIsRotated(false);

      // Check if this completed the puzzle!
      if (updated.reduce((acc, it) => acc + it.w * it.h, 0) === GRID_SIZE * GRID_SIZE) {
        setTimeout(() => bentoAudio.playVictory(), 200);
      }
    } else {
      bentoAudio.playInvalid();
    }
  };

  // Click placed item to remove it back to tray
  const handleRemoveItem = (placedId: string) => {
    bentoAudio.playItemPickup();
    const removed = placedItems.find(p => p.id === placedId);
    setPlacedItems(prev => prev.filter(p => p.id !== placedId));
    if (removed) {
      setSelectedItemId(removed.itemDefId);
      setIsRotated(removed.w !== currentThemeData.items.find(i => i.id === removed.itemDefId)?.w);
    }
  };

  // Rotate selected item
  const handleRotate = () => {
    bentoAudio.playRotate();
    setIsRotated(prev => !prev);
  };

  // Switch Theme
  const handleSwitchTheme = (newTheme: PuzzleTheme) => {
    bentoAudio.playItemPickup();
    setTheme(newTheme);
    setPlacedItems([]);
    setSelectedItemId(BENTO_THEMES[newTheme].items[0].id);
    setIsRotated(false);
  };

  // Reset current box
  const handleReset = () => {
    bentoAudio.playItemPickup();
    setPlacedItems([]);
    setSelectedItemId(currentThemeData.items[0].id);
    setIsRotated(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] bg-[#FFFBEB] select-none">
      {/* 1. Header with Theme Switcher, Progress & Reset */}
      <div className="bg-[#1C1917] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1E232B] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-xl shadow-inner">
            🍱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[11px] text-amber-300 tracking-wider">{currentThemeData.title.toUpperCase()}</span>
              <span className="text-[10px] text-stone-400 font-mono font-bold">• PACKING PUZZLE</span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium">Satisfying Spatial Packing Puzzle • Game 3</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher Button (Bento / Keepsakes) */}
          <div className="flex items-center bg-stone-900 border-2 border-[#1E232B] rounded-full p-0.5">
            <button
              onClick={() => handleSwitchTheme('bento')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                theme === 'bento' ? 'bg-[#D97706] text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>🍱</span>
              <span className="hidden sm:inline">Bento</span>
            </button>
            <button
              onClick={() => handleSwitchTheme('keepsakes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                theme === 'keepsakes' ? 'bg-[#4338CA] text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>🗝️</span>
              <span className="hidden sm:inline">Keepsakes</span>
            </button>
          </div>

          {/* Reset Box */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-[#1E232B] cursor-pointer hover:rotate-45 transition-transform"
            title="Empty Box & Start Fresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Status Bar: Packing Percentage & Current Item Guide */}
      <div className="bg-[#FEF3C7] px-4 sm:px-6 py-2.5 border-b-2 border-amber-300/80 flex items-center justify-between text-xs font-mono relative z-20">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[9px] text-stone-700">PACKED:</span>
          <div className="w-36 h-3 bg-stone-200 rounded-full overflow-hidden border-2 border-[#1E232B]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${(totalCellsFilled / 16) * 100}%` }}
            />
          </div>
          <span className="font-pixel text-[10px] text-amber-800 font-bold">
            {totalCellsFilled}/16 CELLS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentItemDef && (
            <button
              onClick={handleRotate}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 border-2 border-[#1E232B] shadow-[1px_2px_0px_#1E232B] text-stone-800 text-[10px] font-pixel cursor-pointer active:translate-y-0.5"
              title="Rotate item 90 degrees"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-700" />
              <span>ROTATE [ {itemW}x{itemH} ]</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Gameplay Workspace (Tray + Grid) */}
      <div className="relative min-h-[480px] p-4 sm:p-8 flex flex-col md:flex-row items-center justify-center gap-8 overflow-hidden">
        {/* Soft Wood Grain & Linen Runner Background */}
        <div className="absolute inset-0 bg-[#FFFDF5] pointer-events-none opacity-80" />
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* The Compartment Bento Box Grid (4x4) */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Lacquered Wooden Outer Casing */}
          <div className={`p-4 sm:p-5 rounded-3xl border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] ${currentThemeData.boxBg} relative`}>
            {/* Box Outer Lip Highlight */}
            <div className="absolute inset-1 rounded-2xl border border-yellow-200/20 pointer-events-none" />

            {/* 4x4 Grid Cells Container */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 p-2 bg-[#1C1917]/70 rounded-2xl border-2 border-black/40 shadow-inner">
              {Array.from({ length: GRID_SIZE }).map((_, r) =>
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const isOccupied = occupancy[r][c] !== null;
                  const isHover =
                    hoverCell &&
                    r >= hoverCell.y &&
                    r < hoverCell.y + itemH &&
                    c >= hoverCell.x &&
                    c < hoverCell.x + itemW;
                  const validHover =
                    isHover && hoverCell && canFitAt(hoverCell.x, hoverCell.y, itemW, itemH);

                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseEnter={() => setHoverCell({ x: c, y: r })}
                      onMouseLeave={() => setHoverCell(null)}
                      onClick={() => handleCellClick(c, r)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed transition-all relative flex items-center justify-center cursor-pointer ${
                        validHover
                          ? 'border-emerald-400 bg-emerald-400/35 shadow-inner scale-95'
                          : isHover
                          ? 'border-rose-400 bg-rose-400/30'
                          : isOccupied
                          ? 'border-transparent'
                          : 'border-amber-900/50 bg-[#292524]/60 hover:bg-[#352F2D]'
                      }`}
                    >
                      {!isOccupied && (
                        <span className="font-pixel text-[8px] text-amber-900/40 select-none">
                          +
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Render Placed Items Positioned Accurately on Top of Grid */}
            <div className="absolute inset-0 p-4 sm:p-5 pointer-events-none">
              <div className="relative w-full h-full p-2">
                {placedItems.map(placed => {
                  const def = currentThemeData.items.find(i => i.id === placed.itemDefId);
                  if (!def) return null;

                  // Compute absolute percentage positioning on 4x4 grid
                  const cellStep = 100 / 4;
                  const left = `${placed.x * cellStep}%`;
                  const top = `${placed.y * cellStep}%`;
                  const width = `${placed.w * cellStep}%`;
                  const height = `${placed.h * cellStep}%`;

                  return (
                    <motion.div
                      key={placed.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(placed.id);
                      }}
                      style={{ left, top, width, height }}
                      className="absolute p-1 pointer-events-auto cursor-pointer group"
                      title="Click to remove back to tray"
                    >
                      <div className={`w-full h-full rounded-xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B] bg-gradient-to-br ${def.bgGradient} flex flex-col items-center justify-center p-1 relative overflow-hidden group-hover:scale-105 transition-transform`}>
                        <span className="text-xl sm:text-2xl filter drop-shadow select-none">
                          {def.icon}
                        </span>
                        <span className="font-bold text-[9px] text-[#1E232B] line-clamp-1 leading-tight text-center px-1">
                          {def.name.split(' ')[0]}
                        </span>
                        <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 font-pixel text-[7px] bg-[#1E232B] text-white px-1 rounded transition-opacity">
                          ✕
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <span className="font-pixel text-[8px] text-stone-500 mt-2">
            CLICK PLACED ITEM TO LIFT BACK TO TRAY
          </span>
        </div>

        {/* Unplaced Items Tray on the Right */}
        <div className="relative z-10 w-full max-w-xs flex flex-col gap-3">
          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B]">
            <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-stone-100">
              <span className="font-pixel text-[9px] text-stone-800">
                {theme === 'bento' ? 'LUNCH TRAY' : 'MEMORABILIA TRAY'}:
              </span>
              <span className="text-xs font-mono font-bold text-amber-800">
                {placedItems.length}/{currentThemeData.items.length} Placed
              </span>
            </div>

            {/* Tray Item Buttons */}
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {currentThemeData.items.map((item) => {
                const isPlaced = placedItems.some(p => p.itemDefId === item.id);
                const isSelected = selectedItemId === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isPlaced}
                    onClick={() => {
                      bentoAudio.playItemPickup();
                      setSelectedItemId(item.id);
                      setIsRotated(false);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl border-2 transition-all text-left relative ${
                      isPlaced
                        ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-100 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] -translate-y-0.5'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-pixel text-[7px] text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-300">
                        {item.w}x{item.h}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-stone-800 leading-tight">
                      {item.name}
                    </span>
                    {isPlaced && (
                      <span className="font-pixel text-[7px] text-emerald-700 mt-1">
                        ✓ PACKED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Item Floating Helper Card */}
          {currentItemDef && !isPuzzleComplete && (
            <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentItemDef.icon}</span>
                <div>
                  <span className="font-bold text-xs text-stone-800 block">
                    {currentItemDef.name}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Shape: {itemW} wide × {itemH} tall
                  </span>
                </div>
              </div>

              <button
                onClick={handleRotate}
                className="p-2 rounded-xl bg-white hover:bg-amber-100 border-2 border-[#1E232B] shadow-[1px_2px_0px_#1E232B] text-amber-800 cursor-pointer active:translate-y-0.5"
                title="Rotate Item"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal Overlay */}
        <AnimatePresence>
          {isPuzzleComplete && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-[#1C1917]/80 backdrop-blur-sm z-30 flex items-center justify-center p-4"
            >
              <div className="bg-[#FFFBEB] p-6 sm:p-8 rounded-3xl border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] max-w-md w-full text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-3xl mx-auto mb-3">
                  ✨
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-pixel text-[8px] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PERFECT FIT • ZERO GAPS</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mb-2">
                  {theme === 'bento' ? 'Bento Box Snapped Shut!' : 'Memory Drawer Sealed!'}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
                  {theme === 'bento'
                    ? 'All 16 compartments are packed with mouthwatering balance. The furoshiki ribbon snaps with pure geometric harmony!'
                    : 'Every cherished heirloom rests in its exact velvet groove. Grandfather’s memories are safely preserved.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleSwitchTheme(theme === 'bento' ? 'keepsakes' : 'bento')}
                    className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-pixel text-xs border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] active:translate-y-1 cursor-pointer"
                  >
                    {theme === 'bento' ? 'PLAY KEEPSAKES DRAWER ➔' : 'PLAY BENTO BOX ➔'}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-pixel text-xs border-2 border-[#1E232B] cursor-pointer"
                  >
                    PACK AGAIN ↺
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Footer */}
      <div className="bg-[#1C1917] px-4 py-2.5 text-center border-t-2 border-[#1E232B] relative z-20">
        <p className="font-mono text-[11px] text-amber-200/90 font-bold">
          "Order is not about perfection; it is about giving every quiet moment a home." 🍱
        </p>
      </div>
    </div>
  );
}
