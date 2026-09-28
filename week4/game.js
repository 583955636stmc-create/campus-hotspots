// 4주차 실습 3 · HTML Canvas로 만든 캠퍼스 보물찾기
// 규칙: 5×5칸에서 보물 5개(+10점)를 찾고 폭탄 4개(-8점)를 피합니다. 제한 시간 40초.

console.log("game.js 연결 성공!");

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#hud-score");
const timeEl = document.querySelector("#hud-time");
const foundEl = document.querySelector("#hud-found");
const comboEl = document.querySelector("#hud-combo");
const startBtn = document.querySelector("#start-btn");
const resultEl = document.querySelector("#game-result");

const COLS = 5;
const ROWS = 5;
const TILE_COUNT = COLS * ROWS;
const TREASURE_COUNT = 5;
const BOMB_COUNT = 4;
const TREASURE_POINTS = 10;
const BOMB_POINTS = -8;
const COMBO_BONUS = 2;
const GAME_SECONDS = 40;
const URGENT_SECONDS = 10;
const PAD = 10;
const GAP = 8;
const MAX_BOARD = 520;

let tiles = [];
let popups = [];
let score = 0;
let found = 0;
let combo = 0;
let bestCombo = 0;
let timeLeft = GAME_SECONDS;
let boardSize = MAX_BOARD;
let running = false;
let finished = false;
let endMessage = "";
let timerId = null;
let rafId = null;
let lastFrame = 0;

/* ---------- 게임 준비 ---------- */

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
}

function buildTiles() {
  const kinds = [];
  for (let i = 0; i < TREASURE_COUNT; i += 1) {
    kinds.push("treasure");
  }
  for (let i = 0; i < BOMB_COUNT; i += 1) {
    kinds.push("bomb");
  }
  while (kinds.length < TILE_COUNT) {
    kinds.push("empty");
  }
  shuffle(kinds);

  tiles = kinds.map(function (kind) {
    return { kind: kind, revealed: false, phase: Math.random() * Math.PI * 2 };
  });
}

function tileSize() {
  return (boardSize - PAD * 2 - GAP * (COLS - 1)) / COLS;
}

function tileRect(index) {
  const size = tileSize();
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: PAD + col * (size + GAP),
    y: PAD + row * (size + GAP),
    size: size
  };
}

// 캔버스에서 누른 위치가 몇 번째 칸인지 계산합니다. 칸 사이 간격은 무시합니다.
function hitTest(x, y) {
  const size = tileSize();
  const step = size + GAP;
  const col = Math.floor((x - PAD) / step);
  const row = Math.floor((y - PAD) / step);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
    return -1;
  }
  const rect = tileRect(row * COLS + col);
  if (x > rect.x + rect.size || y > rect.y + rect.size) {
    return -1;
  }
  return row * COLS + col;
}

/* ---------- 게임 진행 ---------- */

function startGame() {
  // 다시 시작할 때 이전 타이머와 애니메이션을 먼저 정리합니다.
  stopLoops();

  buildTiles();
  popups = [];
  score = 0;
  found = 0;
  combo = 0;
  bestCombo = 0;
  timeLeft = GAME_SECONDS;
  running = true;
  finished = false;
  endMessage = "";

  startBtn.textContent = "다시 시작";
  resultEl.textContent = "게임 진행 중입니다. 칸을 눌러 보물을 찾아보세요.";
  updateHud();
  resizeCanvas();

  timerId = window.setInterval(tick, 1000);
  lastFrame = performance.now();
  rafId = window.requestAnimationFrame(loop);
}

function tick() {
  if (!running) {
    return;
  }
  timeLeft -= 1;
  updateHud();
  if (timeLeft <= 0) {
    endGame("시간이 끝났습니다.");
  }
}

function endGame(message) {
  running = false;
  finished = true;
  endMessage = message;
  stopLoops();
  updateHud();
  draw();

  resultEl.innerHTML =
    "<strong>" + message + "</strong><br>" +
    "최종 점수 " + score + "점 · 보물 " + found + "/" + TREASURE_COUNT +
    "개 · 최고 연속 " + bestCombo + "회<br>" +
    "다시 하려면 <strong>다시 시작</strong> 버튼을 누르세요.";
  startBtn.textContent = "다시 시작";
}

// 타이머와 애니메이션을 정리합니다.
function stopLoops() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function reveal(index) {
  if (!running || finished) {
    return;
  }
  const tile = tiles[index];
  if (!tile || tile.revealed) {
    return;
  }

  tile.revealed = true;
  const rect = tileRect(index);
  const centerX = rect.x + rect.size / 2;
  const centerY = rect.y + rect.size / 2;

  if (tile.kind === "treasure") {
    combo += 1;
    bestCombo = Math.max(bestCombo, combo);
    const gained = TREASURE_POINTS + (combo - 1) * COMBO_BONUS;
    score += gained;
    found += 1;
    addPopup(centerX, centerY, "+" + gained, "#f2c14e");
  } else if (tile.kind === "bomb") {
    combo = 0;
    score += BOMB_POINTS;
    addPopup(centerX, centerY, String(BOMB_POINTS), "#ff9a9a");
  } else {
    combo = 0;
    addPopup(centerX, centerY, "0", "#9fb0cc");
  }

  updateHud();
  draw();

  const allRevealed = tiles.every(function (item) {
    return item.revealed;
  });
  if (allRevealed) {
    endGame("25칸을 모두 확인했습니다.");
  }
}

