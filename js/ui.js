export class UI {
    constructor(game) {
        this.game = game;
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('timer');
        this.liveElements = document.querySelectorAll('.bxs-game');

        this.overLayer = document.getElementById('overLayer');
        this.popUp = document.getElementById('popUp');

        this.title = document.getElementById('menu-title');
        this.subTitle = document.getElementById('sub-title');
        this.playBtn = document.getElementById('continue');
        this.resetBtn = document.getElementById('reset');
    }

    updateScore(score) {
        this.scoreElement.textContent = score < 10? '0000': score < 100? '00' + score: score < 1000? '0' + score: score;
    }

    updateLives(lives) {
        if (lives === 5) return this.liveElements.forEach(live => live.style.color = '#FFEE58');
        this.liveElements[lives].style.color = '#111';
    }

    updateTimer(time) {
        if (this.timeElement.textContent != time) this.timeElement.textContent = time;
    }

    startMenu() {
        this.title.innerHTML = 'start game';
        this.subTitle.innerHTML = '';
        this.playBtn.style.display = 'block';
        this.resetBtn.style.display = 'none';
    }
    nextMenu() {
        this.title.innerHTML = 'next lvl+';
        this.subTitle.innerHTML = `level ${this.game.level}`;
        this.playBtn.style.display = 'block';
        this.resetBtn.style.display = 'none';
    }
    endMenu(content) {
        this.title.innerHTML = content;
        this.subTitle.innerHTML = `your score : ${this.game.totalScore + this.game.score}`;
        this.playBtn.style.display = 'none';
        this.resetBtn.style.display = 'block';
    }
    pauseMenu(content) {
        this.title.innerHTML = content;
        this.subTitle.innerHTML = '';
        this.playBtn.style.display = 'block';
        this.resetBtn.style.display = 'block';
    }

    showMenu(content) {
        this.game.currentMenu = true;
        this.game.player.animator.stop(); // stop when idle

        if (content == 'start') this.startMenu()
        else if (content == 'next') this.nextMenu()
        else if (content == 'pause') this.pauseMenu(content)
        else if (content == 'continue') this.pauseMenu(content)
        else this.endMenu(content)

        this.overLayer.style.display = 'block';
        this.popUp.style.display = 'block';
    }
    
    hideMenu() {
        this.game.currentMenu = false;
        this.overLayer.style.display = 'none';
        this.popUp.style.display = 'none';
    }
}