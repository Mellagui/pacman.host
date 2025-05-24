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

    setupEventListeners() {

        document.getElementById('reset').addEventListener('click', () => this.game.resetGame());

        document.getElementById('continue').addEventListener('click', () => {
            // start
            this.game.inGame = true;
            // next
            this.game.nextLvl = false;
            // pause
            this.game.pause = false;
            // dead
            this.game.dead = false;

            this.game.ui.hideMenu();
        });

        document.addEventListener('keydown', e => {
            if ((e.key === ' ' || e.key === 'p') && this.game.inGame && !this.game.victory && !this.game.gameOver && !this.game.pause) {
                this.game.pause = true;
                console.log('game paused')
                this.game.ui.showMenu('pause');
                return
            }

            if (!this.game.currentMenu && this.directions[e.key]) this.game.player.nextDirection = this.directions[e.key];
        });
    }
}