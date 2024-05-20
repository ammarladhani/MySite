const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Software Engineer", "Tech Enthusiast", "Open Source Contributor", "Eagle Scout", "Coffee Lover", "Gamer", "Fitness Addict", "Traveler", "Lifelong Learner", "Volunteer", "Human"];
const typingDelay = 160;
const erasingDelay = 80;
const newTextDelay = 1600;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        //generate a number between -40 and 40
        let randomNumber = Math.floor(Math.random() * 80) - 40;
        setTimeout(type, typingDelay + randomNumber);
    } else {
        cursorSpan.classList.remove("typing");
        let randomNumber = Math.floor(Math.random() * 800) - 400;
        setTimeout(erase, newTextDelay+randomNumber);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        let randomNumber = Math.floor(Math.random() * 40) - 20;
        setTimeout(erase, erasingDelay + randomNumber);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        let randomNumber = Math.floor(Math.random() * 440) - 220;
        setTimeout(type, typingDelay + 880 + randomNumber);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (textArray.length) setTimeout(type, newTextDelay + 200);
});