function updateHud() {
  scoreEl.textContent = String(score);
  timeEl.textContent = Math.max(0, timeLeft) + "초";
  timeEl.classList.toggle("is-urgent", running && timeLeft <= URGENT_SECONDS);
  foundEl.textContent = found + " / " + TREASURE_COUNT;
  comboEl.textContent = String(combo);
}

/* ---------- 그리기 ---------- */

function resizeCanvas() {
  const stage = canvas.parentElement;
  const available = stage.clientWidth || MAX_BOARD;
  const size = Math.max(260, Math.min(available, MAX_BOARD));
  const dpr = window.devicePixelRatio || 1;

  boardSize = size;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStar(centerX, centerY, outer, inner, points, color) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHiddenTile(rect, tile) {
  const wobble = running ? Math.sin(performance.now() / 700 + tile.phase) * 1.5 : 0;
  roundRect(rect.x, rect.y + wobble, rect.size, rect.size, 10);
  ctx.fillStyle = "#1d2b47";
  ctx.fill();
  ctx.strokeStyle = "#2f4468";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#5c7398";
  ctx.font = "bold " + Math.round(rect.size * 0.4) + "px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", rect.x + rect.size / 2, rect.y + wobble + rect.size / 2 + 2);
}

function drawRevealedTile(rect, tile) {
  const centerX = rect.x + rect.size / 2;
  const centerY = rect.y + rect.size / 2;

  roundRect(rect.x, rect.y, rect.size, rect.size, 10);
  ctx.lineWidth = 2;

  if (tile.kind === "treasure") {
    ctx.fillStyle = "#3a2f12";
    ctx.fill();
    ctx.strokeStyle = "#e0a326";
    ctx.stroke();
    drawStar(centerX, centerY, rect.size * 0.32, rect.size * 0.14, 5, "#f2c14e");
  } else if (tile.kind === "bomb") {
    ctx.fillStyle = "#3a1a1a";
    ctx.fill();
    ctx.strokeStyle = "#d94a4a";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY + rect.size * 0.05, rect.size * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#d94a4a";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX + rect.size * 0.13, centerY - rect.size * 0.13);
    ctx.lineTo(centerX + rect.size * 0.26, centerY - rect.size * 0.27);
    ctx.strokeStyle = "#f0d9a0";
    ctx.lineWidth = 3;
    ctx.stroke();
  } else {
    ctx.fillStyle = "#16223a";
    ctx.fill();
    ctx.strokeStyle = "#26364f";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, rect.size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = "#3d5170";
    ctx.fill();
  }
}

function addPopup(x, y, text, color) {
  popups.push({ x: x, y: y, text: text, color: color, life: 0.9 });
}

function drawPopups() {
  popups.forEach(function (popup) {
    ctx.globalAlpha = Math.max(0, Math.min(1, popup.life));
    ctx.fillStyle = popup.color;
    ctx.font = "bold " + Math.round(boardSize * 0.045) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(popup.text, popup.x, popup.y);
    ctx.globalAlpha = 1;
  });
}

function drawOverlay() {
  ctx.fillStyle = "rgba(9, 15, 27, 0.75)";
  ctx.fillRect(0, 0, boardSize, boardSize);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold " + Math.round(boardSize * 0.068) + "px system-ui, sans-serif";
  ctx.fillText(finished ? "게임 종료" : "캠퍼스 보물찾기", boardSize / 2, boardSize * 0.43);

  ctx.fillStyle = "#b9c6de";
  ctx.font = Math.round(boardSize * 0.038) + "px system-ui, sans-serif";
  const sub = finished
    ? endMessage + " · 점수 " + score + "점"
    : "게임 시작 버튼을 누르세요";
  ctx.fillText(sub, boardSize / 2, boardSize * 0.54);
}

function draw() {
  ctx.clearRect(0, 0, boardSize, boardSize);
  ctx.fillStyle = "#101a2e";
  ctx.fillRect(0, 0, boardSize, boardSize);

  tiles.forEach(function (tile, index) {
    const rect = tileRect(index);
    if (tile.revealed) {
      drawRevealedTile(rect, tile);
    } else {
      drawHiddenTile(rect, tile);
    }
  });

  drawPopups();

  if (!running) {
    drawOverlay();
  }
}

function loop(now) {
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  popups.forEach(function (popup) {
    popup.life -= delta;
    popup.y -= boardSize * 0.09 * delta;
  });
  popups = popups.filter(function (popup) {
    return popup.life > 0;
  });

  draw();
  if (running) {
    rafId = window.requestAnimationFrame(loop);
  }
}

/* ---------- 입력 ---------- */

canvas.addEventListener("pointerdown", function (event) {
  if (!running || finished) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width === 0 ? 1 : boardSize / rect.width;
  const x = (event.clientX - rect.left) * scale;
  const y = (event.clientY - rect.top) * scale;

  const index = hitTest(x, y);
  if (index >= 0) {
    event.preventDefault();
    reveal(index);
  }
});

startBtn.addEventListener("click", startGame);

window.addEventListener("resize", resizeCanvas);

/* ---------- 시작 ---------- */

buildTiles();
resizeCanvas();
updateHud();
