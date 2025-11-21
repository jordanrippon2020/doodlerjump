import { Game } from './Game';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
canvas.width = 400;
canvas.height = 600;

const game = new Game(canvas);
game.start();
