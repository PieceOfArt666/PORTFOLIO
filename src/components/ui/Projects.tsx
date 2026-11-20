import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Gamepad2, Play, Sparkles, Download, Film, Image as ImageIcon } from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import { InteractiveOverworldMap } from './InteractiveOverworldMap';
import { MagneticText } from './InteractiveProximityText';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function RetroArcadeYoutubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="game-screen-bezel aspect-video group/yt relative overflow-hidden rounded-2xl shadow-[4px_5px_0px_#1E232B]">
      {!isPlaying ? (
        <div className="relative w-full h-full bg-[#0F172A] flex items-center justify-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              // fallback if maxresdefault doesn't exist
              (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
            alt={title}
            className="w-full h-full object-cover filter brightness-90 group-hover/yt:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E232B]/80 via-transparent to-black/30 pointer-events-none" />
          
          <button
            onClick={() => {
              soundEffects.playJump();
              setIsPlaying(true);
            }}
            className="absolute inset-0 m-auto w-14 h-14 rounded-xl bg-[#E60012] hover:bg-[#CF0010] text-white flex items-center justify-center border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer z-10"
            title="Play Official Gameplay Trailer"
          >
            <Play className="w-6 h-6 ml-1 fill-white" />
          </button>

          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#1E232B] text-white border-2 border-white/60 font-pixel text-[8px] pointer-events-none flex items-center gap-1.5 z-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60012] animate-ping" />
            <span>OFFICIAL TRAILER</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded bg-[var(--theme-primary)] text-white font-pixel text-[8px] pointer-events-none z-10 shadow-sm transition-colors">
            YOUTUBE HD
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}

function RetroArcadeVideoPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        soundEffects.playSelect();
      }).catch((err) => {
        console.warn("Video playback requires interaction:", err);
        setIsPlaying(true);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="game-screen-bezel aspect-video group/video relative overflow-hidden rounded-2xl shadow-[4px_5px_0px_#1E232B]">
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full h-full object-cover"
        loop
        playsInline
        preload="metadata"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-14 h-14 rounded-xl bg-[#E60012] hover:bg-[#CF0010] text-white flex items-center justify-center border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer z-10"
          title="Play Gameplay Video"
        >
          <Play className="w-6 h-6 ml-1 fill-white" />
        </button>
      )}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#1E232B] text-white border-2 border-white/60 font-pixel text-[8px] pointer-events-none flex items-center gap-1.5 z-10 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E60012] animate-ping" />
        <span>PLAYABLE RECORDING</span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[var(--theme-primary)] text-white font-pixel text-[8px] pointer-events-none z-10 shadow-sm transition-colors">
        1080P • 60 FPS
      </div>
    </div>
  );
}

