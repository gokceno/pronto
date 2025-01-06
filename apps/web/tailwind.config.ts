import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            screens: {
                xs: "480px",
            },
            fontFamily: {
                jakarta: [
                    'Plus Jakarta Sans',
                    'sans-serif'
                ]
            },
            fontSize: {
                h4: [
                    '24px',
                    {
                        lineHeight: '32px',
                        fontWeight: '600'
                    }
                ]
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            zIndex: {
                '60': '60',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
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
