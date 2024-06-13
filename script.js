
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
];

let food = {
    x: gridSize * Math.floor(Math.random() * (canvas.width / gridSize)),
    y: gridSize * Math.floor(Math.random() * (canvas.height / gridSize))
};

let direction = { x: gridSize, y: 0 };
let score = 0;
let speed = 100;
let obstacles = [
    { x: gridSize * 10, y: gridSize * 10 },
    { x: gridSize * 15, y: gridSize * 15 }
];

const eatSound = document.getElementById('eatSound');
const backgroundMusic = document.getElementById('backgroundMusic');

backgroundMusic.play();

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around edges with full disappearance
    if (head.x >= canvas.width) {
        head.x = 0;
    } else if (head.x < 0) {
        head.x = canvas.width - gridSize;
    }
    
    if (head.y >= canvas.height) {
        head.y = 0;
    } else if (head.y < 0) {
        head.y = canvas.height - gridSize;
    }

    // Check collision with obstacles or itself
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
        resetGame();
    }

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        speed = Math.max(50, speed - 5); // Increase speed
        eatSound.play();
        food = {
            x: gridSize * Math.floor(Math.random() * (canvas.width / gridSize)),
            y: gridSize * Math.floor(Math.random() * (canvas.height / gridSize))
        };
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

    // Increase score size
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
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
    backgroundMusic.play();
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

gameLoop();
