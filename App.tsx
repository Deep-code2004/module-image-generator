
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, Trash2, Share2, Layers, CheckCircle } from 'lucide-react';
import { SOCIAL_FORMATS, BRANDING } from './constants';
import { ImagePreview } from './components/ImagePreview';
import { SocialFormat } from './types';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<SocialFormat>(SOCIAL_FORMATS[0]);
  const [isSharing, setIsSharing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `AutonomousHacks_${activeFormat.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleShare = async () => {
    const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    setIsSharing(true);
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error("Failed to create image blob");

      const file = new File([blob], `AutonomousHacks_${activeFormat.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'AutonomousHacks Branding',
          text: 'Check out my branded asset for AutonomousHacks! #AutonomousHacks #AI #Hacking',
        });
      } else {
        // Fallback for browsers that don't support file sharing
        const shareUrl = window.location.href;
        if (navigator.share) {
          await navigator.share({
            title: 'AutonomousHacks Branding Generator',
            text: 'I just generated my branded asset for AutonomousHacks!',
            url: shareUrl,
          });
        } else {
          // Ultimate fallback: Just download
          handleDownload();
          alert('Share API not supported. Image has been downloaded to your device.');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to download on error
      handleDownload();
    } finally {
      setIsSharing(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#8CFF00] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8CFF00] rounded-lg">
            <Layers className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono">
              <span className="text-white">&lt;Autonomous</span>
              <span className="text-[#8CFF00]">Hacks</span>
              <span className="text-white">/&gt;</span>
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Branding Asset Generator</p>
          </div>
        </div>
        
        {selectedImage && (
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={handleReset}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all text-sm border border-white/10 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isSharing ? 'Sharing...' : 'Share'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-[#8CFF00] text-black font-bold hover:brightness-110 transition-all text-sm shadow-[0_0_20px_rgba(140,255,0,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Column: Editor */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {!selectedImage ? (
            <div 
              onClick={triggerUpload}
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center cursor-pointer hover:border-[#8CFF00]/50 hover:bg-[#8CFF00]/5 transition-all group"
            >
              <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-[#8CFF00]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload your headshot</h2>
              <p className="text-zinc-500 max-w-sm mb-8">
                Drop your photo here or click to browse. We'll automatically add the event branding and format it for social media.
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
              <button className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                Choose Image
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-zinc-950 rounded-3xl border border-zinc-900 p-4 sm:p-8 flex items-center justify-center overflow-hidden relative shadow-inner">
               <ImagePreview 
                  imageSrc={selectedImage} 
                  format={activeFormat} 
                  branding={BRANDING}
               />
               <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className="text-xs font-mono text-zinc-400">{activeFormat.width} x {activeFormat.height}px</span>
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Select Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {SOCIAL_FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFormat(f)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    activeFormat.id === f.id 
                    ? 'bg-[#8CFF00]/10 border-[#8CFF00] text-white' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-sm truncate">{f.platform}</p>
                    <p className="text-xs text-zinc-500 truncate">{f.name}</p>
                  </div>
                  {activeFormat.id === f.id && (
                    <CheckCircle className="w-4 h-4 text-[#8CFF00] ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#8CFF00]" />
              Pro Tips
            </h3>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li className="flex gap-2">
                <span className="text-[#8CFF00]">•</span>
                Use a high-resolution photo for the best results.
              </li>
              <li className="flex gap-2">
                <span className="text-[#8CFF00]">•</span>
                The preview shows how it will look after saving.
              </li>
              <li className="flex gap-2">
                <span className="text-[#8CFF00]">•</span>
                The logo is automatically placed to ensure high visibility.
              </li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="p-8 text-center text-zinc-600 text-sm border-t border-white/5">
        <p>&copy; 2024 AutonomousHacks. All rights reserved.</p>
      </footer>
    </div>
  );
}
