console.log("GAME START");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.onresize = resize;

let groundY;
let gravity = 1.2;

let player = { x: 120, y: 0, vy: 0, onGround: true };
let granny = { x: -250, y: 0, speed: 4 };

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

  groundY = canvas.height - 140;
  player.y = groundY;
  granny.y = groundY;

  requestAnimationFrame(loop);
}

function jump() {
  if (player.onGround) {
    player.vy = -22;
    player.onGround = false;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.getElementById("jumpBtn").onclick = jump;

// Рисуем даже если картинка не загрузилась
function drawSafe(img, x, y, w, h, color="red") {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // физика кота
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // бабка бежит
  granny.x += granny.speed;

  // если догнала
  if (granny.x + 100 > player.x) {
    alert("Бабка догнала!");
    location.reload();
  }

  // земля
  for (let i = 0; i < canvas.width; i += 128) {
    drawSafe(groundImg, i, groundY + 90, 128, 50, "green");
  }

  // кот
  drawSafe(player.onGround ? playerRun : playerJump, player.x, player.y - 120, 120, 120, "blue");

  // бабка
  drawSafe(grannyRun, granny.x, granny.y - 120, 120, 120, "purple");

  requestAnimationFrame(loop);
}
