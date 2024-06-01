let numbers = [];
let hiddenNumberIndex;
let attempts = 3;
let isArithmetic;

const gameSection = document.getElementById('gameSection');
const guessButton = document.getElementById('guessButton');
const restartButton = document.getElementById('restartButton');
const guessInput = document.getElementById('guessInput');
const messageElement = document.getElementById('message');
const attemptsLeftElement = document.getElementById('attemptsLeft');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');

guessButton.addEventListener('click', handleGuess);
restartButton.addEventListener('click', restartGame);

initGame();

function initGame() {
    chooseProgressionType();
    generateNumbers();
}

function chooseProgressionType() {
    isArithmetic = Math.random() < 0.5; // Randomly choose arithmetic or geometric progression
}

function generateNumbers() {
    const firstNumber = getRandomNumber(1, 50); // Adjusted to ensure first number is between 1 and 50
    
    const commonDifferenceOrRatio = isArithmetic ? getRandomNumber(1, 10) : getRandomNumber(2, 5);
    
    numbers = [firstNumber];
    for (let i = 1; i < 5; i++) {
        if (isArithmetic) {
            numbers.push(Math.min(100, numbers[i - 1] + commonDifferenceOrRatio)); // Ensure numbers don't exceed 100
        } else {
            numbers.push(Math.min(100, numbers[i - 1] * commonDifferenceOrRatio)); // Ensure numbers don't exceed 100
        }
    }
    
    hiddenNumberIndex = Math.floor(Math.random() * 5);
    displayNumbers();
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayNumbers() {
    for (let i = 0; i < 5; i++) {
        const numElement = document.getElementById(`num${i + 1}`);
        if (i === hiddenNumberIndex) {
            numElement.textContent = '?';
        } else {
            numElement.textContent = numbers[i];
        }
    }
    const correctNumberElement = document.getElementById(`num${hiddenNumberIndex + 1}`);
    correctNumberElement.classList.add('correct-number');
}

function handleGuess() {
    const userGuess = guessInput.value.trim();

    // Validate input
    if (!/^\d+$/.test(userGuess)) {
        messageElement.textContent = 'Please enter a valid integer number.';
        messageElement.classList.add('error');
        return;
    }

    const guess = parseInt(userGuess);
    if (guess < 1 || guess > 100) {
        messageElement.textContent = 'Please enter a number between 1 and 100.';
        messageElement.classList.add('error');
        return;
    }

    attempts--;

    if (guess === numbers[hiddenNumberIndex]) {
        messageElement.textContent = 'Congratulations! You guessed the correct number!';
        messageElement.classList.add('correct');
        correctSound.play();
        revealNumber();
        disableInput();
    } else if (guess < numbers[hiddenNumberIndex]) {
        messageElement.textContent = 'Your guess is too low.';
        messageElement.classList.add('incorrect');
        incorrectSound.play();
    } else {
        messageElement.textContent = 'Your guess is too high.';
        messageElement.classList.add('incorrect');
        incorrectSound.play();
    }

    messageElement.classList.remove('correct', 'incorrect', 'error');  // Reset classes
    void messageElement.offsetWidth;  // Trigger reflow to restart animation

    if (attempts > 0) {
        attemptsLeftElement.textContent = `Attempts left: ${attempts}`;
    } else {
        messageElement.textContent = `Game over! The correct number was ${numbers[hiddenNumberIndex]}.`;
        revealNumber();
        disableInput();
    }
}

function revealNumber() {
    document.getElementById(`num${hiddenNumberIndex + 1}`).textContent = numbers[hiddenNumberIndex];
}

function disableInput() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    restartButton.style.display = 'inline-block';
}

function restartGame() {
    attempts = 3;
    guessInput.disabled = false;
    guessButton.disabled = false;
    restartButton.style.display = 'none';
    messageElement.textContent = '';
    attemptsLeftElement.textContent = '';
    guessInput.value = '';
    initGame();
}

