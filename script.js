const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let score = 0;
let level = 1;
let speed = 100;
let direction = { x: gridSize, y: 0 }; // Initial direction (right)

// Title and score position
const titlePosition = { x: 10, y: 10 };
const scorePosition = { x: 10, y: 40 };

// Game loop
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

// Update game state
function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.fillText(`Score: ${score}`, scorePosition.x, scorePosition.y);

    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Snake Game', titlePosition.x, titlePosition.y);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    } else {
        snake.pop();
    }
}

// Handle arrow key presses
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== gridSize) {
                direction = { x: 0, y: -gridSize };
            }
            break;
        case 'ArrowDown':
            if (direction.y !== -gridSize) {
                direction = { x: 0, y: gridSize };
            }
            break;
        case 'ArrowLeft':
            if (direction.x !== gridSize) {
                direction = { x: -gridSize, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x !== -gridSize) {
                direction = { x: gridSize, y: 0 };
            }
            break;
    }
});

// Generate random position for food
function getRandomFoodPosition(max) {
    return gridSize * Math.floor(Math.random() * (max / gridSize));
}

// Generate new food position
function generateFood() {
    food = {
        x: getRandomFoodPosition(canvasWidth - gridSize),
        y: getRandomFoodPosition(canvasHeight - gridSize)
    };
}

// Handle eating food
function eatFood() {
    score++;
    generateFood();
}

// Check collisions
function checkCollision() {
    // Check collision with walls
    if (snake[0].x >= canvasWidth || snake[0].x < 0 || snake[0].y >= canvasHeight || snake[0].y < 0) {
        return true;
    }

    // Check collision with itself (excluding the head)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Check collision with title and score
    const titleRect = {
        x: titlePosition.x,
        y: titlePosition.y - 24, // Adjust for font height
        width: ctx.measureText('Snake Game').width,
        height: 24
    };
    const scoreRect = {
        x: scorePosition.x,
        y: scorePosition.y - 18, // Adjust for font height
        width: ctx.measureText(`Score: ${score}`).width,
        height: 18
    };

    const snakeHeadRect = {
        x: snake[0].x,
        y: snake[0].y,
        width: gridSize,
        height: gridSize
    };

    if (rectIntersect(snakeHeadRect, titleRect) || rectIntersect(snakeHeadRect, scoreRect)) {
        return true;
    }

    return false;
}

// Rectangle intersection check
function rectIntersect(r1, r2) {
    return !(r2.x > (r1.x + r1.width) ||
             (r2.x + r2.width) < r1.x ||
             r2.y > (r1.y + r1.height) ||
             (r2.y + r2.height) < r1.y);
}

// Game over
function gameOver() {
    alert('Game Over! Your score was ' + score);
    resetGame();
}

// Reset game state
function resetGame() {
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    speed = 100;
    level = 1;
    generateFood();
}

// Start the game loop
gameLoop();
