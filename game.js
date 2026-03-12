const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 520;

/* IMAGES */

const shipImg = new Image();
shipImg.src = "ship.png";

const explosionImg = new Image();
explosionImg.src = "explosion.png";

/* GAME STATE */

let ship = {
x:480,
y:450,
w:50,
h:50
};

let bullets = [];
let enemies = [];
let explosions = [];

let score = 0;

/* GITHUB COLORS */

const greens = [
"#161b22",
"#0e4429",
"#006d32",
"#26a641",
"#39d353"
];

/* LOAD REAL GITHUB CONTRIBUTION GRAPH */

async function loadContributions(){

const username = "Vishwasm485";

try{

const res = await fetch(
`https://github-contributions-api.jogruber.de/v4/${username}`
);

const data = await res.json();

let startX = 60;
let startY = 50;

let cell = 12;
let gap = 4;

data.contributions.forEach((week,w)=>{

week.days.forEach((day,d)=>{

let level = day.level;

if(level > 0){

enemies.push({
x:startX + w*(cell+gap),
y:startY + d*(cell+gap),
size:cell,
color:greens[level]
});

}

});

});

}catch(e){

console.log("Failed to load contributions");

}

}

loadContributions();

/* CONTROLS */

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft") ship.x -= 25;

if(e.key==="ArrowRight") ship.x += 25;

if(e.key===" "){

bullets.push({
x:ship.x + ship.w/2,
y:ship.y
});

}

});

/* UPDATE */

function update(){

bullets.forEach(b => b.y -= 10);

/* BULLET COLLISION */

bullets.forEach((b,bi)=>{

enemies.forEach((e,ei)=>{

if(
b.x > e.x &&
b.x < e.x + e.size &&
b.y > e.y &&
b.y < e.y + e.size
){

/* explosion */

explosions.push({
x:e.x,
y:e.y,
frame:0
});

/* remove enemy */

enemies.splice(ei,1);
bullets.splice(bi,1);

/* score */

score++;

document.getElementById("score").innerText =
"Score: " + score;

}

});

});

/* explosion animation */

explosions.forEach((ex,i)=>{

ex.frame++;

if(ex.frame > 20){

explosions.splice(i,1);

}

});

}

/* DRAW */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* spaceship */

ctx.drawImage(
shipImg,
ship.x,
ship.y,
ship.w,
ship.h
);

/* bullets */

ctx.fillStyle="red";

bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,4,12);
});

/* enemies */

enemies.forEach(e=>{

ctx.fillStyle = e.color;

ctx.fillRect(
e.x,
e.y,
e.size,
e.size
);

});

/* explosions */

explosions.forEach(ex=>{

ctx.drawImage(
explosionImg,
ex.x-10,
ex.y-10,
30,
30
);

});

}

/* GAME LOOP */

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();