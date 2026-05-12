
export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
  bpm: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  highScore: number;
}
