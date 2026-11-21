// Pure Web Audio API Ambient Synthesizer for Desk Terrarium & Bonsai
// Features: Scissor snips, water mist, stone taps, and a soothing ambient Lo-Fi music box generator!

let audioCtx: AudioContext | null = null;
let musicBoxTimer: number | null = null;
let isMusicPlaying = false;
let ambientSoundType: 'none' | 'lofi' | 'wind' | 'rain' = 'none';
let ambientNoiseNode: AudioNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const terrariumAudio = {
  // 1. Scissor Snip Sound (Crisp metallic shear)
  playSnip: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // High metallic shear
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // Secondary snap click
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(3200, now + 0.01);
      snapOsc.frequency.exponentialRampToValueAtTime(1000, now + 0.035);

      snapGain.gain.setValueAtTime(0.1, now + 0.01);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now + 0.01);
      snapOsc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  },

  // 2. Fine Water Mist Spray
  playMist: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.25;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3500, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.22);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.25);
    } catch {
      // Ignore
    }
  },

  // 3. Smooth River Stone Placement (Tactile wooden/rock tock)
  playStoneTock: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  },

  // 4. Gentle Bell / Wind Chime Ping
  playWindChime: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // High harmonic frequencies for wind chimes: B5, E6, G#6, B6
      const chimeFreqs = [987.77, 1318.51, 1661.22, 1975.53];
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignore
    }
  },

  // 5. Ambient Lo-Fi Music Box Synthesizer
  // Plays a slow, meditative, beautiful music box melody in G Major Pentatonic
  toggleAmbientMusic: (type: 'lofi' | 'wind' | 'none') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return false;

      // Stop any existing music loop
      if (musicBoxTimer !== null) {
        clearInterval(musicBoxTimer);
        musicBoxTimer = null;
      }
      if (ambientNoiseNode) {
        try {
          (ambientNoiseNode as AudioBufferSourceNode).stop();
        } catch {
          // Ignore
        }
        ambientNoiseNode = null;
      }

      if (type === 'none' || (isMusicPlaying && ambientSoundType === type)) {
        isMusicPlaying = false;
        ambientSoundType = 'none';
        return false;
      }

      isMusicPlaying = true;
      ambientSoundType = type;

      // Pentatonic music box scale: G4, A4, B4, D5, E5, G5, B5
      const notes = [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 987.77];
      // Cozy chord progressions
      const melodySequence = [
        [0, 2, 4], // G - B - E
        [1, 3, 5], // A - D - G
        [2, 4, 6], // B - E - B
        [0, 3, 5], // G - D - G
      ];

      let step = 0;
      const playStep = () => {
        if (!isMusicPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        const chord = melodySequence[step % melodySequence.length];
        step++;

        // Play arpeggiated music box tines
        chord.forEach((noteIdx, n) => {
          const osc = audioCtx!.createOscillator();
          const gain = audioCtx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[noteIdx], now + n * 0.18);

          gain.gain.setValueAtTime(0.065, now + n * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + n * 0.18 + 0.95);

          osc.connect(gain);
          gain.connect(audioCtx!.destination);
          osc.start(now + n * 0.18);
          osc.stop(now + n * 0.18 + 1.0);
        });

        // Occasional wind chime shimmer
        if (Math.random() > 0.6) {
          terrariumAudio.playWindChime();
        }
      };

      playStep();
      musicBoxTimer = window.setInterval(playStep, 2400);
      return true;
    } catch {
      isMusicPlaying = false;
      return false;
    }
  },

  getIsMusicPlaying: () => isMusicPlaying,
  getAmbientType: () => ambientSoundType,
};
