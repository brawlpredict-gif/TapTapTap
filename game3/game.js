const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {x:200, y:0, vy:0, onGround:false, run:null, jump:null};
let granny = {x:-200, y:0, vy:0, onGround:false, run:null, jump:null};

let gravity = 0.7;
let speed = 6;
let worldX = 0;
let platforms = [];
let groundImg = new Image();

// MOBILE BUTTON
let jumpButton = document.createElement("button");
jumpButton.innerText = "JUMP";
jumpButton.style.position="fixed";
jumpButton.style.bottom="20px";
jumpButton.style.right="20px";
jumpButton.style.padding="20px";
jumpButton.style.fontSize="20px";
document.body.appendChild(jumpButton);

jumpButton.ontouchstart = jump;

function startGame(cat){
  document.getElementById("menu").style.display="none";
  canvas.style.display="block";

  player.run = new Image();
  player.jump = new Image();
  if(cat==="black"){
    player.run.src="cat_black_run.png";
    player.jump.src="cat_black_jump.png";
  } else {
    player.run.src="cat_white_run.png";
    player.jump.src="cat_white_jump.png";
  }

  granny.run = new Image();
  granny.jump = new Image();
  granny.run.src="granny_run.png";
  granny.jump.src="granny_jump.png";

  groundImg.src="ground.png";

  createPlatforms();
  requestAnimationFrame(loop);
}

function createPlatforms(){
  platforms=[];
  for(let i=0;i<500;i++){
    platforms.push({x:i*300, y:canvas.height-120});
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

function update(){
  worldX += speed;

  // PLAYER PHYSICS
  player.vy += gravity;
  player.y += player.vy;
  player.onGround=false;

  platforms.forEach(p=>{
    let px = p.x - worldX;
    if(player.x+60>px && player.x<px+200){
      if(player.y+80>=p.y){
        player.y=p.y-80;
        player.vy=0;
        player.onGround=true;
      }
    }
  });

  // GRANNY AI
  granny.vy += gravity;
  granny.y += granny.vy;
  granny.onGround=false;

  platforms.forEach(p=>{
    let px = p.x - worldX;
    if(granny.x+80>px && granny.x<px+200){
      if(granny.y+100>=p.y){
        granny.y=p.y-100;
        granny.vy=0;
        granny.onGround=true;
      }
    }
  });

  // бабка прыгает если платформа заканчивается
  if(granny.onGround){
    let nextPlatform = platforms.find(p=>p.x-worldX>granny.x && p.x-worldX<granny.x+300);
    if(!nextPlatform){
      granny.vy=-12;
    }
  }

  // бабка ОЧЕНЬ медленная
  granny.x += 0.05;

  // проигрыш
  if(granny.x > player.x-120){
    alert("Бабка догнала!");
    location.reload();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // GROUND
  for(let i=0;i<10;i++){
    ctx.drawImage(groundImg, i*groundImg.width - (worldX%groundImg.width), canvas.height-100);
  }

  // PLATFORMS
  ctx.fillStyle="#222";
  platforms.forEach(p=>{
    ctx.fillRect(p.x-worldX, p.y, 200, 20);
  });

  // PLAYER
  let pImg = player.onGround ? player.run : player.jump;
  if(pImg.complete) ctx.drawImage(pImg, player.x, player.y, 80, 80);

  // GRANNY
  let gImg = granny.onGround ? granny.run : granny.jump;
  if(gImg.complete) ctx.drawImage(gImg, granny.x, granny.y, 100, 100);
}

// INPUT
document.addEventListener("keydown", e=>{
  if(e.code==="Space") jump();
});
document.addEventListener("touchstart", jump);

function jump(){
  if(player.onGround){
    player.vy=-14;
  }
}
