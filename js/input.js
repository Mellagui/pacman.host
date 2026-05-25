export class InputHandler {
    constructor(game) {
        this.game = game;
        this.directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        this.setupEventListeners();
    }

    // Central logic for direction changes
    handleMove(dir) {
        if (!this.game.currentMenu) {
            this.game.player.nextDirection = dir;
        }
    }

    setupEventListeners() {
        // Original Menu Buttons
        document.getElementById('reset').addEventListener('click', () => this.game.resetGame());

        document.getElementById('continue').addEventListener('click', () => {
            this.game.inGame = true;
            this.game.nextLvl = false;
            this.game.pause = false;
            this.game.dead = false;
            this.game.ui.hideMenu();
        });

        // --- NEW MOBILE CONTROL LISTENERS ---
        document.getElementById('btn-up').addEventListener('click', () => this.handleMove('up'));
        document.getElementById('btn-down').addEventListener('click', () => this.handleMove('down'));
        document.getElementById('btn-left').addEventListener('click', () => this.handleMove('left'));
        document.getElementById('btn-right').addEventListener('click', () => this.handleMove('right'));

        document.getElementById('btn-pause').addEventListener('click', () => {
            if (this.game.inGame && !this.game.victory && !this.game.gameOver && !this.game.pause) {
                this.game.pause = true;
                this.game.ui.showMenu('pause');
            } else if (this.game.pause) {
                // If already paused, clicking pause again unpauses (Continue logic)
                this.game.pause = false;
                this.game.ui.hideMenu();
            }
        });

        // Keyboard Listener
        document.addEventListener('keydown', e => {
            if ((e.key === ' ' || e.key === 'p') && this.game.inGame && !this.game.victory && !this.game.gameOver && !this.game.pause) {
                this.game.pause = true;
                this.game.ui.showMenu('pause');
                return;
            }

            if (!this.game.currentMenu && this.directions[e.key]) {
                this.handleMove(this.directions[e.key]);
            }
        });
    }
}