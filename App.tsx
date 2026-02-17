import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { BingoState } from './types.ts';
import { BINGO_RHYMES } from './constants/bingoRhymes.ts';
// @ts-ignore
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<BingoState>({
    allNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
    drawnNumbers: [],
    currentNumber: null,
    remainingNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
  });

  const [isAnimate, setIsAnimate] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingNumber, setRollingNumber] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const rollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  const drawNumber = useCallback(() => {
    if (gameState.remainingNumbers.length === 0 || isRolling) return;

    setIsRolling(true);
    setIsAnimate(false);
    
    let count = 0;
    const rollDuration = 500; 
    const rollInterval = 50; 
    const totalSteps = rollDuration / rollInterval;

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

    rollIntervalRef.current = window.setInterval(() => {
      setRollingNumber(Math.floor(Math.random() * 90) + 1);
      count++;

      if (count >= totalSteps) {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current);
          rollIntervalRef.current = null;
        }
        
        const randomIndex = Math.floor(Math.random() * gameState.remainingNumbers.length);
        const newNumber = gameState.remainingNumbers[randomIndex];
        const newRemaining = gameState.remainingNumbers.filter(n => n !== newNumber);

        setGameState(prev => ({
          ...prev,
          currentNumber: newNumber,
          drawnNumbers: [newNumber, ...prev.drawnNumbers],
          remainingNumbers: newRemaining
        }));

        setIsRolling(false);
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 300);
      }
    }, rollInterval);

  }, [gameState.remainingNumbers, isRolling]);

  const undoLastDraw = useCallback(() => {
    if (gameState.drawnNumbers.length === 0 || isRolling) return;
    const [lastDrawn, ...rest] = gameState.drawnNumbers;
    setGameState(prev => ({
      ...prev,
      drawnNumbers: rest,
      currentNumber: rest.length > 0 ? rest[0] : null,
      remainingNumbers: [...prev.remainingNumbers, lastDrawn].sort((a, b) => a - b)
    }));
  }, [gameState.drawnNumbers, isRolling]);

  const performReset = useCallback(() => {
    setShowResetConfirm(false);
    
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#38bdf8', '#ffffff']
        });
      }
    } catch (e) {}

    setGameState({
      allNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
      drawnNumbers: [],
      currentNumber: null,
      remainingNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
    });
    
    setRollingNumber(null);
    setIsRolling(false);
    setIsAnimate(false);
  }, []);

  const progress = useMemo(() => (gameState.drawnNumbers.length / 90) * 100, [gameState.drawnNumbers]);

  return (
    <div className="h-screen w-screen flex flex-col p-3 md:p-6 bg-[#020617] text-white overflow-hidden relative">
      
      {showResetConfirm && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-white/10 p-6 rounded-[2rem] max-w-sm w-full shadow-2xl text-center">
            <h2 className="text-xl md:text-2xl font-black mb-4 uppercase text-sky-400">Start New Game?</h2>
            <div className="flex flex-col gap-3">
              <button onClick={performReset} className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl transition-all uppercase active:scale-95">Yes, Reset</button>
              <button onClick={() => setShowResetConfirm(false)} className="w-full py-4 bg-[#1e293b] text-slate-300 font-bold rounded-xl transition-all uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-2 md:mb-6">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-sky-400 uppercase tracking-tighter leading-none">PALLION BINGO</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-sky-500 text-[#020617] px-2 py-0.5 rounded font-black">v1.9 ULTIMATE</span>
          </div>
        </div>
        <div className="bg-[#0f172a] px-3 py-2 md:px-6 md:py-3 rounded-2xl border border-white/10 shadow-xl flex items-baseline gap-2">
          <span className="text-sky-500 font-black text-xs md:text-xl uppercase">Calls:</span>
          <span className="text-xl md:text-4xl font-black">{gameState.drawnNumbers.length}</span>
          <span className="text-slate-600 font-bold text-xs md:text-lg">/90</span>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-6 overflow-hidden landscape-flex-row">
        
        <div className="flex-1 md:w-[45%] flex flex-col min-h-0 gap-3 landscape-w-40">
          <div className="panel-bg rounded-[2rem] flex-1 flex flex-col p-4 md:p-8 shadow-2xl border border-white/5 overflow-hidden">
            <button
              onClick={drawNumber}
              disabled={gameState.remainingNumbers.length === 0 || isRolling}
              className="w-full py-4 md:py-10 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-400 text-white font-black text-3xl md:text-6xl shadow-2xl active:scale-95 transition-all disabled:opacity-30 border-t border-white/30"
            >
              {isRolling ? <i className="fas fa-spinner fa-spin"></i> : 'DRAW'}
            </button>

            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className={`relative flex items-center justify-center w-32 h-32 md:w-72 md:h-72 rounded-full border-8 border-sky-500/10 bg-sky-500/5 transition-transform duration-200 ${isAnimate ? 'scale-110' : ''}`}>
                <span className="text-6xl md:text-[10rem] font-black neon-glow text-white">
                  {isRolling ? rollingNumber : (gameState.currentNumber ?? '—')}
                </span>
              </div>
              <div className="mt-4 md:mt-8 min-h-[3rem] flex items-center justify-center text-center">
                {!isRolling && gameState.currentNumber && (
                  <p className="text-sky-300 font-black text-sm md:text-4xl uppercase tracking-widest leading-tight">
                    "{BINGO_RHYMES[gameState.currentNumber]}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 mt-auto">
              <button onClick={undoLastDraw} disabled={gameState.drawnNumbers.length === 0 || isRolling} className="flex-1 py-3 md:py-6 bg-[#1e293b]/50 rounded-xl text-xs md:text-lg font-black text-slate-400 uppercase active:scale-95 transition-all">Undo</button>
              <button onClick={() => setShowResetConfirm(true)} disabled={isRolling} className="flex-1 py-3 md:py-6 bg-red-500/10 rounded-xl text-xs md:text-lg font-black text-red-400 uppercase active:scale-95 transition-all">Reset</button>
            </div>
          </div>
        </div>

        <div className="flex-1 md:w-[55%] flex flex-col panel-bg rounded-[2rem] p-4 md:p-6 border border-white/5 min-h-0 landscape-w-60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs md:text-xl font-black text-slate-500 uppercase tracking-widest">Master Board</h2>
            <div className="h-1 md:h-2 w-32 md:w-64 bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="bingo-grid h-full">
              {gameState.allNumbers.map((num) => {
                const isDrawn = gameState.drawnNumbers.includes(num);
                const isCurrent = gameState.currentNumber === num && !isRolling;
                return (
                  <div key={num} className={`flex items-center justify-center rounded md:rounded-lg border text-[10px] md:text-2xl font-black transition-all
                    ${isCurrent ? 'bg-sky-400 text-white border-white scale-110 z-10 shadow-lg' : 
                      isDrawn ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 
                      'bg-transparent text-slate-800 border-white/5'}`}>
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-slate-800 text-[8px] md:text-xs font-black uppercase tracking-widest py-3">
        Pallion Action Group Community Bingo
      </footer>
    </div>
  );
};

export default App;