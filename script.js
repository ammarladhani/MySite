const captchaSection = document.querySelector('[data-section="captcha"]');
const valentineSection = document.querySelector('[data-section="valentine"]');
const verifyButton = document.querySelector('.verify-button');
const questionText = document.querySelector('[data-question]');
const messageText = document.querySelector('[data-message]');
const actionsArea = document.querySelector('[data-actions]');
const yesButton = document.querySelector('[data-yes]');
const noButton = document.querySelector('[data-no]');

const steps = [
    'Will you be my valentine?',
    'Are you sure?',
    'Are you really sure?',
    'Are you really really sure?',
    'Are you really really really sure?'
];

let currentStep = 0;
let swapState = false;
let lastMousePosition = null;

const positionState = {
    yes: { x: 0, y: 0 },
    no: { x: 0, y: 0 }
};

const setButtonPosition = (button, x, y) => {
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
};

const getSafeRandomPosition = (button, mousePosition) => {
    const areaWidth = actionsArea.clientWidth;
    const areaHeight = actionsArea.clientHeight;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    const maxX = Math.max(0, areaWidth - buttonWidth);
    const maxY = Math.max(0, areaHeight - buttonHeight);

    const isMouseOverPosition = (position) => {
        if (!mousePosition) {
            return false;
        }
        return (
            mousePosition.x >= position.x &&
            mousePosition.x <= position.x + buttonWidth &&
            mousePosition.y >= position.y &&
            mousePosition.y <= position.y + buttonHeight
        );
    };

    let candidate = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
    };

    let attempts = 0;
    while (attempts < 20 && isMouseOverPosition(candidate)) {
        candidate = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
        attempts += 1;
    }

    return candidate;
};

const isMouseOverButtonPosition = (button, position) => {
    if (!lastMousePosition) {
        return false;
    }
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    return (
        lastMousePosition.x >= position.x &&
        lastMousePosition.x <= position.x + buttonWidth &&
        lastMousePosition.y >= position.y &&
        lastMousePosition.y <= position.y + buttonHeight
    );
};

const placeDefaultButtons = () => {
    const areaWidth = actionsArea.clientWidth;
    const areaHeight = actionsArea.clientHeight;
    const yesWidth = yesButton.offsetWidth;
    const noWidth = noButton.offsetWidth;

    positionState.yes.x = Math.max(12, areaWidth * 0.2 - yesWidth / 2);
    positionState.no.x = Math.min(areaWidth - noWidth - 12, areaWidth * 0.7 - noWidth / 2);
    positionState.yes.y = areaHeight * 0.45 - yesButton.offsetHeight / 2;
    positionState.no.y = areaHeight * 0.45 - noButton.offsetHeight / 2;

    setButtonPosition(yesButton, positionState.yes.x, positionState.yes.y);
    setButtonPosition(noButton, positionState.no.x, positionState.no.y);
};

const updateQuestion = () => {
    questionText.textContent = steps[currentStep] || steps[steps.length - 1];
};

const showFinalMessage = () => {
    questionText.classList.add('is-hidden');
    messageText.classList.remove('is-hidden');
    actionsArea.classList.add('is-hidden');
};

const swapButtonPositions = () => {
    swapState = !swapState;
    if (swapState) {
        setButtonPosition(yesButton, positionState.no.x, positionState.no.y);
        if (isMouseOverButtonPosition(noButton, positionState.yes)) {
            const nextPos = getSafeRandomPosition(noButton, lastMousePosition);
            setButtonPosition(noButton, nextPos.x, nextPos.y);
        } else {
            setButtonPosition(noButton, positionState.yes.x, positionState.yes.y);
        }
    } else {
        setButtonPosition(yesButton, positionState.yes.x, positionState.yes.y);
        if (isMouseOverButtonPosition(noButton, positionState.no)) {
            const nextPos = getSafeRandomPosition(noButton, lastMousePosition);
            setButtonPosition(noButton, nextPos.x, nextPos.y);
        } else {
            setButtonPosition(noButton, positionState.no.x, positionState.no.y);
        }
    }
};

const resetButtons = () => {
    swapState = false;
    yesButton.textContent = 'Yes';
    noButton.textContent = 'No';
    placeDefaultButtons();
};

const handleNoHover = () => {
    if (currentStep === 0 || currentStep === 2) {
        const nextPos = getSafeRandomPosition(noButton, lastMousePosition);
        setButtonPosition(noButton, nextPos.x, nextPos.y);
        return;
    }

    if (currentStep === 1 || currentStep === 3) {
        swapButtonPositions();
        return;
    }

    if (currentStep === 4) {
        const currentYes = yesButton.textContent;
        yesButton.textContent = noButton.textContent;
        noButton.textContent = currentYes;
        swapButtonPositions();
    }
};

const advanceStep = () => {
    currentStep += 1;
    if (currentStep >= steps.length) {
        showFinalMessage();
        return;
    }
    updateQuestion();
    resetButtons();
};

verifyButton.addEventListener('click', () => {
    captchaSection.classList.add('is-hidden');
    valentineSection.classList.remove('is-hidden');
    resetButtons();
});

yesButton.addEventListener('click', advanceStep);
noButton.addEventListener('mouseenter', handleNoHover);

actionsArea.addEventListener('mousemove', (event) => {
    const bounds = actionsArea.getBoundingClientRect();
    lastMousePosition = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
    };
});

actionsArea.addEventListener('mouseleave', () => {
    lastMousePosition = null;
});

window.addEventListener('resize', () => {
    if (!valentineSection.classList.contains('is-hidden')) {
        placeDefaultButtons();
    }
});

updateQuestion();
