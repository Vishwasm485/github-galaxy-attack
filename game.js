const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 520;

/* IMAGES */

const shipImg = new Image();
shipImg.src = "./ship.png";

const explosionImg = new Image();
explosionImg.src = "./explosion.png";

/* GAME STATE */

let ship = { x:480, y:450, w:60, h:60 };

let bullets = [];
let enemies = [];
let explosions = [];

let score = 0;

/* COLORS */

const greens = [
"#161b22",
"#0e4429",
"#006d32",
"#26a641",
"#39d353"
];

/* CREATE GRID */

function createGrid(){

let cols = 45;
let rows = 7;

let size = 14;
let gap = 4;

let startX = 120;
let startY = 60;

for(let c=0;c<cols;c++){
for(let r=0;r<rows;r++){

let level = Math.floor(Math.random()*4)+1;

enemies.push({
x:startX + c*(size+gap),
y:startY + r*(size+gap),
size:size,
color:greens[level]
});

}
}

}

createGrid();

/* CONTROLS */

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft") ship.x -= 25;
if(e.key==="ArrowRight") ship.x += 25;

if(e.key===" "){
bullets.push({
x:ship.x + ship.w/2 - 2,
y:ship.y,
w:4,
h:12
});
}

});

/* UPDATE */

function update(){

/* MOVE BULLETS */

for(let b of bullets){
b.y -= 10;
}

/* REMOVE OFFSCREEN BULLETS */

bullets = bullets.filter(b => b.y > 0);

/* COLLISION */

for(let i=enemies.length-1;i>=0;i--){

let e = enemies[i];

for(let j=bullets.length-1;j>=0;j--){

let b = bullets[j];

if(
b.x < e.x + e.size &&
b.x + b.w > e.x &&
b.y < e.y + e.size &&
b.y + b.h > e.y
){

explosions.push({x:e.x,y:e.y,frame:0});

enemies.splice(i,1);
bullets.splice(j,1);

score++;
document.getElementById("score").innerText = "Score: " + score;

break;

}

}

}

/* EXPLOSION TIMER */

for(let i=explosions.length-1;i>=0;i--){

explosions[i].frame++;

if(explosions[i].frame > 12){
explosions.splice(i,1);
}

}

}

/* DRAW */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* SHIP */

if(shipImg.complete){
ctx.drawImage(shipImg,ship.x,ship.y,ship.w,ship.h);
}else{
ctx.fillStyle="white";
ctx.fillRect(ship.x,ship.y,ship.w,ship.h);
}

/* BULLETS */

ctx.fillStyle="red";

for(let b of bullets){
ctx.fillRect(b.x,b.y,b.w,b.h);
}

/* ENEMIES */

for(let e of enemies){
ctx.fillStyle = e.color;
ctx.fillRect(e.x,e.y,e.size,e.size);
}

/* EXPLOSIONS */

for(let ex of explosions){

if(explosionImg.complete){
ctx.drawImage(explosionImg,ex.x-10,ex.y-10,30,30);
}

}

}

/* LOOP */

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();