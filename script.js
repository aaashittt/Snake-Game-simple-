const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const boundaryPadding = 2 * gridSize; // Padding to ensure food appears within visible area

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
];

let food = {
    x: getRandomFoodPosition(canvas.width - boundaryPadding),
    y: getRandomFoodPosition(canvas.height - boundaryPadding)
};

let direction = { x: gridSize, y: 0 };
let score = 0;
let speed = 100;

const eatSound = new Audio('eat.wav'); // Replace with your eat sound file
const gameOverSound = new Audio('gameover.wav'); // Replace with your game over sound file
const backgroundMusic = new Audio('background.mp3'); // Replace with your background music file

backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
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
    
    // Wrap around vertically
    if (head.y >= canvas.height) {
        head.y = 0;
    } else if (head.y < 0) {
        head.y = canvas.height - gridSize;
    }

    // Check collision with itself
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
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

    // Display score in top right corner
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 20);
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
    generateFood();
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

// Generate random position for food
function getRandomFoodPosition(max) {
    return gridSize * Math.floor(Math.random() * (max / gridSize));
}

// Generate new food position
function generateFood() {
    food = {
        x: getRandomFoodPosition(canvas.width - boundaryPadding),
        y: getRandomFoodPosition(canvas.height - boundaryPadding)
    };

    // Ensure food doesn't overlap with snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = getRandomFoodPosition(canvas.width - boundaryPadding);
        food.y = getRandomFoodPosition(canvas.height - boundaryPadding);
    }
}

// Start the game loop
gameLoop();

