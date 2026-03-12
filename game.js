const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 520;

let shipImg = new Image();
shipImg.src = "ship.png";

let score = 0;

let ship = {
x:480,
y:450,
w:50,
h:50
};

let bullets = [];
let enemies = [];
let explosions = [];

const greens = [
"#161b22",
"#0e4429",
"#006d32",
"#26a641",
"#39d353"
];

/* Create real GitHub layout */

function createContributionGrid(){

let cols = 52;
let rows = 7;

let cell = 12;
let gap = 4;

let startX = 60;
let startY = 50;

for(let c=0;c<cols;c++){

for(let r=0;r<rows;r++){

let activity = Math.floor(Math.random()*5);

if(activity>0){

enemies.push({
x:startX+c*(cell+gap),
y:startY+r*(cell+gap),
size:cell,
color:greens[activity]
});

}

}

}

}

createContributionGrid();

/* Controls */

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft") ship.x-=25;

if(e.key==="ArrowRight") ship.x+=25;

if(e.key===" "){

bullets.push({
x:ship.x+22,
y:ship.y
});

}

});

/* Update */

function update(){

bullets.forEach(b=>b.y-=10);

bullets.forEach((b,bi)=>{

enemies.forEach((e,ei)=>{

if(
b.x>e.x &&
b.x<e.x+e.size &&
b.y>e.y &&
b.y<e.y+e.size
){

explosions.push({
x:e.x,
y:e.y,
frame:0
});

enemies.splice(ei,1);
bullets.splice(bi,1);

score++;
document.getElementById("score").innerText="Score: "+score;

}

});

});

explosions.forEach(ex=>ex.frame++);

}

/* Draw */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* draw spaceship */

ctx.drawImage(shipImg,ship.x,ship.y,ship.w,ship.h);

/* bullets */

ctx.fillStyle="red";

bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,4,12);
});

/* enemies */

enemies.forEach(e=>{

ctx.fillStyle=e.color;
ctx.fillRect(e.x,e.y,e.size,e.size);

});

/* explosions */

explosions.forEach(ex=>{

ctx.beginPath();
ctx.arc(ex.x+6,ex.y+6,ex.frame*2,0,Math.PI*2);
ctx.strokeStyle="orange";
ctx.stroke();

});

}

/* Game loop */

function gameLoop(){

update();
draw();
requestAnimationFrame(gameLoop);

}

gameLoop();