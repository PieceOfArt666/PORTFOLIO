import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  RotateCcw, 
  Undo2, 
  Sparkles, 
  Type, 
  Palette, 
  Check
} from 'lucide-react';
import { sketchbookAudio } from './sketchbookAudio';

// Stamp Definition
interface StampDef {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'heritage' | 'cozy';
  svgPath?: string;
  renderSvg: (color: string) => React.ReactNode;
}

// Placed Stamp on Canvas
interface PlacedStamp {
  id: string;
  stampId: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  color: string;
  rotation: number;
  scale: number;
}

// Ink Color Definition
interface InkDef {
  id: string;
  name: string;
  hex: string;
  colorClass: string;
}

const INK_PALETTE: InkDef[] = [
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#C2410C', colorClass: 'bg-[#C2410C]' },
  { id: 'matcha', name: 'Matcha Forest', hex: '#15803D', colorClass: 'bg-[#15803D]' },
  { id: 'indigo', name: 'Backwater Indigo', hex: '#1E3A8A', colorClass: 'bg-[#1E3A8A]' },
  { id: 'espresso', name: 'Roasted Espresso', hex: '#78350F', colorClass: 'bg-[#78350F]' },
  { id: 'vermilion', name: 'Sakura Vermilion', hex: '#BE123C', colorClass: 'bg-[#BE123C]' },
  { id: 'antique-gold', name: 'Antique Gold', hex: '#B45309', colorClass: 'bg-[#B45309]' },
  { id: 'noir', name: 'Charcoal Noir', hex: '#27272A', colorClass: 'bg-[#27272A]' },
];

const PAPER_THEMES = [
  { id: 'parchment', name: 'Aged Parchment', bg: 'bg-[#FDF6E2]', text: 'text-[#451A03]', border: 'border-[#D97706]/40' },
  { id: 'linen', name: 'Pressed Linen', bg: 'bg-[#FBF8EF]', text: 'text-[#292524]', border: 'border-stone-300' },
  { id: 'kraft', name: 'Tea-Stained Kraft', bg: 'bg-[#F5E6CA]', text: 'text-[#3E2723]', border: 'border-[#A16207]/40' },
  { id: 'midnight', name: 'Postal Midnight', bg: 'bg-[#1E1B4B]', text: 'text-[#E0E7FF]', border: 'border-[#4338CA]/60' }
];

const PRESET_QUOTES = [
  "The afternoon rain stopped just in time for meter chai.",
  "Watching the mist roll quietly over the Nilgiri hills.",
  "Somewhere between Kochi backwaters and the tea gardens.",
  "A quiet morning on the train with a sketchbook in hand.",
  "Postcard from a wandering heart • Kerala 1984"
];

