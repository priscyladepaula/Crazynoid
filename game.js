//dimensões da tela de fundo
var box = document.getElementById("box");
var largura = 500;
var altura = 400;
//posição da tela
var minX = 400;
var minY = 150;
var maxX = minX + largura;
var maxY = minY + altura;
 
//bola
var ball = document.getElementsByClassName("ball");
var ballRadius = 10;
var ballSize = ballRadius*2+1;
//posição inicial da bola
var x = largura/2;
var y = altura-30;
//velocidade da bola
var speedX = 8;
var speedY = -8;

//barra
var paddle = document.getElementById("paddle");
var padW = 80;
var padH = 10;
var padX = ((largura - padW)/2)-20;
var padY = altura - 10;

//score
var score = 0;
var pts = document.getElementById("score");

function drawBox(){
	box.style.left = (minX) + "px";
	box.style.top = (minY) + "px";
	box.style.width = largura + "px";
	box.style.height = altura + "px";
}

function drawBall() { 
	ball[0].style.left = (x - ballRadius) + "px";
	ball[0].style.top  = (y - ballRadius) + "px";
	ball[0].style.width = ballSize + "px";
	ball[0].style.height = ballSize + "px";
}

function drawPaddle(){
	paddle.style.left = padX + "px";
	paddle.style.top = padY + "px";
	paddle.style.width = padW + "px";
	paddle.style.height = padH + "px";
}

//posição da barra não ultrapassar da tela
function mouseMove(e){
	if(e.pageX > minX && e.pageX < maxX){
		padX = Math.max(e.pageX - minX - (padW/2), 0);
		padX = Math.min(largura - padW, padX);
	}
}

document.addEventListener("mousemove", mouseMove, false);

//criação do bloco colorido na tela
function Bloco(pos){
	this.gerarElemento = function(){
		var elm = document.createElement("div");
		elm.classList.add("brick");
		document.body.appendChild(elm);
		return elm;
	}
	this.updateTamanho = function(){
		this.elemento.style.width = this.tamanhoX + "px";
		this.elemento.style.height = this.tamanhoY + "px";
	}
	this.updatePos = function(){
		this.elemento.style.left = this.pos[0]+minX + "px";
		this.elemento.style.top = this.pos[1]+minY + "px";
	}
	this.dir = -1;
	this.pos = pos;
	this.tamanhoX = 200;
	this.tamanhoY = 25;
	this.elemento = this.gerarElemento();
	this.updatePos();
	this.updateTamanho();
}

function refresh(){
	for(var i in bricks){
		bricks[i].updatePos();
	}
}

//função para alternar a velocidade do bloco colorido na posição X
function update(){
	for(var i in bricks){
		var p = bricks[i];
		var px = parseInt(p.pos[0]);
		var vel = 3;
		px += vel * p.dir;
		if(px > 0 && px < largura - (p.tamanhoX-8)){
			p.pos[0] = px;
		} else {
			p.dir = -1 * p.dir;
		}
		
		collision();
		pts = document.getElementById("score").innerHTML = "SCORE: " + score;
	}
}

function collision(){
	drawBall();
	drawPaddle();
	
	//colisão da bola com o bloco colorido
	for(var i in bricks){
		var p = bricks[i];
		var colX = x + speedX + ballRadius > p.pos[0] && x + speedX - ballRadius < p.pos[0] + p.tamanhoX;
		var colY = y + speedY + ballRadius > p.pos[1] && y + speedY - ballRadius < p.pos[1] + p.tamanhoY;
		
		if(colX && colY){
			score += ~~(Math.random()*10);
			if(colY) speedX = -speedX;
			if(colX) speedY = -speedY;
		}
	}
	
	//colisão da bola com as paredes da tela
	if (x + speedX + ballRadius > largura || x + speedX - ballRadius < 0) {
		speedX = -speedX;
	}

	if (y + speedY - ballRadius < 0) {
		speedY = -speedY;		
	}
	
	else if(y + speedY + ballRadius > altura - padH){
		if(x > padX && x < padX + padW){
		   speedX = 16 * ((x-(padX+padW/2))/padW); //a velocidade alterna a cada vez que a bola bate na barra
		   speedY = -speedY;
		}
		else if(y > altura){
			alert("G  A  M  E    O  V  E  R  !");
			document.location.reload(); //reinicia o jogo automaticamente
		}
	}

	x += speedX;
	y += speedY;
}

//blocos
function game(){
	for(var i=0; i < 1; i++){
		var blocox = 0;
		var blocoy = 5;
		var p = new Bloco([blocox,blocoy]);
		bricks.push(p);
	}
	gameloop();
}

function gameloop(){
	drawBox();
	refresh();
	update();
	requestAnimationFrame(gameloop);
}

var bricks = [];
game();