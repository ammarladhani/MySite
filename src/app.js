const typedTextSpan = document.querySelector(".typed-text");

const textArray = ["Software Engineer", "Tech Enthusiast", "Open Source Contributor", "Eagle Scout", "Coffee Lover", "Gamer", "Fitness Addict", "Traveler", "Lifelong Learner", "Volunteer", "Human"];
const typingDelay = 160;
const erasingDelay = 80;
const newTextDelay = 1600;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, newTextDelay + 250);
});