function setup() {
  createCanvas(windowWidth, windowHeight);

  background(256);

  stroke(200);
  for (let i = 0; i < 20; i++) {
    web(0, 0, windowWidth / 2, windowHeight);
  }

  stroke(0);
  webWithPredefinedEnd(0, 0, windowWidth / 2, windowHeight);

  stroke(200);
  for (let i = 0; i < 20; i++) {
    web(windowWidth / 2, 0, windowWidth, windowHeight);
  }

  stroke(0);
  web(windowWidth / 2, 0, windowWidth, windowHeight);
}

function web(x1, y1, x2, y2, stepCount) {
  const xStepCount = stepCount || 100;

  const xStep = (x2 - x1) / xStepCount;
  const yStep = (y2 - y1) / 100;

  let y = (y1 + y2) / 2;
  let x = x1;

  for (let i = 0; i < xStepCount; i++) {
    const diff = (random(2) - 1) * yStep;
    const newY = y + diff;

    line(x, y, x + xStep, newY);

    y = newY;
    x += xStep;
  }

  return [x, y];
}

function webWithPredefinedEnd(x1, y1, x2, y2) {
  const [x, y] = web(x1, y1, x2, y2, 99);

  line(x, y, x2, (y1 + y2) / 2);
}
