import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'h4': ['24px', {
          lineHeight: '32px',
          fontWeight: '600',
        }],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /from-(orange|blue|pink|purple|cyan|green|red|gray|rose|indigo|teal|emerald|violet|yellow|amber|fuchsia|sky|lime)-(400|500|600)/,
    },
    {
      pattern: /to-(orange|blue|pink|purple|cyan|green|red|gray|rose|indigo|teal|emerald|violet|yellow|amber|fuchsia|sky|lime)-(400|500|600)/,
    },
    {
      pattern: /via-(orange|blue|pink|purple|cyan|green|red|gray|rose|indigo|teal|emerald|violet|yellow|amber|fuchsia|sky|lime)-(400|500|600)/,
    },
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'bg-gradient-to-tr',
    'font-jakarta',
    'text-h4',
  ],
} satisfies Config;
