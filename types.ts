
export interface CmykColor {
  name: string;
  cmyk: [number, number, number, number];
  hex: string;
  isDark: boolean;
}

export interface FontOption {
  name: string;
  value: string;
  url: string;
  weight: number;
}

export interface BannerSettings {
  width: number;
  height: number;
  backgroundColor: CmykColor;
  textColor: CmykColor;
  font: FontOption;
  textLines: string[];
}