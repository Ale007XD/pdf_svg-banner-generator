
import React, { useRef, useLayoutEffect, useState } from 'react';
import { BannerSettings } from '../types';
import { SAFE_AREA_MARGIN_MM } from '../constants';

interface BannerPreviewProps {
  settings: BannerSettings;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({ settings }) => {
  const { width, height, backgroundColor, textColor, font, textLines } = settings;
  const textGroupRef = useRef<SVGGElement>(null);
  const [textScale, setTextScale] = useState(1);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (textGroupRef.current) {
      const textBBox = textGroupRef.current.getBBox();
      
      const safeAreaWidth = width - (SAFE_AREA_MARGIN_MM * 2);
      const safeAreaHeight = height - (SAFE_AREA_MARGIN_MM * 2);

      if (textBBox.width > 0 && textBBox.height > 0) {
        const scaleX = safeAreaWidth / textBBox.width;
        const scaleY = safeAreaHeight / textBBox.height;
        const newScale = Math.min(scaleX, scaleY);
        setTextScale(newScale);
        
        const scaledWidth = textBBox.width * newScale;
        const scaledHeight = textBBox.height * newScale;
        
        const x = SAFE_AREA_MARGIN_MM + (safeAreaWidth - scaledWidth) / 2 - (textBBox.x * newScale);
        const y = SAFE_AREA_MARGIN_MM + (safeAreaHeight - scaledHeight) / 2 - (textBBox.y * newScale);
        setTextPosition({ x, y });
      } else {
        // Reset or center if no text
        setTextScale(1);
        setTextPosition({ x: width / 2, y: height / 2 });
      }
    }
  }, [width, height, textLines, font]);

  const filteredTextLines = textLines.filter(line => line.trim() !== '');
  const initialFontSize = 100; // Arbitrary large size for initial measurement

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      style={{ backgroundColor: backgroundColor.hex }}
    >
      <rect width={width} height={height} fill={backgroundColor.hex} />
      {/* Optional: uncomment to visualize safe area */}
      {/* <rect 
        x={SAFE_AREA_MARGIN_MM} 
        y={SAFE_AREA_MARGIN_MM} 
        width={width - SAFE_AREA_MARGIN_MM * 2} 
        height={height - SAFE_AREA_MARGIN_MM * 2} 
        fill="none" 
        stroke="rgba(255,0,255,0.5)" 
        strokeWidth="2"
        strokeDasharray="10 5"
      /> */}

      <g transform={`translate(${textPosition.x} ${textPosition.y}) scale(${textScale})`}>
        <g ref={textGroupRef}>
          {filteredTextLines.map((line, index) => (
            <text
              key={index}
              x={0}
              y={index * initialFontSize * 1.2}
              dy="0.35em" // Vertical alignment adjustment
              fontFamily={font.value}
              fontSize={initialFontSize}
              fill={textColor.hex}
              textAnchor="start"
              dominantBaseline="middle"
              style={{ fontWeight: font.weight }}
            >
              {line}
            </text>
          ))}
        </g>
      </g>
    </svg>
  );
};

export default BannerPreview;