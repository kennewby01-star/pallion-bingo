
import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Undo2, Play, Share2 } from 'lucide-react';
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
        landscape:w-60 sm:landscape:w-72 md:landscape:w-80
        p-3 border-b landscape:border-b-0 landscape:border-r border-slate-800 shadow-2xl h-auto landscape:h-full relative">
        
        {/* BRANDING */}
        <div className="text-center w-full mt-1">
          <p className="text-[8px] md:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase leading-none mb-1">
            Pallion Action Group
          </p>
          <h1 className="bingo-font text-2xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-500 leading-none">
            BINGO!
          </h1>
        </div>
          
        {/* BALL AREA */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0">
          <div className="relative aspect-square w-full max-w-[20vh] sm:max-w-[28vh] md:max-w-[40vh] bg-white rounded-full flex flex-col items-center justify-center border-4 md:border-[10px] border-slate-950 shadow-2xl transition-all p-3 md:p-6 overflow-hidden">
            <span className="bingo-font text-5xl md:text-9xl landscape:text-[14vh] text-slate-900 tabular-nums leading-none mb-1 md:mb-2">
              {currentNumber || '--'}
            </span>
            {currentNumber && (
              <div className="w-full text-center border-t border-slate-100 pt-1 md:pt-2">
                <p className="text-[8px] md:text-2xl landscape:text-[2.2vh] font-black text-slate-500 italic uppercase leading-tight tracking-tight px-1">
                  {currentRhyme}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full mt-2 landscape:mt-0 space-y-2">
          <div className="flex gap-2 justify-center w-full">
            <button onClick={undoLast} disabled={drawnNumbers.length === 0} className="flex-1 bg-slate-800/80 py-2 rounded-lg text-[9px] md:text-xs font-bold uppercase text-slate-400 flex items-center justify-center gap-1 active:bg-slate-700 disabled:opacity-20 transition-all">
              <Undo2 size={12} /> Undo
            </button>
            <button onClick={resetGame} className="flex-1 bg-slate-800/80 py-2 rounded-lg text-[9px] md:text-xs font-bold uppercase text-red-500/70 flex items-center justify-center gap-1 active:bg-red-900/40 transition-all">
              <RefreshCw size={12} /> New
            </button>
          </div>

          <button
            onClick={drawRandom}
            disabled={drawnNumbers.length >= 90}
            className="w-full bg-gradient-to-b from-orange-400 to-orange-600 py-4 md:py-6 rounded-xl font-black text-slate-950 text-[16px] md:text-4xl shadow-[0_4px_0_rgb(154,52,18)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" size={18} className="md:w-10 md:h-10" />
            <span>CALL NEXT</span>
          </button>
        </div>

        <button onClick={shareApp} className="absolute bottom-1 left-1 p-1 opacity-20 hover:opacity-100 text-slate-400" title="Share">
          <Share2 size={12} />
        </button>
      </section>

      {/* Main Board Area - 90 Numbers Maximized */}
      <main className="flex-1 flex flex-col p-1.5 md:p-4 bg-slate-950 min-h-0">
        <div className="flex-1 grid grid-cols-10 grid-rows-9 gap-1 md:gap-2 place-content-center h-full w-full">
          {gridNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isCurrent = currentNumber === num;
            
            return (
              <button
                key={num}
                onClick={() => handleCall(num)}
                className={`
                  flex items-center justify-center aspect-square rounded-[1px] md:rounded-lg border md:border-2 transition-all
                  ${isCurrent 
                    ? 'bg-yellow-400 border-yellow-100 text-slate-950 z-10 scale-[1.1] shadow-2xl' 
                    : isDrawn 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-inner' 
                      : 'bg-slate-900 border-slate-800 text-slate-800 hover:bg-slate-800'}
                `}
              >
                <span className={`font-black leading-none 
                  ${isDrawn 
                    ? 'text-[11px] landscape:text-[3.2vh] sm:landscape:text-base md:text-4xl' 
                    : 'text-[9px] landscape:text-[2vh] sm:landscape:text-sm md:text-2xl opacity-20'
                  }`}
                >
                  {num}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default App;
