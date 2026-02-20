const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerImgRun, playerImgJump;
let grannyImg = new Image();
grannyImg.src = "img/granny_run.png";

let obstacleImg = new Image();
obstacleImg.src = "img/obstacle.png";

let groundImg = new Image();
groundImg.src = "img/ground.png";

let player = { x: 100, y: 0, vy: 0, w: 80, h: 80, slow: 0 };
let granny = { x: 0 };
let obstacles = [];
let groundX = 0;

let speed = 6;
let gravity = 1;
let jumping = false;
let gameRunning = false;

// выбор кота
document.getElementById("blackCat").onclick = () => startGame("black");
document.getElementById("whiteCat").onclick = () => startGame("white");

function startGame(type) {
  playerImgRun = new Image();
  playerImgJump = new Image();

  playerImgRun.src = `img/cat_${type}_run.png`;
  playerImgJump.src = `img/cat_${type}_jump.png`;

  document.getElementById("menu").style.display = "none";
  document.getElementById("jumpBtn").style.display = "block";

  resetGame();
  gameRunning = true;
  loop();
}

function resetGame() {
  player.y = canvas.height - 200;
  player.vy = 0;
  player.slow = 0;
  granny.x = -200;
  obstacles = [];
}

function jump() {
  if (!jumping) {
    player.vy = -20;
    jumping = true;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.getElementById("jumpBtn").onclick = jump;

// obstacles
setInterval(() => {
  if (!gameRunning) return;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - 180,
    w: 60,
    h: 60
  });
}, 2000);

function loop() {
  if (!gameRunning) return;
  requestAnimationFrame(loop);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ground infinite
  groundX -= speed;
  if (groundX < -canvas.width) groundX = 0;
  ctx.drawImage(groundImg, groundX, canvas.height - 100, canvas.width, 100);
  ctx.drawImage(groundImg, groundX + canvas.width, canvas.height - 100, canvas.width, 100);

  // physics
  player.vy += gravity;
  player.y += player.vy;

  if (player.y > canvas.height - 200) {
    player.y = canvas.height - 200;
    player.vy = 0;
    jumping = false;
  }

  // obstacles move
  for (let o of obstacles) {
    o.x -= speed;
    ctx.drawImage(obstacleImg, o.x, o.y, o.w, o.h);

    // collision slow
    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y < o.y + o.h &&
      player.y + player.h > o.y
    ) {
      player.slow = 120; // frames slow
    }
  }

  if (player.slow > 0) {
    player.slow--;
    granny.x += speed + 2; // granny catches faster
  } else {
    granny.x += speed; // same speed
  }

  // draw player
  let img = jumping ? playerImgJump : playerImgRun;
  ctx.drawImage(img, player.x, player.y, player.w, player.h);

  // draw granny
  ctx.drawImage(grannyImg, granny.x, player.y, 80, 80);

  // granny catches
  if (granny.x + 60 > player.x) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  alert("Бабка догнала!");
  location.reload();
}