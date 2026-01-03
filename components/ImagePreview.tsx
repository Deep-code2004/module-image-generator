
import React, { useEffect, useRef } from 'react';
import { SocialFormat, BrandingConfig } from '../types';

interface ImagePreviewProps {
  imageSrc: string;
  format: SocialFormat;
  branding: BrandingConfig;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, format, branding }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      // Set canvas size to the specific format
      canvas.width = format.width;
      canvas.height = format.height;

      // 1. Draw Background (Blurred Version for letterboxing)
      ctx.save();
      if (format.isCircle) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
      }

      // Draw a blurred, darkened background first (Cover style)
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;
      
      let bgWidth, bgHeight, bgX, bgY;
      if (imgAspect > canvasAspect) {
        bgHeight = canvas.height;
        bgWidth = canvas.height * imgAspect;
        bgX = (canvas.width - bgWidth) / 2;
        bgY = 0;
      } else {
        bgWidth = canvas.width;
        bgHeight = canvas.width / imgAspect;
        bgX = 0;
        bgY = (canvas.height - bgHeight) / 2;
      }

      ctx.filter = 'blur(20px) brightness(0.4)';
      ctx.drawImage(img, bgX, bgY, bgWidth, bgHeight);
      ctx.filter = 'none';

      // 2. Draw Foreground Image (Contain style - No Cutting)
      let fgWidth, fgHeight, fgX, fgY;
      if (imgAspect > canvasAspect) {
        // Image is wider than canvas relative to height
        fgWidth = canvas.width;
        fgHeight = canvas.width / imgAspect;
        fgX = 0;
        fgY = (canvas.height - fgHeight) / 2;
      } else {
        // Image is taller than canvas relative to height
        fgHeight = canvas.height;
        fgWidth = canvas.height * imgAspect;
        fgX = (canvas.width - fgWidth) / 2;
        fgY = 0;
      }

      // Draw the actual image "contained"
      ctx.drawImage(img, fgX, fgY, fgWidth, fgHeight);

      // Add a slight dark gradient from top to improve logo visibility
      const gradientHeight = format.isCircle ? canvas.height * 0.4 : canvas.height * 0.2;
      const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();

      // 3. Draw Logo (Always on top)
      const baseFontSize = canvas.width * 0.05;
      const fontSize = Math.max(24, Math.min(baseFontSize, 60));
      
      ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textBaseline = 'top';

      // Safe zone padding
      const paddingX = format.isCircle ? canvas.width * 0.15 : canvas.width * 0.05;
      const paddingY = format.isCircle ? canvas.height * 0.15 : canvas.height * 0.05;

      const part1 = `<${branding.logoTextPrimary}`;
      const part2 = branding.logoTextAccent;
      const part3 = '/>';

      const p1Width = ctx.measureText(part1).width;
      const p2Width = ctx.measureText(part2).width;

      // High-contrast shadow
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Draw Text Components
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(part1, paddingX, paddingY);

      ctx.fillStyle = branding.accentColor;
      ctx.fillText(part2, paddingX + p1Width, paddingY);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(part3, paddingX + p1Width + p2Width, paddingY);
    };
  }, [imageSrc, format, branding]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'branding-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 space-y-4">
      <canvas
        id="preview-canvas"
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain shadow-2xl transition-all duration-300 ${format.isCircle ? 'rounded-full border-4 border-[#8CFF00]/20' : 'rounded-sm border border-white/5'}`}
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          background: '#000'
        }}
      />
      <button
        onClick={downloadImage}
        className="px-6 py-2 bg-[#8CFF00] text-black font-bold rounded-lg hover:bg-[#7BE600] transition-colors duration-200 shadow-lg"
      >
        Download Image
      </button>
    </div>
  );
};
