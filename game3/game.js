const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// OBJECTS
let player, granny;
let gravity = 0.7;
let speed = 6;
let slowTimer = 0;
let worldX = 0;
let obstacles = [];
let groundImg, obstacleImg;

// IMAGE LOADER
function loadImage(src){
  return new Promise(resolve=>{
    const img = new Image();
    img.src = src;
    img.onload = ()=>resolve(img);
  });
}

function safeDraw(img,x,y,w,h){
  if(img && img.complete && img.naturalWidth>0){
    ctx.drawImage(img,x,y,w,h);
  }
}

// START GAME
async function startGame(cat){
  document.getElementById("menu").style.display="none";
  canvas.style.display="block";

  player = {x:200, y:0, vy:0, onGround:false, run:null, jump:null};
  granny = {x:-250, y:0, vy:0, onGround:false, run:null, jump:null};

  if(cat==="black"){
    player.run  = await loadImage("cat_black_run.png");
    player.jump = await loadImage("cat_black_jump.png");
  } else {
    player.run  = await loadImage("cat_white_run.png");
    player.jump = await loadImage("cat_white_jump.png");
  }

  granny.run  = await loadImage("granny_run.png");
  granny.jump = await loadImage("granny_jump.png");
  groundImg   = await loadImage("ground.png");
  obstacleImg = await loadImage("obstacle.png");

  obstacles = [];
  worldX = 0;
  requestAnimationFrame(loop);
}

// LOOP
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

// UPDATE
function update(){
  worldX += speed;

  // PLAYER PHYSICS
  player.vy += gravity;
  player.y += player.vy;
  player.onGround=false;

  let groundY = canvas.height - 140;
  if(player.y >= groundY){
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // OBSTACLES SPAWN
  if(Math.random() < 0.02){
    obstacles.push({x: worldX + canvas.width, y: groundY, hit:false});
  }

  // COLLISION
  obstacles.forEach(o=>{
    let ox = o.x - worldX;
    if(!o.hit && player.x+60>ox && player.x<ox+60 && player.y+80>o.y){
      o.hit=true;
      slowTimer = 60; // 1 секунда замедления
    }
  });

  // SLOW EFFECT
  let currentSpeed = speed;
  if(slowTimer>0){
    currentSpeed = speed * 0.4;
    slowTimer--;
  }

  worldX += currentSpeed - speed; // компенсируем

  // GRANNY SAME SPEED
  granny.vy += gravity;
  granny.y += granny.vy;
  if(granny.y >= groundY){
    granny.y = groundY;
    granny.vy = 0;
    granny.onGround=true;
  }

  // бабка догоняет если ты медленный
  granny.x += (speed - currentSpeed) * 0.5;

  // LOSE
  if(granny.x > player.x-120){
    endGame();
  }
}

// DRAW
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // ground
  if(groundImg){
    for(let i=0;i<10;i++){
      ctx.drawImage(groundImg, i*groundImg.width - (worldX%groundImg.width), canvas.height-100);
    }
  }

  // obstacles
  obstacles.forEach(o=>{
    let ox=o.x-worldX;
    safeDraw(obstacleImg, ox, o.y-60, 60, 60);
  });

  // player
  let pImg = player.onGround ? player.run : player.jump;
  safeDraw(pImg, player.x, player.y-80, 80, 80);

  // granny
  let gImg = granny.onGround ? granny.run : granny.jump;
  safeDraw(gImg, granny.x, granny.y-100, 100, 100);
}

// INPUT
document.getElementById("jumpBtn").onclick = jump;
document.getElementById("jumpBtn").ontouchstart = jump;
document.addEventListener("keydown", e=>{
  if(e.code==="Space") jump();
});

function jump(){
  if(player.onGround){
    player.vy = -15;
  }
}

// END GAME
function endGame(){
  alert("Бабка догнала!");
  location.reload(); // возвращаем в меню выбора
}
