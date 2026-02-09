const captchaSection = document.querySelector('[data-section="captcha"]');
const valentineSection = document.querySelector('[data-section="valentine"]');
const verifyButton = document.querySelector('.verify-button');
const questionText = document.querySelector('[data-question]');
const messageText = document.querySelector('[data-message]');
const actionsArea = document.querySelector('[data-actions]');
const yesButton = document.querySelector('[data-yes]');
const noButton = document.querySelector('[data-no]');
const noShield = document.querySelector('[data-no-shield]');

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

const setShieldPosition = (x, y, width, height) => {
    noShield.style.left = `${x}px`;
    noShield.style.top = `${y}px`;
    noShield.style.width = `${width}px`;
    noShield.style.height = `${height}px`;
};

const wrapPosition = (value, min, max) => {
    if (value < min) {
        return max;
    }
    if (value > max) {
        return min;
    }
    return value;
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

const repelNoButtonFromMouse = () => {
    if (!lastMousePosition) {
        return;
    }

    const areaWidth = actionsArea.clientWidth;
    const areaHeight = actionsArea.clientHeight;
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;
    const maxX = Math.max(0, areaWidth - buttonWidth);
    const maxY = Math.max(0, areaHeight - buttonHeight);

    const buttonCenter = {
        x: noButton.offsetLeft + buttonWidth / 2,
        y: noButton.offsetTop + buttonHeight / 2
    };

    const deltaX = buttonCenter.x - lastMousePosition.x;
    const deltaY = buttonCenter.y - lastMousePosition.y;
    const distance = Math.hypot(deltaX, deltaY);
    const repelRadius = 120;

    if (distance > repelRadius) {
        return;
    }

    const safeDistance = distance || 1;
    const intensity = (repelRadius - distance) / repelRadius;
    const shift = Math.max(36 * intensity, 18);

    const nextXRaw = noButton.offsetLeft + (deltaX / safeDistance) * shift;
    const nextYRaw = noButton.offsetTop + (deltaY / safeDistance) * shift;

    const nextX = wrapPosition(nextXRaw, 0, maxX);
    const nextY = wrapPosition(nextYRaw, 0, maxY);

    setButtonPosition(noButton, nextX, nextY);
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

const updateNoShield = () => {
    if (currentStep === 2) {
        noShield.classList.remove('is-hidden');
        const padding = 6;
        setShieldPosition(
            positionState.no.x - padding,
            positionState.no.y - padding,
            noButton.offsetWidth + padding * 2,
            noButton.offsetHeight + padding * 2
        );
    } else {
        noShield.classList.add('is-hidden');
    }
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
    noButton.classList.remove('is-loading');
    noButton.removeAttribute('aria-busy');
    placeDefaultButtons();
    updateNoShield();
};

const handleNoHover = () => {
    if (currentStep === 0) {
        const nextPos = getSafeRandomPosition(noButton, lastMousePosition);
        setButtonPosition(noButton, nextPos.x, nextPos.y);
        return;
    }

    if (currentStep === 2) {
        return;
    }

    if (currentStep === 1) {
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
noButton.addEventListener('click', () => {
    if (currentStep === steps.length - 1) {
        noButton.classList.add('is-loading');
        noButton.setAttribute('aria-busy', 'true');
    }
});
noButton.addEventListener('mouseenter', handleNoHover);

actionsArea.addEventListener('mousemove', (event) => {
    const bounds = actionsArea.getBoundingClientRect();
    lastMousePosition = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
    };

    if (currentStep === 3) {
        repelNoButtonFromMouse();
    }
});

actionsArea.addEventListener('mouseleave', () => {
    lastMousePosition = null;
});

window.addEventListener('resize', () => {
    if (!valentineSection.classList.contains('is-hidden')) {
        placeDefaultButtons();
        updateNoShield();
    }
});

updateQuestion();
