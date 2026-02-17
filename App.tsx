import React, { useState, useCallback, useMemo } from 'react';
// @ts-ignore
import confetti from 'canvas-confetti';

const RHYMES: Record<number, string> = {
  1: "Kelly's Eye", 2: "One Little Duck", 3: "Cup of Tea", 4: "Knock at the Door", 5: "Man Alive",
  6: "Tom Mix", 7: "Lucky Seven", 8: "Garden Gate", 9: "Doctor's Orders", 10: "Uncle Ben",
  11: "Legs Eleven", 12: "One Dozen", 13: "Unlucky for Some", 14: "Valentine's Day", 15: "Young and Keen",
  16: "Sweet Sixteen", 17: "Dancing Queen", 18: "Coming of Age", 19: "Goodbye Teens", 20: "One Score",
  21: "Royal Salute", 22: "Two Little Ducks", 23: "Thee and Me", 24: "Two Dozen", 25: "Duck and Dive",
  26: "Pick and Mix", 27: "Gateway to Heaven", 28: "Overweight", 29: "Rise and Shine", 30: "Dirty Gertie",
  31: "Get Up and Run", 32: "Buckle My Shoe", 33: "Dirty Knee", 34: "Ask for More", 35: "Jump and Jive",
  36: "Three Dozen", 37: "More than 11", 38: "Christmas Cake", 39: "Steps", 40: "Life Begins",
  41: "Time for Fun", 42: "Winnie the Pooh", 43: "Down on Your Knee", 44: "Droopy Drawers", 45: "Halfway There",
  46: "Up to Tricks", 47: "Four and Seven", 48: "Four Dozen", 49: "PC 49", 50: "Half a Century",
  51: "Tweak of the Thumb", 52: "Weeks in a Year", 53: "Stuck in the Tree", 54: "Clean the Floor", 55: "Snakes Alive",
  56: "Was She Worth It?", 57: "Heinz Varieties", 58: "Make Them Wait", 59: "Brighton Line", 60: "Five Dozen",
  61: "Bakers Bun", 62: "Turn on the Screw", 63: "Tickle Me 63", 64: "Red Raw", 65: "Old Age Pension",
  66: "Clickety Click", 67: "Made in Heaven", 68: "Saving Grace", 69: "Either Way Up", 70: "Three Score and Ten",
  71: "Bang on the Drum", 72: "Six Dozen", 73: "Queen B", 74: "Candy Store", 75: "Strive and Strive",
  76: "Trombones", 77: "Sunset Strip", 78: "Heaven's Gate", 79: "One More Time", 80: "Eight and Blank",
  81: "Stop and Run", 82: "Straight on Through", 83: "Time for Tea", 84: "Seven Dozen", 85: "Staying Alive",
  86: "Between the Sticks", 87: "Torquay in Devon", 88: "Two Fat Ladies", 89: "Nearly There", 90: "Top of the Shop"
};

const App: React.FC = () => {
  const [drawn, setDrawn] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [rolling, setRolling] = useState<number | null>(null);

  const remaining = useMemo(() => {
    const all = Array.from({ length: 90 }, (_, i) => i + 1);
    return all.filter(n => !drawn.includes(n));
  }, [drawn]);

  const drawNumber = useCallback(() => {
    if (remaining.length === 0 || rolling !== null) return;

    let steps = 0;
    const maxSteps = 12;
    const interval = setInterval(() => {
      setRolling(Math.floor(Math.random() * 90) + 1);
      steps++;
      if (steps >= maxSteps) {
        clearInterval(interval);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setDrawn(prev => [next, ...prev]);
        setCurrent(next);
        setRolling(null);
      }
    }, 40);
  }, [remaining, rolling]);

  const undo = useCallback(() => {
    if (drawn.length === 0) return;
    const [_, ...rest] = drawn;
    setDrawn(rest);
    setCurrent(rest.length > 0 ? rest[0] : null);
  }, [drawn]);

  const reset = useCallback(() => {
    if (window.confirm("Start a new game?")) {
      setDrawn([]);
      setCurrent(null);
      try { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); } catch(e){}
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white p-4 md:p-8 overflow-hidden">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-5xl font-black text-[#38bdf8] tracking-tighter uppercase">PALLION BINGO</h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">STABLE v1.12</p>
        </div>
        <div className="panel-bg px-4 py-2 rounded-2xl border border-[#38bdf8]/20 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Numbers Drawn</span>
          <span className="text-2xl md:text-4xl font-black">{drawn.length}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <div className="flex-1 md:w-1/2 flex flex-col gap-6">
          <div className="panel-bg flex-1 rounded-[2.5rem] p-6 flex flex-col items-center justify-between">
            <button 
              onClick={drawNumber}
              disabled={remaining.length === 0 || rolling !== null}
              className="w-full py-6 md:py-10 bg-gradient-to-b from-[#38bdf8] to-[#0284c7] rounded-3xl text-3xl md:text-6xl font-black shadow-2xl active:scale-95 transition-all disabled:opacity-20 uppercase"
            >
              {rolling !== null ? "..." : "DRAW NUMBER"}
            </button>

            <div className="flex flex-col items-center">
              <div className="w-44 h-44 md:w-80 md:h-80 rounded-full border-[12px] border-[#38bdf8]/10 bg-[#0f172a] flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.1)]">
                <span className="text-8xl md:text-[10rem] font-black text-white neon-text">
                  {rolling !== null ? rolling : (current ?? "—")}
                </span>
              </div>
              <div className="mt-8 text-center min-h-[4rem]">
                {current && !rolling && (
                  <h2 className="text-xl md:text-4xl font-black text-[#38bdf8] uppercase italic">
                    "{RHYMES[current]}"
                  </h2>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button onClick={undo} className="flex-1 py-4 bg-slate-800/50 rounded-2xl font-bold uppercase text-slate-400 hover:bg-slate-800 transition-colors">Undo Last</button>
              <button onClick={reset} className="flex-1 py-4 bg-red-500/10 rounded-2xl font-bold uppercase text-red-400 hover:bg-red-500/20 transition-colors">Reset Game</button>
            </div>
          </div>
        </div>

        <div className="flex-1 md:w-1/2 panel-bg rounded-[2.5rem] p-6 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Full Master Board</h3>
            <span className="text-slate-700 font-mono text-xs">1 - 90</span>
          </div>
          <div className="flex-1 min-h-0">
            <div className="bingo-grid h-full">
              {Array.from({length: 90}, (_, i) => i + 1).map(n => (
                <div key={n} className={`flex items-center justify-center rounded-lg border text-[10px] md:text-2xl font-black transition-all duration-300
                  ${current === n && rolling === null ? 'bg-[#38bdf8] text-white border-white scale-110 z-10 shadow-xl' : 
                    drawn.includes(n) ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/30' : 
                    'bg-transparent text-slate-800 border-white/5'}`}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-[10px] text-slate-800 font-black tracking-[0.5em] uppercase">
        PAG COMMUNITY BINGO &copy; 2026
      </footer>
    </div>
  );
};

export default App;