let targetScore = Math.floor(Math.random() * 20) + 30; // Random target between 50 and 80
let currentScore = 0;
let ballsLeft = 24;
let wicketsLeft = 3;
let runsRequired = targetScore;
let singlesCount = 0, doublesCount = 0;

let runProbabilities = { 1: 100, 2: 100, 4: 60, 6: 40 };

document.getElementById("target-score").textContent = targetScore;
document.getElementById("runs-required").textContent = runsRequired;
document.getElementById("balls-left").textContent = ballsLeft;
document.getElementById("wickets-left").textContent = wicketsLeft;

const batsmen = [
    { name: "Kohli", skill:"Run-Machine" },
    { name: "Rohit", skill: "Hitman" },
    { name: "Dhoni", skill: "Mastermind" }
];

let selectedBatsman = null;

function displayBatsmanOptions() {
    const batsmanList = document.getElementById("batsman-options");
    batsmanList.innerHTML = ""; 

    batsmen.forEach((batsman, index) => {
    let btn = document.createElement("button");
    btn.textContent = `${batsman.name} (${batsman.skill})`;
    btn.classList.add("batsman-button"); // ✅ Apply the CSS class
    btn.onclick = function() { selectBatsman(index); };
    batsmanList.appendChild(btn);
});
}

function selectBatsman(index) {
    selectedBatsman = batsmen[index];
    document.getElementById("batsman-selection").style.display = "none"; 
    document.getElementById("game-container").style.display = "block";
    initializeGame();
}
function adjustForBatsmanSkill() {
    if (selectedBatsman.skill === "High") {
        runProbabilities = { 1: 100, 2: 100, 4: 70, 6: 50 };
    } else if (selectedBatsman.skill === "Medium") {
        runProbabilities = { 1: 100, 2: 100, 4: 60, 6: 40 };
    } else {
        runProbabilities = { 1: 100, 2: 100, 4: 50, 6: 30 };
    }
}


function initializeGame() {
    document.getElementById("score").textContent = "0/0";  
    document.getElementById("runs-required").textContent = runsRequired;
    document.getElementById("commentary").textContent = `You selected ${selectedBatsman.name}. Let's play! 🏏`;
    updateScoreboard();
}

function playShot(run) {
    if (ballsLeft === 0 || wicketsLeft === 0) return;

    ballsLeft--;
    let successRate = runProbabilities[run];

    if (Math.random() * 100 <= successRate) {
        currentScore += run;
        runsRequired -= run;
        adjustProbabilities(run);
        updateCommentary(run);
    } else {
        wicketsLeft--;
        updateWicketCommentary();
    }

    updateScoreboard();
    updateRunProbabilities();

    if (runsRequired <= 0) {
        document.getElementById("game-container").style.display = "none";
        document.getElementById("win-message").style.display = "block";
    } else if (wicketsLeft === 0 || ballsLeft === 0) {
        document.getElementById("game-container").style.display = "none";
        document.getElementById("lose-message").style.display = "block";
    }
}

let lastShotWasBoundary = false; // Track if the last shot was a boundary
// 🏏 **Advanced Probability Management System**
function adjustProbabilities(run) {
    // **Dynamic Increase Rate for Boundaries (More growth when low)**
    function getIncreaseRate(prob) {
        if (prob < 30) return 7;  // Fast increase at low probability
        if (prob > 85) return 2;  // Slow increase at high probability
        return 4;  // Normal increase
    }

    if (run === 1) {
        singlesCount++;
        runProbabilities[1] = Math.max(30, runProbabilities[1] - 3); // Decrease 1s
        runProbabilities[2] = Math.min(100, runProbabilities[2] + 3); // Increase 2s
        runProbabilities[4] = Math.min(90, runProbabilities[4] + getIncreaseRate(runProbabilities[4]));
        runProbabilities[6] = Math.min(75, runProbabilities[6] + getIncreaseRate(runProbabilities[6]));
    }

    if (run === 2) {
        doublesCount++;
        runProbabilities[2] = Math.max(30, runProbabilities[2] - 3); // Decrease 2s
        runProbabilities[1] = Math.min(100, runProbabilities[1] + 3); // Increase 1s
        runProbabilities[4] = Math.min(90, runProbabilities[4] + getIncreaseRate(runProbabilities[4]));
        runProbabilities[6] = Math.min(75, runProbabilities[6] + getIncreaseRate(runProbabilities[6]));
    }

    // **Handling Boundaries (4 & 6)**
    if (run === 4 || run === 6) {
        runProbabilities[run] = Math.max(10, runProbabilities[run] - 20); // Always decrease when hit

        // **Consecutive Boundary Penalty**
        if (lastShotWasBoundary) {
            runProbabilities[run] = Math.max(5, runProbabilities[run] - 30);
        }

        lastShotWasBoundary = true;
    } else {
        lastShotWasBoundary = false;
    }

    // **🏏 Momentum Bonus - If 6 balls pass without a wicket, increase boundary chances slightly**
    if (ballsLeft % 6 === 0 && wicketsLeft > 0) {
        runProbabilities[4] = Math.min(90, runProbabilities[4] + 6);
        runProbabilities[6] = Math.min(75, runProbabilities[6] + 4);
    }

    // **📉 Pressure Mechanic - Closer to Target? Boundaries Harder**
    if (runsRequired < 10) {
        runProbabilities[4] = Math.max(25, runProbabilities[4] - 6);
        runProbabilities[6] = Math.max(10, runProbabilities[6] - 12);
    }

    updateRunProbabilities();
}

