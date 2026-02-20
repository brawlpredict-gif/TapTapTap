const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// ===== СПРАЙТЫ =====
const sprites = {
  bg: new Image(),
  ground: new Image(),
  obstacle: new Image(),
  catRun: new Image(),
  catJump: new Image(),
  grannyRun: new Image(),
  grannyJump: new Image()
};

sprites.bg.src = "img/bg.png";
sprites.ground.src = "img/ground.png";
sprites.obstacle.src = "img/obstacle.png";
sprites.grannyRun.src = "img/granny_run.png";
sprites.grannyJump.src = "img/granny_jump.png";

// ===== ИГРОВАЯ ЛОГИКА =====
let started = false;
const gravity = 1;
const groundY = canvas.height - 140;
let speed = 6;
let bgX = 0;

const player = { x: 150, y: groundY, vy: 0, jump: false, slow: 0 };
const granny = { x: 0 };
let chaseDistance = 220;
const obstacles = [];

// ===== ВЫБОР КОТА (КЛИК И ТАП) =====
function bindMenu() {
  const c1 = document.getElementById("cat1");
  const c2 = document.getElementById("cat2");

  c1.addEventListener("click", () => selectCat(1));
  c2.addEventListener("click", () => selectCat(2));

  c1.addEventListener("touchstart", () => selectCat(1));
  c2.addEventListener("touchstart", () => selectCat(2));
}
bindMenu();

function selectCat(id) {
  sprites.catRun.src = `img/cat${id}_run.png`;
  sprites.catJump.src = `img/cat${id}_jump.png`;
  document.getElementById("menu").style.display = "none";
  started = true;
  spawnObstacle();
  loop();
}

// ===== ПРЕПЯТСТВИЯ =====
function spawnObstacle() {
  obstacles.push({ x: canvas.width + 300, y: groundY, w: 60, h: 80 });
  setTimeout(spawnObstacle, 1500 + Math.random() * 1500);
}

// ===== ПРЫЖОК =====
function jump() {
  if (!player.jump) {
    player.vy = -18;
    player.jump = true;
  }
}
addEventListener("keydown", e => { if (e.code === "Space") jump(); });
addEventListener("touchstart", jump);

// ===== UPDATE =====
function update() {
  // фон
  bgX -= speed / 2;
  if (bgX < -canvas.width) bgX = 0;

  // физика
  player.vy += gravity;
  player.y += player.vy;
  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.jump = false;
  }

  // препятствия
  obstacles.forEach(o => o.x -= speed);
  while (obstacles.length && obstacles[0].x < -100) obstacles.shift();

  // столкновение
  let hit = false;
  obstacles.forEach(o => {
    if (player.x < o.x + o.w && player.x + 60 > o.x &&
        player.y < o.y + o.h && player.y + 80 > o.y) hit = true;
  });

  if (hit) {
    player.slow = 40;
    chaseDistance -= 25;
  }

  if (player.slow > 0) player.slow--;
  else chaseDistance += 0.1;

  chaseDistance = Math.max(0, Math.min(350, chaseDistance));
  granny.x = player.x - chaseDistance;

  if (chaseDistance < 15) {
    alert("БАБКА ПОЙМАЛА ТЕБЯ");
    location.reload();
  }
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(sprites.bg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(sprites.bg, bgX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(sprites.ground, 0, groundY + 80, canvas.width, 120);

  obstacles.forEach(o => ctx.drawImage(sprites.obstacle, o.x, o.y, o.w, o.h));

  const g = player.jump ? sprites.grannyJump : sprites.grannyRun;
  ctx.drawImage(g, granny.x, groundY, 80, 120);

  const c = player.jump ? sprites.catJump : sprites.catRun;
  ctx.drawImage(c, player.x, player.y, 80, 120);
}

// ===== LOOP =====
function loop() {
  if (!started) return;
  update();
  draw();
  requestAnimationFrame(loop);
}