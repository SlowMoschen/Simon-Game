// Gamestats Dependencies
let playerSequence = [];
let computerSequence = [];
let isPlaying = false;
let currentLevel = 0;
let currentPlayTime  = 0;
let resetTime = 5;
let UI_Interval;

// DOM Elements
const buttonColors = ['red', 'blue', 'yellow', 'green'];
const colorButtons = document.querySelectorAll('.btn');
const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');
const timeDisplay = document.querySelector('#time');
const levelDisplay = document.querySelector('#level');
const highScoreDisplay = document.querySelector('#highscore');
const looseModal = document.querySelector('.loose-modal');
const resetTimeDisplay = document.querySelector('#reset-time')

// One-liner Helper Functions
const displayCurrentYear = () => document.querySelector('#year').textContent = new Date().getFullYear();

const displayHighscore = () => highScoreDisplay.textContent = localStorage.getItem('simon-game-highscore');

const addClass = (element, className) => element.classList.add(className);
const removeClass = (element, className) => element.classList.remove(className);

const disableButton = button => button.disabled = true;
const enableButton = button => button.disabled = false;

const pickRandomColor = () => computerSequence.push(buttonColors[Math.floor(Math.random() * buttonColors.length)]);

const addPlayerChoice = color => playerSequence.push(color);

// Function to check if Sequences are the same - if not end game
function checkSequences(sequenceIndex)
{
    if (playerSequence[sequenceIndex] === computerSequence[sequenceIndex]) 
    {
        if (playerSequence.length === computerSequence.length)
        {
            colorButtons.forEach(btn => disableButton(btn));
            playSound('win')
            setTimeout(nextSequence, 1000);
        }
    } 
    else
    {
        endGame()
    };
};

// Function to initiate the next Sequence
async function nextSequence() 
{
    isPlaying = false
    playerSequence.length = 0;
    currentLevel++
    pickRandomColor();
    await animateButton();
    isPlaying = true
    colorButtons.forEach(btn => enableButton(btn))
}

// Function to simulate Button press
async function animateButton()
{
    function ligthUpButton(button)
    {
        return new Promise(resolve => 
            {
                addClass(button, 'pressed')
                setTimeout(() => {
                    removeClass(button, 'pressed')
                    setTimeout(resolve, 500)
                }, 500);
            });
    }

    for(let color of computerSequence)
    {
        const btn = document.querySelector(`#${color}`)
        await ligthUpButton(btn)
    }
};

// Main Loop Functions
function startGame()
{
    isPlaying = true
    disableButton(startBtn)
    enableButton(resetBtn)
    colorButtons.forEach(btn => enableButton(btn))
    pickRandomColor();
    animateButton();
    currentLevel++
    UI_Interval = setInterval(updateUI, 1000)
}

function endGame()
{
    isPlaying = false;
    colorButtons.forEach(btn => disableButton(btn))
    playSound('lost')
    addClass(looseModal, 'show');
    saveHighScore();
    setTimeout(() => {
        clearInterval(UI_Interval);
        removeClass(looseModal, 'show');
        resetGame();
    }, 5500);
}

function resetGame()
{
    disableButton(resetBtn)
    enableButton(startBtn)
    clearInterval(UI_Interval)
    computerSequence.length = 0;
    playerSequence.length = 0;
    currentLevel = 0;
    currentPlayTime = 0;
    isPlaying = false;
    resetTime = 5;
    updateUI()
    displayHighscore()
}

// Function to update Level/Timer and Resettimer
function updateUI()
{
    if (isPlaying) 
    {
        timeDisplay.textContent = currentPlayTime++;
    }
    else
    {
        timeDisplay.textContent = currentPlayTime;
        resetTimeDisplay.textContent = Math.max(0, resetTime--)
    }
    levelDisplay.textContent = currentLevel;
}


function saveHighScore() 
{
    const currentHS = localStorage.getItem('simon-game-highscore')
    if(currentLevel > currentHS)
    {
        localStorage.setItem('simon-game-highscore', currentLevel)
    }
    return
}

function playSound(soundName) 
{
    const audio = new Audio()
    switch (soundName)
    {
        case 'click':
            audio.src = './sounds/click.wav'
            audio.play()
            break
        case 'lost':
            audio.src = './sounds/lost.wav'
            audio.play()
            break
        case 'win':
            audio.src = './sounds/won.wav'
            audio.play()
            break
    }
    return
}

// Eventlisteners
colorButtons.forEach(btn => 
{
    btn.addEventListener('click', e => 
    {
        addPlayerChoice(e.target.id);
        checkSequences(playerSequence.length - 1);
        playSound('click')
    });
});

startBtn.addEventListener('click', () => 
{
    startGame();
})

resetBtn.addEventListener('click', () => 
{
    resetGame();
})

displayCurrentYear()
displayHighscore()