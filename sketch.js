let listOfLineCollections = [];
let activeLineCollection = [];
let committedLineCollection = [];

let x;
let y;
const xSectionCount = 15;
let xSectionWidth;
let currentSection = 0;

const STATE_BEGIN = 0;
const STATE_ACTIVE = 1;
const STATE_SCORING = 2;

let state = STATE_BEGIN;

let score;

function storeGlobalState() {
  const globalState = {
    state,
    listOfLineCollections,
    activeLineCollection,
    committedLineCollection,
    x,
    y,
  };

  localStorage.setItem("completeState", JSON.stringify(globalState));
}

function readGlobalState() {
  const storedState = localStorage.getItem("completeState");
  if (storedState) {
    const parsedState = JSON.parse(storedState);

    state = parsedState.state;
    listOfLineCollections = parsedState.listOfLineCollections;
    activeLineCollection = parsedState.activeLineCollection;
    committedLineCollection = parsedState.committedLineCollection;

    x = parsedState.x;
    y = parsedState.y;
  }
}

function setup() {
  x = 0;
  y = windowHeight / 2;

  xSectionWidth = windowWidth / xSectionCount;

  createCanvas(windowWidth, windowHeight);

  readGlobalState();

  setInterval(() => {
    if (state == STATE_ACTIVE) {
      buildNewLines();
    }
  }, 500);

  background(256);

  activeLineCollection = genLines(x, 0, x + xSectionWidth, windowHeight, y);
}

function buildNewLines() {
  listOfLineCollections.push(activeLineCollection);
  activeLineCollection = genLines(x, 0, x + xSectionWidth, windowHeight, y);

  storeGlobalState();
}

function keyPressed() {
  if (key != " ") {
    return;
  }

  if (state == STATE_BEGIN) {
    state = STATE_ACTIVE;
  } else if (state == STATE_ACTIVE) {
    let [x1, y1, x2, y2] =
      activeLineCollection[activeLineCollection.length - 1];

    committedLineCollection.push(activeLineCollection);

    x += xSectionWidth;
    y = y2;
    currentSection += 1;

    if (currentSection >= xSectionCount) {
      state = STATE_SCORING;
    }

    buildNewLines();

    storeGlobalState();
  }
}

function draw() {
  if (state == STATE_BEGIN) {
    textAlign(CENTER);
    textSize(32);
    text(
      "Press 'space' to commit. Your choices are not reversable.",
      windowWidth / 2,
      windowHeight / 2
    );
  } else if (state == STATE_ACTIVE) {
    background(256);

    drawLineForest();
  } else if (state == STATE_SCORING) {
    background(256);

    drawLineForest();

    textAlign(CENTER);
    textSize(32);
    fill(255, 0, 0);
    text(
      "You explored " + listOfLineCollections.length + " possibilities",
      windowWidth / 2,
      windowHeight / 2
    );
  }
}

function drawLineForest(inactiveLineStroke) {
  stroke(inactiveLineStroke || 200);
  for (let lineCollection of listOfLineCollections) {
    drawLines(lineCollection);
  }

  stroke(0);
  drawLines(activeLineCollection);
  for (let lineCollection of committedLineCollection) {
    drawLines(lineCollection);
  }
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
