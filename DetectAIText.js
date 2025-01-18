// Constants for thresholds
const PASTE_EVENT_THRESHOLD = 3; // Example: Max 3 paste events allowed
const TYPING_SPEED_THRESHOLD = 300; // Example: Avg typing speed (ms per char)
const FLAG_THRESHOLD = 70; // Example: 70% bot-like behavior to flag AI

// Data structure to hold keypress intervals
let typingData = {
    intervals: [],
    keyEvents: {
        backspace: 0,
        enter: 0,
        delete: 0,
        shift: 0,
        ctrlZ: 0,
    },
    pasteEvents: [],
};

// Function to track keypress intervals
let lastKeyPressTime = null;
function trackKeyPress(event) {
    const now = Date.now();
    if (lastKeyPressTime) {
        const interval = now - lastKeyPressTime;
        typingData.intervals.push(interval);
    }
    lastKeyPressTime = now;

    // Track specific key events
    if (event.key === "Backspace") typingData.keyEvents.backspace++;
    if (event.key === "Enter") typingData.keyEvents.enter++;
    if (event.key === "Delete") typingData.keyEvents.delete++;
    if (event.key === "Shift") typingData.keyEvents.shift++;
    if (event.ctrlKey && event.key === "z") typingData.keyEvents.ctrlZ++;
}

// Function to detect paste events
function detectPaste(event) {
    const clipboardData = event.clipboardData.getData("text");
    typingData.pasteEvents.push(clipboardData.length); // Log length of pasted text
}

// Analysis functions
function analyzeTypingSpeed() {
    if (typingData.intervals.length === 0) return 0;
    const avgSpeed =
        typingData.intervals.reduce((sum, val) => sum + val, 0) /
        typingData.intervals.length;
    return avgSpeed;
}

function analyzeConsistency() {
    if (typingData.intervals.length === 0) return 0;
    const mean = analyzeTypingSpeed();
    const variance =
        typingData.intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        typingData.intervals.length;
    return Math.sqrt(variance);
}

function analyzePastes() {
    return typingData.pasteEvents.length > PASTE_EVENT_THRESHOLD ? "High" : "Normal";
}

function calculateBotLikelihood() {
    const typingSpeed = analyzeTypingSpeed();
    const consistency = analyzeConsistency();
    const pasteAnalysis = analyzePastes();

    let botScore = 0;

    if (typingSpeed < TYPING_SPEED_THRESHOLD) botScore += 40; // Typing speed too fast
    if (consistency < 100) botScore += 30; // Low typing consistency
    if (pasteAnalysis === "High") botScore += 30; // High paste activity

    return botScore;
}

// Final decision function
function isAIText() {
    const botLikelihood = calculateBotLikelihood();
    return botLikelihood > FLAG_THRESHOLD ? "AI-Generated" : "Human-Generated";
}

// Event Listeners
document.addEventListener("keydown", trackKeyPress);
document.addEventListener("paste", detectPaste);

// Debugging and testing
function debugResults() {
    console.log("Typing Data:", typingData);
    console.log("Average Typing Speed:", analyzeTypingSpeed(), "ms/char");
    console.log("Typing Consistency:", analyzeConsistency());
    console.log("Paste Analysis:", analyzePastes());
    console.log("Bot Likelihood:", calculateBotLikelihood(), "%");
    console.log("Final Result:", isAIText());
}

// Test button (add to your HTML for debugging)
const testButton = document.createElement("button");
testButton.textContent = "Test Results";
testButton.onclick = debugResults;
document.body.appendChild(testButton);
