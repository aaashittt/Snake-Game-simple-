const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const boundaryPadding = 2 * gridSize; // Padding to ensure food appears within visible area

const scoreTitleHeight = 50; // Height of score and title area
const scorePadding = 10; // Padding for score text

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
];

let food = {
    x: getRandomFoodPosition(canvas.width - boundaryPadding),
    y: getRandomFoodPosition(canvas.height - boundaryPadding - scoreTitleHeight)
};

let direction = { x: gridSize, y: 0 };
let score = 0;
let speed = 100;
let level = 1;
let obstacles = generateObstacles(level);

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const backgroundMusic = document.getElementById('backgroundMusic');

backgroundMusic.play();

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around horizontally
    if (head.x >= canvas.width) {
        head.x = 0;
    } else if (head.x < 0) {
        head.x = canvas.width - gridSize;
    }
    
    // Vertical wrapping logic
    if (head.y >= canvas.height - scoreTitleHeight) {
        head.y = 0; // Wrap from bottom to top
    } else if (head.y < 0) {
        head.y = canvas.height - scoreTitleHeight - gridSize; // Wrap from top to bottom
    }

    // Check collision with obstacles or itself
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
        gameOver();
        return;
    }

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        speed = Math.max(50, speed - 5); // Increase speed
        eatSound.play();
        generateFood();
    } else {
        snake.pop(); // Remove the tail segment
    }

    snake.unshift(head); // Add new head segment
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    ctx.fillStyle = 'brown';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, gridSize, gridSize);
    });

    // Display score in top right corner
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - scorePadding, scoreTitleHeight - scorePadding);

    // Display level in top left corner
    ctx.textAlign = 'left';
    ctx.fillText(`Level: ${level}`, scorePadding, scoreTitleHeight - scorePadding);
}

function resetGame() {
    snake = [
        { x: gridSize * 5, y: gridSize * 5 },
        { x: gridSize * 4, y: gridSize * 5 },
        { x: gridSize * 3, y: gridSize * 5 }
    ];
    direction = { x: gridSize, y: 0 };
    score = 0;
    speed = 100;
    level = 1;
    obstacles = generateObstacles(level);
    backgroundMusic.play();
}

function gameOver() {
    gameOverSound.play();
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

// Prevent default arrow key behavior
document.addEventListener('keydown', e => {
    e.preventDefault(); // Prevents default browser behavior for arrow keys
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', e => {
    e.preventDefault(); // Prevent scrolling
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault(); // Prevent scrolling
});

canvas.addEventListener('touchend', e => {
    e.preventDefault(); // Prevent scrolling
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleTouch();
});

function handleTouch() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && direction.x === 0) {
            direction = { x: gridSize, y: 0 }; // Swipe right
        } else if (diffX < 0 && direction.x === 0) {
            direction = { x: -gridSize, y: 0 }; // Swipe left
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && direction.y === 0) {
            direction = { x: 0, y: gridSize }; // Swipe down
        } else if (diffY < 0 && direction.y === 0) {
            direction = { x: 0, y: -gridSize }; // Swipe up
        }
    }
}

// Generate random position for food
function getRandomFoodPosition(max) {
    return gridSize * Math.floor(Math.random() * (max / gridSize));
}

// Generate obstacles based on level
function generateObstacles(level) {
    const obstacles = [];
    const numObstacles = level * 2; // Increase number of obstacles with level
    
    for (let i = 0; i < numObstacles; i++) {
        obstacles.push({
            x: getRandomFoodPosition(canvas.width - boundaryPadding),
            y: getRandomFoodPosition(canvas.height - boundaryPadding - scoreTitleHeight)
        });
    }
    
    return obstacles;
}

// Ensure food doesn't appear on snake or obstacles
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: getRandomFoodPosition(canvas.width - boundaryPadding),
            y: getRandomFoodPosition(canvas.height - boundaryPadding - scoreTitleHeight)
        };
    } while (isFoodOnSnake(newFood) || isFoodOnObstacle(newFood));

    food = newFood;
}

function isFoodOnSnake(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

function isFoodOnObstacle(pos) {
    return obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
}

// Display the instructions
function showInstructions() {
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.style.position = 'fixed';
    instructions.style.top = '10px';
    instructions.style.left = '50%';
    instructions.style.transform = 'translateX(-50%)';
    instructions.style.padding = '10px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    instructions.style.color = 'white';
    instructions.style.fontSize = '18px';
    instructions.style.borderRadius = '5px';
    instructions.style.textAlign = 'center';
    instructions.style.zIndex = '1000';
    instructions.innerHTML = `
        <p>Use arrow keys or swipe to move the snake</p>
        <p>In this world, everybody is a winner. Enjoy!</p>
    `;
    document.body.appendChild(instructions);

    // Remove the instructions after 5 seconds
    setTimeout(() => {
        instructions.style.transition = 'opacity 1s';
        instructions.style.opacity = '0';
        setTimeout(() => instructions.remove(), 1000);
    }, 5000);
}

showInstructions();
gameLoop();
