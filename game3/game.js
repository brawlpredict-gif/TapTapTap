const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

console.log("GAME START");

let started=false;
const gravity=1;
const groundY=canvas.height-150;
let speed=6;
let bgX=0;

const player={x:150,y:groundY,vy:0,jump:false};
const granny={x:0};
let chaseDistance=200;
const obstacles=[];

// ===== MENU =====
document.getElementById("cat1").onclick=start;
document.getElementById("cat2").onclick=start;

function start(){
 document.getElementById("menu").style.display="none";
 started=true;
 spawn();
 loop();
}

// ===== OBSTACLES =====
function spawn(){
 obstacles.push({x:canvas.width+200,y:groundY,w:60,h:80});
 setTimeout(spawn,2000);
}

// ===== JUMP =====
function jump(){
 if(!player.jump){player.vy=-18;player.jump=true;}
}
addEventListener("touchstart",jump);
addEventListener("keydown",e=>{if(e.code==="Space")jump()});

// ===== UPDATE =====
function update(){
 player.vy+=gravity;
 player.y+=player.vy;
 if(player.y>=groundY){player.y=groundY;player.vy=0;player.jump=false;}

 obstacles.forEach(o=>o.x-=speed);
 while(obstacles.length&&obstacles[0].x<-100)obstacles.shift();

 let hit=false;
 obstacles.forEach(o=>{
  if(player.x<o.x+o.w&&player.x+60>o.x) hit=true;
 });

 if(hit) chaseDistance-=10;
 else chaseDistance+=0.05;

 chaseDistance=Math.max(0,300);
 granny.x=player.x-chaseDistance;
}

// ===== DRAW =====
function draw(){
 ctx.fillStyle="black";
 ctx.fillRect(0,0,canvas.width,canvas.height);

 // ground
 ctx.fillStyle="green";
 ctx.fillRect(0,groundY+80,canvas.width,120);

 // obstacles
 ctx.fillStyle="red";
 obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));

 // player
 ctx.fillStyle="blue";
 ctx.fillRect(player.x,player.y,60,80);

 // granny
 ctx.fillStyle="purple";
 ctx.fillRect(granny.x,groundY,60,80);
}

// ===== LOOP =====
function loop(){
 if(!started)return;
 update();
 draw();
 requestAnimationFrame(loop);
}
