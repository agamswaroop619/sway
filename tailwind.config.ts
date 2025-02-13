import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glitch: {
          '0%': { textShadow: '2px 2px #ff00ff, -2px -2px #00ffff' },
          '20%': { textShadow: '2px 2px #ff00ff, -2px -2px #00ffff' },
          '40%': { textShadow: '-2px -2px #ff00ff, 2px 2px #00ffff' },
          '60%': { textShadow: '2px -2px #ff00ff, -2px 2px #00ffff' },
          '80%': { textShadow: '-2px 2px #ff00ff, 2px -2px #00ffff' },
          '100%': { textShadow: '2px 2px #ff00ff, -2px -2px #00ffff' },
        },
        glitchShift: {
          '0%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '20%': { transform: 'translate(2px, 2px)' },
          '30%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '50%': { transform: 'translate(2px, 2px)' },
          '60%': { transform: 'translate(0)' },
          '70%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
          '90%': { transform: 'translate(-2px, 2px)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeInItem: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
      },
      animation: {
        glitch: 'glitch 1s infinite linear alternate-reverse',
        glitchShift: 'glitchShift 1s infinite linear alternate-reverse',
        'fade-in-item': 'fadeInItem 0.3s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-in-out forwards',
        slideOut: 'slideOut 0.3s ease-in-out forwards',
        fadeIn: 'fadeIn 0.3s ease-in-out forwards',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        _2xl: '1536px'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        title: ["Oswald", "sans-serif"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;