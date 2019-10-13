let order = [];
let playerOrder = [];
let flash;
let turn;
let flashesCount;
let compTurn;
let intervalId;
let noise = true;
let on = false;
let win;
let array;
let round;
var session = {
	'turno': []
};

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

onButton.addEventListener('click', (event) => {
	if (onButton.checked == true) {
		on = true;
		turnCounter.innerHTML = "-";
	} 
	else {
		on = false;
		turnCounter.innerHTML = "";
		clearColor();
		clearInterval(intervalId);
	}
});

startButton.addEventListener('click', (event) => {
	if (on || win) {
		play();
	}
});

websocket = new WebSocket("ws://127.0.0.1:6789/");
websocket.onmessage = function (event) {
	data = JSON.parse(event.data);
    switch (data.type) {
        case 'round':
			console.log(data);
			array = data.sequence;
			win = false;
			order = [];
			playerOrder = [];
			flash = 0;
			intervalId = 0;
			turn = array.length;
			flashesCount = 0;
			turnCounter.innerHTML = 1;
			for (var i = 0; i < array.length; i++) {
				order.push(array[i]);
			}
			compTurn = true;
			intervalId = setInterval(gameTurn, 800);
            break;
		case 'timer':
			document.getElementById("timer").innerHTML = data.value + "s ";
			break;
		case 'users':
			break;
		case 'state':
			break;
		default:
			console.error("unsupported event", data);
    }
};

function play() {
	websocket.send(JSON.stringify({action: 'start'}));
}

function gameTurn() {
	on = false;
	if (flash == turn) {
		clearInterval(intervalId);
		compTurn = false;
		clearColor();
		on = true;
	}
	if (compTurn) {
		clearColor();
		setTimeout(() => {
			if (order[flash] == 0) one();
			if (order[flash] == 1) two();
			if (order[flash] == 2) three();
			if (order[flash] == 3) four();
			flash++;
		}, 200);
	}
	++flashesCount;
	if(flashesCount == turn) {
		websocket.send(JSON.stringify({action: 'play'}));
	}
}

function one() {
	if (noise) {
		let audio = document.getElementById("clip1");
		audio.play();
	}
	noise = true;
	topLeft.style.backgroundColor = "lightgreen";
}

function two() {
	if (noise) {
		let audio = document.getElementById("clip2");
		audio.play();
	}
	noise = true;
	topRight.style.backgroundColor = "tomato";
}

function three() {
	if (noise) {
		let audio = document.getElementById("clip3");
		audio.play();
	}
	noise = true;
	bottomLeft.style.backgroundColor = "yellow";
}

function four() {
	if (noise) {
		let audio = document.getElementById("clip4");
		audio.play();
	}
	noise = true;
	bottomRight.style.backgroundColor = "lightskyblue";
}

function clearColor() {
	topLeft.style.backgroundColor = "darkgreen";
	topRight.style.backgroundColor = "darkred";
	bottomLeft.style.backgroundColor = "goldenrod";
	bottomRight.style.backgroundColor = "darkblue";
}

function flashColor() {
	topLeft.style.backgroundColor = "lightgreen";
	topRight.style.backgroundColor = "tomato";
	bottomLeft.style.backgroundColor = "yellow";
	bottomRight.style.backgroundColor = "lightskyblue";
}

topLeft.addEventListener('click', (event) => {
	if (on) {
		playerOrder.push(0);
		check();
		one();
		if(!win) {
			setTimeout(() => {
				clearColor();
			}, 300);
		}
	}
})

topRight.addEventListener('click', (event) => {
	if (on) {
		playerOrder.push(1);
		check();
		two();
		if(!win) {
			setTimeout(() => {
				clearColor();
			}, 300);
		}
	}
})

bottomLeft.addEventListener('click', (event) => {
	if (on) {
		playerOrder.push(2);
		check();
		three();
		if(!win) {
			setTimeout(() => {
				clearColor();
			}, 300);
		}
	}
})

bottomRight.addEventListener('click', (event) => {
	if (on) {
		playerOrder.push(3);
		check();
		four();
		if(!win) {
			setTimeout(() => {
				clearColor();
			}, 300);
		}
	}
})

function check() {
	if (playerOrder.length == array.length){
		session.turno.push(playerOrder);
		winGame();
	}
	if (turn == playerOrder.length && !win){
		session.turno.push(playerOrder);
		turn++;
		playerOrder = [];
		compTurn = true;
		flash = 0;
		turnCounter.innerHTML = turn;
		intervalId = setInterval(gameTurn, 800);
	}
}

function winGame() {
	flashColor();
	turnCounter.innerHTML = "DONE";
	on = false;
	win = true;
}