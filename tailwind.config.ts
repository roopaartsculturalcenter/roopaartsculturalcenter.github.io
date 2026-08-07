import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // Sampled from the RACC logo and deepened into a jewel-tone range.
        oxblood: '#2A0A0E',
        maroon: { DEFAULT: '#4A1220', deep: '#360C17', light: '#6B1E30' },
        gold: {
          // #F0A838 is the logo amber. It reads beautifully on the dark surfaces
          // (9.0:1 on oxblood) but fails contrast on ivory, so `deep` is the
          // bronze used for small text on light backgrounds — 5.5:1 on ivory.
          DEFAULT: '#F0A838',
          deep: '#8F571E',
          pale: '#F6C978',
        },
        ivory: { DEFAULT: '#FBF6EE', dim: '#EFE5D6' },
        ink: '#1A1A1A',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Fluid display sizes so the hero never needs a breakpoint jump.
        'display-xl': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      maxWidth: { content: '78rem', prose: '42rem' },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.12) translate3d(-1.5%, -1%, 0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'scroll-hint': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)', opacity: '0.35' },
          '50%': { transform: 'translate3d(0, 0.5rem, 0)', opacity: '1' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        kenburns: 'kenburns 14s ease-out forwards',
        marquee: 'marquee 40s linear infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 90s linear infinite',
      },
    },
  },
}
