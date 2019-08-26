const colWidth = 101;
const rowHeight = 83;
let gameOver = false;

class Enemy {	
	constructor(x, row, speed) {
		this.x = x;
		this.row = row;
		this.sprite = 'images/enemy-bug.png';
		this.collision = false;
		this.speed = speed;
	}

	// Update method updates the enemy's position and handles collision 
	update(dt) {
		// multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		if(!this.collision) {
			this.x += this.speed * dt;

			if(this.x > 5 * colWidth) {
				this.x = -1 * colWidth;
				this.speed = 100 + (Math.random() * 300);
			}

			checkCollision(this);
		}
	}

	// Draw the enemy on the screen, required method for game
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, (this.row * rowHeight) - 20);
	}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
	constructor(sprite = 'images/char-boy.png') {
		this.col = 2;
		this.row = 5;
		this.rowHeight = 83;
		this.colWidth = 101;
		this.sprite = sprite;
		this.collision = false;
		this.score = 0;
		this.lives = 5;
		this.reset();
	}

	//when the player reaches the water it returns to its inital position
	update() {
		if(this.row === 0) {
			this.score++;
			setTimeout(() => this.resetPosition(), 1400);
		}
	}
	
	reset() {
		this.curLives = this.lives;
		this.score = 0;
		this.resetPosition();
	}
	
	resetPosition() {
		this.col = 2;
		this.row = 5;
		this.collision = false;
	}
	
	render() {
		this.renderLivesAndScore();
		ctx.drawImage(Resources.get(this.sprite), this.col * colWidth, this.row * rowHeight - 10);
		ctx.font = '30px Charcoal, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#566ED7';
	}
	
	renderLivesAndScore() {
		ctx.font = '20px Charcoal';
		ctx.textAlign = 'left';
		ctx.fillStyle = 'white';
		ctx.fillText('Lives: ' + this.curLives, 10, (7 * this.rowHeight));
		ctx.textAlign = 'right';
		ctx.fillText('Score: ' + this.score, (5 * this.colWidth ) - 10, (7 * this.rowHeight));
	}

	handleInput(key) {
		if(!this.collision) {
			if(key === 'left' && this.col > 0) {
				this.col --;
			} else if (key === 'right' && this.col < 4) {
				this.col ++;
			} else if (key === 'down' && this.row < 5) {
				this.row ++;
			} else if (key === 'up' && this.row > 0) {
				this.row --;
			}
		}
	}
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

const player = new Player('images/char-pink-girl.png');
const allEnemies = [
	new Enemy(-1 * colWidth, 1, 280),
	new Enemy(-2 * colWidth, 2, 130),
	new Enemy(-3 * colWidth, 3, 310)
];

//handling collision
function checkCollision(enemy) {
	if(enemy.row === player.row && Math.abs(player.col * colWidth - enemy.x) <= 82) {
		enemy.collision = true;
		player.collision = true;
		setTimeout(resetCollision, 1300);
	}
}

function resetCollision() {
	player.resetPosition();
	player.curLives--;
	allEnemies.forEach(enemy => enemy.collision = false);
}