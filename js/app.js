class Enemy {	
	constructor(col, row, speed) {
		this.colWidth = 101;
		this.rowHeight = 83;
		this.x = col * this.colWidth;
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
			
			if(this.x > 5 * this.colWidth) {
				this.x = -1 * this.colWidth;
				this.speed = 150 + (Math.random() * 300);
			}
			checkCollision(this);
		}
	}

	// Draw the enemy on the screen, required method for game
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, (this.row * this.rowHeight) - 20);
	}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
	constructor(sprite = 'images/char-boy.png') {
		this.rowHeight = 83;
		this.colWidth = 101;
		this.sprite = sprite;
		this.reset();
	}

	//when the player reaches the water it returns to its inital position
	update() {
		if(this.row === 0) {
			if(!this.isScored) {
				this.isScored = true;
				this.score++;
				setTimeout(() => this.resetPosition(), 1200);
			}
		}
	}
	
	reset() {
		this.resetPosition();
		this.lives = 5;
		this.score = 0;
		this.gameOver = false;
	}
	
	resetPosition() {
		this.col = 2;
		this.row = 5;
		this.collision = false;
		this.isScored = false; // to go back to normal
	}
	
	handleCollision() {
		this.collision = true;
		this.lives--;
		if(this.lives === 0) {
			this.gameOver = true;
		}
	}
	
	render() {
		this.renderLivesAndScore();
		ctx.drawImage(Resources.get(this.sprite), this.col * this.colWidth, this.row * this.rowHeight - 10);
		ctx.font = '27px Impact';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#7ACD5D';
		if(this.gameOver) {
			ctx.fillStyle = 'red';
			this.renderText('You\'re', -31);
			this.renderText('dead!');
			ctx.drawImage(Resources.get('images/bloodStain.png'), this.col * this.colWidth + 4, this.row * this.rowHeight + 25);
		} else if(this.collision) {
			this.renderText('Ouch!');
		} else if(this.row === 0) {
			this.renderText('Hooray!');
		}
	}
	
	renderText(msg, yPos = 0) {
		ctx.fillText(msg, (this.col + 0.5) * this.colWidth, (this.row * this.rowHeight) + 35 + yPos);
	}
	
	renderLivesAndScore() {
		ctx.font = '20px Impact';
		ctx.textAlign = 'left';
		ctx.fillStyle = 'white';
		ctx.fillText('Lives: ' + this.lives, 12, (7 * this.rowHeight) - 8);
		ctx.textAlign = 'right';
		ctx.fillText('Score: ' + this.score, (5 * this.colWidth ) - 12, (7 * this.rowHeight) - 8);
		if(this.gameOver) {
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.font = '22px Impact';
			ctx.fillText('Press ENTER to play again', (2.5 * this.colWidth), (7 * this.rowHeight) -8);
			
		}
	}

	handleInput(key) {
		if(!this.collision && !this.gameOver && this.row !== 0) {
			if(key === 'left' && this.col > 0) {
				this.col --;
			} else if (key === 'right' && this.col < 4) {
				this.col ++;
			} else if (key === 'down' && this.row < 5) {
				this.row ++;
			} else if (key === 'up' && this.row > 0) {
				this.row --;
			}
		} else if(key == 'enter' && this.gameOver) {
			this.reset();
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
		40: 'down',
		13: 'enter'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

const player = new Player('images/char-pink-girl.png');
const allEnemies = [
	new Enemy(-1, 1, 280),
	new Enemy(-2, 2, 130),
	new Enemy(-3, 3, 310)
];

//handling collision
function checkCollision(enemy) {
	//82 = colWidth minus non-transparent parts of images
	if(enemy.row === player.row && Math.abs(player.col * player.colWidth - enemy.x) <= 82) {
		enemy.collision = true;
		player.handleCollision();
		setTimeout(resetCollision, 1400);
	}
}

function resetCollision() {
	player.resetPosition();
	allEnemies.forEach(enemy => enemy.collision = false);
}