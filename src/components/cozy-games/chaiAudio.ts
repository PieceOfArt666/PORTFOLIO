// Pure Web Audio API Ambient Synthesizer for Monsoon Chai
// Zero external mp3 dependencies, works instantly in browser with rich acoustic texture

let audioCtx: AudioContext | null = null;
let rainNode: AudioNode | null = null;
let rainGain: GainNode | null = null;

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

export const chaiAudio = {
  // Start layered soft rainfall ambience (pink noise + distant thunder rumbles)
  startRain: (volume = 0.16) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (rainNode) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink/Brown noise generator for soothing rainfall
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.12;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, ctx.currentTime);

      rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(volume, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(ctx.destination);

      whiteNoise.start();
      rainNode = whiteNoise;
    } catch {
      // AudioContext policy
    }
  },

  stopRain: () => {
    try {
      if (rainGain && audioCtx) {
        rainGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        setTimeout(() => {
          if (rainNode) {
            (rainNode as AudioBufferSourceNode).stop();
            rainNode.disconnect();
            rainNode = null;
          }
        }, 400);
      } else if (rainNode) {
        (rainNode as AudioBufferSourceNode).stop();
        rainNode = null;
      }
    } catch {
      rainNode = null;
    }
  },

  // Heavy pestle impact with resonance
  playPestleImpact: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Deep brass bowl body resonance
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.18);

      oscGain.gain.setValueAtTime(0.25, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);

      // Metallic high rim ring
      const ringOsc = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ringOsc.type = 'triangle';
      ringOsc.frequency.setValueAtTime(1480, now);
      ringOsc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

      ringGain.gain.setValueAtTime(0.08, now);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      ringOsc.connect(ringGain);
      ringGain.connect(ctx.destination);
      ringOsc.start(now);
      ringOsc.stop(now + 0.13);
    } catch {
      // Ignore
    }
  },

  // Satisfying spice crack / mortar pestle strike
  playSpiceCrunch: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1300 + Math.random() * 500, now);
      snapOsc.frequency.exponentialRampToValueAtTime(250, now + 0.05);

      snapGain.gain.setValueAtTime(0.16, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  },

  // Grinding circular mortar friction sound
  playGrind: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150 + Math.random() * 60, now);
      osc.frequency.linearRampToValueAtTime(210, now + 0.14);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Ignore
    }
  },

  // Liquid splash / milk pour sound
  playLiquidPour: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startFreq = 420 + Math.random() * 320;
        osc.frequency.setValueAtTime(startFreq, now + i * 0.035);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 180, now + i * 0.035 + 0.055);

        gain.gain.setValueAtTime(0.08, now + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.035);
        osc.stop(now + i * 0.035 + 0.07);
      }
    } catch {
      // Ignore
    }
  },

  // Simmer / boiling bubble pop
  playBubble: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 + Math.random() * 220, now);
      osc.frequency.exponentialRampToValueAtTime(750 + Math.random() * 250, now + 0.07);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore
    }
  },

  // Ceramic tea cup clink on saucer
  playCupClink: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2150, now);
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.39);
    } catch {
      // Ignore
    }
  },

  // Cozy completion chime (Warm soothing chord)
  playChimeChord: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // D major pentatonic warm acoustic chord: D4, F#4, A4, D5, E5, A5
      const freqs = [293.66, 369.99, 440.00, 587.33, 659.25, 880.00];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.0);
      });
    } catch {
      // Ignore
    }
  }
};
