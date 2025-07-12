import { CmykColor, FontOption } from './types';

export const CMYK_COLORS: CmykColor[] = [
  { name: 'White', cmyk: [0, 0, 0, 0], hex: '#FFFFFF', isDark: false },
  { name: 'Black', cmyk: [0, 0, 0, 1], hex: '#1a1a1a', isDark: true },
  { name: 'Red', cmyk: [0, 1, 1, 0], hex: '#FF0000', isDark: true },
  { name: 'Yellow', cmyk: [0, 0, 1, 0], hex: '#FFFF00', isDark: false },
  { name: 'Blue', cmyk: [1, 1, 0, 0], hex: '#0000FF', isDark: true },
  { name: 'Green', cmyk: [1, 0, 1, 0], hex: '#00FF00', isDark: false },
];

// Fonts are now loaded locally from the `/public/fonts` directory for reliability.
// The user must place the font files with matching names in that directory.
export const FONT_OPTIONS: FontOption[] = [
    { name: 'Golos Text', value: "'Golos Text', sans-serif", url: '/fonts/golos-text-latin-700-normal.woff2', weight: 700 },
    { name: 'Tenor Sans', value: "'Tenor Sans', sans-serif", url: '/fonts/tenor-sans-latin-400-normal.woff2', weight: 400 },
    { name: 'Fira Sans', value: "'Fira Sans', sans-serif", url: '/fonts/fira-sans-latin-700-normal.woff2', weight: 700 },
    { name: 'Montserrat (Igra Sans alt.)', value: "'Montserrat', sans-serif", url: '/fonts/montserrat-latin-700-normal.woff2', weight: 700 },
];

export const SAFE_AREA_MARGIN_MM = 30;
export const PREDEFINED_EMAIL = "alex.deloverov@gmail.com";