const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: 0, vy: 0, speed: 6, onGround: true };
let granny = { x: -200, y: 0, speed: 6 };

let groundY = canvas.height - 150;
let gravity = 1.2;
let gameRunning = false;
let playerRun, playerJump;

const grannyRun = new Image();
grannyRun.src = "granny_run.png";

const grannyJump = new Image();
grannyJump.src = "granny_jump.png";

const groundImg = new Image();
groundImg.src = "ground.png";

function startGame(cat) {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;

  if (cat === "black") {
    playerRun = new Image();
    playerRun.src = "cat_black_run.png";
    playerJump = new Image();
    playerJump.src = "cat_black_jump.png";
  } else {
    playerRun = new Image();
    playerRun.src = "cat_white_run.png";
    playerJump = new Image();
    playerJump.src = "cat_white_jump.png";
  }

  player.y = groundY;
  granny.y = groundY;

  requestAnimationFrame(loop);
}

function jump() {
  if (player.onGround) {
    player.vy = -20;
    player.onGround = false;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.getElementById("jumpBtn").onclick = jump;

function safeDraw(img, x, y, w, h) {
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
  }
}

function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ГРАВИТАЦИЯ
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // БАБКА БЕЖИТ С ТОЙ ЖЕ СКОРОСТЬЮ
  granny.x += granny.speed;

  // ЕСЛИ ДОГНАЛА
  if (granny.x + 100 > player.x) {
    alert("Бабка догнала!");
    location.reload();
  }

  // ЗЕМЛЯ
  for (let i = 0; i < canvas.width; i += 128) {
    safeDraw(groundImg, i, groundY + 100, 128, 50);
  }

  // КОТ
  if (player.onGround)
    safeDraw(playerRun, player.x, player.y - 100, 120, 120);
  else
    safeDraw(playerJump, player.x, player.y - 120, 120, 120);

  // БАБКА
  if (player.onGround)
    safeDraw(grannyRun, granny.x, granny.y - 120, 120, 120);
  else
    safeDraw(grannyJump, granny.x, granny.y - 120, 120, 120);

  requestAnimationFrame(loop);
}
