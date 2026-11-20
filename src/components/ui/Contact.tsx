import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, ExternalLink, ArrowUp, Send, CheckCircle2, Gamepad2 } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import { MagneticText } from './InteractiveProximityText';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCopyEmail = () => {
    soundEffects.playCoin();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playPowerup();
    setIsSending(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${PERSONAL_INFO.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || `Message from ${formData.name}`,
          message: formData.message,
          _subject: `🎮 Portfolio Message from ${formData.name}: ${formData.subject || 'General Inquiry'}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();
      if (result.success === 'true' || result.success === true) {
        setStatusMessage('TRANSMITTED DIRECTLY TO YOUR MAIL (abhijithdas19@gmail.com)!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (result.message && result.message.includes('Activation')) {
        setStatusMessage('FIRST-TIME ACTIVATION: Check your email (abhijithdas19@gmail.com) and click "Activate Form" once!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const messageContent = `To: ${PERSONAL_INFO.email}\nSubject: ${formData.subject || 'Portfolio Inquiry'}\nFrom: ${formData.name} (${formData.email})\n\n${formData.message}`;
        navigator.clipboard.writeText(messageContent);
        setStatusMessage('MESSAGE TRANSMITTED & COPIED TO CLIPBOARD!');
      }
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 8000);
    } catch {
      const messageContent = `To: ${PERSONAL_INFO.email}\nSubject: ${formData.subject || 'Portfolio Inquiry'}\nFrom: ${formData.name} (${formData.email})\n\n${formData.message}`;
      navigator.clipboard.writeText(messageContent);
      setStatusMessage('OFFLINE MODE: MESSAGE COPIED TO CLIPBOARD!');
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 8000);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToTop = () => {
    soundEffects.playJump();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Contact Intro & 2D Hub Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B] text-xs font-mono font-bold text-[#1E232B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
              <span className="font-pixel text-[9px] text-[var(--theme-primary)]">CASTLE 1-6</span>
              <span className="text-slate-300">•</span>
              <span className="font-pixel text-[9px] text-[#1E232B]">COURSE CLEAR</span>
            </div>

            <MagneticText strength={18} rotationStrength={3}>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1E232B] tracking-tight mb-3">
                Get In <span className="text-[var(--theme-primary)]">Touch</span>
              </h2>
            </MagneticText>

            <p className="text-base text-[#475569] leading-relaxed mb-6 font-medium">
              You reached the goal! Interested in collaborating, prototyping game mechanics, or discussing a game design opportunity? Drop me a message!
            </p>

            {/* 2D Contact Cards (Organic Speech Balloons, Zero Square Cards) */}
            <div className="w-full space-y-4">
              {/* Card 1: Direct Email with Copy */}
              <div className="speech-bubble-tail game-card-hover p-4 sm:p-5 flex items-center justify-between group bg-white cursor-pointer hover:border-[var(--theme-primary)]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#E60012] flex-shrink-0 group-hover:scale-115 group-hover:rotate-[-8deg] transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-pixel text-[8px] text-slate-400 uppercase">
                      DIRECT EMAIL
                    </div>
                    <div className="font-display font-bold text-sm sm:text-base text-[#1E232B] group-hover:text-[var(--theme-primary)] transition-colors">
                      {PERSONAL_INFO.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-[#E60012] hover:text-white border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] active:translate-y-0.5 active:shadow-none hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="font-pixel text-[8px]">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-pixel text-[8px]">COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card 2: Itch.io Profile */}
              <a
                href={PERSONAL_INFO.itchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playSelect()}
                className="speech-bubble-tail game-card-hover p-4 sm:p-5 flex items-center justify-between group block bg-white hover:border-[#0099E5]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#E0F2FE] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#0099E5] flex-shrink-0 group-hover:scale-115 group-hover:rotate-8 transition-transform">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-pixel text-[8px] text-slate-400 uppercase">
                      PLAY GAMES ON ITCH
                    </div>
                    <div className="font-display font-bold text-sm sm:text-base text-[#1E232B] group-hover:text-[#0099E5] transition-colors">
                      maajingod.itch.io
                    </div>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0099E5] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>

              {/* Card 3: GitHub */}
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playSelect()}
                className="speech-bubble-tail game-card-hover p-4 sm:p-5 flex items-center justify-between group block bg-white hover:border-black"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#1E232B] flex-shrink-0 group-hover:scale-115 group-hover:rotate-[-8deg] transition-transform">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-pixel text-[8px] text-slate-400 uppercase">
                      CODE REPOSITORY
                    </div>
                    <div className="font-display font-bold text-sm sm:text-base text-[#1E232B] group-hover:text-[#000000] transition-colors">
                      PieceOfArt666
                    </div>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#000000] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>

              {/* Card 4: Instagram */}
              {PERSONAL_INFO.instagramUrl && (
                <a
                  href={PERSONAL_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEffects.playSelect()}
                  className="speech-bubble-tail game-card-hover p-4 sm:p-5 flex items-center justify-between group block bg-white hover:border-[#E1306C]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-[#E60012] flex-shrink-0 group-hover:scale-115 group-hover:rotate-8 transition-transform">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-pixel text-[8px] text-slate-400 uppercase">
                        INSTAGRAM
                      </div>
                      <div className="font-display font-bold text-sm sm:text-base text-[#1E232B] group-hover:text-[#E1306C] transition-colors">
                        _abxjxth_
                      </div>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#E1306C] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: 2D Platform Stage Goal Transmission (No Square Box) */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="grassy-hill-shelf p-6 sm:p-8 border-x-4 border-b-4 border-[#1E232B] shadow-[6px_10px_0px_#1E232B] relative overflow-hidden">
              {/* Scalloped Pixel Grass Fringe */}
              <div className="pixel-grass-fringe-bar w-full absolute top-0 left-0 right-0 z-10" />

              <div className="flex items-center justify-between pb-4 mb-6 border-b-3 border-[#1E232B] pt-3 relative z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
                  <span className="font-pixel text-xs sm:text-sm text-[#1E232B] font-black">
                    TRANSMIT TO PLAYER 1
                  </span>
                </div>
                <span className="font-pixel text-[8px] px-3 py-1 rounded-full bg-white border-2 border-[#1E232B] text-slate-700 font-bold shadow-xs">
                  WARP COMM
                </span>
              </div>

              {formSubmitted && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 border-2 border-[#16A34A] text-green-800 text-sm font-semibold flex items-center gap-2.5 relative z-20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 animate-bounce" />
                  <span className="font-pixel text-[9px] leading-relaxed">
                    {statusMessage || 'TRANSMITTED DIRECTLY TO YOUR MAIL!'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-pixel text-[8px] text-[#1E232B] mb-1.5 uppercase font-bold">
                      Player Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mario Mario"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border-3 border-[#1E232B] text-[#1E232B] placeholder-slate-400 focus:outline-none focus:border-[#E60012] text-sm font-bold transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-pixel text-[8px] text-[#1E232B] mb-1.5 uppercase font-bold">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="mario@nintendo.jp"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border-3 border-[#1E232B] text-[#1E232B] placeholder-slate-400 focus:outline-none focus:border-[#E60012] text-sm font-bold transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-pixel text-[8px] text-[#1E232B] mb-1.5 uppercase font-bold">
                    Subject / Quest
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Game Prototyping / Studio Role Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-3 border-[#1E232B] text-[#1E232B] placeholder-slate-400 focus:outline-none focus:border-[#E60012] text-sm font-bold transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[8px] text-[#1E232B] mb-1.5 uppercase font-bold">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your game idea, studio role, or project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-3 border-[#1E232B] text-[#1E232B] placeholder-slate-400 focus:outline-none focus:border-[#E60012] text-sm font-bold transition-all resize-none shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-2d-red group/submit w-full text-base py-3.5 px-6 rounded-full shadow-[4px_5px_0px_#1E232B] hover:shadow-[0_0_18px_rgba(21,128,61,0.5),5px_7px_0px_#1E232B] disabled:opacity-60 cursor-pointer disabled:cursor-wait"
                >
                  <span className="key-2d key-2d-red w-5 h-5 text-[9px] group-hover/submit:rotate-12 transition-transform">
                    {isSending ? '...' : 'A'}
                  </span>
                  <span className="font-pixel text-[10px]">
                    {isSending ? 'TRANSMITTING TO YOUR MAIL...' : 'SEND MESSAGE TO MY MAIL'}
                  </span>
                  <Send className={`w-4 h-4 fill-white ml-1 transition-transform ${isSending ? 'animate-pulse' : 'group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1'}`} />
                </button>
              </form>

              {/* Earthen Cliff Platform Base Bottom Strip */}
              <div className="pixel-earth-footer w-full h-4 rounded-b-[20px] mt-6 border-t-2 border-[#1E232B]" />
            </div>
          </motion.div>
        </div>

        {/* 2D Nintendo Bottom Footer Bar */}
        <div className="pt-8 border-t-3 border-[#1E232B] flex flex-col sm:flex-row items-center justify-between gap-4 font-pixel text-[9px] text-slate-600 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--theme-primary)] animate-pulse" />
            <span>© 2026 {PERSONAL_INFO.name.toUpperCase()} • 2D ADVENTURE THEME</span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-2d-white group/top text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Warp to top"
          >
            <span className="key-2d w-4 h-4 text-[7px] group-hover/top:rotate-12 transition-transform">B</span>
            <span className="font-pixel text-[8px]">WARP TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover/top:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
