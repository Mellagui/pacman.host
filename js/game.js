import { GameBoard } from './gameBoard.js';
import { Player } from './player.js';
import { Ghosts } from './enemy.js';
import { InputHandler } from './input.js';
import { UI } from './ui.js';

export class Game {
    constructor() {
        // game state
        this.lastTime = 0;
        this.deltaTime = 0;
        this.maxScore = 0;
        this.totalScore = 0;
        this.inGame = false;
        this.victory = false;
        this.gameOver = false;
        this.pause = false;
        this.nextLvl = false;
        this.dead = false;

        this.level = 1;
        this.score = 0;
        this.lives = 5;
        this.timeRemaining = 120;
        this.displayedTime = null;

        this.pacmanSpeed = 100;  // 5 cells per second (100/20)
        this.ghostSpeed = 80;    // 4 cells per second (80/20)
        this.cellSize = 20;

        this.ui = new UI(this);
        this.gameBoard = new GameBoard(this);
        this.input = new InputHandler(this);

        this.player = null;
        this.ghosts = null;

        // Animation frame reference
        this.animationFrameId = null;

        this.currentMenu = false;

        // In Game constructor
        this.gameLoop = this.gameLoop.bind(this);
    }

    init() {
        console.log('Initializing game...');

        this.gameBoard.createBoard();

        this.player = new Player(this);
        this.ghosts = new Ghosts(this);

        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateTimer(this.timeRemaining);

        if (this.level === 1) this.ui.showMenu('start');

        this.startGameLoop();

        console.log('Game initialized successfully');
    }

    startGameLoop() {
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp)); //
    }

    cancelGameLoop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;

        // Calculate delta time (time between frames)
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Limit delta time to prevent large jumps
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;

        if (!this.currentMenu) {

            this.timeRemaining -= this.deltaTime;
            if (this.displayedTime != Math.ceil(this.timeRemaining)) {
                this.displayedTime = Math.ceil(this.timeRemaining);
                this.ui.updateTimer(this.displayedTime);
            };

            this.player.update(this.deltaTime);

            this.ghosts.update(this.deltaTime);

            this.ghosts.checkCollisionWithPlayer();
        }

        if (!this.currentMenu) this.checkGameState();

        // Continue the game loop
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    checkGameState() {
        if (this.score >= this.maxScore /*100*/ ) {
            if (this.level === 3) {
                this.victory = true;
                console.log('victory');
                this.ui.showMenu('victory');
                return
            }
            this.initNextLvl();

        } else if (this.timeRemaining <= 0 || this.lives === 0) {
            this.gameOver = true;
            console.log('defeat');
            this.ui.showMenu('defeat');
        } else if (this.dead) {
            this.ui.showMenu('continue');
            console.log('life -1');
        }
    }

    resetPosition() {
        this.player.reset();
        this.ghosts.reset();
    }

    initNextLvl() {
        this.nextLvl = true;
        console.log('next level +');
        this.level++
        this.totalScore += this.score;
        this.ui.showMenu('next');
        this.score = 0;
        this.timeRemaining = 120 - 5 - (this.level * 5); // logic for time
        this.setSpeeds(100, 80 + (this.level * 5)); // change speed by levels

        // init new level
        this.gameBoard.createBoard();
        this.player = new Player(this);
        this.ghosts = new Ghosts(this);
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateTimer(this.timeRemaining);
    }

    resetGame() {
        this.cancelGameLoop()
        this.victory = false;
        this.gameOver = false;
        this.dead = false;
        this.nextLvl = false;
        this.pause = false;
        this.inGame = false;
        this.totalScore = 0;
        this.level = 1;
        this.score = 0;
        this.lives = 5;
        this.timeRemaining = 120;
        console.log('game restarted')
        this.init();
    }

    pixelsToGrid(pixels) {
        return Math.round(pixels / this.cellSize);
    }

    gridToPixels(grid) {
        return grid * this.cellSize;
    }

    setSpeeds(pacmanSpeed, ghostSpeed) {
        this.pacmanSpeed = pacmanSpeed;
        this.ghostSpeed = ghostSpeed;
    }
}