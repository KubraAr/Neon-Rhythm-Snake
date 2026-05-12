
import { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER'>('IDLE');
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      // Update direction from the buffered nextDirection to prevent self-collision on quick inputs
      setDirection(nextDirection);

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setGameState('OVER');
        return prevSnake;
      }

      // Check self-collision
      if (prevSnake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, nextDirection, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Decorative Gradient */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-magenta/10 rounded-full blur-3xl" />

      {/* Header Stats */}
      <div className="flex justify-between w-full px-4 items-center mb-2 z-10 transition-all duration-500">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Current Score</span>
          <span className="text-4xl font-mono font-black text-neon-cyan text-glow-cyan leading-none">
            {score.toString().padStart(3, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High Score
          </span>
          <span className="text-2xl font-mono font-bold text-neon-magenta text-glow-magenta leading-none">
            {highScore.toString().padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black border-2 border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute rounded-sm transition-all duration-100 ${i === 0 ? 'bg-neon-cyan glow-cyan z-20' : 'bg-neon-cyan/40 z-10'}`}
            style={{
              width: '100%',
              height: '100%',
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              maxWidth: 20,
              maxHeight: 20
            }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-neon-lime glow-lime rounded-full z-10"
          style={{
            width: '100%',
            height: '100%',
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            maxWidth: 20,
            maxHeight: 20,
            scale: 0.8
          }}
        />

        {/* Overlay States */}
        <AnimatePresence>
          {gameState === 'IDLE' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="text-4xl font-black text-white italic mb-6 tracking-tighter">NEON SNAKE</h2>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-3 px-8 py-4 bg-neon-cyan text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                <Play className="fill-black" /> START GAME
              </button>
            </motion.div>
          )}

          {gameState === 'OVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <span className="text-neon-magenta text-6xl font-black italic mb-2 tracking-tighter text-glow-magenta">GAME OVER</span>
              <span className="text-zinc-500 font-mono text-sm mb-8">FINAL SCORE: {score}</span>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-full hover:bg-neon-magenta hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Instructions */}
      <div className="flex gap-8 mt-2 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
        <span className="flex items-center gap-2 font-bold"><span className="px-1.5 py-0.5 border border-zinc-700 rounded text-zinc-400">ARROWS</span> TO MOVE</span>
        <span className="flex items-center gap-2 font-bold"><span className="px-1.5 py-0.5 border border-zinc-700 rounded text-zinc-400">SPACE</span> PAUSE</span>
      </div>
    </div>
  );
}
