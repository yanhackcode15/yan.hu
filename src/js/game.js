//----initiatizing all configuration variables---
var keys = {
	pause: false,
	enter: false,
	speed: 'low',
	end: false,
};
var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight - 50 - 50;
var ctx = canvas.getContext("2d");
var x = 0; //ball's position
var y = 0; //ball's position
var dx = 0;
var dy = 0;
var ballRadius = 0;
var color = "";
var paddleHeight = 0;
var paddleWidth = 0;
var paddleX = 0;
var rightPressed = false;
var leftPressed = false;
var brickWidth = 0;
var brickHeight = 0;
var brickPadding = 0;
var brickOffsetTop = 0;
var brickOffsetLeft = 0;
var brickRowCount = 0;
var brickColumnCount = 0;
var score = 0; 
var lives = 0;
var success = 0;
var bricks = [];
//------END of Initializing----
gameInitiator();
requestAnimationFrame(mainLoop);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

const instructions = `Press [Enter] To Play, [Q] to quit…
[Space] to Pause/Unpause…
Speed: [1] slow [2] medium [3] fast…`;
typewriter('instructions', instructions);
function typewriter(parentId, text) {
	const parent = document.getElementById(parentId);
	const caret = document.createElement('span');
	caret.className = 'blink-caret';
	let line, i = 0;
	text = `\n${text}`; // Ensure a new line div is created on first pass
	const interval = setInterval(typeLetter, 75);

	function typeLetter() {
		let char = text[i];
		if (char === '\n') {
			// Create a new line and move the blinking curser to there
			line = document.createElement('h2');
			parent.appendChild(line);
			line.appendChild(caret);
		} else {
			char = document.createTextNode(char);
			line.insertBefore(char, caret);
		}
		if (++i >= text.length) {
			clearInterval(interval);
		}
	}
}


var currentState = startGame;
var animationRequestId = null;

function gameInitiator() {
	gameReset();
	successCounterReset();
}

function gameReset() {
	gameConfig();
	scoreReset();
	livesReset();
	keyPressReset();
	ballPosReset();
	paddlePosReset();
	speedReset();
	bricks = bricksInitiator();
}
function gameConfig() {
	ballRadius = 10;
	
	color = "#EFCB68";

	paddleHeight = 10;
	paddleWidth = 80;

	brickWidth = 75;
	brickHeight = 20;
	brickPadding = 5;
	brickOffsetTop = 30;
	brickOffsetLeft = 30;
	brickRowCount = 3;
	brickColumnCount = Math.floor((canvas.width - brickPadding - brickOffsetLeft)/(brickWidth + brickPadding));
}

function scoreReset() {
	score = 0;
}

function livesReset() {
	lives = 3;
}

function successCounterReset() {
	success = 0;
}

function keyPressReset() {
	rightPressed = false;
	leftPressed = false;
}

function ballPosReset() {
	x = canvas.width/2; 
	y = canvas.height-80;
}

function paddlePosReset() {
	paddleX = (canvas.width - paddleWidth)/2;
}
function speedReset(){
	setSpeed('low');
}

function bricksInitiator() {
	let bck = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bck[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bck[c][r] = {x: 0, y: 0, status: 1};
		}
	}
	return bck; 
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	drawScore();
	drawLives();
	collisionDetection();
	if (x + dx + ballRadius > canvas.width || x + dx - ballRadius < 0) {
		dx = -dx;
		color = getRandomColor();

	}
	if (y + dy - ballRadius < 0 || ( x + dx > paddleX && x + dx < paddleX + paddleWidth && y + dy + ballRadius> canvas.height )) {
		dy = -dy;
		color = getRandomColor();
	}
	else if (y + dy + ballRadius> canvas.height) {
		lives--;
		resetBallsPaddle();
		if (lives===0) {
			//alert("GAME OVER");
			document.getElementById("gameover").classList.remove("hide");
			gameReset();
		}
	}
	x += dx;
	y += dy;

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
	
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth/2, paddleHeight);
	ctx.fillStyle = "#808080";
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.rect(paddleX+paddleWidth/2, canvas.height - paddleHeight, paddleWidth/2, paddleHeight);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
}

