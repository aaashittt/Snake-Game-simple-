// Define constants and variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Adjust this based on your game's grid size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreTitleHeight = 50; // Height of score and title area

const snakeBoundary = {
    minX: 0,
    minY: scoreTitleHeight,
    maxX: canvas.width - gridSize,
    maxY: canvas.height - gridSize
};

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
];

let food = {
    x: getRandomFoodPosition(canvas.width),
    y: getRandomFoodPosition(canvas.height)
};

let direction = { x: gridSize, y: 0 };
let score = 0;
let speed = 100;
let level = 1;
let maze = generateMaze(level); // Generate initial maze for level 1

const eatSound = new Audio('eat.mp3'); // Example audio for eating food
const backgroundMusic = new Audio('background.mp3'); // Example background music

backgroundMusic.loop = true; // Loop the background music
backgroundMusic.play();

// Game loop
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

// Update game state
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check if snake hits the boundary or maze walls
    if (head.x < snakeBoundary.minX || head.x >= snakeBoundary.maxX ||
        head.y < snakeBoundary.minY || head.y >= snakeBoundary.maxY ||
        isSnakeCollidingWithMaze(head)) {
        resetGame();
        return;
    }

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.play();
        if (score % 5 === 0) { // Increase level every 5 points
            level++;
            speed = Math.max(50, speed - 10); // Increase speed
            maze = generateMaze(level); // Generate new maze for the next level
        }
        generateFood();
    } else {
        snake.pop(); // Remove the tail segment
    }

    snake.unshift(head); // Add new head segment
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls (purple)
    ctx.fillStyle = 'purple';
    maze.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, gridSize, gridSize);
    });

    // Draw food (red)
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw snake (green)
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Display score and level
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 60);
}

// Reset the game state
function resetGame() {
    snake = [
        { x: gridSize * 5, y: gridSize * 5 },
        { x: gridSize * 4, y: gridSize * 5 },
        { x: gridSize * 3, y: gridSize * 5 }
    ];
    direction = { x: gridSize, y: 0 };
    score = 0;
    level = 1;
    speed = 100;
    maze = generateMaze(level); // Reset maze for level 1
    backgroundMusic.play();
}

// Check if snake collides with maze walls
function isSnakeCollidingWithMaze(position) {
    return maze.some(wall => wall.x === position.x && wall.y === position.y);
}

// Generate random position for food
function getRandomFoodPosition(max) {
    return gridSize * Math.floor(Math.random() * (max / gridSize));
}

// Generate maze based on level
function generateMaze(level) {
    let maze = [];

    // Simple maze generation for demonstration (customize as needed)
    if (level === 1) {
        maze = [
            { x: gridSize * 2, y: gridSize * 2 },
            { x: gridSize * 2, y: gridSize * 3 },
            { x: gridSize * 2, y: gridSize * 4 },
            { x: gridSize * 2, y: gridSize * 5 },
            { x: gridSize * 2, y: gridSize * 6 },
            { x: gridSize * 2, y: gridSize * 7 },
            { x: gridSize * 2, y: gridSize * 8 },
            { x: gridSize * 2, y: gridSize * 9 },
            { x: gridSize * 2, y: gridSize * 10 }
            // Add more coordinates as per your level 1 maze
        ];
    } else if (level === 2) {
        maze = [
            { x: gridSize * 2, y: gridSize * 2 },
            { x: gridSize * 2, y: gridSize * 3 },
            { x: gridSize * 2, y: gridSize * 4 },
            { x: gridSize * 2, y: gridSize * 5 },
            { x: gridSize * 2, y: gridSize * 6 },
            { x: gridSize * 2, y: gridSize * 7 },
            { x: gridSize * 2, y: gridSize * 8 },
            { x: gridSize * 2, y: gridSize * 9 },
            { x: gridSize * 2, y: gridSize * 10 }
            // Add more coordinates as per your level 2 maze
        ];
    }
    // Add more levels as needed

    return maze;
}

// Handle arrow key controls
document.addEventListener('keydown', e => {
    e.preventDefault(); // Prevent default arrow key behavior
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

// Handle touch controls for mobile devices
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

// Handle touch movement
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

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snakeBoundary.maxX = canvas.width - gridSize;
    snakeBoundary.maxY = canvas.height - gridSize;
    draw(); // Redraw the game elements on resize
});

// Start the game loop
gameLoop();
