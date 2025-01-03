let listOfLineCollections = [];
let activeLineCollection = [];
let committedLineCollection = [];

let x;
let y;
const xSectionCount = 15;
let xSectionWidth;
let currentSection = 0;

let allowWrites = true;

const STATE_BEGIN = 0;
const STATE_ACTIVE = 1;
const STATE_SCORING = 2;
const STATE_SCORE_FADEOUT = 3;
const STATE_MSG_FADEIN = 4;
const STATE_FINISH = 5;

let typed = "";

let state = STATE_BEGIN;

let score;

let inactiveLineStrokeWhileScoring = 200;
let scoreOpacity = 256;
let msgOpacity = 0;

function storeGlobalState() {
  const globalState = {
    state,
    listOfLineCollections,
    activeLineCollection,
    committedLineCollection,
    x,
    y,
    inactiveLineStrokeWhileScoring,
    scoreOpacity,
    msgOpacity,
  };

  if (allowWrites) {
    localStorage.setItem("completeState", JSON.stringify(globalState));
  }
}

function resetState() {
  localStorage.removeItem("completeState");
  allowWrites = false;
}

function readGlobalState() {
  const storedState = localStorage.getItem("completeState");
  if (storedState) {
    const parsedState = JSON.parse(storedState);

    state = parsedState.state;
    listOfLineCollections = parsedState.listOfLineCollections;
    activeLineCollection = parsedState.activeLineCollection;
    committedLineCollection = parsedState.committedLineCollection;

    inactiveLineStrokeWhileScoring = parsedState.inactiveLineStrokeWhileScoring;
    scoreOpacity = parsedState.scoreOpacity;
    msgOpacity = parsedState.msgOpacity;

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
  typed += key;
  if (typed == "resetme") {
    resetState();
  }

  if (key == " ") {
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
    }
  }

  storeGlobalState();
}

function draw() {
  if (state == STATE_BEGIN) {
    writeText(
      "Press 'space' to commit to a path. Your choices are not reversable."
    );
  } else if (state == STATE_ACTIVE) {
    background(256);

    drawLineForest();
  } else if (state == STATE_SCORING) {
    background(256);

    drawLineForest(inactiveLineStrokeWhileScoring);

    writeText(
      "You explored " + listOfLineCollections.length + " possibilities"
    );

    inactiveLineStrokeWhileScoring += 0.5;
    if (inactiveLineStrokeWhileScoring >= 256) {
      state = STATE_SCORE_FADEOUT;
    }
  } else if (state == STATE_SCORE_FADEOUT) {
    background(256);

    drawLineForest(256);

    writeText(
      "You explored " + listOfLineCollections.length + " possibilities",
      scoreOpacity
    );

    scoreOpacity -= 2;
    if (scoreOpacity <= 0) {
      state = STATE_MSG_FADEIN;
    }
  } else if (state == STATE_MSG_FADEIN) {
    background(256);
    drawLineForest(256);

    writeText("Do you remember the paths you didn't take?", msgOpacity);

    msgOpacity += 3;
    if (msgOpacity >= 256) {
      state = STATE_FINISH;
    }
  } else if (state == STATE_FINISH) {
    background(256);
    drawLineForest(256);

    writeText("Do you remember the paths you didn't take?");
  }

  storeGlobalState();
}

function writeText(msg, opacity) {
  textAlign(CENTER);
  textSize(32);

  strokeWeight(3);
  stroke(0, 0, 0, opacity || 256);

  fill(256, 256, 256, opacity || 256);
  text(msg, windowWidth / 2, windowHeight / 2);

  strokeWeight(1);
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
