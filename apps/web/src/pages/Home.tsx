import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Copy, Link as LinkIcon, Check } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const msgParam = searchParams.get('m');
  
  const { greeting, setGreeting } = useAppStore();
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydration marker
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize greeting state based on URL param or persisted store
  useEffect(() => {
    if (!isHydrated) return;
    
    if (msgParam) {
      try {
        const decoded = decodeURIComponent(msgParam);
        setCurrentGreeting(decoded);
      } catch (e) {
        setCurrentGreeting(greeting);
      }
    } else {
      setCurrentGreeting(greeting);
    }
  }, [msgParam, greeting, isHydrated]);

  // Adjust textarea height dynamically
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [currentGreeting, isHydrated]);

  const handleGreetingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCurrentGreeting(val);
    
    // If user edits while viewing a shared link, clear the URL to switch to local mode
    if (msgParam) {
      setSearchParams({});
    }
    setGreeting(val);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(currentGreeting);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const copyLink = async () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('m', encodeURIComponent(currentGreeting));
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-purple-200 dark:selection:bg-purple-900">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://decoded-studios-storage.s3.ap-southeast-2.amazonaws.com/public/images-1-c2de8d77.jpg" 
            alt="HelloSpark Logo" 
            className="h-9 w-auto object-contain rounded-sm drop-shadow-sm"
            crossOrigin="anonymous"
          />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-foreground">
            HelloSpark
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="relative w-full group flex justify-center">
            <textarea
              ref={textareaRef}
              value={currentGreeting}
              onChange={handleGreetingChange}
              placeholder="Type a greeting..."
              spellCheck="false"
              className="w-full resize-none overflow-hidden text-center bg-transparent outline-none text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-purple-600 dark:text-purple-400 placeholder:text-purple-600/20 dark:placeholder:text-purple-400/20 transition-all focus:scale-[1.01]"
              rows={1}
              aria-label="Greeting message"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium text-muted-foreground whitespace-nowrap pointer-events-none bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">
              Click to edit inline
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 w-full">
            <Button 
              onClick={copyText} 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto min-w-[160px] border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 dark:border-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-800 transition-colors h-12 text-base font-semibold"
            >
              {copiedText ? <Check className="mr-2 h-5 w-5 text-green-500" /> : <Copy className="mr-2 h-5 w-5" />}
              {copiedText ? 'Copied Text!' : 'Copy Text'}
            </Button>
            
            <Button 
              onClick={copyLink} 
              size="lg"
              className="w-full sm:w-auto min-w-[160px] bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-none transition-all h-12 text-base font-semibold"
            >
              {copiedLink ? <Check className="mr-2 h-5 w-5" /> : <LinkIcon className="mr-2 h-5 w-5" />}
              {copiedLink ? 'Link Copied!' : 'Share Greeting'}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm font-medium text-muted-foreground/60 animate-in fade-in duration-1000 delay-500">
        <p>Built with HelloSpark &middot; Your greeting is saved locally.</p>
      </footer>
    </div>
  );
}
