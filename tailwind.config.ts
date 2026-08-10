import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // The stage — now house lights up, not a blackout.
        //
        // The scale runs light. `deep` no longer means "darker black", it means
        // "more tinted" — the alternating band between white sections. `raised`
        // is the brightest of the three, since a raised panel on a light ground
        // catches more light, not less.
        stage: {
          DEFAULT: '#FBF8F3',
          deep: '#F1EADE',
          raised: '#FFFFFF',
        },
        // Gold. `DEFAULT` is a fill colour only — at 2.2:1 on the light stage it
        // must never carry text. `ink` is the same hue taken dark enough to read
        // (~5.6:1), and is what every `text-*` usage points at.
        spot: {
          DEFAULT: '#D4A017',
          warm: '#E8BC4A',
          dim: '#8A6A11',
          ink: '#7A5A0C',
        },
        crimson: {
          DEFAULT: '#7A1220',
          deep: '#4A0A14',
          lit: '#A81B2E',
        },
        // The type colour. Named `chalk` from the dark-stage design and kept that
        // way to avoid churning ~150 call sites — it now means ink, not light.
        chalk: '#1F1A16',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Deliberately enormous — the type is the set design.
        colossal: ['clamp(3.5rem, 15vw, 16rem)', { lineHeight: '0.82', letterSpacing: '-0.035em' }],
        monumental: ['clamp(2.75rem, 9vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        grand: ['clamp(2rem, 5.5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        recital: ['clamp(1.5rem, 3.2vw, 2.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        // Act 3 recites nine verses inside one pinned viewport, so this is sized
        // to fit all of them at once — `grand` overflowed and clipped the first.
        verse: ['clamp(1.3rem, 3.3vw, 2.9rem)', { lineHeight: '1.16', letterSpacing: '-0.015em' }],
      },
      letterSpacing: { rubric: '0.32em' },
      maxWidth: { stage: '90rem' },
      transitionTimingFunction: {
        curtain: 'cubic-bezier(0.76, 0, 0.24, 1)',
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'ring-turn': { to: { transform: 'rotate(360deg)' } },
        'cue-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'translate3d(0,0,0)' },
          '50%': { opacity: '0.9', transform: 'translate3d(0,0.35rem,0)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
      },
      animation: {
        'ring-turn': 'ring-turn 90s linear infinite',
        'cue-pulse': 'cue-pulse 2.4s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
}
