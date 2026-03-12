const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

let ship = { x: 480, y: 440, w: 40, h: 20 };
let bullets = [];
let enemies = [];

/* Create contribution grid */

function createContributionGrid(){

let cols = 52;
let rows = 7;

let cell = 12;
let gap = 4;

let startX = 80;
let startY = 60;

for(let c=0; c<cols; c++){

    for(let r=0; r<rows; r++){

        if(Math.random() > 0.5){

            enemies.push({
                x: startX + c*(cell+gap),
                y: startY + r*(cell+gap),
                size: cell
            });

        }

    }

}

}

createContributionGrid();

/* Controls */

document.addEventListener("keydown", e => {

if(e.key === "ArrowLeft") ship.x -= 25;
if(e.key === "ArrowRight") ship.x += 25;

if(e.key === " "){

    bullets.push({
        x: ship.x + ship.w/2,
        y: ship.y
    });

}

});

/* Update game */

function update(){

bullets.forEach(b => b.y -= 8);

bullets.forEach((b,bi)=>{

    enemies.forEach((e,ei)=>{

        if(
            b.x > e.x &&
            b.x < e.x + e.size &&
            b.y > e.y &&
            b.y < e.y + e.size
        ){

            enemies.splice(ei,1);
            bullets.splice(bi,1);

        }

    });

});

}

/* Draw */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* spaceship */

ctx.fillStyle="white";
ctx.fillRect(ship.x, ship.y, ship.w, ship.h);

/* bullets */

ctx.fillStyle="red";

bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,4,10);
});

/* contribution squares */

ctx.fillStyle="#39d353";

enemies.forEach(e=>{
ctx.fillRect(e.x,e.y,e.size,e.size);
});

}

/* Game loop */

function gameLoop(){

update();
draw();
requestAnimationFrame(gameLoop);

}

gameLoop();