// **⚠ Wicket Handling - Pressure System**
function handleWicket() {
    wicketsLeft--;

    // **🏏 Wicket Drop - Boundaries Become Tougher**
    runProbabilities[4] = Math.max(10, runProbabilities[4] - 35);
    runProbabilities[6] = Math.max(5, runProbabilities[6] - 45);

    // **🏏 Recovery Bonus - If You Last 6 Balls After a Wicket, Some Probability Returns**
    setTimeout(() => {
        if (ballsLeft % 6 === 0 && wicketsLeft > 0) {
            runProbabilities[4] = Math.min(70, runProbabilities[4] + 12);
            runProbabilities[6] = Math.min(50, runProbabilities[6] + 10);
        }
        updateRunProbabilities();
    }, 3000); // 3-second delay to mimic in-game time

    updateWicketCommentary();
    updateRunProbabilities();
}



function updateScoreboard() {
    document.getElementById("score").textContent = `${currentScore}/${3 - wicketsLeft}`;
    document.getElementById("runs-required").textContent = runsRequired;
    document.getElementById("balls-left").textContent = ballsLeft;
    document.getElementById("wickets-left").textContent = wicketsLeft;

    let ballsFaced = 24 - ballsLeft;
let oversFaced = ballsFaced / 6;
let currentRR = (currentScore / oversFaced).toFixed(2);
    let requiredRR = ((runsRequired / ballsLeft) * 6).toFixed(2);

    document.getElementById("current-run-rate").textContent = isNaN(currentRR) ? "0.00" : currentRR;
    document.getElementById("required-run-rate").textContent = requiredRR;
}

function updateRunProbabilities() {
    document.getElementById("prob-1").textContent = runProbabilities[1] + "%";
    document.getElementById("prob-2").textContent = runProbabilities[2] + "%";
    document.getElementById("prob-4").textContent = runProbabilities[4] + "%";
    document.getElementById("prob-6").textContent = runProbabilities[6] + "%";
}

function updateCommentary(run) {
    let comments = {
        1: ["Good single! 🏃", "Rotating the strike! 🔄", "Smart batting! 🎯"],
        2: ["Well-judged two! ✅", "Great running! 🏃💨", "Keeping the scoreboard ticking! ⏳"],
        4: ["Glorious FOUR! ✨", "Smashes it to the boundary! 🏏🔥", "Cracking shot! 💥"],
        6: ["MASSIVE SIX! 💣", "Out of the park! 🚀", "That’s HUGE! 🎇"]
    };

   let randomComment = comments[run][Math.floor(Math.random() * comments[run].length)];
    document.getElementById("commentary").textContent = randomComment;

    let scoreboard = document.querySelector(".scoreboard");

    if (run === 4 || run === 6) {
        scoreboard.classList.add("boundary-effect");
        setTimeout(() => {
            scoreboard.classList.remove("boundary-effect");
        }, 1000); // Effect lasts for 0.5s
    }
}
function updateWicketCommentary() {
    let wicketComments = [
        "Oh no! He's OUT! 😞",
        "Bowled him! Timber! 🏏💥",
        "Caught behind! Big wicket! 🎯",
        "Edge... and taken! What a catch! 🏆",
        "LBW! The umpire raises the finger! ☝️",
        "Run out! A disaster! 🚨",
        "Huge appeal... and given! ❌"
    ];

    let randomComment = wicketComments[Math.floor(Math.random() * wicketComments.length)];
    document.getElementById("commentary").textContent = randomComment;

    let scoreboard = document.querySelector(".scoreboard");
    scoreboard.classList.add("wicket-effect");

    // Reduce boundary probabilities drastically
    runProbabilities[4] = Math.max(10, runProbabilities[4] - 35);
    runProbabilities[6] = Math.max(5, runProbabilities[6] - 35);

    // Reset single and double counts so 4s and 6s don't regain probability from past progress
    singlesCount = 0;
    doublesCount = 0;

    updateRunProbabilities();
        setTimeout(() => {
        scoreboard.classList.remove("wicket-effect");
    }, 1000);
}

function restartGame() {
    location.reload();
}



displayBatsmanOptions();
