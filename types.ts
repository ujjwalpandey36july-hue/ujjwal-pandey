export interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export enum GameStatus {
  PLAYING = 'PLAYING',
  CORRECT = 'CORRECT',
  WRONG = 'WRONG',
}

export interface FeedbackState {
  status: GameStatus;
  message: string;
}
