
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 520;

/* ── images ── */
const shipImg = new Image();
shipImg.src = "./ship.png";

const explosionImg = new Image();
explosionImg.src = "./explosion.png";

/* ── state ── */
let ship = { x: 480, y: 450, w: 60, h: 60 };
let bullets    = [];
let enemies    = [];
let explosions = [];
let score      = 0;

/* ── github colours ── */
const greens = ["#161b22","#0e4429","#006d32","#26a641","#39d353"];

/* ── build enemy grid ── */
function createGrid() {
  const cols = 40, rows = 7;
  const startX = 150, startY = 180;
  const size = 14, gap = 4;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const level = Math.floor(Math.random() * 4) + 1;
      enemies.push({
        x: startX + c * (size + gap),
        y: startY + r * (size + gap),
        w: size,
        h: size,
        color: greens[level]
      });
    }
  }
}
createGrid();

/* ── keyboard ── */
const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === " ") {
    bullets.push({
      x: ship.x + ship.w / 2 - 2,
      y: ship.y,
      w: 4,
      h: 12
    });
  }

  if ([" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

/* ── AABB overlap check ── */
function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw
      && ax + aw > bx
      && ay < by + bh
      && ay + ah > by;
}

/* ── update ── */
function update() {

  if (keys["ArrowLeft"])  ship.x -= 5;
  if (keys["ArrowRight"]) ship.x += 5;
  ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));

  for (const b of bullets) b.y -= 8;
  bullets = bullets.filter(b => b.y + b.h > 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bu = bullets[j];
      if (overlaps(bu.x, bu.y, bu.w, bu.h, en.x, en.y, en.w, en.h)) {
        explosions.push({ x: en.x, y: en.y, timer: 12 });
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        break;
      }
    }
  }

  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].timer--;
    if (explosions[i].timer <= 0) explosions.splice(i, 1);
  }
}

/* ── draw ── */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (shipImg.complete && shipImg.naturalWidth > 0) {
    ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
  }

  ctx.fillStyle = "red";
  for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);

  for (const en of enemies) {
    ctx.fillStyle = en.color;
    ctx.fillRect(en.x, en.y, en.w, en.h);
  }

  for (const ex of explosions) {
    if (explosionImg.complete && explosionImg.naturalWidth > 0) {
      ctx.globalAlpha = ex.timer / 12;
      ctx.drawImage(explosionImg, ex.x - 10, ex.y - 10, 34, 34);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = `rgba(255,160,0,${ex.timer / 12})`;
      ctx.fillRect(ex.x - 4, ex.y - 4, 22, 22);
    }
  }
}

/* ── game loop (60 fps) ── */
let lastTime = 0;

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  if (delta >= 1000 / 60) {
    lastTime = timestamp - (delta % (1000 / 60));
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop(0);
