let listOfLineCollections = [];
let activeLineCollection = [];
let x;
let y;
const xSteps = 10;
let xSectionWidth;

function setup() {
  x = 0;
  y = windowHeight / 2;

  xSectionWidth = windowWidth / xSteps;

  createCanvas(windowWidth, windowHeight);

  setInterval(() => {
    listOfLineCollections.push(activeLineCollection);
    activeLineCollection = genLines(x, 0, x + xSectionWidth, windowHeight, y);
  }, 500);

  background(256);

  activeLineCollection = genLines(x, 0, x + xSectionWidth, windowHeight, y);
}

function keyPressed() {
  let [x1, y1, x2, y2] = activeLineCollection[activeLineCollection.length - 1];

  x += xSectionWidth;
  y = y2;
}

function draw() {
  background(256);

  stroke(200);
  for (let lineCollection of listOfLineCollections) {
    drawLines(lineCollection);
  }

  stroke(0);
  drawLines(activeLineCollection);
}

function drawLines(lines) {
  for (let [x1, y1, x2, y2] of lines) {
    line(x1, y1, x2, y2);
  }
}

function genLines(x1, y1, x2, y2, y) {
  const xStepCount = 100;

  const xStep = (x2 - x1) / xStepCount;
  const yStep = (y2 - y1) / 100;

  let x = x1;

  const lines = [];

  for (let i = 0; i < xStepCount; i++) {
    const diff = (random(2) - 1) * yStep;
    const newY = y + diff;

    lines.push([x, y, x + xStep, newY]);

    y = newY;
    x += xStep;
  }

  return lines;
}