function keyDownHandler(e) {
	const space = 32;
	const right = 39;
	const left = 37;
	const enter = 13;
	const quit = 81;
	const low = 49;
	const med = 50;
	const high = 51;
	const showAll = 27;
	const hide = 72;
	if (e.keyCode === right) {
		rightPressed = true;
	}
	else if (e.keyCode === left) {
		leftPressed = true;
	}
	else if (e.keyCode === space) {
		if (animationRequestId) {
			cancelAnimationFrame(animationRequestId);
			animationRequestId = 0;
		}
		else {
			animationRequestId = requestAnimationFrame(mainLoop);
		}
	}
	else if (e.keyCode === enter) {
		keys.enter = true;
		console.log('success', success);
		document.getElementById("myCanvas").style.backgroundSize = "0px 0px";
		if (!animationRequestId) {
			gameReset();
			animationRequestId = requestAnimationFrame(mainLoop);
		}
		gameReset();
	}
	else if (e.keyCode === low) {
		keys.speed = 'low';
		setSpeed(keys.speed);
	}
	else if (e.keyCode === med) {
		keys.speed = 'med';
		setSpeed(keys.speed);
	}
	else if (e.keyCode === high) {
		keys.speed = 'high';
		setSpeed(keys.speed);
	}
	else if (e.keyCode === quit ) {
		keys.end = true;
		keys.enter = false;
		if (animationRequestId) {
			cancelAnimationFrame(animationRequestId);
			animationRequestId = 0;
			//resetBallsPaddle();
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);	
	}
	else if (e.keyCode === showAll) {
		successCounterReset();
		showAllContent();
	}
	else if (e.keyCode === hide) {
		successCounterReset();
		hideAllContent();
	}
}


function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}	
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function drawBricks() {
	for (let c=0; c<brickColumnCount; c++) {
		for(let r=0; r<brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
				ctx.fillStyle = "#EFCB68";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "20px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Score: "+score, 35, 20);
}

function drawLives() {
	ctx.font = "25px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Lives: "+lives, 125, 20);
}

function collisionDetection() {
	for (let c=0; c<brickColumnCount; c++) {
		for(let r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if ( b.status 
				&& x > b.x && x < (b.x + brickWidth) 
				&& y > b.y && y < (b.y + brickHeight)
			) {
				dy = -dy;
				b.status = 0;
				score++;
				console.log(brickRowCount * brickColumnCount);
				if (score === brickRowCount * brickColumnCount) {
					success+=1;
					// console.log('success',success);
					document.getElementById("success").classList.remove("hide");
					// switch (success) {
					// 	case 1: 
					// 	document.getElementById("about").classList.remove("hide");
					// 	break;
					// 	case 2:
					// 	document.getElementById("experience").classList.remove("hide");
					// 	break;
					// 	case 3:
					// 	document.getElementById("education_geekery").classList.remove("hide");
					// 	break;
					// }
					gameReset();
					
				}
			}
		}
	}
}
function resetBallsPaddle() {
    ballPosReset();
    paddlePosReset();
    keys.speed = 'low';
    setSpeed(keys.speed);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
function setSpeed(sp){
	switch (sp) {
		case 'low': 
			dx = 2;
			dy = -2;
			break;
		case 'med':
			dx = 5;
			dy = -5;
			break;
		case 'high':
			dx = 8;
			dy = -8;
			break;
	}
}

function showAllContent() {
	document.getElementById("about").classList.remove("hide");
	document.getElementById("experience").classList.remove("hide");
	document.getElementById("projects").classList.remove("hide");
	document.getElementById("education").classList.remove("hide");
}
function hideAllContent(){
	document.getElementById("about").classList.add("hide");
	document.getElementById("experience").classList.add("hide");
	document.getElementById("projects").classList.add("hide");
	document.getElementById("education").classList.add("hide");	
}

function mainLoop(){
    currentState(); // call the current game state
    animationRequestId = requestAnimationFrame(mainLoop);
}
function startGame() {
	if (keys.enter) {
		currentState = game; 
	}
}
function game() {
	draw();	
	// if (keys.pause) {
	// 	currentState = pause;
	// }
}