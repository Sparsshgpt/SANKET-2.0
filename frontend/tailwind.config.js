/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Mountain Greens (Pine / Forest / Alpine)
        mountain: {
          950: '#0A1813', // Deepest pine black
          900: '#11251E', // Tactical mountain dark
          850: '#163128',
          800: '#1E4237', // Dark spruce
          700: '#2A5A4B', // Alpine forest
          600: '#387360', // Moss green
          500: '#4A9078', // Mountain sage
          400: '#69AB94',
          300: '#94C7B5',
          200: '#C2E2D6',
          100: '#E4F2EC',
          50: '#F2F8F5',
        },
        
        // Earth & Soil Tones (Clay / Terracotta / Loam / Sandstone)
        soil: {
          950: '#26170E',
          900: '#3C2517', // Dark humus
          800: '#543621', // Rich topsoil
          700: '#714B30', // Clay loam
          600: '#8E603E', // Terracotta soil
          500: '#AB7851', // Sandy loam
          400: '#C59670', // Warm earth
          300: '#DCB594', // Sandstone
          200: '#EBD2BC', // Muted tan
          100: '#F5E8DC', // Soft clay
          50: '#FAF4EE',  // Warm off-white
        },
        
        // Stone & Mineral Neutrals (Slate / Granite / Basalt)
        stone: {
          950: '#0E1211',
          900: '#191F1D',
          800: '#262E2C',
          700: '#394340',
          600: '#505D59',
          500: '#6D7C78',
          400: '#8F9E9A',
          300: '#B6C2BF',
          200: '#D6DFDD',
          100: '#EBF0EE',
          50: '#F6F9F8',
        },
        
        // Canvas & Surface Colors (Warm Sandstone / Crisp Mineral)
        canvas: {
          DEFAULT: '#F7F5F0', // Warm sandstone background
          subtle: '#EFECE4',  // Section divider / panel
          card: '#FFFFFF',    // Crisp surface
          dark: '#111816',    // Dark mode / Tactical canvas
          darkcard: '#182421',
        },
        
        // Muted Mineral Risk Severity Scale (Calm, highly visible, non-neon)
        risk: {
          critical: '#BE123C',      // Mineral Crimson Red
          'critical-bg': '#FFE4E6',
          'critical-border': '#FDA4AF',
          high: '#C2410C',          // Terracotta Orange
          'high-bg': '#FFEDD5',
          'high-border': '#FDBA74',
          moderate: '#B45309',      // Ochre Amber
          'moderate-bg': '#FEF3C7',
          'moderate-border': '#FCD34D',
          low: '#15803D',           // Alpine Forest Green
          'low-bg': '#DCFCE7',
          'low-border': '#86EFAC',
        },
        
        // Atmospheric / Hydrological Accents (Precipitation / River / Radar)
        hydro: {
          deep: '#0369A1',
          DEFAULT: '#0284C7',
          light: '#38BDF8',
          mist: '#E0F2FE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft-earth': '0 2px 10px -2px rgba(84, 54, 33, 0.05), 0 1px 3px -1px rgba(84, 54, 33, 0.08)',
        'elevated-earth': '0 10px 25px -4px rgba(30, 66, 55, 0.08), 0 4px 6px -2px rgba(84, 54, 33, 0.04)',
        'mountain-glow': '0 0 20px -3px rgba(42, 90, 75, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mountain-dusk': 'linear-gradient(180deg, #11251E 0%, #1E4237 60%, #3C2517 100%)',
        'earth-card': 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
      }
    },
  },
  plugins: [],
}
