const ball = document.querySelector('.ball');
const goalkeeper = document.querySelector('.goalkeeper');
const circles = document.querySelectorAll('.circle');
const gameContainer = document.querySelector('.game-container');

let ballDirection = 1;
let ballSpeed = 1.5;
let ballMoving = true;
let currentTry = 0;
let score = 0;
let goalkeeperPos = 50; // Goalkeeper's starting position
let goalkeeperSpeed = 4.5; // Movement speed
let goalkeeperDirection = 1; // 1 = right, -1 = left
let gameOver = false;

// Goal and Keeper dimensions (based on CSS)
const goalWidth = 500; // Max width of the goal
const goalkeeperWidth = 230;
const ballWidth = 50;

// Convert percentage positions to pixels
const percentToPixels = (percent, total) => (percent / 100) * total;

// Move ball left-right continuously
function moveBall() {
    if (!ballMoving || gameOver) return;
    
    let ballPos = parseFloat(ball.style.left || '50%');
    ballPos += ballDirection * ballSpeed;

    if (ballPos > 80 || ballPos < 10) {
        ballDirection *= -1; // Change direction at boundaries
    }

    ball.style.left = ballPos + '%';
    requestAnimationFrame(moveBall);
}

// Move goalkeeper smoothly across the entire goal width
function moveGoalkeeper() {
    const maxLeft = (goalWidth - goalkeeperWidth) / 2;
    const minLeft = -maxLeft;

    goalkeeperPos += goalkeeperDirection * goalkeeperSpeed;

    if (goalkeeperPos > maxLeft || goalkeeperPos < minLeft) {
        goalkeeperDirection *= -1; // Reverse direction
    }

    goalkeeper.style.transform = `translateX(${goalkeeperPos}px)`;
}

setInterval(moveGoalkeeper, 20); // Move goalkeeper continuously
moveBall(); // Start ball movement

// Shoot ball on Spacebar press
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && currentTry < 5 && !gameOver) {
        shootBall();
    }
});

// Shoot ball function
function shootBall() {
    ballMoving = false;
    ball.style.transition = 'bottom 0.5s';
    ball.style.bottom = '250px';

    setTimeout(() => {
        checkGoal();
        ball.style.transition = 'none';
        ball.style.bottom = '20px';

        if (currentTry < 5) {
            ballMoving = true;
            moveBall(); // Resume ball movement
        } else {
            endGame();
        }
    }, 500);
}

function checkGoal() {
    let goalRect = document.querySelector('.goal-area').getBoundingClientRect();
    let ballRect = ball.getBoundingClientRect();
    let keeperRect = goalkeeper.getBoundingClientRect();

    // Ball's left & right edges
    let ballLeft = ballRect.left;
    let ballRight = ballRect.right;
 
    // Goalkeeper's left & right edges
    let keeperLeft = keeperRect.left;
    let keeperRight = keeperRect.right;

    // Check if ball overlaps with goalkeeper
    if (ballRight >= keeperLeft && ballLeft <= keeperRight) {
        circles[currentTry].style.background = 'red'; // Save
    } else {
        circles[currentTry].style.background = 'green'; // Goal
        score++;
    }

    currentTry++;
}



function endGame() {
    gameOver = true;
    ball.style.display = 'none';
    goalkeeper.style.display = 'none';

    // Create a wrapper to properly align elements
    const endGameWrapper = document.createElement('div');
    endGameWrapper.style.display = 'flex';
    endGameWrapper.style.flexDirection = 'column';
    endGameWrapper.style.alignItems = 'center';
    endGameWrapper.style.marginTop = '20px';

    // Score message
    const message = document.createElement('h2');
    message.innerText = `Game Over! Your Score: ${score}/5`;
    message.style.marginBottom = '10px';

    // Play Again button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = 'Play Again';
    playAgainBtn.style.padding = '12px 24px';
    playAgainBtn.style.fontSize = '18px';
    playAgainBtn.style.fontWeight = 'bold';
    playAgainBtn.style.cursor = 'pointer';
    playAgainBtn.style.border = 'none';
    playAgainBtn.style.background = '#28a745';
    playAgainBtn.style.color = '#fff';
    playAgainBtn.style.borderRadius = '5px';
    playAgainBtn.style.width = 'auto'; // Ensures button resizes properly
    playAgainBtn.style.minWidth = '150px'; // Prevents it from being too small

    // Append elements to the wrapper
    endGameWrapper.appendChild(message);
    endGameWrapper.appendChild(playAgainBtn);

    // Append wrapper to the game container
    gameContainer.appendChild(endGameWrapper);

    playAgainBtn.addEventListener('click', () => {
        location.reload();
    });
}
