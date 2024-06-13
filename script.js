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
        resetGame();
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Snake Game', canvasWidth / 2, 30);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvasWidth - 20, 30);

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

    return false;
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




