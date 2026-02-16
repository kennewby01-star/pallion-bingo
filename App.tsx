
import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Undo2, Play, Hash, Share2 } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

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
    
    if (drawnNumbers.length === 89) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
    if (confirm("Start a new game?")) {
      setDrawnNumbers([]);
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pallion Bingo!',
          text: 'Play Bingo with Pallion Action Group!',
          url: window.location.href,
        });
      } catch (err) { console.error(err); }
    }
  };

  const gridNumbers = useMemo(() => Array.from({ length: 90 }, (_, i) => i + 1), []);

  return (
    <div className="flex flex-col landscape:flex-row h-[100dvh] w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Sidebar: Caller Area */}
      <section className="flex-shrink-0 flex flex-col items-center justify-between bg-slate-900 z-20 
        landscape:w-32 sm:landscape:w-44 md:landscape:w-80 
        p-1 md:p-4 border-b landscape:border-b-0 landscape:border-r border-slate-800 shadow-2xl h-auto landscape:h-full">
        
        {/* BRANDING */}
        <div className="text-center w-full pt-1 landscape:pt-0">
          <p className="text-[6px] md:text-xs font-bold tracking-[0.2em] text-slate-400 uppercase leading-none opacity-80">
            Pallion Action Group
          </p>
          <h1 className="bingo-font text-lg md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-500 mt-0.5 landscape:mt-0">
            BINGO!
          </h1>
        </div>
          
        {/* BALL AREA: Explicitly height-bound in landscape */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 landscape:max-h-[55%]">
          <div className="relative">
            {/* SHRUNKEN BALL: Size increased slightly as requested (from 18vh to 22vh) */}
            <div className="aspect-square 
              w-14 sm:w-28 md:w-56 
              landscape:w-[22vh] 
              bg-white rounded-full flex items-center justify-center 
              border-2 md:border-8 border-slate-950 shadow-2xl transition-all">
              <span className="bingo-font text-2xl md:text-7xl landscape:text-[12vh] text-slate-900 tabular-nums leading-none">
                {currentNumber || '--'}
              </span>
            </div>
          </div>

          {/* RHYME: Size increased slightly as requested (from 2.2vh to 3vh) */}
          <div className="flex items-center justify-center text-center px-1 mt-1 landscape:mt-1 min-h-[1.5rem] landscape:h-[10vh]">
            {currentNumber ? (
              <p className="text-[9px] md:text-xl landscape:text-[3vh] font-black text-orange-400 italic uppercase leading-tight tracking-tighter">
                {currentRhyme}
              </p>
            ) : (
              <p className="text-[7px] md:text-sm text-slate-600 font-bold uppercase animate-pulse">Ready</p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full space-y-0.5 md:space-y-4 px-1 pb-1 md:pb-4">
          <button
            onClick={drawRandom}
            disabled={drawnNumbers.length >= 90}
            className="w-full bg-gradient-to-b from-orange-400 to-orange-600 
              py-1 landscape:py-1.5 md:py-5 
              rounded-md md:rounded-2xl font-black text-slate-950 
              text-[10px] landscape:text-[2.5vh] md:text-2xl 
              shadow-[0_1px_0_rgb(154,52,18)] md:shadow-[0_4px_0_rgb(154,52,18)]
              active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1"
          >
            <Play fill="currentColor" size={10} className="md:w-6 md:h-6" />
            <span>CALL</span>
          </button>
          
          <div className="grid grid-cols-2 gap-0.5 md:gap-3">
            <button 
              onClick={undoLast} 
              disabled={drawnNumbers.length === 0} 
              className="bg-slate-800 py-0.5 landscape:py-1 md:py-3 rounded-md text-[7px] md:text-sm font-bold uppercase text-slate-300 flex items-center justify-center gap-1 active:bg-slate-700"
            >
              <Undo2 size={8} /> UNDO
            </button>
            <button 
              onClick={resetGame} 
              className="bg-red-600 py-0.5 landscape:py-1 md:py-3 rounded-md text-[7px] md:text-sm font-bold uppercase text-white flex items-center justify-center gap-1 active:bg-red-700"
            >
              <RefreshCw size={8} /> NEW
            </button>
          </div>
        </div>
      </section>

      {/* Main Board Area */}
      <main className="flex-1 flex flex-col p-1.5 landscape:p-1 md:p-6 bg-slate-950 overflow-hidden">
        
        <header className="flex items-center justify-between mb-0.5 md:mb-4 px-1 text-[7px] md:text-xl font-black uppercase text-slate-500 tracking-widest">
          <div className="flex items-center gap-1">
            <Hash size={8} className="md:w-6 md:h-6 text-slate-700" />
            <span className="opacity-60">Board</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">CALLED: <span className="text-white font-mono">{drawnNumbers.length}</span></span>
          </div>
        </header>

        {/* THE GRID */}
        <div className="flex-1 grid grid-cols-10 grid-rows-9 gap-0.5 md:gap-2 min-h-0">
          {gridNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isCurrent = currentNumber === num;
            
            return (
              <button
                key={num}
                onClick={() => handleCall(num)}
                className={`
                  flex items-center justify-center rounded-[1px] md:rounded-lg border md:border-2 transition-all
                  ${isCurrent 
                    ? 'bg-yellow-400 border-yellow-100 text-slate-950 z-10 scale-[1.05] shadow-lg shadow-yellow-500/30' 
                    : isDrawn 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-inner' 
                      : 'bg-slate-900 border-slate-800 text-slate-700 hover:bg-slate-800'}
                `}
              >
                <span className={`font-black leading-none 
                  ${isDrawn 
                    ? 'text-[11px] landscape:text-[3.2vh] sm:landscape:text-base md:text-3xl' 
                    : 'text-[9px] landscape:text-[2vh] sm:landscape:text-xs md:text-xl opacity-20'
                  }`}
                >
                  {num}
                </span>
              </button>
            );
          })}
        </div>

        <footer className="mt-1 landscape:hidden md:flex justify-center gap-10 text-[8px] md:text-xs font-bold uppercase opacity-30 py-1 border-t border-slate-900/50">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-sm"></div>
            <span>Called</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-sm"></div>
            <span>Active</span>
          </div>
        </footer>
      </main>

      {/* FLOAT SHARE */}
      <button 
        onClick={shareApp} 
        className="fixed bottom-2 right-2 md:bottom-8 md:right-8 bg-slate-800/90 p-1.5 md:p-5 rounded-full text-slate-300 border border-slate-700 z-50 hover:text-white transition-all shadow-2xl landscape:p-1"
      >
        <Share2 size={12} className="md:w-8 md:h-8" />
      </button>
    </div>
  );
};

export default App;
