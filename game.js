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

/* GitHub colors */

const greens = [
"#161b22",
"#0e4429",
"#006d32",
"#26a641",
"#39d353"
];

/* CREATE GRID (guaranteed visible) */

function createContributionGrid(){

let cols = 45;
let rows = 7;

let startX = 120;
let startY = 60;

let cell = 14;
let gap = 4;

for(let c=0;c<cols;c++){

for(let r=0;r<rows;r++){

let level = Math.floor(Math.random()*4)+1;

let enemy = {
x:startX + c*(cell+gap),
y:startY + r*(cell+gap),
size:cell,
color:greens[level]
};

enemies.push(enemy);

}

}

console.log("Enemies created:", enemies.length);

}

createContributionGrid();

/* CONTROLS */

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft") ship.x -= 25;
if(e.key==="ArrowRight") ship.x += 25;

if(e.key===" "){
bullets.push({ x:ship.x+30, y:ship.y });
}

});

/* UPDATE */

function update(){

/* move bullets */

for(let i=0;i<bullets.length;i++){
bullets[i].y -= 10;
}

/* store items to remove */

let bulletsToRemove = [];
let enemiesToRemove = [];

/* collision detection */

for(let i = bullets.length - 1; i >= 0; i--){

let b = bullets[i];

for(let j = enemies.length - 1; j >= 0; j--){

let e = enemies[j];

if(
b.x < e.x + e.size &&
b.x + 4 > e.x &&
b.y < e.y + e.size &&
b.y + 12 > e.y
){

explosions.push({
x:e.x,
y:e.y,
frame:0
});

enemies.splice(j,1);
bullets.splice(i,1);

score++;

document.getElementById("score").innerText =
"Score: " + score;

break;

}

}

}
/* remove bullets */

bullets = bullets.filter((_,index)=> !bulletsToRemove.includes(index));

/* remove enemies */

enemies = enemies.filter((_,index)=> !enemiesToRemove.includes(index));

/* explosion animation */

for(let i=explosions.length-1;i>=0;i--){

explosions[i].frame++;

if(explosions[i].frame > 12){
explosions.splice(i,1);
}

}

}
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* ship */

if(shipImg.complete){
ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
}else{
ctx.fillStyle="white";
ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
}

/* bullets */

ctx.fillStyle="red";
bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,4,12);
});

/* enemies */

enemies.forEach(e=>{
ctx.fillStyle = e.color;
ctx.fillRect(e.x,e.y,e.size,e.size);
});

/* explosions */

explosions.forEach(ex=>{
if(explosionImg.complete){
ctx.drawImage(explosionImg, ex.x-10, ex.y-10, 30, 30);
}
});

}

/* GAME LOOP */

function gameLoop(){

update();
draw();
requestAnimationFrame(gameLoop);

}

gameLoop();