// Rich Collection of Handcrafted Stamp Vectors
const STAMPS: StampDef[] = [
  {
    id: 'palm',
    name: 'Coconut Palm',
    icon: '🌴',
    category: 'nature',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Curved trunk */}
        <path d="M 28 58 Q 32 38 34 22" />
        <path d="M 32 58 Q 35 40 37 22" />
        {/* Palm fronds */}
        <path d="M 34 22 Q 22 18 12 26" />
        <path d="M 34 22 Q 26 10 18 8" />
        <path d="M 34 22 Q 36 8 46 10" />
        <path d="M 34 22 Q 46 16 52 24" />
        <path d="M 34 22 Q 40 30 48 38" />
        <path d="M 34 22 Q 24 28 16 36" />
        {/* Coconuts */}
        <circle cx="32" cy="23" r="2.5" fill={color} />
        <circle cx="36" cy="24" r="2.5" fill={color} />
        {/* Ground grass */}
        <path d="M 22 58 Q 28 56 38 58" />
      </svg>
    )
  },
  {
    id: 'train',
    name: 'Steam Locomotive',
    icon: '🚂',
    category: 'heritage',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Train boiler & cabin */}
        <rect x="14" y="26" width="36" height="18" rx="3" />
        <rect x="36" y="16" width="14" height="18" rx="2" />
        <rect x="40" y="20" width="6" height="6" fill={color} fillOpacity="0.2" />
        {/* Chimney & cowcatcher */}
        <path d="M 20 26 L 18 16 L 24 16 L 22 26" />
        <path d="M 14 42 L 8 46 L 14 46" fill={color} fillOpacity="0.3" />
        {/* Wheels */}
        <circle cx="20" cy="46" r="5" />
        <circle cx="32" cy="46" r="5" />
        <circle cx="44" cy="46" r="5" />
        {/* Steam puffs */}
        <circle cx="16" cy="12" r="2" strokeDasharray="2 2" />
        <circle cx="12" cy="8" r="3" strokeDasharray="2 2" />
        <circle cx="8" cy="4" r="3.5" strokeDasharray="2 2" />
      </svg>
    )
  },
  {
    id: 'chaya',
    name: 'Kerala Chaya Glass',
    icon: '☕',
    category: 'cozy',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Fluted tea glass */}
        <path d="M 20 18 L 24 50 L 40 50 L 44 18 Z" />
        <line x1="22" y1="24" x2="42" y2="24" strokeDasharray="2 1" />
        <line x1="28" y1="24" x2="29" y2="48" />
        <line x1="32" y1="24" x2="32" y2="48" />
        <line x1="36" y1="24" x2="35" y2="48" />
        {/* Saucer / Plate */}
        <path d="M 16 54 Q 32 58 48 54" />
        {/* Tea steam */}
        <path d="M 28 14 Q 30 10 27 6" />
        <path d="M 33 14 Q 36 10 33 6" />
        <path d="M 38 14 Q 40 10 38 6" />
      </svg>
    )
  },
  {
    id: 'mountains',
    name: 'Nilgiri Mountain Peaks',
    icon: '⛰️',
    category: 'nature',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Back ridge */}
        <path d="M 6 48 L 22 22 L 38 48" />
        <path d="M 22 22 L 20 30 L 26 34" strokeDasharray="2 2" />
        {/* Fore ridge */}
        <path d="M 26 48 L 42 16 L 58 48" />
        <path d="M 42 16 L 39 26 L 47 30" strokeDasharray="2 2" />
        {/* Rising sun / moon */}
        <circle cx="16" cy="18" r="4" fill={color} fillOpacity="0.25" />
        {/* Pine trees at base */}
        <path d="M 10 48 L 12 44 L 14 48" />
        <path d="M 50 48 L 52 44 L 54 48" />
      </svg>
    )
  },
  {
    id: 'compass',
    name: 'Traveler Compass Rose',
    icon: '🧭',
    category: 'heritage',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer and inner circles */}
        <circle cx="32" cy="32" r="22" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="18" strokeDasharray="2 2" />
        {/* 4 Points */}
        <polygon points="32,14 35,29 32,32 29,29" fill={color} />
        <polygon points="32,50 35,35 32,32 29,35" fill="none" stroke={color} />
        <polygon points="50,32 35,35 32,32 35,29" fill="none" stroke={color} />
        <polygon points="14,32 29,35 32,32 29,29" fill="none" stroke={color} />
        {/* Cardinal Letters */}
        <text x="32" y="11" textAnchor="middle" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace">N</text>
        <circle cx="32" cy="32" r="2" fill={color} />
      </svg>
    )
  },
  {
    id: 'canoe',
    name: 'Kettuvalam Backwater Boat',
    icon: '🛶',
    category: 'heritage',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Traditional canoe hull */}
        <path d="M 8 38 Q 32 46 56 38 Q 48 48 16 48 Z" fill={color} fillOpacity="0.2" />
        {/* Thatch canopy */}
        <path d="M 20 38 Q 32 24 44 38" />
        <path d="M 24 38 Q 32 28 40 38" strokeDasharray="2 1" />
        {/* Oar / Pole */}
        <line x1="16" y1="28" x2="10" y2="52" strokeWidth="2" />
        {/* Ripple waves */}
        <path d="M 4 52 Q 12 50 20 52 Q 28 54 36 52 Q 44 50 52 52 Q 58 54 62 52" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'airmail',
    name: '1984 Airmail Postal Crest',
    icon: '📮',
    category: 'heritage',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Circular cancel stamp */}
        <circle cx="32" cy="32" r="24" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="20" strokeDasharray="3 2" />
        {/* Wavy cancellation bars */}
        <path d="M 12 28 Q 22 24 32 28 Q 42 32 52 28" />
        <path d="M 12 36 Q 22 32 32 36 Q 42 40 52 36" />
        {/* Text */}
        <text x="32" y="20" textAnchor="middle" fill={color} fontSize="6" fontWeight="bold" fontFamily="monospace">POSTE KERALA</text>
        <text x="32" y="46" textAnchor="middle" fill={color} fontSize="6.5" fontWeight="black" fontFamily="monospace">NOV 1984</text>
      </svg>
    )
  },
  {
    id: 'orchid',
    name: 'Wild Mountain Blossom',
    icon: '🌸',
    category: 'nature',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* 5 Petals */}
        <ellipse cx="32" cy="20" rx="6" ry="10" />
        <ellipse cx="43" cy="28" rx="10" ry="6" transform="rotate(35 43 28)" />
        <ellipse cx="39" cy="42" rx="6" ry="10" transform="rotate(70 39 42)" />
        <ellipse cx="25" cy="42" rx="6" ry="10" transform="rotate(-70 25 42)" />
        <ellipse cx="21" cy="28" rx="10" ry="6" transform="rotate(-35 21 28)" />
        {/* Center pistil */}
        <circle cx="32" cy="32" r="4" fill={color} />
      </svg>
    )
  },
  {
    id: 'lantern',
    name: 'Cozy Verandah Lantern',
    icon: '🏮',
    category: 'cozy',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Top hanger and ring */}
        <circle cx="32" cy="12" r="3" />
        <line x1="32" y1="15" x2="32" y2="20" />
        <path d="M 22 20 L 42 20" strokeWidth="3" />
        {/* Oval glass body */}
        <path d="M 24 20 Q 18 34 24 48 L 40 48 Q 46 34 40 20 Z" />
        {/* Inner flame */}
        <path d="M 32 42 Q 28 36 32 30 Q 36 36 32 42" fill={color} fillOpacity="0.4" />
        {/* Base */}
        <path d="M 20 48 L 44 48" strokeWidth="3" />
        <path d="M 24 52 L 40 52" />
      </svg>
    )
  },
  {
    id: 'kingfisher',
    name: 'River Kingfisher',
    icon: '🐦',
    category: 'nature',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Perched branch */}
        <path d="M 12 52 Q 32 48 54 52" />
        {/* Body and long beak */}
        <ellipse cx="34" cy="34" rx="8" ry="12" transform="rotate(15 34 34)" />
        <circle cx="36" cy="20" r="6" />
        <path d="M 42 20 L 56 22 L 42 24" fill={color} />
        {/* Tail */}
        <path d="M 28 44 L 22 56 L 26 56 L 31 44" fill={color} fillOpacity="0.3" />
        {/* Eye */}
        <circle cx="38" cy="19" r="1.5" fill={color} />
      </svg>
    )
  },
  {
    id: 'elephant',
    name: 'Heritage Elephant Silhouette',
    icon: '🐘',
    category: 'heritage',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Back, head and trunk */}
        <path d="M 16 46 L 16 34 Q 18 20 34 20 Q 42 20 46 26 Q 52 32 50 42 Q 49 46 45 44" />
        {/* Tusk */}
        <path d="M 44 38 Q 48 38 46 34" strokeWidth="2" />
        {/* Ears */}
        <path d="M 38 24 Q 30 26 32 38 Q 36 40 38 34" fill={color} fillOpacity="0.2" />
        {/* Legs */}
        <line x1="22" y1="42" x2="22" y2="52" strokeWidth="3" />
        <line x1="28" y1="42" x2="28" y2="52" strokeWidth="3" />
        <line x1="38" y1="42" x2="38" y2="52" strokeWidth="3" />
        <line x1="44" y1="42" x2="44" y2="52" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'sunburst',
    name: 'Vintage Sol Sunburst',
    icon: '☀️',
    category: 'cozy',
    renderSvg: (color) => (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="10" strokeWidth="2.5" fill={color} fillOpacity="0.15" />
        {/* Radiant rays */}
        <line x1="32" y1="12" x2="32" y2="18" strokeWidth="2.5" />
        <line x1="32" y1="46" x2="32" y2="52" strokeWidth="2.5" />
        <line x1="12" y1="32" x2="18" y2="32" strokeWidth="2.5" />
        <line x1="46" y1="32" x2="52" y2="32" strokeWidth="2.5" />
        <line x1="18" y1="18" x2="22" y2="22" strokeWidth="2" />
        <line x1="42" y1="42" x2="46" y2="46" strokeWidth="2" />
        <line x1="42" y1="22" x2="46" y2="18" strokeWidth="2" />
        <line x1="18" y1="46" x2="22" y2="42" strokeWidth="2" />
      </svg>
    )
  }
];

