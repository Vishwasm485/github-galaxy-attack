const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

let ship = {x:430,y:440,w:40,h:20};
let bullets = [];
let enemies = [];

// fetch github contributions
async function loadContributions() {

const username = "Vishwasm485";

try {

const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
const data = await res.json();

let startX = 60;
let startY = 40;
let cell = 14;
let gap = 4;

data.contributions.forEach((week, w) => {

    week.days.forEach((day, d) => {

        if(day.count > 0){

            enemies.push({
                x: startX + w * (cell + gap),
                y: startY + d * (cell + gap),
                size: cell
            });

        }

    });

});

} catch(err) {

console.log("Contribution API failed");

generateFakeGrid();

}

}
function generateFakeGrid(){

let startX = 60;
let startY = 40;
let cell = 14;
let gap = 4;

for(let w=0; w<20; w++){

    for(let d=0; d<7; d++){

        if(Math.random() > 0.4){

            enemies.push({
                x: startX + w * (cell + gap),
                y: startY + d * (cell + gap),
                size: cell
            });

        }

    }

}

}
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
ctx.fillStyle="#39d353";

enemies.forEach(e=>{
ctx.fillRect(e.x,e.y,e.size,e.size);
});

}

function gameLoop(){
update();
draw();
requestAnimationFrame(gameLoop);
}

gameLoop();