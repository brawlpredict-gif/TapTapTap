document.getElementById("debug").innerText = "JS LOADED";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

let x = 50;

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 300);

  ctx.fillStyle = "lime";
  ctx.fillRect(x, 150, 50, 50);

  x += 2;
  if (x > 400) x = -50;

  requestAnimationFrame(loop);
}

loop();