export function TravelersSketchbookGame() {
  const [selectedStampId, setSelectedStampId] = useState<string>('palm');
  const [activeInk, setActiveInk] = useState<InkDef>(INK_PALETTE[0]);
  const [paperTheme, setPaperTheme] = useState(PAPER_THEMES[0]);
  const [placedStamps, setPlacedStamps] = useState<PlacedStamp[]>([
    { id: 'initial-1', stampId: 'airmail', x: 82, y: 18, color: '#C2410C', rotation: -5, scale: 0.9 },
    { id: 'initial-2', stampId: 'palm', x: 25, y: 48, color: '#15803D', rotation: 2, scale: 1.1 },
    { id: 'initial-3', stampId: 'chaya', x: 45, y: 62, color: '#78350F', rotation: -3, scale: 0.95 }
  ]);
  const [hasWashiTape, setHasWashiTape] = useState(true);
  const [travelerNote, setTravelerNote] = useState<string>(PRESET_QUOTES[0]);
  const [customNoteInput, setCustomNoteInput] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [stampScale, setStampScale] = useState<number>(1.0);
  const [stampAngle, setStampAngle] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [exportNotice, setExportNotice] = useState(false);

  const postcardRef = useRef<HTMLDivElement>(null);

  const activeStamp = STAMPS.find(s => s.id === selectedStampId) || STAMPS[0];

  // Handle stamping onto the paper canvas
  const handlePostcardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!postcardRef.current) return;
    const rect = postcardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Slight handcrafted human tilt variation (+/- 4 degrees)
    const naturalWobble = (Math.random() - 0.5) * 8;
    const finalAngle = stampAngle + naturalWobble;

    sketchbookAudio.playStamp();

    const newStamp: PlacedStamp = {
      id: `stamp-${Date.now()}-${Math.random()}`,
      stampId: selectedStampId,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      color: activeInk.hex,
      rotation: finalAngle,
      scale: stampScale
    };

    setPlacedStamps(prev => [...prev, newStamp]);
  };

  // Remove a specific placed stamp
  const handleRemoveStamp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sketchbookAudio.playPaperRustle();
    setPlacedStamps(prev => prev.filter(s => s.id !== id));
  };

  // Undo last stamp
  const handleUndo = () => {
    if (placedStamps.length === 0) return;
    sketchbookAudio.playPaperRustle();
    setPlacedStamps(prev => prev.slice(0, -1));
  };

  // Clear all stamps
  const handleClear = () => {
    sketchbookAudio.playPaperRustle();
    setPlacedStamps([]);
  };

  // Export Postcard as Canvas Download
  const handleExportPostcard = () => {
    sketchbookAudio.playExportChime();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);

    // Create high-resolution export canvas (1200 x 800)
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Postcard Background fill
    ctx.fillStyle = paperTheme.id === 'midnight' ? '#1E1B4B' : paperTheme.id === 'kraft' ? '#F5E6CA' : '#FDF6E2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Vintage Deckled Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1E232B';
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    // 3. Central Postcard Divider Line
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = paperTheme.id === 'midnight' ? '#4338CA' : '#A8A29E';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 40);
    ctx.lineTo(canvas.width / 2, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Postal Stamp Box on Top Right
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1E232B';
    ctx.strokeRect(canvas.width - 150, 40, 110, 130);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = paperTheme.id === 'midnight' ? '#E0E7FF' : '#78716C';
    ctx.textAlign = 'center';
    ctx.fillText('AFFIX', canvas.width - 95, 95);
    ctx.fillText('STAMP', canvas.width - 95, 115);

    // 5. Postal Address Lines on Right Side
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = paperTheme.id === 'midnight' ? '#4338CA' : '#D6D3D1';
    [240, 310, 380, 450].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 + 50, y);
      ctx.lineTo(canvas.width - 50, y);
      ctx.stroke();
    });

    // 6. Traveler's Handwritten Note on Left Side
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillStyle = paperTheme.id === 'midnight' ? '#F8FAFC' : '#1C1917';
    ctx.textAlign = 'left';
    ctx.fillText(`"${travelerNote}"`, 60, canvas.height - 90);

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = paperTheme.id === 'midnight' ? '#818CF8' : '#B45309';
    ctx.fillText('KERALA VERANDAH POSTCARD • WORLD 1-4.5', 60, canvas.height - 50);

    // Trigger download
    const link = document.createElement('a');
    link.download = `kerala-travel-postcard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] bg-[#FFFBEB] select-none">
      {/* 1. Header with Controls & Export Button */}
      <div className="bg-[#1C1917] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1E232B] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-xl shadow-inner">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[11px] text-purple-300 tracking-wider">TRAVELER'S SKETCHBOOK</span>
              <span className="text-[10px] text-stone-400 font-mono font-bold">• 郵便 絵葉書</span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium">Vintage Stamp & Postcard Studio • Game 6</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Paper Theme Picker */}
          <div className="hidden sm:flex items-center bg-stone-900 border-2 border-[#1E232B] rounded-full p-0.5">
            {PAPER_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sketchbookAudio.playPaperRustle();
                  setPaperTheme(theme);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                  paperTheme.id === theme.id ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                {theme.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={placedStamps.length === 0}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border-2 border-[#1E232B] cursor-pointer"
            title="Undo Last Stamp"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Clear Canvas */}
          <button
            onClick={handleClear}
            disabled={placedStamps.length === 0}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border-2 border-[#1E232B] cursor-pointer"
            title="Clear Postcard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Export Postcard Button */}
          <button
            onClick={handleExportPostcard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-pixel text-[10px] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] active:translate-y-0.5 cursor-pointer"
            title="Save and download this postcard"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT PNG</span>
          </button>
        </div>
      </div>

      {/* 2. Top Toolbar: Ink Pad Palette & Stamp Tweaks */}
      <div className="bg-[#FEF3C7] px-4 sm:px-6 py-2.5 border-b-2 border-amber-300/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-20">
        {/* Ink Pad Selection */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-stone-700 flex items-center gap-1">
            <Palette className="w-3 h-3 text-amber-800" />
            <span>INK PAD:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {INK_PALETTE.map((ink) => {
              const isSelected = activeInk.id === ink.id;
              return (
                <button
                  key={ink.id}
                  onClick={() => {
                    sketchbookAudio.playInkDab();
                    setActiveInk(ink);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${ink.colorClass} ${
                    isSelected ? 'scale-115 border-[#1E232B] shadow-[1px_2px_0px_#1E232B]' : 'border-stone-400 opacity-85 hover:opacity-100'
                  }`}
                  title={`${ink.name} Ink Pad`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white filter drop-shadow" />}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] font-bold text-stone-700 hidden md:inline ml-1">
            {activeInk.name}
          </span>
        </div>

        {/* Stamp Size and Angle adjustments */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-700">
            <span>SIZE:</span>
            <button
              onClick={() => {
                sketchbookAudio.playInkDab();
                setStampScale(prev => Math.max(0.7, prev - 0.15));
              }}
              className="px-1.5 py-0.5 rounded bg-white border border-[#1E232B] hover:bg-stone-100"
            >
              -
            </button>
            <span className="w-8 text-center">{Math.round(stampScale * 100)}%</span>
            <button
              onClick={() => {
                sketchbookAudio.playInkDab();
                setStampScale(prev => Math.min(1.5, prev + 0.15));
              }}
              className="px-1.5 py-0.5 rounded bg-white border border-[#1E232B] hover:bg-stone-100"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-700">
            <span>TILT:</span>
            <button
              onClick={() => {
                sketchbookAudio.playInkDab();
                setStampAngle(prev => (prev - 15) % 360);
              }}
              className="px-1.5 py-0.5 rounded bg-white border border-[#1E232B] hover:bg-stone-100"
              title="Rotate counter-clockwise"
            >
              ⟲
            </button>
            <span className="w-8 text-center">{stampAngle}°</span>
            <button
              onClick={() => {
                sketchbookAudio.playInkDab();
                setStampAngle(prev => (prev + 15) % 360);
              }}
              className="px-1.5 py-0.5 rounded bg-white border border-[#1E232B] hover:bg-stone-100"
              title="Rotate clockwise"
            >
              ⟳
            </button>
          </div>

          {/* Toggle Washi Tape */}
          <button
            onClick={() => {
              sketchbookAudio.playTapeStick();
              setHasWashiTape(prev => !prev);
            }}
            className={`px-2 py-0.5 rounded border text-[9px] font-pixel transition-all ${
              hasWashiTape ? 'bg-amber-800 text-white border-amber-950' : 'bg-white text-stone-700 border-stone-300'
            }`}
          >
            TAPE: {hasWashiTape ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 3. Main Studio Workspace: Stamp Drawer + Postcard Canvas */}
      <div className="relative min-h-[500px] p-4 sm:p-6 flex flex-col lg:flex-row items-center justify-center gap-6 overflow-hidden">
        {/* Wooden Desktop Ambience */}
        <div className="absolute inset-0 bg-[#EFE9DB] pointer-events-none opacity-60" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Stamp Drawer */}
        <div className="relative z-10 w-full lg:w-60 flex flex-col gap-2 order-2 lg:order-1">
          <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
              <span className="font-pixel text-[9px] text-stone-800 flex items-center gap-1">
                <span>CARVED STAMPS</span>
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold">
                {STAMPS.length} Designs
              </span>
            </div>

            {/* Stamp Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {STAMPS.map((stamp) => {
                const isSelected = selectedStampId === stamp.id;
                return (
                  <button
                    key={stamp.id}
                    onClick={() => {
                      sketchbookAudio.playInkDab();
                      setSelectedStampId(stamp.id);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all cursor-pointer group text-center relative ${
                      isSelected
                        ? 'bg-purple-50 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] -translate-y-0.5'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-300'
                    }`}
                  >
                    <div className="w-9 h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      {stamp.renderSvg(isSelected ? activeInk.hex : '#57534E')}
                    </div>
                    <span className="font-bold text-[9px] text-stone-700 leading-tight line-clamp-1">
                      {stamp.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stamp Preview Block */}
          <div className="bg-[#FFFDF5] p-3 rounded-2xl border-2 border-amber-300 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 p-1 bg-white rounded-xl border-2 border-[#1E232B] flex items-center justify-center">
                {activeStamp.renderSvg(activeInk.hex)}
              </div>
              <div>
                <span className="font-bold text-xs text-stone-800 block leading-tight">
                  {activeStamp.name}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  Click on card to stamp
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
        </div>

        {/* Right Postcard Canvas Area */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-xl order-1 lg:order-2">
          {/* Postcard Container with Deckled Borders and Shadow */}
          <div
            ref={postcardRef}
            onClick={handlePostcardClick}
            onMouseMove={(e) => {
              if (!postcardRef.current) return;
              const rect = postcardRef.current.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            }}
            onMouseLeave={() => setMousePos(null)}
            className={`w-full aspect-[4/2.7] rounded-2xl border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] p-4 sm:p-6 relative cursor-crosshair overflow-hidden transition-colors duration-300 ${paperTheme.bg} ${paperTheme.text}`}
          >
            {/* Washi Tape Corners */}
            {hasWashiTape && (
              <>
                <div className="absolute -top-2.5 left-6 w-14 h-5 bg-[#CA8A04]/70 border-b border-t border-black/20 -rotate-3 shadow-xs pointer-events-none" />
                <div className="absolute -top-2.5 right-6 w-14 h-5 bg-[#BE123C]/70 border-b border-t border-black/20 rotate-4 shadow-xs pointer-events-none" />
                <div className="absolute -bottom-2.5 left-8 w-14 h-5 bg-[#15803D]/70 border-b border-t border-black/20 2 shadow-xs pointer-events-none" />
                <div className="absolute -bottom-2.5 right-8 w-14 h-5 bg-[#1E3A8A]/70 border-b border-t border-black/20 -rotate-2 shadow-xs pointer-events-none" />
              </>
            )}

            {/* Central Vertical Postcard Line */}
            <div className={`absolute top-4 bottom-4 left-1/2 w-0.5 border-r-2 border-dashed pointer-events-none ${paperTheme.border}`} />

            {/* Postcard Layout Grid */}
            <div className="relative w-full h-full flex justify-between pointer-events-none">
              {/* Left Side: Message Area */}
              <div className="w-[46%] h-full flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-1.5 opacity-60 mb-2">
                    <span className="font-pixel text-[7px]">CORRESPONDENCE</span>
                    <span className="text-[9px]">•</span>
                    <span className="font-pixel text-[7px]">1984</span>
                  </div>

                  {/* Handwritten Travel Quote / Custom Note */}
                  <div className="font-serif italic text-xs sm:text-sm leading-relaxed pr-2 pointer-events-auto">
                    "{travelerNote}"
                  </div>
                </div>

                <div className="opacity-50 text-[9px] font-mono">
                  Kerala Hill Station & Backwaters
                </div>
              </div>

              {/* Right Side: Airmail Stamp & Address Lines */}
              <div className="w-[46%] h-full flex flex-col justify-between items-end py-1">
                {/* Stamp Box */}
                <div className="w-16 h-20 rounded border-2 border-dashed border-stone-500/70 flex flex-col items-center justify-center p-1 relative">
                  <span className="font-pixel text-[6px] opacity-60 text-center">
                    POSTAGE
                  </span>
                  <span className="text-xl my-0.5">🏷️</span>
                  <span className="font-mono text-[7px] font-bold opacity-75">
                    1984
                  </span>
                </div>

                {/* 3 Postal Address Guide Lines */}
                <div className="w-full space-y-3.5 mb-2">
                  <div className={`w-full border-b ${paperTheme.border}`} />
                  <div className={`w-full border-b ${paperTheme.border}`} />
                  <div className={`w-full border-b ${paperTheme.border}`} />
                </div>
              </div>
            </div>

            {/* Render All Stamped Marks on Canvas */}
            <div className="absolute inset-0 pointer-events-none">
              {placedStamps.map((stamp) => {
                const def = STAMPS.find(s => s.id === stamp.stampId);
                if (!def) return null;

                return (
                  <motion.div
                    key={stamp.id}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: stamp.scale, opacity: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    style={{
                      left: `${stamp.x}%`,
                      top: `${stamp.y}%`,
                      transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg)`
                    }}
                    className="absolute w-14 h-14 sm:w-16 sm:h-16 pointer-events-auto cursor-pointer group"
                    title="Click to peel off / remove"
                    onClick={(e) => handleRemoveStamp(stamp.id, e)}
                  >
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform">
                      {def.renderSvg(stamp.color)}
                      {/* Peel/Delete Hover Hint */}
                      <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 font-pixel text-[7px] bg-[#1E232B] text-white px-1 rounded transition-opacity">
                        ✕
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ghost Cursor Stamp Following Mouse */}
            {mousePos && (
              <div
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  transform: `translate(-50%, -50%) rotate(${stampAngle}deg) scale(${stampScale})`
                }}
                className="absolute w-14 h-14 sm:w-16 sm:h-16 pointer-events-none opacity-45 filter drop-shadow"
              >
                {activeStamp.renderSvg(activeInk.hex)}
              </div>
            )}
          </div>

          {/* Under-canvas instructions & Note Editor */}
          <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-stone-600">
            <span className="font-pixel text-[8px] text-stone-500">
              CLICK ANYWHERE ON CARD TO STAMP • CLICK STAMP TO PEEL
            </span>

            {/* Preset Quote Switcher Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sketchbookAudio.playTapeStick();
                  setIsEditingNote(prev => !prev);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white hover:bg-stone-100 border border-stone-300 cursor-pointer font-bold"
              >
                <Type className="w-3 h-3 text-purple-700" />
                <span>{isEditingNote ? 'CLOSE NOTE' : 'EDIT NOTE'}</span>
              </button>

              <button
                onClick={() => {
                  sketchbookAudio.playPaperRustle();
                  const nextIdx = (PRESET_QUOTES.indexOf(travelerNote) + 1) % PRESET_QUOTES.length;
                  setTravelerNote(PRESET_QUOTES[nextIdx]);
                }}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-stone-100 border border-stone-300 cursor-pointer"
                title="Cycle Travel Notes"
              >
                RANDOM QUOTE ⟳
              </button>
            </div>
          </div>

          {/* Collapsible Note Editor */}
          <AnimatePresence>
            {isEditingNote && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full mt-2 p-3 bg-white rounded-2xl border-2 border-stone-300 shadow-xs overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customNoteInput}
                    onChange={(e) => setCustomNoteInput(e.target.value)}
                    placeholder="Write your custom travel inscription..."
                    maxLength={70}
                    className="flex-1 px-3 py-1.5 text-xs border rounded-xl border-stone-300 focus:outline-none focus:border-purple-600 font-serif italic"
                  />
                  <button
                    onClick={() => {
                      if (customNoteInput.trim()) {
                        sketchbookAudio.playStamp();
                        setTravelerNote(customNoteInput.trim());
                        setCustomNoteInput('');
                        setIsEditingNote(false);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-pixel text-[8px] cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Export Download Success Notification Banner */}
      <AnimatePresence>
        {exportNotice && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-12 inset-x-4 max-w-sm mx-auto p-3 rounded-2xl bg-[#15803D] text-white border-2 border-[#1E232B] shadow-[4px_6px_0px_#1E232B] flex items-center justify-between gap-3 z-30"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="font-pixel text-[9px] leading-tight">
                POSTCARD SAVED TO YOUR DOWNLOADS! 📮
              </span>
            </div>
            <button
              onClick={() => setExportNotice(false)}
              className="font-pixel text-[8px] bg-white/20 px-1.5 py-0.5 rounded cursor-pointer"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Footer */}
      <div className="bg-[#1C1917] px-4 py-2.5 text-center border-t-2 border-[#1E232B] relative z-20">
        <p className="font-mono text-[11px] text-purple-200/90 font-bold">
          "Every stamp marks a memory; every postcard carries a quiet piece of your journey." 📮
        </p>
      </div>
    </div>
  );
}
