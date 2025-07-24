const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const retryButton = document.getElementById('tryAgain');

const cellSize = 20;
const rowCount = canvas.height / cellSize;
const colCount = canvas.width / cellSize;

let snakeBody, foodPosition, velocityX, velocityY, score, isGameOver, baseSpeed, currentSpeed, gameInterval;
let isFlashActive;

function initializeGame() {
  snakeBody = [{ x: 400, y: 400 }];
  foodPosition = getRandomPosition();
  velocityX = cellSize;
  velocityY = 0;
  score = 0;
  isGameOver = false;
  baseSpeed = 100;
  currentSpeed = baseSpeed;
  isFlashActive = false;

  scoreDisplay.style.color = 'lime';
  scoreDisplay.textContent = 'Score: 0';
  retryButton.style.display = 'none';

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, currentSpeed);
}

initializeGame();

document.addEventListener('keydown', handleKeyDown);
retryButton.addEventListener('click', initializeGame);

function handleKeyDown(event) {
  if (event.key === 'ArrowUp' && velocityY === 0) {
    velocityX = 0;
    velocityY = -cellSize;
  }
  if (event.key === 'ArrowDown' && velocityY === 0) {
    velocityX = 0;
    velocityY = cellSize;
  }
  if (event.key === 'ArrowLeft' && velocityX === 0) {
    velocityX = -cellSize;
    velocityY = 0;
  }
  if (event.key === 'ArrowRight' && velocityX === 0) {
    velocityX = cellSize;
    velocityY = 0;
  }
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * colCount) * cellSize,
    y: Math.floor(Math.random() * rowCount) * cellSize,
  };
}

function wrapPosition(position) {
  return {
    x: (position.x + canvas.width) % canvas.width,
    y: (position.y + canvas.height) % canvas.height,
  };
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (isFlashActive) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    isFlashActive = false;
    return;
  }

  if (isGameOver) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.font = '40px sans-serif';
    context.fillText('Game Over', 300, 400);
    retryButton.style.display = 'inline-block';
    return;
  }

  // draw snake
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillStyle = i === 0 ? 'lime' : 'green';
    context.fillRect(snakeBody[i].x, snakeBody[i].y, cellSize, cellSize);
  }

  // draw food
  context.fillStyle = 'red';
  context.fillRect(foodPosition.x, foodPosition.y, cellSize, cellSize);

  // move snake head
  let nextHead = wrapPosition({ x: snakeBody[0].x + velocityX, y: snakeBody[0].y + velocityY });

  // check collision with self
  if (snakeBody.some(segment => segment.x === nextHead.x && segment.y === nextHead.y)) {
    isGameOver = true;
    scoreDisplay.style.color = 'red';
    return;
  }

  snakeBody.unshift(nextHead);

  // check food eaten
  if (nextHead.x === foodPosition.x && nextHead.y === foodPosition.y) {
    foodPosition = getRandomPosition();
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
    isFlashActive = true;

    // speed up by random 0-60ms
    const speedBonus = Math.floor(Math.random() * 61);
    currentSpeed = Math.max(40, baseSpeed - speedBonus);

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, currentSpeed);
  } else {
    snakeBody.pop();
  }
}
