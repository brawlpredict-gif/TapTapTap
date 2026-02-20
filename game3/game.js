const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// --------- OBJECTS ----------
let player = {x:200, y:0, vy:0, onGround:false, run:null, jump:null};
let granny = {x:-400, y:0, vy:0, onGround:false, run:null, jump:null};

let gravity = 0.7;
let speed = 6;
let worldX = 0;
let platforms = [];
let groundImg;

// -------- SAFE IMAGE LOADER --------
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

// -------- START GAME --------
async function startGame(cat){
  document.getElementById("menu").style.display="none";
  canvas.style.display="block";

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

  createPlatforms();
  requestAnimationFrame(loop);
}

// -------- PLATFORMS --------
function createPlatforms(){
  platforms=[];
  for(let i=0;i<500;i++){
    platforms.push({x:i*300, y:canvas.height-140});
  }
}

// -------- LOOP --------
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

// -------- UPDATE --------
function update(){
  worldX += speed;

  // PLAYER
  player.vy += gravity;
  player.y += player.vy;
  player.onGround=false;

  platforms.forEach(p=>{
    let px=p.x-worldX;
    if(player.x+60>px && player.x<px+200){
      if(player.y+80>=p.y){
        player.y=p.y-80;
        player.vy=0;
        player.onGround=true;
      }
    }
  });

  // GRANNY
  granny.vy += gravity;
  granny.y += granny.vy;
  granny.onGround=false;

  platforms.forEach(p=>{
    let px=p.x-worldX;
    if(granny.x+80>px && granny.x<px+200){
      if(granny.y+100>=p.y){
        granny.y=p.y-100;
        granny.vy=0;
        granny.onGround=true;
      }
    }
  });

  // бабка медленно приближается
  granny.x += 0.15;

  // проигрыш
  if(granny.x > player.x-120){
    alert("Бабка догнала!");
    location.reload();
  }
}

// -------- DRAW --------
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // ground scrolling
  if(groundImg){
    for(let i=0;i<10;i++){
      ctx.drawImage(groundImg, i*groundImg.width - (worldX%groundImg.width), canvas.height-120);
    }
  }

  // debug platforms
  ctx.fillStyle="#222";
  platforms.forEach(p=>{
    ctx.fillRect(p.x-worldX, p.y, 200, 20);
  });

  // player sprite
  let pImg = player.onGround ? player.run : player.jump;
  safeDraw(pImg, player.x, player.y, 80, 80);

  // granny sprite
  let gImg = granny.onGround ? granny.run : granny.jump;
  safeDraw(gImg, granny.x, granny.y, 100, 100);
}

// -------- INPUT --------
document.addEventListener("keydown", e=>{
  if(e.code==="Space") jump();
});
document.getElementById("jumpBtn").ontouchstart = jump;
document.getElementById("jumpBtn").onclick = jump;

function jump(){
  if(player.onGround){
    player.vy = -14;
  }
}
