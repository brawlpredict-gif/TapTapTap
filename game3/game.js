let player = { x: 150, y: 0, vy: 0, onGround: true, speed: 6 };
let granny = { x: -800, y: 0, speed: 4 };

let worldSpeed = 6;
let groundY;
let gravity = 1.1;
let groundX = 0;

// ===== ДЖОЙСТИК =====
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
let joyActive = false;
let joyStartY = 0;

joystick.addEventListener("touchstart", e => {
  joyActive = true;
  joyStartY = e.touches[0].clientY;
});

joystick.addEventListener("touchmove", e => {
  if (!joyActive) return;
  let dy = e.touches[0].clientY - joyStartY;
  dy = Math.max(-50, Math.min(50, dy));
  stick.style.top = 40 + dy + "px";

  // вверх = прыжок
  if (dy < -30) jump();
});

joystick.addEventListener("touchend", () => {
  joyActive = false;
  stick.style.top = "40px";
});

function jump() {
  if (player.onGround) {
    player.vy = -20;
    player.onGround = false;
  }
}

// ===== ГЛАВНЫЙ ЦИКЛ =====
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // мир едет
  groundX -= worldSpeed;
  if (groundX <= -128) groundX = 0;

  // физика
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // 👵 логика бабки (НЕ догоняет сразу)
  if (worldSpeed < granny.speed) {
    granny.x += granny.speed - worldSpeed;
  } else {
    granny.x -= 0.5; // отстаёт
  }

  // если реально догнала
  if (granny.x > player.x - 80) {
    alert("Бабка догнала!");
    location.reload();
  }

  // земля
  for (let i=-128; i<canvas.width; i+=128) {
    drawSafe(groundImg, i + groundX, groundY + 100, 128, 50, "green");
  }

  // кот
  drawSafe(player.onGround ? playerRun : playerJump, player.x, player.y - 120, 120, 120, "blue");

  // бабка
  drawSafe(grannyRun, granny.x, granny.y - 120, 120, 120, "purple");

  requestAnimationFrame(loop);
}
