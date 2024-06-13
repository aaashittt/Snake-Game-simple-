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

// Instruction message
const instructionMessage = 'How to play:\n\n' +
                           'On computers: Use arrow keys to move the snake.\n\n' +
                           'On mobile phones: Swipe on the screen in the direction you want the snake to move.\n\n' +
                           'Eat the red squares to grow and score points. Avoid running into the walls or yourself!';

// Disable touch scrolling
document.body.addEventListener('touchstart', e => {
    e.preventDefault();
});

document.body.addEventListener('touchmove', e => {
    e.preventDefault();
});

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

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Snake Game', titlePosition.x, titlePosition.y);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.fillText(`Score: ${score}`, scorePosition.x, scorePosition.y);

    // Draw instruction message
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(instructionMessage, canvasWidth / 2, canvasHeight / 2);
    ctx.textAlign = 'left'; // Reset text alignment
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

// Handle arrow key presses and swipe gestures
document.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

function handleKeyDown(e) {
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
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction.x !== -gridSize) {
            direction = { x: gridSize, y: 0 };
        } else if (deltaX < 0 && direction.x !== gridSize) {
            direction = { x: -gridSize, y: 0 };
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && direction.y !== -gridSize) {
            direction = { x: 0, y: gridSize };
        } else if (deltaY < 0 && direction.y !== gridSize) {
            direction = { x: 0, y: -gridSize };
        }
    }

    // Reset touch start coordinates
    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

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
    const titleWidth = ctx.measureText('Snake Game').width;
    const titleHeight = 24; // Adjust according to font size
    const scoreWidth = ctx.measureText(`Score: ${score}`).width;
    const scoreHeight = 18; // Adjust according to font size

    if (snake[0].x >= titlePosition.x && snake[0].x <= titlePosition.x + titleWidth &&
        snake[0].y >= titlePosition.y - titleHeight && snake[0].y <= titlePosition.y) {
        return true;
    }

    if (snake[0].x >= scorePosition.x && snake[0].x <= scorePosition.x + scoreWidth &&
        snake[0].y >= scorePosition.y - scoreHeight && snake[0].y <= scorePosition.y) {
        return true;
    }

    return false;
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
