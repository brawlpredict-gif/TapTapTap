console.log("GAME LOADED");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let groundY = canvas.height - 120;
let gravity = 1.1;

let player = { x: 100, y: groundY, vy: 0, onGround: true };
let granny = { x: -250, y: groundY };

let playerRun = new Image();
let playerJump = new Image();

const grannyRun = new Image();
grannyRun.src = "granny_run.png";

const grannyJump = new Image();
grannyJump.src = "granny_jump.png";

const groundImg = new Image();
groundImg.src = "ground.png";

function startGame(cat) {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  if (cat === "black") {
    playerRun.src = "cat_black_run.png";
    playerJump.src = "cat_black_jump.png";
  } else {
    playerRun.src = "cat_white_run.png";
    playerJump.src = "cat_white_jump.png";
  }

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

function drawSafe(img, x, y, w, h) {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = "magenta";
    ctx.fillRect(x, y, w, h);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // физика
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // бабка бежит
  granny.x += 5;

  // если догнала
  if (granny.x + 120 > player.x) {
    alert("Бабка догнала!");
    location.reload();
  }

  // земля
  for (let i = 0; i < canvas.width; i += 128) {
    drawSafe(groundImg, i, groundY + 80, 128, 40);
  }

  // кот
  drawSafe(player.onGround ? playerRun : playerJump, player.x, player.y - 100, 120, 120);

  // бабка
  drawSafe(grannyRun, granny.x, granny.y - 120, 120, 120);

  requestAnimationFrame(loop);
}
