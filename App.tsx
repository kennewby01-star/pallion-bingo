
import React, { useState, useCallback, useMemo } from 'react';
import { getBingoLingo } from './services/gemini';
import { RefreshCw, Undo2, Play, Info, Hash, Loader2, Share2 } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lingo, setLingo] = useState<string>("Ready to Call?");
  const [isLingoLoading, setIsLingoLoading] = useState(false);

  const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;

  const handleCall = useCallback(async (num: number) => {
    if (drawnNumbers.includes(num)) return;

    setDrawnNumbers(prev => [...prev, num]);
    setIsLingoLoading(true);

    try {
      const newLingo = await getBingoLingo(num);
      setLingo(newLingo);
    } catch (e) {
      setLingo(`Number ${num}`);
    } finally {
      setIsLingoLoading(false);
    }

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
    setLingo(drawnNumbers.length > 1 ? "Last call undone" : "Ready to Call?");
    setIsLingoLoading(false);
  };

  const resetGame = () => {
    if (window.confirm("Start a new game? This will clear the master board.")) {
      setDrawnNumbers([]);
      setLingo("Ready to Call?");
      setIsLingoLoading(false);
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pallion Bingo Caller',
          text: 'Check out the Pallion Action Group Bingo Caller!',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard! Send it to your staff via text or email.");
    }
  };

  const gridNumbers = useMemo(() => Array.from({ length: 90 }, (_, i) => i + 1), []);

  return (
    <div className="flex flex-col landscape:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Caller Side/Top Panel */}
      <section className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-slate-900 shadow-2xl z-20 landscape:w-72 landscape:h-full border-b landscape:border-b-0 landscape:border-r border-slate-800">
        
        <div className="flex items-center justify-between w-full mb-2 landscape:hidden">
            <button onClick={shareApp} className="p-2 text-slate-400 hover:text-yellow-500">
                <Share2 size={20} />
            </button>
            <h1 className="bingo-font text-lg text-yellow-500 opacity-90 uppercase tracking-tighter">
              Pallion Action Group
            </h1>
            <button onClick={resetGame} className="p-2 text-slate-400 hover:text-red-500">
                <RefreshCw size={20} />
            </button>
        </div>

        <h1 className="hidden landscape:block bingo-font text-xl text-yellow-500 opacity-90 uppercase tracking-tighter text-center mb-6">
          Pallion Action Group
        </h1>

        {/* Big Number Circle */}
        <div className="relative mb-2 landscape:mb-6">
          <div className={`
            w-20 h-20 md:w-28 md:h-28 landscape:w-32 landscape:h-32 bg-white rounded-full flex items-center justify-center 
            border-4 md:border-8 border-slate-950 shadow-xl transition-all duration-200
            ${isLingoLoading ? 'ring-4 ring-yellow-500/20 scale-95' : 'scale-100'}
          `}>
            <span className="bingo-font text-4xl md:text-5xl landscape:text-6xl text-slate-900 tabular-nums">
              {currentNumber || '--'}
            </span>
          </div>
          {isLingoLoading && (
            <div className="absolute -top-1 -right-1 bg-slate-950 rounded-full p-1 border border-slate-700">
              <Loader2 className="animate-spin text-yellow-500" size={16} />
            </div>
          )}
        </div>

        {/* Rhyme Phrase */}
        <div className="text-center h-10 md:h-12 landscape:h-20 flex items-center justify-center px-2 mb-4">
          <p className={`text-sm md:text-base landscape:text-lg font-bold text-yellow-400 italic leading-tight transition-all duration-200 ${isLingoLoading ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
            {lingo}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2 landscape:gap-4 mt-auto landscape:mt-0">
          <button
            onClick={drawRandom}
            disabled={drawnNumbers.length >= 90}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-slate-600 p-3 landscape:p-5 rounded-xl font-black text-slate-950 text-base md:text-lg landscape:text-xl shadow-[0_3px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all"
          >
            <Play fill="currentColor" size={18} />
            CALL NEXT
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={undoLast}
              disabled={drawnNumbers.length === 0}
              className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 p-2 landscape:p-3 rounded-xl transition-all active:scale-95 text-[10px] md:text-xs font-bold uppercase"
            >
              <Undo2 size={14} />
              Undo
            </button>

            <button
              onClick={shareApp}
              className="hidden landscape:flex items-center justify-center gap-1 bg-slate-800 hover:bg-blue-900/40 p-2 landscape:p-3 rounded-xl transition-all active:scale-95 text-[10px] md:text-xs font-bold uppercase"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={resetGame}
              className="hidden landscape:flex items-center justify-center gap-1 bg-slate-800 hover:bg-red-900/40 p-2 landscape:p-3 rounded-xl transition-all active:scale-95 text-[10px] md:text-xs font-bold uppercase"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Stats - Landscape only */}
        <div className="hidden landscape:flex flex-col w-full mt-8 gap-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>Balls Drawn</span>
            <span>{drawnNumbers.length}/90</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-500" 
              style={{ width: `${(drawnNumbers.length / 90) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <main className="flex-1 flex flex-col min-h-0 p-2 md:p-4 landscape:p-6 bg-slate-950">
        <header className="flex items-center justify-between mb-2 landscape:mb-4 px-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            <Hash size={14} className="text-slate-600" />
            <span>Master Board</span>
          </div>
          <div className="landscape:hidden text-[10px] font-mono text-yellow-500 font-bold">
            {drawnNumbers.length} / 90
          </div>
        </header>

        {/* The Grid - Dynamically fills space */}
        <div className="flex-1 grid grid-cols-10 grid-rows-9 gap-1 md:gap-2 min-h-0">
          {gridNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isCurrent = currentNumber === num;
            
            return (
              <button
                key={num}
                onClick={() => handleCall(num)}
                className={`
                  relative flex items-center justify-center rounded-md md:rounded-lg text-xs sm:text-base md:text-lg lg:text-xl font-black transition-all duration-150
                  ${isCurrent 
                    ? 'bg-yellow-400 text-slate-950 ring-2 md:ring-4 ring-yellow-400/40 z-10 scale-105 shadow-lg' 
                    : isDrawn 
                      ? 'bg-blue-600 text-white shadow-inner' 
                      : 'bg-slate-900 text-slate-700 border border-slate-800/50 hover:bg-slate-800 hover:text-slate-400'}
                `}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Legend - Minimized */}
        <footer className="mt-2 md:mt-4 flex justify-center gap-4 text-[9px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Called</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-slate-900 border border-slate-800 rounded-full"></div>
            <span>Open</span>
          </div>
        </footer>
      </main>

      {/* Minimal Info Button */}
      <button 
        onClick={() => alert("Pallion Action Group Bingo!\n\n- Click 'Call Next' for a random ball.\n- Tap any number on the board to call it manually.\n- Rotate for side-by-side view.\n- No scrollbars needed!")}
        className="fixed bottom-2 right-2 md:bottom-4 md:right-4 text-slate-700 hover:text-yellow-500 transition-colors p-2"
      >
        <Info size={16} />
      </button>
    </div>
  );
};

export default App;
