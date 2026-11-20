import type { Project, DesignPillar, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: "ABHIJITH XS",
  title: "Game Designer",
  shortBio: "Crafting thoughtful player experiences, systemic gameplay loops, and tactile mechanics in Unity. Bridging mathematical game balance with intuitive game feel.",
  status: "Available for Game Design & Prototyping Roles",
  location: "Earth • Remote Friendly",
  email: "abhijithdas19@gmail.com",
  itchUrl: "https://maajingod.itch.io/",
  githubUrl: "https://github.com/PieceOfArt666",
  instagramUrl: "https://www.instagram.com/_abxjxth_/",
  linkedinUrl: "https://linkedin.com",
};

export const DESIGN_PILLARS: DesignPillar[] = [
  {
    title: "Tangible Game Feel",
    tagline: "Juice, Weight & Feedback",
    description: "Every jump, swing, and interaction should have satisfying kinetic inertia, micro-screenshake, and responsive input curves.",
    iconName: "Sparkles",
  },
  {
    title: "Emergent Systems",
    tagline: "Rules that Intersect",
    description: "Designing modular mechanics that layer together naturally, enabling players to discover unscripted solutions and genuine surprises.",
    iconName: "Cpu",
  },
  {
    title: "Pacing & Level Flow",
    tagline: "Tension, Rest & Reward",
    description: "Guiding player attention through environmental affordances, architectural framing, and rhythmic difficulty curve design.",
    iconName: "Compass",
  },
  {
    title: "Clean Unity Architecture",
    tagline: "Fast Iteration & Tooling",
    description: "Writing maintainable C# ScriptableObject architectures and custom Unity editor tooling that empower rapid gameplay iteration.",
    iconName: "Layers",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "echobound",
    title: "ECHOBOUND",
    genre: "Interactive Browser-Based Game",
    tagline: "An interactive browser-based experience exploring creative gameplay mechanics and visual storytelling.",
    description: "ECHOBOUND is an interactive browser-based game project created using Crayon. The project explores creative game design, visual presentation, and rapid prototyping, transforming an initial concept into a playable experience. It reflects my interest in experimenting with gameplay ideas and building engaging interactive experiences.",
    designRole: "Game Designer & Prototyper",
    engine: "Crayon Engine",
    languages: ["Crayon", "Web / Interactive"],
    videoUrl: "/videos/echobound.mp4",
    imageUrl: "/images/game-dev-hero-showcase.jpg",
    features: [
      "Rapid gameplay prototyping & iterative mechanic tuning",
      "Interactive browser-based game feel & visual presentation",
      "Dynamic player feedback loops and responsive input handling"
    ],
    crayonUrl: "https://app.usecrayon.ai/play/005724dc-8049-4721-a736-dd5b55590cdc?utm_source=share&utm_surface=publish_menu",
    badge: "Playable Video Demo",
    color: "#EF4444",
  },
  {
    id: "summer-reverie",
    title: "The Summer Reverie",
    genre: "Atmospheric Narrative Adventure",
    tagline: "A grandfather's fading childhood memories in rural Kerala preserved through dream fragments.",
    description: "A grandfather falls asleep and dreams of his childhood in rural Kerala, only to discover that his memories are slowly disappearing. Playing as his younger self, you explore a fading dreamscape, recover fragments of the past, and try to preserve the moments that made him who he is before they are lost forever. Submitted to BYOG (Build Your Own Game) 2026.",
    designRole: "Level Designer (Abhijit XS) • Dev by Abhinav S • Audio by Anantha Krishnan",
    engine: "Unity",
    languages: ["C#", "Unity 3D / Level Design"],
    imageUrl: "/images/summer-reverie/cover.png",
    videoUrl: "/videos/summer-reverie.mp4",
    screenshots: [
      "/images/summer-reverie/cover.png",
      "/images/summer-reverie/screenshot-1.png",
      "/images/summer-reverie/screenshot-2.png",
      "/images/summer-reverie/screenshot-3.png",
      "/images/summer-reverie/screenshot-4.png",
      "/images/summer-reverie/screenshot-5.png"
    ],
    trailerUrl: "https://youtu.be/ih62_NIfF5Q",
    youtubeId: "ih62_NIfF5Q",
    indieConnectUrl: "https://www.indieconnect.in/game-jams/byog-build-your-own-game-2026-mu89emkb/submissions/dcc467a4-0108-46f8-af64-fc313d5f68d5",
    downloadUrl: "https://mqpfcdqiucwdxsggkfib.supabase.co/storage/v1/object/public/jam-assets/699c3217-9ad9-499a-8db6-cd2842a86fbb/01b9347d-a0ad-4215-8d92-8a10f7fd1ad7/builds/c40afe47-3966-464c-8851-daeddd36ac5a.zip",
    features: [
      "Fading Dreamscape: Atmospheric rural Kerala environment design & cultural nostalgia",
      "Memory Fragment Pacing: Contemplative spatial layout guiding player emotional journey",
      "BYOG 2026 Jam Entry: Rapid team collaboration across programming, level design, and audio"
    ],
    credits: "Abhinav S (Programming), Abhijit XS (Level Design), Anantha Krishnan (Audio)",
    badge: "BYOG 2026 JAM ENTRY",
    color: "#059669",
  },
  {
    id: "hgc",
    title: "Halloween Graveyard Challenge",
    genre: "3D Survival Stealth Adventure",
    tagline: "🥈 2nd Prize Winner (EXR Game Jam) • You asked for a treat... the witch chose TRICK!",
    description: "Awarded 2nd Prize in the Game Jam conducted by EXR Games! Separated from friends while trick-or-treating on Halloween night, young Timmy is banished by a wicked witch into a fog-shrouded cemetery. To break the curse, players must stealthily navigate five perilous graveyard sectors, recover the 5 Elemental Relic Gravestones, evade patrolling undead ghouls, and ignite Ancient Portal Ten to escape.",
    designRole: "Lead Game Designer & Systems Programmer",
    engine: "Unity 6 URP",
    languages: ["C#", "Unity 6 URP", "Bloodlines UI"],
    imageUrl: "/images/hgc/cover.png",
    videoUrl: "/videos/hgc.mp4",
    screenshots: [
      "/images/hgc/cover.png",
      "/images/hgc/screenshot-1.png",
      "/images/hgc/screenshot-2.png",
      "/images/hgc/screenshot-3.png",
      "/images/hgc/screenshot-4.png",
      "/images/hgc/screenshot-5.png",
      "/images/hgc/screenshot-6.png",
      "/images/hgc/screenshot-7.png",
      "/images/hgc/screenshot-8.png"
    ],
    features: [
      "🥈 2nd Prize Winner: Awarded 2nd Place in the EXR Games Game Jam",
      "Tense Line-of-Sight Stealth: Evade wandering undead ghouls and patrolling cemetery horrors",
      "5 Elemental Gravestones: Search Gallows Yard, Crypt Maze, Iron Mausoleum & Pumpkin Patch",
      "Ancient Portal Ten: Return collected relics to the mystical northern portal ring to escape",
      "Stylized Gothic Atmosphere: Volumetric fog, jack-o'-lanterns, and ornate Bloodlines UI"
    ],
    itchUrl: "https://maajingod.itch.io/hgc",
    awardUrl: "https://www.instagram.com/p/DfZAHu5TpV-/",
    badge: "🥈 2ND PRIZE • EXR GAME JAM",
    color: "#EA580C",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Game Engines & Tools",
    skills: [
      { name: "Unity Engine", level: "Primary Specialty", note: "URP, ScriptableObjects, Physics, Profiler, GraphView, Animation State Machines" },
      { name: "Git / Version Control", level: "Advanced", note: "Git LFS, branching strategies, collaborative Unity project management" },
      { name: "Blender (Basic / Layout)", level: "Working Knowledge", note: "Collision generation, pivot correction, lightweight asset assembly" },
    ],
  },
  {
    category: "Programming & Scripting",
    skills: [
      { name: "C#", level: "Primary Language", note: "Clean gameplay architectures, event buses, state machines, custom inspectors" },
      { name: "C++", level: "Foundational", note: "Memory management, data structures, algorithm efficiency, engine fundamentals" },
      { name: "C", level: "Foundational", note: "Low-level understanding, pointers, system fundamentals" },
      { name: "Python", level: "Scripting & Tooling", note: "Gameplay balancing math, data parsing, procedural generation automation" },
    ],
  },
  {
    category: "Game Design Disciplines",
    skills: [
      { name: "Mechanics & Game Feel", level: "Core Strength", note: "Input buffering, camera shake, visual juice, animation-to-hitbox sync" },
      { name: "Level Design & Flow", level: "Core Strength", note: "Guidance without markers, pacing beats, risk vs. reward loops" },
      { name: "Systems & Economy", level: "Core Strength", note: "Attribute scaling, progression curves, emergent interaction design" },
      { name: "Playtesting & Telemetry", level: "Core Strength", note: "Observational testing, feedback synthesis, metric-driven iteration" },
    ],
  },
];
