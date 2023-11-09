let playerSequence = [];
let computerSequence = [];
let isPlaying = false;
let currentLevel = 0;

const buttonColors = ['red', 'blue', 'yellow', 'green'];
const buttons = document.querySelectorAll('.btn')
const startBtn = document.querySelector('#start')

const pickRandomColor = () => computerSequence.push(buttonColors[Math.floor(Math.random() * buttonColors.length)]);

const addPlayerChoice = color => playerSequence.push(color);

function checkSequences(sequenceIndex)
{
    if (playerSequence[sequenceIndex] === computerSequence[sequenceIndex]) 
    {
        if (playerSequence.length === computerSequence.length)
        {
            isPlaying = false
            setTimeout(nextSequence, 1000)
        }
    } 
    else
    {
        // endGame()
        console.log("ended");
    };
};

function nextSequence() 
{
    playerSequence.length = 0;
    pickRandomColor();
    animateButton();
    isPlaying = true
}

async function animateButton()
{
    function ligthUpButton(button)
    {
        return new Promise(resolve => 
            {
                button.classList.add('pressed');
                setTimeout(() => {
                    button.classList.remove('pressed');
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

function startGame()
{
    pickRandomColor();
    animateButton();
}

buttons.forEach(btn => 
{
    btn.addEventListener('click', e => 
    {
        if (isPlaying)
        {
            addPlayerChoice(e.target.id);
            checkSequences(playerSequence.length - 1);
            console.log(playerSequence);
        }
    });
});

startBtn.addEventListener('click', () => 
{
    isPlaying = true
    startGame()
})