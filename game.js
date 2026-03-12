const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

let ship = {x:430,y:440,w:40,h:20};
let bullets = [];
let enemies = [];

// fetch github contributions
async function loadContributions(){

const res = await fetch("https://github-contributions-api.jogruber.de/v4/Vishwasm485");

const data = await res.json();

let x = 50;
let y = 50;

data.contributions.forEach(week => {

    week.days.forEach(day => {

        if(day.count > 0){

            enemies.push({
                x:x,
                y:y,
                size:12
            });

        }

        y += 15;

    });

    y = 50;
    x += 15;

});

}

loadContributions();

document.addEventListener("keydown",e=>{

if(e.key === "ArrowLeft") ship.x -= 20;
if(e.key === "ArrowRight") ship.x += 20;

if(e.key === " "){
    bullets.push({x:ship.x+20,y:ship.y});
}

});

function update(){

bullets.forEach(b => b.y -= 6);

bullets.forEach((b,bi)=>{
    enemies.forEach((e,ei)=>{

        if(
            b.x < e.x+12 &&
            b.x > e.x &&
            b.y < e.y+12 &&
            b.y > e.y
        ){
            enemies.splice(ei,1);
            bullets.splice(bi,1);
        }

    })
})

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// ship
ctx.fillStyle="white";
ctx.fillRect(ship.x,ship.y,ship.w,ship.h);

// bullets
ctx.fillStyle="red";
bullets.forEach(b=>ctx.fillRect(b.x,b.y,4,10));

// contribution enemies
ctx.fillStyle="lime";
enemies.forEach(e=>{
ctx.fillRect(e.x,e.y,e.size,e.size)
})

}

function gameLoop(){
update();
draw();
requestAnimationFrame(gameLoop);
}

gameLoop();