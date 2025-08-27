// Graph settings
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const margin = 40;
const graphMin = -5;
const graphMax = 5;
const graphRange = graphMax - graphMin;

// Random line: y = mx + b
const m = +(Math.random() * 4 - 2).toFixed(2); // slope between -2 and 2
const b = +(Math.random() * 4 - 2).toFixed(2); // intercept between -2 and 2

// Random point
let pointOnLine = Math.random() < 0.5;
let px = +(Math.random() * graphRange + graphMin).toFixed(2);
let py;
if (pointOnLine) {
    py = +(m * px + b).toFixed(2);
} else {
    // Pick a random y not on the line
    let offset = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 1 : -1);
    py = +(m * px + b + offset).toFixed(2);
}

// Utility: graph to canvas coords
function toCanvas(x, y) {
    const cx = margin + ((x - graphMin) / graphRange) * (width - 2 * margin);
    const cy = height - (margin + ((y - graphMin) / graphRange) * (height - 2 * margin));
    return [cx, cy];
}

// Draw axes
function drawAxes() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    // X axis
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    // Ticks and labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    for (let i = graphMin; i <= graphMax; i++) {
        // X ticks
        let [cx, cy] = toCanvas(i, graphMin);
        ctx.beginPath();
        ctx.moveTo(cx, height - margin - 5);
        ctx.lineTo(cx, height - margin + 5);
        ctx.stroke();
        ctx.fillText(i, cx - 8, height - margin + 20);
        // Y ticks
        [cx, cy] = toCanvas(graphMin, i);
        ctx.beginPath();
        ctx.moveTo(margin - 5, cy);
        ctx.lineTo(margin + 5, cy);
        ctx.stroke();
        ctx.fillText(i, margin - 30, cy + 4);
    }
}

// Draw point
function drawPoint() {
    const [cx, cy] = toCanvas(px, py);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw slope line (hidden until answer)
function drawSlopeLine() {
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    let x1 = graphMin, x2 = graphMax;
    let y1 = m * x1 + b, y2 = m * x2 + b;
    let [cx1, cy1] = toCanvas(x1, y1);
    let [cx2, cy2] = toCanvas(x2, y2);
    ctx.beginPath();
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
    ctx.restore();
}

// Initial draw
function drawGraph(showLine = false) {
    ctx.clearRect(0, 0, width, height);
    drawAxes();
    drawPoint();
    if (showLine) drawSlopeLine();
}

drawGraph();

document.getElementById('equation').textContent = `Line: y = ${m}x + ${b}`;
document.getElementById('slope').textContent = `Slope: ${m}`;

const showAnswerBtn = document.getElementById('show-answer');
const answerDiv = document.getElementById('answer');
let answerShown = false;

showAnswerBtn.addEventListener('mouseenter', () => {
    if (!answerShown) {
        drawGraph(true);
        answerDiv.style.display = 'block';
        answerDiv.textContent = pointOnLine ? 'The point is on the line.' : 'The point is not on the line.';
        answerShown = true;
    }
});

showAnswerBtn.addEventListener('mouseleave', () => {
    if (answerShown) {
        drawGraph(false);
        answerDiv.style.display = 'none';
        answerShown = false;
    }
});
