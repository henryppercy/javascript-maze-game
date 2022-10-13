import {dynamicObject, objectMove} from './animation.js';

const winModal = document.querySelector('#winModal');
const loseModal = document.querySelector('#loseModal');
const collision = document.querySelectorAll('.collision');
const nest = document.querySelector('.nest');
const startButton = document.querySelector('.startBtn');
const maze = document.querySelectorAll('.line');
const startArea = document.querySelector('.startArea');
const hawk1 = document.querySelector('.hawk1');
const hawk2 = document.querySelector('.hawk2');
const snake = document.querySelector('.snake');
const startArrow = document.querySelector('.startArrow');
const timerElement = document.querySelector('.timer h2');
const countdownElement = document.querySelector('#countdownModal');
const countdownH2 = document.querySelector('.modalNum');

// Constants to construct each dynamicObject
const hawk1Obj = new dynamicObject(hawk1, null, 50, 300, 2, 'moveRight');
const hawk2Obj = new dynamicObject(hawk2, null, 480, 663, 2, 'moveRight');
const snakeObj = new dynamicObject(snake, null, 250, 450, 2, 'moveRight');
const arrowObj = new dynamicObject(startArrow, null, 90, 120, 0.7, 'moveRight');

// Game timer start time - change this to adjust duration of the game
let secondsLeft = 45;

// Countdown timer - change this to adjust countdown duration
// note - start number is called with modal so will also need to be updated. timeLeft is second num of countdown
let timeLeft = 2;

/* -----Main content----- */
/* cancelAnimation function - cancels all three objects from moving in a game win or lose scenario */
const cancelAnimation = () => {
    cancelAnimationFrame(snakeObj.aniFrame);
    cancelAnimationFrame(hawk1Obj.aniFrame);
    cancelAnimationFrame(hawk2Obj.aniFrame);
}

// event Handlers for win and lose conditions
const lose = () => {
    loseModal.style.display = "block";
    cancelAnimation();
    clearInterval(timer);
}

const win = () => {
    winModal.style.display = "block";
    cancelAnimation();
    clearInterval(timer);
}

const stopPropagation = (ev) => {
    ev.stopPropagation();
}

// event listeners for win and lose
const listenForCollisions = () => {
    collision.forEach(item => {
        item.addEventListener('mouseover', lose);
    });
}

// event listener for maze lines
const listenForLeaveMaze = () => {
    maze.forEach(item => {
        item.addEventListener('mouseover', stopPropagation);
    });
}

const listenForStartArea = () => {
    startArea.addEventListener('mouseover', stopPropagation);
    startArea.addEventListener('mouseleave', () => {startTimer(secondsLeft)});
}

const listenForWinning = () => {
    nest.addEventListener('mouseenter', win);
}

const stopWinningPropagation = () => {
    nest.addEventListener('mouseover', stopPropagation);
}

// countdown timer function - It only works for durations less than 60 seconds
let timer;
const startTimer = (secondsLeft) => {
    timer = setInterval(() => {
        secondsLeft = (secondsLeft < 10) ? ("0" + secondsLeft) : secondsLeft;
        timerElement.textContent = "00:" + (secondsLeft - 1);
        --secondsLeft;
        if (secondsLeft < 0) {
            lose();
        }
    }, 1000)
}

/*
 event to initiate game, start the animations, set up
the event listeners for the win/lose conditions and make the start button disappear
*/
const gameStart = (ev) => {
    listenForWinning();
    stopWinningPropagation();

    listenForCollisions();
    listenForLeaveMaze();

    timerElement.textContent = "00:" + secondsLeft;
    listenForStartArea();

    // start of animations
    objectMove(null, snakeObj);
    objectMove(null, hawk1Obj);
    objectMove(null, hawk2Obj);
}

// Countdown Timer - activated on start button
let countdown;
const startCountdown = (ev) => {
    ev.preventDefault();
    startButton.style.display = 'none'; // makes start button disappear
    countdownElement.style.display = "block";
    countdownH2.textContent = '3';
    objectMove(null, arrowObj);
    countdown = setInterval(() => {
        let seconds = parseInt(timeLeft % 60, 10);
        if (timeLeft > 0) {
            countdownH2.textContent = seconds;
        }
        --timeLeft;
        if (timeLeft === -1) {
            countdownH2.textContent = 'GO!';
        } if (timeLeft === -2) {
            clearInterval(countdown);
            countdownElement.style.display = "none";
            gameStart();
        }
    }, 1000);
}

startButton.addEventListener('click', startCountdown);
