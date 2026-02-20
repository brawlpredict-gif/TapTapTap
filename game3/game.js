const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {x:100, y:0, vy:0, onGround:false, sprite:null};
let granny = {x:-100, y:0};
let gravity = 0.6;
let speed = 3;
let worldX = 0;
let platforms = [];

function startGame(cat){
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  player.sprite = new Image();
  player.sprite.src = cat === "black" ? "cat_black.png" : "cat_white.png";

  granny.sprite = new Image();
  granny.sprite.src = "granny.png";

  createPlatforms();
  requestAnimationFrame(loop);
}

function createPlatforms(){
  for(let i=0;i<50;i++){
    platforms.push({x:i*300, y:canvas.height-100});
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

function update(){
  worldX += speed;

  // gravity
  player.vy += gravity;
  player.y += player.vy;

  // ground collision
  player.onGround = false;
  platforms.forEach(p=>{
    if(player.x+50 > p.x-worldX && player.x < p.x-worldX+200){
      if(player.y+80 >= p.y){
        player.y = p.y-80;
        player.vy = 0;
        player.onGround = true;
      }
    }
  });

  // бабка догоняет если медленно
  granny.x += 0.5 + speed*0.2;

  if(granny.x > player.x-50){
    alert("Бабка догнала!");
    location.reload();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // платформы
  ctx.fillStyle = "#444";
  platforms.forEach(p=>{
    ctx.fillRect(p.x-worldX, p.y, 200, 20);
  });

  // игрок
  if(player.sprite.complete)
    ctx.drawImage(player.sprite, player.x, player.y, 80, 80);

  // бабка
  if(granny.sprite.complete)
    ctx.drawImage(granny.sprite, granny.x, canvas.height-180, 100, 100);
}

// прыжок
document.addEventListener("touchstart", jump);
document.addEventListener("keydown", e=>{
  if(e.code==="Space") jump();
});

function jump(){
  if(player.onGround){
    player.vy = -12;
  }
}
