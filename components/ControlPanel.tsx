
import React, { useState } from 'react';
import { BannerSettings, CmykColor, FontOption } from '../types';
import { CMYK_COLORS, FONT_OPTIONS, PREDEFINED_EMAIL } from '../constants';
import { generatePdf, generateSvg } from '../services/bannerService';
import { sendEmailConfirmation } from '../services/geminiService';
import { DownloadIcon, MailIcon, LoadingSpinner } from './IconComponents';
import Toast from './Toast';

interface ControlPanelProps {
  settings: BannerSettings;
  onSettingsChange: <K extends keyof BannerSettings>(key: K, value: BannerSettings[K]) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
  const [numberOfLines, setNumberOfLines] = useState(settings.textLines.length);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState({ pdf: false, svg: false, email: false });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleTextLineChange = (index: number, value: string) => {
    const newTextLines = [...settings.textLines];
    newTextLines[index] = value;
    onSettingsChange('textLines', newTextLines);
  };

  const handleLineCountChange = (count: number) => {
    setNumberOfLines(count);
    const newTextLines = Array.from({ length: count }, (_, i) => settings.textLines[i] || '');
    onSettingsChange('textLines', newTextLines);
  };

  const handleGeneratePdf = async () => {
    setIsLoading(prev => ({...prev, pdf: true}));
    setToast(null);
    try {
      await generatePdf(settings);
      setToast({ message: 'PDF generated successfully!', type: 'success' });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setToast({ message: `Failed to generate PDF. ${error instanceof Error ? error.message : ''}`, type: 'error' });
    }
    setIsLoading(prev => ({...prev, pdf: false}));
  };
  
  const handleGenerateSvg = async () => {
    setIsLoading(prev => ({...prev, svg: true}));
    setToast(null);
    try {
      await generateSvg(settings);
      setToast({ message: 'SVG generated successfully!', type: 'success' });
    } catch (error) {
      console.error('SVG Generation Error:', error);
      setToast({ message: `Failed to generate SVG. ${error instanceof Error ? error.message : ''}`, type: 'error' });
    }
    setIsLoading(prev => ({...prev, svg: false}));
  };

  const handleSendEmail = async () => {
    if (!userEmail) {
        setToast({ message: 'Please enter your email address.', type: 'error' });
        return;
    }
    setIsLoading(prev => ({...prev, email: true}));
    setToast(null);
    try {
      const confirmation = await sendEmailConfirmation(userEmail, settings);
      // In a real app, you'd send the email here. We simulate by showing a detailed confirmation.
      setToast({ message: `Simulation: Email confirmation sent! Developer notified at ${PREDEFINED_EMAIL}.`, type: 'success' });
      console.log("Simulated Email Confirmation:", confirmation);
    } catch (error) {
        console.error('Email Simulation Error:', error);
        setToast({ message: 'Could not simulate email sending.', type: 'error' });
    }
    setIsLoading(prev => ({...prev, email: false}));
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-2xl flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      
      {/* Dimensions */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-cyan-400">1. Dimensions (mm)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-400 mb-1">Width</label>
            <input type="number" id="width" min="500" max="3000" value={settings.width} onChange={(e) => onSettingsChange('width', parseInt(e.target.value, 10))} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-400 mb-1">Height</label>
            <input type="number" id="height" min="500" max="3000" value={settings.height} onChange={(e) => onSettingsChange('height', parseInt(e.target.value, 10))} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
        </div>
      </div>
      
      {/* Colors */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-cyan-400">2. Colors (CMYK)</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Background</label>
                <div className="flex flex-wrap gap-2">
                    {CMYK_COLORS.map(color => (
                        <button key={color.name} onClick={() => onSettingsChange('backgroundColor', color)} className={`w-8 h-8 rounded-full border-2 ${settings.backgroundColor.name === color.name ? 'border-cyan-400' : 'border-transparent'}`} style={{backgroundColor: color.hex}} title={color.name}></button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Text</label>
                <div className="flex flex-wrap gap-2">
                    {CMYK_COLORS.map(color => (
                        <button key={color.name} onClick={() => onSettingsChange('textColor', color)} className={`w-8 h-8 rounded-full border-2 ${settings.textColor.name === color.name ? 'border-cyan-400' : 'border-transparent'}`} style={{backgroundColor: color.hex}} title={color.name}></button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Text & Font */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-cyan-400">3. Text and Font</h3>
        <div className="space-y-4">
            <div>
                <label htmlFor="font" className="block text-sm font-medium text-gray-400 mb-1">Font</label>
                <select id="font" value={settings.font.value} onChange={(e) => onSettingsChange('font', FONT_OPTIONS.find(f => f.value === e.target.value) as FontOption)} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                    {FONT_OPTIONS.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="lines" className="block text-sm font-medium text-gray-400 mb-1">Number of Text Lines</label>
                 <select id="lines" value={numberOfLines} onChange={(e) => handleLineCountChange(parseInt(e.target.value, 10))} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                {Array.from({ length: numberOfLines }).map((_, i) => (
                    <input key={i} type="text" placeholder={`Line ${i + 1}`} value={settings.textLines[i] || ''} onChange={(e) => handleTextLineChange(i, e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
                ))}
            </div>
        </div>
      </div>
      
      {/* Actions */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-cyan-400">4. Generate & Export</h3>
        <div className="flex flex-col gap-3">
           <div className="flex gap-3">
             <button onClick={handleGeneratePdf} disabled={isLoading.pdf} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-900 disabled:text-gray-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
               {isLoading.pdf ? <LoadingSpinner className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
               Download PDF
             </button>
             <button onClick={handleGenerateSvg} disabled={isLoading.svg} className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-900 disabled:text-gray-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                {isLoading.svg ? <LoadingSpinner className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
               Download SVG
             </button>
           </div>
           <div className="border-t border-gray-700 pt-4 mt-2 space-y-3">
              <p className="text-sm text-gray-400">Send a preview to your email and notify the developer.</p>
              <input type="email" placeholder="Your email address" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
              <button onClick={handleSendEmail} disabled={isLoading.email} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 disabled:text-gray-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                {isLoading.email ? <LoadingSpinner className="w-5 h-5"/> : <MailIcon className="w-5 h-5"/>}
                Send to Email (Simulated)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
