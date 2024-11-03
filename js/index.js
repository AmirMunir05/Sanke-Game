document.addEventListener('DOMContentLoaded', () => {
    // Game Constants & Variables
    let inputDir = { x: 0, y: 0 };
    const hiscoreBox = document.getElementById('hiscoreBox');
    const scoreBox = document.getElementById('score');
    const board = document.querySelector('.board');
    let foodSound = new Audio('../assets/music/food.mp3');
    let moveSound = new Audio('../assets/music/move.mp3');
    let gameoverSound = new Audio('../assets/music/gameover.mp3');
    let musicSound = new Audio('../assets/music/music.mp3');
    let score = 0;
    let speed = 10;
    let lastPaintTime = 0;
    let snakeArr = [{ x: 13, y: 15 }];
    let food = { x: 6, y: 3 };

    // Initialize High Score
    let hiscore = localStorage.getItem("hiscore");
    let hiscoreVal = hiscore ? parseInt(hiscore, 10) : 0;
    hiscoreBox.innerHTML = "High Score : " + hiscoreVal;

    // Main Game Loop
    const main = (ctime) => {
        window.requestAnimationFrame(main);
        if ((ctime - lastPaintTime) / 1000 > 1 / speed) {
            lastPaintTime = ctime;
            gameEngine();
        }
    };

    // Check Collision
    const isCollide = (sarr) => {
        for (let i = 1; i < sarr.length; i++) {
            if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) return true;
        }
        return sarr[0].x >= 18 || sarr[0].x < 0 || sarr[0].y >= 18 || sarr[0].y < 0;
    };

    // Game Engine
    const gameEngine = () => {
        if (isCollide(snakeArr)) {
            gameoverSound.play();
            musicSound.pause();
            inputDir = { x: 0, y: 0 };
            alert("Game Over. Press OK to play again!");
            snakeArr = [{ x: 13, y: 15 }];
            score = 0;
            scoreBox.innerHTML = "Score : " + score;
            return;
        }

        // Food eaten
        if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
            foodSound.play();
            score++;
            scoreBox.innerHTML = "Score : " + score;
            updateHighScore(score);
            snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
            food = {
                x: Math.round(2 + (16 - 2) * Math.random()),
                y: Math.round(2 + (16 - 2) * Math.random())
            };
        }

        // Move the snake
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;

        // Display snake and food
        board.innerHTML = "";
        snakeArr.forEach((e, index) => {
            let snakeElement = document.createElement('div');
            snakeElement.style.gridRowStart = e.y;
            snakeElement.style.gridColumnStart = e.x;
            snakeElement.classList.add(index === 0 ? 'head' : 'snake');
            board.appendChild(snakeElement);
        });
        let foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        board.appendChild(foodElement);
    };

    // High Score Update
    const updateHighScore = (currentScore) => {
        if (currentScore > hiscoreVal) {
            hiscoreVal = currentScore;
            localStorage.setItem("hiscore", hiscoreVal);
            hiscoreBox.innerHTML = "High Score : " + hiscoreVal;
        }
    };

    // Arrow Key Controls
    window.addEventListener('keydown', (e) => {
        if (e.key === "ArrowUp" && inputDir.y !== 1) {
            inputDir = { x: 0, y: -1 };
            moveSound.play();
        } else if (e.key === "ArrowDown" && inputDir.y !== -1) {
            inputDir = { x: 0, y: 1 };
            moveSound.play();
        } else if (e.key === "ArrowLeft" && inputDir.x !== 1) {
            inputDir = { x: -1, y: 0 };
            moveSound.play();
        } else if (e.key === "ArrowRight" && inputDir.x !== -1) {
            inputDir = { x: 1, y: 0 };
            moveSound.play();
        }
    });

    // Touch Controls for Mobile
    // let touchStartX = 0; 
    // let touchStartY = 0;
    // document.addEventListener('touchstart', (e) => {
    //     touchStartX = e.touches[0].clientX;
    //     touchStartY = e.touches[0].clientY;
    // });

    // document.addEventListener('touchend', (e) => {
    //     let touchEndX = e.changedTouches[0].clientX;
    //     let touchEndY = e.changedTouches[0].clientY;
    //     let diffX = touchEndX - touchStartX;
    //     let diffY = touchEndY - touchStartY;

    //     if (Math.abs(diffX) > Math.abs(diffY)) {
    //         if (diffX > 0 && inputDir.x !== -1) inputDir = { x: 1, y: 0 };
    //         else if (diffX < 0 && inputDir.x !== 1) inputDir = { x: -1, y: 0 };
    //     } else {
    //         if (diffY > 0 && inputDir.y !== -1) inputDir = { x: 0, y: 1 };
    //         else if (diffY < 0 && inputDir.y !== 1) inputDir = { x: 0, y: -1 };
    //     }
    // });

    // D-pad Controls for On-screen Buttons
    document.getElementById('up').addEventListener('click', () => {
        if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            moveSound.play();
    });
    document.getElementById('down').addEventListener('click', () => {
        if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            moveSound.play();
    });
    document.getElementById('left').addEventListener('click', () => {
        if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            moveSound.play();
    });
    document.getElementById('right').addEventListener('click', () => {
        if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            moveSound.play();
    });

    // Start the game
    window.requestAnimationFrame(main);
});
