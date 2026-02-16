
import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Undo2, Play, Hash, Share2 } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

// Hardcoded rhymes to ensure they work instantly on all devices without fetching delays
const TRADITIONAL_RHYMES: Record<number, string> = {
  1: "Kelly's Eye", 2: "One Little Duck", 3: "Cup of Tea", 4: "Knock at the Door", 5: "Man Alive",
  6: "Tom Mix", 7: "Lucky Seven", 8: "Garden Gate", 9: "Doctor's Orders", 10: "Mr Ben",
  11: "Legs Eleven", 12: "One Dozen", 13: "Unlucky for Some", 14: "Valentine's Day", 15: "Young and Keen",
  16: "Sweet Sixteen", 17: "Dancing Queen", 18: "Coming of Age", 19: "Goodbye Teens", 20: "One Score",
  21: "Key of the Door", 22: "Two Little Ducks", 23: "Thee and Me", 24: "Two Dozen", 25: "Duck and Dive",
  26: "Pick and Mix", 27: "Gateway to Heaven", 28: "Over Weight", 29: "Rise and Shine", 30: "Dirty Gertie",
  31: "Get Up and Run", 32: "Buckle My Shoe", 33: "Dirty Knee", 34: "Ask for More", 35: "Jump and Jive",
  36: "Three Dozen", 37: "More than Eleven", 38: "Christmas Cake", 39: "39 Steps", 40: "Life Begins",
  41: "Time for Fun", 42: "Winnie the Pooh", 43: "Down on Your Knee", 44: "Droopy Drawers", 45: "Halfway There",
  46: "Up to Tricks", 47: "Four and Seven", 48: "Four Dozen", 49: "PC 49", 50: "Half a Century",
  51: "Tweak of the Thumb", 52: "Weeks in a Year", 53: "Stuck in the Tree", 54: "Clean the Floor", 55: "Snakes Alive",
  56: "Was She Worth It?", 57: "Heinz Varieties", 58: "Make Them Wait", 59: "Brighton Line", 60: "Five Dozen",
  61: "Bakers Bun", 62: "Tickety Boo", 63: "Tickle Me", 64: "Red Raw", 65: "Old Age Pension",
  66: "Clickety Click", 67: "Made in Heaven", 68: "Saving Grace", 69: "Either Way Up", 70: "Three Score and Ten",
  71: "Bang on the Drum", 72: "Six Dozen", 73: "Queen B", 74: "Candy Store", 75: "Strive and Thrive",
  76: "Trombones", 77: "Sunset Strip", 78: "Heaven's Gate", 79: "One More Time", 80: "Eight and Blank",
  81: "Fat Lady with a Cane", 82: "Straight On Through", 83: "Time for Tea", 84: "Seven Dozen", 85: "Staying Alive",
  86: "Between the Sticks", 87: "Torquay in Devon", 88: "Two Fat Ladies", 89: "Nearly There", 90: "Top of the Shop"
};

