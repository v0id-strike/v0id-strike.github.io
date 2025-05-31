// Typewriter effect configuration
const texts = ['Red Teamer', 'Malware Developer', 'Student', 'Bored'];
const dynamicText = document.querySelector('.dynamic-text');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function type() {
    if (!dynamicText) return; // Guard clause in case element isn't found
    
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        dynamicText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = erasingDelay;
    } else {
        dynamicText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = newTextDelay;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingDelay = 500;
    }

    setTimeout(type, typingDelay);
}

// Initialize the typewriter effect
function initTypewriter() {
    if (dynamicText) {
        setTimeout(type, newTextDelay);
    }
}

// Start the typewriter effect when the script loads
initTypewriter(); 