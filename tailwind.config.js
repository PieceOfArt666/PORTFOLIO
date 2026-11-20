/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marioRed: '#E60012',
        marioDarkRed: '#C4000F',
        marioBlue: '#0099E5',
        pipeGreen: '#16A34A',
        pipeDarkGreen: '#15803D',
        coinGold: '#F59E0B',
        coinLight: '#FCD34D',
        brickBrown: '#9A3412',
        retroDark: '#1E232B',
        retroCharcoal: '#2D323B',
        retroBg: '#F2F5F8',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px #1E232B',
        'pixel': '4px 4px 0px #1E232B',
        'pixel-lg': '6px 6px 0px #1E232B',
        'pixel-red': '4px 4px 0px #9C000D',
        'pixel-blue': '4px 4px 0px #006396',
        'pixel-gold': '4px 4px 0px #B45309',
        'pixel-green': '4px 4px 0px #15803D',
        'question-block': 'inset 2px 2px 0px #FDE68A, inset -2px -2px 0px #B45309, 4px 4px 0px #1E232B',
        'brick-block': 'inset 2px 2px 0px #FDBA74, inset -2px -2px 0px #7C2D12, 4px 4px 0px #1E232B',
        'pipe-block': 'inset 3px 3px 0px #86EFAC, inset -3px -3px 0px #14532D, 4px 4px 0px #1E232B',
      }
    },
  },
  plugins: [],
}