const App: React.FC = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);

  const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;
  const currentRhyme = currentNumber ? (TRADITIONAL_RHYMES[currentNumber] || "Lucky Number") : null;

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
    setDrawnNumbers([]);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#ffffff']
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

  return (
    <div className="flex flex-col landscape:flex-row h-[100dvh] w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Side Panel: The Caller (Left) */}
      {/* Optimized landscape width for mobile (w-52) and tablet (w-72) */}
      <section className="flex-shrink-0 flex flex-col items-center justify-between p-3 md:p-5 lg:p-6 bg-slate-900 shadow-2xl z-20 landscape:w-52 md:landscape:w-72 lg:landscape:w-[28rem] border-b landscape:border-b-0 landscape:border-r border-slate-800 h-auto landscape:h-full">
        
        {/* Branding Header */}
        <div className="w-full text-center flex-shrink-0 pt-2 pb-1 md:pb-4">
          <h2 className="text-[10px] md:text-lg lg:text-2xl font-black text-white uppercase tracking-[0.2em] opacity-80 leading-tight">
            PALLION ACTION GROUP
          </h2>
          <h1 className="bingo-font text-3xl md:text-5xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-500 uppercase tracking-tighter drop-shadow-lg">
            BINGO!
          </h1>
        </div>
          
        {/* Main Number Display (Bingo Ball) */}
        {/* Adjusted ball sizes to fit mobile landscape height constraints */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-1">
          <div className="relative mb-2 md:mb-4 flex-shrink-0">
            <div className="aspect-square w-24 md:w-44 lg:w-72 bg-white rounded-full flex items-center justify-center border-[4px] md:border-[10px] lg:border-[16px] border-slate-950 shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all">
              <span className="bingo-font text-4xl md:text-[6rem] lg:text-[9rem] text-slate-900 tabular-nums leading-none flex items-center justify-center h-full pt-1">
                {currentNumber || '--'}
              </span>
            </div>
          </div>

          {/* Rhyme Section */}
          <div className="px-1 w-full flex flex-col items-center justify-center text-center h-12 md:h-24">
            {currentNumber ? (
              <div className="animate-in fade-in zoom-in duration-300 w-full flex flex-col items-center">
                <div className="bg-slate-800/90 px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-2xl border border-slate-700 shadow-xl inline-block w-full max-w-[320px]">
                  <p className="text-[10px] md:text-xl lg:text-3xl font-black text-white italic leading-tight uppercase tracking-tight">
                    {currentRhyme}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-600 font-bold uppercase text-[8px] md:text-base tracking-[0.3em] animate-pulse">
                READY?
              </div>
            )}
          </div>
        </div>

        {/* Buttons Section */}
        <div className="w-full space-y-1.5 md:space-y-4 pb-3 md:pb-6 flex-shrink-0 px-1 md:px-4 lg:px-8">
          <button
            onClick={drawRandom}
            disabled={drawnNumbers.length >= 90}
            className="w-full flex items-center justify-center gap-2 md:gap-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 p-2.5 md:py-4 md:px-6 lg:py-6 lg:px-10 rounded-lg md:rounded-3xl lg:rounded-[2.5rem] font-black text-slate-950 text-base md:text-2xl lg:text-4xl shadow-[0_3px_0_rgb(154,52,18)] md:shadow-[0_6px_0_rgb(154,52,18)] active:translate-y-1 active:shadow-none transition-all outline-none"
          >
            <Play fill="currentColor" className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
            <span>CALL NEXT</span>
          </button>
          
          <div className="grid grid-cols-2 gap-1.5 md:gap-3">
            <button 
              onClick={undoLast} 
              disabled={drawnNumbers.length === 0} 
              className="flex items-center justify-center gap-1 md:gap-2 bg-slate-800 hover:bg-slate-700 p-2 md:p-3 lg:p-5 rounded-lg md:rounded-xl text-[8px] md:text-base lg:text-xl font-bold uppercase disabled:opacity-30 transition-colors shadow-lg active:scale-95"
            >
              <Undo2 className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5" /> UNDO
            </button>
            <button 
              onClick={resetGame} 
              className="flex items-center justify-center gap-1 md:gap-2 bg-red-600 hover:bg-red-500 p-2 md:p-3 lg:p-5 rounded-lg md:rounded-xl text-[8px] md:text-base lg:text-xl font-bold uppercase text-white transition-all shadow-lg active:scale-95"
            >
              <RefreshCw className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5" /> NEW
            </button>
          </div>
        </div>
      </section>

      {/* Main Panel: The Master Board (Right Grid) */}
      <main className="flex-1 flex flex-col p-2 md:p-4 lg:p-10 bg-slate-950 overflow-hidden">
        {/* Board Header */}
        <header className="flex items-center justify-between mb-2 md:mb-4 lg:mb-8 px-2 text-[8px] md:text-lg lg:text-2xl font-black uppercase text-slate-500 tracking-[0.1em] md:tracking-[0.2em] flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <Hash className="text-slate-600 w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8" />
            <span>Master Board</span>
          </div>
          <div className="flex items-center gap-3 md:gap-8">
            <span className="text-blue-400">CALLED: <span className="text-white font-mono">{drawnNumbers.length}</span></span>
            <span className="text-slate-700 hidden sm:inline">LEFT: <span className="text-slate-400 font-mono">{90 - drawnNumbers.length}</span></span>
          </div>
        </header>

        {/* Master Board Grid - Boosted text sizes for all landscape modes */}
        <div className="flex-1 grid grid-cols-10 grid-rows-9 gap-0.5 md:gap-2 lg:gap-3.5 min-h-0">
          {gridNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isCurrent = currentNumber === num;
            
            return (
              <button
                key={num}
                onClick={() => handleCall(num)}
                className={`
                  relative flex items-center justify-center rounded-sm md:rounded-lg lg:rounded-xl transition-all border md:border-2 lg:border-[3px]
                  ${isCurrent 
                    ? 'bg-yellow-400 border-yellow-200 text-slate-950 ring-1 md:ring-4 lg:ring-[8px] ring-yellow-400/50 z-10 scale-[1.05] shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                    : isDrawn 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-inner opacity-90' 
                      : 'bg-slate-900 border-slate-800 text-slate-700 hover:bg-slate-800 hover:text-slate-400'}
                `}
              >
                {/* Increased base font from text-xs to text-sm/text-base for mobile grid */}
                <span className={`font-black leading-none ${isDrawn ? 'text-sm md:text-2xl lg:text-3xl' : 'text-xs md:text-lg lg:text-2xl opacity-20'}`}>
                  {num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend Footer */}
        <footer className="mt-1.5 md:mt-4 lg:mt-8 flex justify-center gap-3 md:gap-12 lg:gap-32 text-[7px] md:text-base lg:text-xl text-slate-600 font-bold uppercase tracking-[0.2em] opacity-80 flex-shrink-0 py-1.5 md:py-4 lg:py-6 border-t border-slate-900/50">
          <div className="flex items-center gap-1 md:gap-3">
            <div className="w-2 h-2 md:w-5 md:h-5 bg-blue-600 rounded-[1px] md:rounded-md border border-blue-400"></div>
            <span>Called</span>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <div className="w-2 h-2 md:w-5 md:h-5 bg-yellow-400 rounded-[1px] md:rounded-md border border-yellow-200"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <div className="w-2 h-2 md:w-5 md:h-5 bg-slate-900 border border-slate-800 rounded-[1px] md:rounded-md"></div>
            <span>Open</span>
          </div>
        </footer>
      </main>

      {/* Share Button (Float) */}
      <button 
        onClick={shareApp} 
        className="fixed bottom-2 right-2 md:bottom-8 md:right-8 bg-slate-800/95 p-2.5 md:p-6 rounded-full text-slate-300 shadow-2xl border border-slate-700 hover:text-yellow-500 hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Share2 className="w-3.5 h-3.5 md:w-8 md:h-8" />
      </button>
    </div>
  );
};

export default App;
