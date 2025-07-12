
import React, { useState, useCallback } from 'react';
import { BannerSettings } from './types';
import { CMYK_COLORS, FONT_OPTIONS } from './constants';
import ControlPanel from './components/ControlPanel';
import BannerPreview from './components/BannerPreview';
import { MailIcon, GenerateIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [settings, setSettings] = useState<BannerSettings>({
    width: 1000,
    height: 1000,
    backgroundColor: CMYK_COLORS[0],
    textColor: CMYK_COLORS[1],
    font: FONT_OPTIONS[0],
    textLines: ['Your Text Here'],
  });

  const handleSettingsChange = useCallback(<K extends keyof BannerSettings>(key: K, value: BannerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GenerateIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              PDF/SVG Banner Generator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="mailto:alex.deloverov@gmail.com" className="text-gray-400 hover:text-white transition-colors" title="Contact Developer">
              <MailIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
        <div className="lg:col-span-2">
           <div className="sticky top-24">
             <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 shadow-2xl">
                <h2 className="text-lg font-bold mb-4 text-cyan-400">Live Preview</h2>
                <div className="w-full aspect-square bg-grid-pattern p-4 rounded-lg flex items-center justify-center">
                   <BannerPreview settings={settings} />
                </div>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;