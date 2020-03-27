let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let soundOver = new Audio();
let soundScore = new Audio();
let soundHit = new Audio();
let soundWin = new Audio();
soundHit.src = "vut.mp3";
soundOver.src = "ketthuc.mp3";
soundScore.src = "ting.mp3";
soundWin.src = "yeah.mp3";

class Ball {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }

    drawBall = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = "yellow";
        context.fill();
        context.closePath();
    };
    moveBall = function () {
        this.x += this.dx;
        this.y += this.dy;
    };
    hitsWall = function () {
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.dx = -this.dx;
            soundHit.play().then();
            console.log(this.dx)
        }
        if (this.y < this.radius) {
            this.dy = -this.dy;
            soundHit.play().then();
        }
    }
}

class Bars {
    constructor(width, height, x, y, speed, isMoveLeft, isMoveRight) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isMoveLeft = isMoveLeft;
        this.isMoveRight = isMoveRight;
    };

    drawBars = function () {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "orange";
        context.fill();
        context.closePath();
    };
}

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) {
        bars.isMoveLeft = false;
    }
    if (event.keyCode === 39) {
        bars.isMoveRight = false;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
        bars.isMoveLeft = true;
    }
    if (event.keyCode === 39) {
        bars.isMoveRight = true;
    }
});

function moveTheBars() {
    if (bars.isMoveLeft) {
        bars.x -= bars.speed;
    }
    if (bars.isMoveRight) {
        bars.x += bars.speed;
    }
}

class Brick {
    constructor(width, height, margin, rows, cols) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.rows = rows;
        this.cols = cols;
    }
}

let ball = new Ball(20, canvas.height / 3, 10, 1.5, 3.5);
let bars = new Bars(70, 10, canvas.width / 3 + 30, canvas.height - 10, 5, false, false);
let brick = new Brick(50, 10, 25, 3, 5);
let isGameOver = false;
let isGameWin = false;
let userScore = 0;

let brickList = [];
for (let i = 0; i < brick.rows; i++) {
    for (let j = 0; j < brick.cols; j++) {
        brickList.push({
            x: brick.margin + j * (brick.width + brick.margin),
            y: brick.margin + i * (brick.height + brick.height),
            isBroken: false
        })
    }
}


function drawBrick() {
    brickList.forEach(function (value) {
        if (!value.isBroken) {
            context.beginPath();
            context.rect(value.x, value.y, brick.width, brick.height);
            context.fillStyle= "red";
            context.fill();
            context.closePath();
        }
    })
}

function upDateBars() {
    if (bars.x < 0) {
        bars.x = 0;
    }
    if (bars.x > canvas.width - bars.width) {
        bars.x = canvas.width - bars.width;
    }
}

function ballHitsTheBars() {
    if (ball.x + ball.radius >= bars.x && ball.x + ball.radius <= bars.x + bars.width &&
        ball.y + ball.radius >= canvas.height - bars.height) {

        soundHit.play().then();
        ball.dy = -ball.dy;
    }
}

function ballHitsBrick() {
    brickList.forEach(function (value) {
        if (!value.isBroken) {
            if (ball.x >= value.x && ball.x <= value.x + brick.width &&
                ball.y + ball.radius >= value.y && ball.y - ball.radius <= value.y + brick.height) {
                ball.dy = -ball.dy;
                value.isBroken = true;
                soundScore.play().then();
                userScore++;
                document.getElementById("score").value = " " + userScore;
                if (userScore >= 15) {
                    isGameOver = true;
                    isGameWin = true;
                    soundWin.play().then();
                }
            }
        }
    })
}

function checkGameWin() {
    if (isGameWin) {
        alert(" You Win ");
    } else {
        alert("Game Over . " + " Điểm của bạn : " + userScore);
    }
}

function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
        soundOver.play().then();
    }
}

function main() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        ball.drawBall();
        ball.moveBall();
        ball.hitsWall();

        bars.drawBars();
        drawBrick();
        upDateBars();
        ballHitsTheBars();
        ballHitsBrick();
        moveTheBars();
        checkGameOver();
        requestAnimationFrame(main);
    } else {
        checkGameWin();
    }
}
function refresh() {
    location.reload();
}