export function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('echobound');
  const [activeMediaTab, setActiveMediaTab] = useState<'trailer' | 'screenshots'>('trailer');
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState<number>(0);

  const handleStageSelect = (projectId: string) => {
    soundEffects.playSelect();
    const targetId = projectId === 'start' ? 'echobound' : projectId;
    setSelectedProjectId(targetId);
    setActiveMediaTab('trailer');
    setActiveScreenshotIdx(0);
    setTimeout(() => {
      const el = document.getElementById('stage-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];
  const isEchobound = activeProject.id === 'echobound';
  const hasScreenshots = activeProject.screenshots && activeProject.screenshots.length > 0;
  const currentImage = hasScreenshots 
    ? activeProject.screenshots![activeScreenshotIdx] 
    : (activeProject.imageUrl || "/images/game-dev-hero-showcase.jpg");

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
              <span className="font-pixel text-[9px] text-[var(--theme-primary)]">WORLD 1-4</span>
              <span className="text-slate-300">•</span>
              <span className="font-pixel text-[9px] text-[#1E232B]">OVERWORLD MAP &amp; STAGES</span>
            </div>

            <MagneticText strength={18} rotationStrength={3}>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1E232B] tracking-tight mb-2">
                Featured <span className="text-[var(--theme-primary)]">Game Stages</span>
              </h2>
            </MagneticText>

            <p className="text-base text-[#475569] max-w-xl font-medium">
              Tap any stone node on the floating Overworld Island to travel between playable releases and interactive stages.
            </p>
          </div>

          <a
            href={PERSONAL_INFO.itchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEffects.playSelect()}
            className="pixel-button-white self-start sm:self-auto text-xs py-2 px-4 rounded-full"
          >
            <Gamepad2 className="w-4 h-4 text-[#E60012]" />
            <span className="font-pixel text-[9px]">EXPLORE ITCH.IO</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </motion.div>

        {/* 1. Interactive 2D Nintendo Overworld Map Island (Floating Freely in Sky) */}
        <InteractiveOverworldMap
          activeProjectId={selectedProjectId}
          onSelectProject={handleStageSelect}
        />

        {/* 2. Interactive Stage Milestone Track (No Boxes, Round Stone Pedestals) */}
        <div id="stage-showcase" className="mt-14 mb-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {PROJECTS.map((project, idx) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <button
                key={project.id}
                onClick={() => handleStageSelect(project.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full border-3 border-[#1E232B] transition-all cursor-pointer group/pill ${
                  isSelected
                    ? 'bg-[var(--theme-primary)] text-white shadow-[4px_5px_0px_#1E232B] -translate-y-1 scale-105'
                    : 'bg-white text-[#1E232B] hover:bg-[#FEF08A] hover:-translate-y-1 hover:scale-105 shadow-[2px_3px_0px_#1E232B] hover:shadow-[3px_5px_0px_#1E232B]'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-pixel text-[10px] font-black border-2 border-[#1E232B] transition-transform group-hover/pill:rotate-12 ${
                  isSelected ? 'bg-white text-[var(--theme-primary)]' : 'bg-slate-100 text-[#1E232B]'
                }`}>
                  {idx + 1}
                </div>
                <span className="font-pixel text-[9px] font-bold">
                  {project.title.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. In-Game 2D Platform Stage Diorama (Zero Rectangular Box Cards) */}
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Grassy Hill Platform Base with Stepped Roots */}
          <div className="grassy-hill-shelf p-6 sm:p-10 border-x-4 border-b-4 border-[#1E232B] shadow-[6px_10px_0px_#1E232B] overflow-hidden">
            {/* Top Scalloped Fringe */}
            <div className="pixel-grass-fringe-bar w-full absolute top-0 left-0 right-0 z-10" />

            {/* Platform Content: Arcade TV on Left + Dialogue Speech Balloon on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20 pt-2">
              {/* Left Column: Arcade TV Screen Bezel */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                {activeMediaTab === 'trailer' && activeProject.videoUrl ? (
                  <RetroArcadeVideoPlayer
                    key={activeProject.videoUrl}
                    src={activeProject.videoUrl}
                    title={activeProject.title}
                  />
                ) : activeMediaTab === 'trailer' && activeProject.youtubeId ? (
                  <RetroArcadeYoutubePlayer
                    videoId={activeProject.youtubeId}
                    title={activeProject.title}
                  />
                ) : (
                  <div className="game-screen-bezel aspect-video group/screen overflow-hidden rounded-2xl shadow-[4px_5px_0px_#1E232B] relative">
                    <img
                      src={currentImage}
                      alt={`${activeProject.title} In-Game Artwork`}
                      className="w-full h-full object-cover transform group-hover/screen:scale-108 transition-transform duration-700 filter brightness-95"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E232B]/85 via-transparent to-transparent pointer-events-none" />

                    {/* Top In-Game Genre HUD Bar */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none z-10">
                      <div className="bg-[#1E232B]/90 px-3 py-1 rounded-full border-2 border-white/60 font-pixel text-[8px] flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#E60012]" />
                        <span>{activeProject.genre.toUpperCase()}</span>
                      </div>

                      <div className="bg-[var(--theme-primary)] px-2.5 py-0.5 rounded-full border border-white font-pixel text-[8px] shadow-sm transition-colors">
                        60 FPS
                      </div>
                    </div>

                    {/* Bottom In-Game Telemetry Stamp */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none z-10">
                      <span className="font-pixel text-[8px] text-white/90 drop-shadow">
                        ACTIVE STAGE: READY
                      </span>
                      <span className="font-pixel text-[8px] text-[#FCD34D] drop-shadow">
                        ★ 100% JUICE
                      </span>
                    </div>
                  </div>
                )}

                {/* Media Switcher Bar (For games with trailer or screenshots) */}
                {(activeProject.youtubeId || (hasScreenshots && activeProject.screenshots!.length > 1)) && (
                  <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeProject.youtubeId && (
                        <button
                          onClick={() => {
                            soundEffects.playSelect();
                            setActiveMediaTab('trailer');
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-pixel text-[8px] border-2 border-[#1E232B] transition-all cursor-pointer ${
                            activeMediaTab === 'trailer'
                              ? 'bg-[#E60012] text-white shadow-xs font-bold'
                              : 'bg-slate-100 text-[#1E232B] hover:bg-slate-200'
                          }`}
                        >
                          <Film className="w-3 h-3" />
                          <span>TRAILER</span>
                        </button>
                      )}

                      {hasScreenshots && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              soundEffects.playSelect();
                              setActiveMediaTab('screenshots');
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-pixel text-[8px] border-2 border-[#1E232B] transition-all cursor-pointer ${
                              activeMediaTab === 'screenshots'
                                ? 'bg-[var(--theme-primary)] text-white shadow-xs font-bold'
                                : 'bg-slate-100 text-[#1E232B] hover:bg-slate-200'
                            }`}
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>GALLERY</span>
                          </button>

                          {activeMediaTab === 'screenshots' && (
                            <div className="flex items-center gap-1 ml-1">
                              {activeProject.screenshots!.map((_, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => {
                                    soundEffects.playSelect();
                                    setActiveScreenshotIdx(sIdx);
                                  }}
                                  className={`w-5 h-5 rounded-md font-pixel text-[7px] border border-[#1E232B] flex items-center justify-center transition-transform cursor-pointer ${
                                    activeScreenshotIdx === sIdx
                                      ? 'bg-[#1E232B] text-white scale-110'
                                      : 'bg-white text-slate-700 hover:bg-amber-100'
                                  }`}
                                  title={`View Screenshot ${sIdx + 1}`}
                                >
                                  {sIdx + 1}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="font-pixel text-[7px] text-slate-500 hidden sm:inline">
                      {activeMediaTab === 'trailer' ? 'YOUTUBE 1080P' : `PHOTO ${activeScreenshotIdx + 1}/${activeProject.screenshots?.length || 1}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Organic Dialogue Speech Balloon (No Square Box) */}
              <div className="lg:col-span-6">
                <div className="speech-bubble-tail game-card-hover p-6 sm:p-7 bg-white">
                  {/* Header Badges */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="star-badge-disk px-3 py-1 font-pixel text-[8px] font-black uppercase hover:scale-105 transition-transform cursor-default">
                        ★ {activeProject.badge}
                      </span>
                      <span className="font-pixel text-[8px] text-slate-700 bg-slate-100 border-2 border-[#1E232B] px-2.5 py-0.5 rounded-full hover:scale-105 transition-transform cursor-default">
                        {activeProject.engine}
                      </span>
                      {activeProject.id === 'summer-reverie' && (
                        <span className="font-pixel text-[8px] text-emerald-800 bg-emerald-100 border-2 border-[#1E232B] px-2 py-0.5 rounded-full">
                          BYOG 2026
                        </span>
                      )}
                      {activeProject.id === 'hgc' && (
                        <span className="font-pixel text-[8px] text-amber-900 bg-amber-100 border-2 border-[#1E232B] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <span>🥈</span>
                          <span>EXR GAME JAM 2ND PLACE</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-pixel text-[9px] text-[#F59E0B]">
                      <span className="animate-coin-spin inline-block">🪙</span>
                      <span>+100 COINS</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1E232B] mb-1">
                    {activeProject.title}
                  </h3>

                  {/* Tagline */}
                  <p className="font-pixel text-[9px] text-[#0099E5] mb-3">
                    {activeProject.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#475569] leading-relaxed font-medium mb-4">
                    {activeProject.description}
                  </p>

                  {/* Key Features as Floating Power-Up Chips */}
                  <div className="space-y-2 mb-5">
                    {activeProject.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="p-2.5 rounded-full bg-slate-50 hover:bg-white border-2 border-[#1E232B] flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer group/feat"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#FEF2F2] border border-[#1E232B] flex items-center justify-center font-pixel text-xs text-[#E60012] flex-shrink-0 group-hover/feat:scale-120 group-hover/feat:rotate-12 transition-transform">
                          {fIdx === 0 ? '⚡' : fIdx === 1 ? '🌱' : '⚔️'}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Language Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-5">
                    {activeProject.languages.map((lang, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-pixel text-[8px] text-slate-800 px-3 py-1 rounded-full bg-[#F1F5F9] border-2 border-[#1E232B] hover:bg-[var(--theme-primary)] hover:text-white hover:scale-105 hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Role & Actions */}
                  <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="font-pixel text-[8px] text-slate-600 font-bold max-w-full sm:max-w-md break-words">
                      ROLE: {activeProject.designRole}
                    </span>

                    {/* Action buttons depending on project */}
                    {isEchobound ? (
                      <a
                        href={activeProject.crayonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEffects.playPowerup()}
                        className="btn-2d-red group/crayon text-xs py-2 px-5 rounded-full shadow-[4px_4px_0px_#1E232B] hover:shadow-[0_0_18px_rgba(21,128,61,0.5),5px_7px_0px_#1E232B]"
                      >
                        <span className="key-2d key-2d-red w-4 h-4 text-[8px] group-hover/crayon:rotate-12 group-hover/crayon:scale-110 transition-transform">A</span>
                        <span className="font-pixel text-[9px]">PLAY ON CRAYON ↗</span>
                        <Sparkles className="w-3.5 h-3.5 fill-white group-hover/crayon:rotate-45 group-hover/crayon:scale-125 transition-transform" />
                      </a>
                    ) : activeProject.id === 'summer-reverie' ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {activeProject.indieConnectUrl && (
                          <a
                            href={activeProject.indieConnectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEffects.playPowerup()}
                            className="btn-2d-red text-xs py-1.5 px-3.5 rounded-full group/indie shadow-[3px_3px_0px_#1E232B] inline-flex items-center gap-1.5"
                            title="View & Download on Indie Connect"
                          >
                            <span className="key-2d key-2d-red w-3.5 h-3.5 text-[7px] group-hover/indie:rotate-12 transition-transform">A</span>
                            <span className="font-pixel text-[8px]">INDIE CONNECT</span>
                            <ExternalLink className="w-3 h-3 text-white group-hover/indie:translate-x-0.5 transition-transform" />
                          </a>
                        )}

                        {activeProject.downloadUrl && (
                          <a
                            href={activeProject.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEffects.playSelect()}
                            className="btn-2d-white text-xs py-1.5 px-3 rounded-full group/dl inline-flex items-center gap-1.5"
                            title="Direct Download Windows Build ZIP"
                          >
                            <Download className="w-3 h-3 text-emerald-600 group-hover/dl:scale-115 transition-transform" />
                            <span className="font-pixel text-[8px]">GET .ZIP</span>
                          </a>
                        )}

                        {activeProject.youtubeId && (
                          <button
                            onClick={() => {
                              soundEffects.playSelect();
                              setActiveMediaTab('trailer');
                            }}
                            className="btn-2d-white text-xs py-1.5 px-3 rounded-full group/tr inline-flex items-center gap-1"
                            title="Watch Trailer on Screen"
                          >
                            <Film className="w-3 h-3 text-[#E60012] group-hover/tr:scale-115 transition-transform" />
                            <span className="font-pixel text-[8px]">TRAILER</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {activeProject.awardUrl && (
                          <a
                            href={activeProject.awardUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEffects.playSelect()}
                            className="btn-2d-white text-xs py-1.5 px-3 rounded-full group/award inline-flex items-center gap-1.5"
                            title="View EXR Games Game Jam 2nd Prize Announcement on Instagram"
                          >
                            <span className="text-xs group-hover/award:scale-125 transition-transform">🥈</span>
                            <span className="font-pixel text-[8px]">EXR JAM WINNER</span>
                            <ExternalLink className="w-3 h-3 text-amber-600 group-hover/award:translate-x-0.5 transition-transform" />
                          </a>
                        )}

                        {activeProject.githubUrl && (
                          <a
                            href={activeProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEffects.playSelect()}
                            className="btn-2d-white text-xs py-1.5 px-3.5 rounded-full group/btn"
                            title="View Source Code"
                          >
                            <GithubIcon className="w-3.5 h-3.5 group-hover/btn:rotate-[-8deg] transition-transform" />
                            <span className="font-pixel text-[8px]">CODE</span>
                          </a>
                        )}

                        {activeProject.itchUrl && (
                          <a
                            href={activeProject.itchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEffects.playJump()}
                            className="btn-2d-red text-xs py-1.5 px-4 rounded-full group/btn"
                            title="Play on Itch.io"
                          >
                            <span className="key-2d key-2d-red w-3.5 h-3.5 text-[7px] group-hover/btn:rotate-12 transition-transform">A</span>
                            <span className="font-pixel text-[8px]">PLAY</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earthen Cliff Platform Base Bottom Strip */}
          <div className="pixel-earth-footer w-full h-6 rounded-b-[24px] border-x-4 border-b-4 border-[#1E232B]" />
        </motion.div>
      </div>
    </section>
  );
}
