
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { fetchAllBingoRhymes } from './services/gemini';
import { RefreshCw, Undo2, Play, Hash, Share2, Sparkles } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [rhymes, setRhymes] = useState<Record<number, string>>({});
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await fetchAllBingoRhymes();
      setRhymes(data);
      setIsInitializing(false);
    };
    init();
  }, []);

  const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;
  const currentRhyme = currentNumber ? (rhymes[currentNumber] || "Lucky Number") : null;

  const handleCall = useCallback((num: number) => {
    if (drawnNumbers.includes(num)) return;
    setDrawnNumbers(prev => [...prev, num]);
    
    // Confetti on last ball!
    if (drawnNumbers.length === 89) {
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#ffb347', '#ff4b2b', '#ffffff', '#3b82f6']
      });
    }
  }, [drawnNumbers]);

  const drawRandom = useCallback(() => {
    if (drawnNumbers.length >= 90) return;
    let nextNum: number;
    do {
      nextNum = Math.floor(Math.random() * 90) + 1;
    } while (drawnNumbers.includes(nextNum));
    handleCall(nextNum);
  }, [drawnNumbers, handleCall]);

  const undoLast = () => {
    if (drawnNumbers.length === 0) return;
    setDrawnNumbers(prev => prev.slice(0, -1));
  };

  const resetGame = () => {
    // Instant reset to avoid browser dialog issues
    setDrawnNumbers([]);
    // Small confetti burst to signal a fresh start
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#ffffff']
    });
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pallion Action Group BINGO!',
          text: 'Join the Bingo game at Pallion!',
          url: window.location.href,
        });
      } catch (err) { console.error(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const gridNumbers = useMemo(() => Array.from({ length: 90 }, (_, i) => i + 1), []);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Sparkles className="text-yellow-500 mb-4 animate-spin" size={48} />
        <h2 className="bingo-font text-2xl text-yellow-500 uppercase tracking-widest text-center">
          PALLION ACTION GROUP<br/>
          <span className="text-white text-lg">LOADING...</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col landscape:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Side Panel: The Caller (Left) */}
      <section className="flex-shrink-0 flex flex-col items-center justify-between p-3 md:p-4 bg-slate-900 shadow-2xl z-20 landscape:w-80 border-b landscape:border-b-0 landscape:border-r border-slate-800 h-full overflow-hidden">
        
        {/* Text Header - Replacing Logo */}
        <div className="w-full text-center flex-shrink-0 pt-2 pb-4">
          <header className="flex flex-col items-center px-2">
            <h2 className="text-base md:text-xl font-black text-white uppercase tracking-[0.15em] drop-shadow-md leading-tight">
              PALLION ACTION GROUP
            </h2>
            <h1 className="bingo-font text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-[#ffb347] to-[#ff4b2b] uppercase tracking-tighter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] -mt-1">
              BINGO!
            </h1>
          </header>
        </div>
          
        {/* Ball and Rhyme Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-1">
          <div className="relative mb-2 md:mb-6 flex-shrink-0">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center border-[10px] md:border-[14px] border-slate-950 shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all">
                <span className="bingo-font text-5xl md:text-8xl text-slate-900 tabular-nums">
                  {currentNumber || '--'}
                </span>
              </div>
          </div>

          <div className="px-2 w-full flex flex-col items-center justify-center text-center h-24 md:h-40">
            {currentNumber ? (
              <div className="animate-in fade-in zoom-in duration-300 w-full">
                <p className="text-4xl md:text-6xl font-black text-yellow-500 mb-1 drop-shadow-md">
                  {currentNumber}
                </p>
                <div className="bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl inline-block w-full max-w-[260px]">
                  <p className="text-base md:text-2xl font-black text-white italic leading-tight uppercase tracking-tight">
                    {currentRhyme}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-600 font-bold uppercase text-xs md:text-sm tracking-[0.4em] animate-pulse space-y-2">
                <p>Ready to play?</p>
                <p className="text-[10px] opacity-50 tracking-widest">Numbers 1 to 90</p>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3 pb-4 flex-shrink-0 px-2">
          <button
            onClick={drawRandom}
            disabled={drawnNumbers.length >= 90}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 p-4 md:p-5 rounded-2xl font-black text-slate-950 text-2xl md:text-3xl shadow-[0_6px_0_rgb(154,52,18)] active:translate-y-1 active:shadow-none transition-all outline-none"
          >
            <Play fill="currentColor" size={28} />
            CALL NEXT
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={undoLast} 
              disabled={drawnNumbers.length === 0} 
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase disabled:opacity-30 transition-colors shadow-lg active:scale-95"
            >
              <Undo2 size={16} /> Undo
            </button>
            <button 
              onClick={resetGame} 
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 p-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase text-