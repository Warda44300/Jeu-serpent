//function qui s'éxécute dès le téléchargement de la page
//vu que je change le code en js es6:
//ctx = canvas.getContext('2d') n'est plus dans function init mais devient la valeur de const ctx car sa valeur ne change jamais
//var delay devient let delay car sa propriété et changer plus long dans le code

//Changement de déclaration de function en fuction fléché
window.onload = () => {
	const canvasWidht = 900;
	const canvasHeight = 600;
	const blockSize = 20;
	const canvas = document.getElementsByTagName("canvas")[0];
	const ctx = canvas.getContext('2d');
	const widthInBlocks = canvasWidht/blockSize;
	const heightInBlocks = canvasHeight/blockSize;
	//pour placer game over au centre
	const centreX = canvasWidht / 2;
	const centreY = canvasHeight / 2;
	let delay;
	let snakee;
	let applee;
	let score;
	//let timeout  va me permettre de controler ma fonction setTimeout(refreshCanvas,delay);
	let timeout;

	const init = () => {
		canvas.width = canvasWidht;
		canvas.height = canvasHeight;
		//style de la bordure du canvas
		canvas.style.border = "20px solid #0f056b";
		canvas.style.margin = "20px auto";
		//pour que mon margin marche il faut que le canvas soit en block
		canvas.style.display = "block";
		canvas.style.backgroundColor = "#013de1";
		// document.body.appendChild(canvas);
		//changement ES6 tout ce qu'il ya en dessous devient qu'une ligne de code vu j'appelle launch(restart) qui contient tous les éléments
		launch();
		// snakee = new Snake ([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");premier block tête ensuite c'est la taille du corps
		// applee = new Apple([10,10]);
		// initilisation de ma var score
		// score = 0;
		// refreshCanvas();	
	}

	//Création de la fonction restart(cette fonction va tout re créer(function init) à chaque fois pour faire une nouvelle partie)
	//Changement avec js ES6 restart devient launch
	const launch = () => {
		snakee = new Snake ([[6,2], [5,2], [4,2], [3,2]], "right");
		applee = new Apple([10,10]);
		//pour relancer le jeu à 0
		score = 0;
		clearTimeout(timeout);
		delay = 500;
		refreshCanvas();	
	}
	const refreshCanvas = () => {
		snakee.advance();
		if(snakee.checkCollision()){
			//éxecution de la function game over créer dans function gameOver
			gameOver();
		}
		else{
			if(snakee.isEatingApple(applee)){
				//pour augmenté le score à chaque fois que le serpent mange un pomme
				score++;
			//controler la vitesse %5 on recupérer le reste de la division et ensuite on accélére
				if(score %5 == 0)
				{
					speedUp();
					// delay = delay - 100;
				} 
				// console.log(score);
			console.log(delay);
			console.log(score);
			console.log(score %5);
				//si le serpent mange la pomme aller voir this advance
				snakee.ateApple = true;
				do{
					applee.setNewPosition();
				}//verifie que la pomme n'est pas sur le serpent
				while(applee.isOnSnake(snakee))
			}
			ctx.clearRect(0,0, canvasWidht, canvasHeight);
			//score est en premier pour pas qu'il se mette sur mon serpent ou pomme mais en dessous
			drawScore();
			snakee.draw();
			applee.draw();	
			timeout = setTimeout(refreshCanvas,delay);
		}		
	}
//faire accéléré mon serpent
	const speedUp = () => {
	delay /= 2;
	}
//Création de la fonction gameOver qui va écrit game over à chaque fois que le serpent touche le mur ou se mange
	const gameOver =() =>{
		ctx.save();
		//pour changer la police et taille du game over
		ctx.font = "bold 70px sans-serif";
		//pour changer la couleur game over 
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		//pour que mon chiffre score redescends vraiment au centre
		ctx.textBaseline = "middle";
		//pour donner style au game over
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		//fonction qui faire apparaitre mon style au game over
		ctx.strokeText("GAME OVER", centreX, centreY -180);
		//function qui permet d'écrit à l'écran game over, et j'indique l'endroit ou je le veux
		ctx.fillText("GAME OVER",centreX, centreY -180);
		//change pour Appuyer sur la touche espace pour rejouer
		ctx.font = "bold 30px sans-serif";
		ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX, centreY -120);
		//function qui va permet de pouvoir expliquer à l'utilisateur que marche à suivre pour refaire une nouvelle partie
		ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY -120);
		ctx.restore();
	}

//Pour afficher ma variable score à l'écran
	const drawScore = () => {
		ctx.save();
		//pour changer la police et taille du score
		ctx.font = "bold 200px sans-serif";
		//pour changer la couleur
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		//pour que mon chiffre score redescends vraiment au centre
		ctx.textBaseline = "middle";
		//pour placer le score au centre
		// var centreX = canvasWidht / 2; Déclarer avec change js ES6 en haut avec const
		// var centreY = canvasHeight / 2; Déclarer avec change js ES6 en haut avec const

		//function qui permet d'afficher le score et son emplacement
		ctx.fillText(score.toString(),centreX, centreY);
		ctx.restore();	
		//gérer la vitesse
		// this.delay = 1000;
		
	}
//augmenter la vitesse
	// function vitesseSnake()
	// {
	// 	ctx.save();

	// 	ctx.restore();
	// }

//drawblock prends un contexte et une position(array x y) drawBlock(ctx,this.body[i])
	const drawBlock =(ctx, position) => {
		const x = position[0] * blockSize;
		const y = position[1] * blockSize;
		ctx.fillRect(x,y, blockSize, blockSize);
	}
//création du serpent
//fonction snake protopyte du serpent qui prend dedans le corp
//ctx.save() permet de garde les premiers paramétre déjà défini du canvas (couleur taille...)
//le corps du serpent c'est des petits block
//chaque black à deux array un x et y [6,4(tete du serpent)]

	function Snake(body, direction){
		this.body = body;		
		this.direction = direction;//pour faire changer de direction au serpent		
		this.ateApple = false;//savoir si mon serpent à bien mangé une pomme et qu'il grandise
		//designé le serpent dans le canvas
		this.draw = function(){
			ctx.save();
			ctx.fillStyle = "#FFDC00";
			for(let i = 0; i < this.body.length; i++){
				drawBlock(ctx,this.body[i]);
			}	
			ctx.restore();//permet de restoré après change les paramétres d'avant			
		};
//pour avancer mon serpent
		this.advance = function(){
			const nextPosition = this.body[0].slice();
			switch(this.direction){
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;
				default:
				//throw erreur
				throw("Invalide Direction ");
			}
			this.body.unshift(nextPosition);
			//pour agrandir mon serpent
			if(!this.ateApple)
				//le serpent s'arrête
				this.body.pop();
			else
				this.ateApple = false;
		};
		this.setDirection = function(newDirection){
			let allowedDirections;
			switch(this.direction){
				case "left":
				case "right":
					allowedDirections = ["up","down"];//LET car ici en change la valeur
					break;
				case "down":
				case "up":
					allowedDirections = ["left", "right"];
					break;
				default:
					//throw erreur
					throw("Invalide Direction ");
			}
//direction permisse
			if(allowedDirections.indexOf(newDirection) > -1){
				this.direction = newDirection;
			}
		};
//faire en sorte que le serpent ne sors pas du canvas(function qui gére si le serpent se prends le mur ou si il se mange lui même)
		this.checkCollision = function(){
			let wallCollision = false;
			let snakeCollison = false;
			const head = this.body[0];
			const rest = this.body.slice(1);
			const snakeX = head[0];
			const snakeY = head[1];
			const minX = 0;
			const minY = 0;
			const maxX = widthInBlocks - 1;
			const maxY = heightInBlocks - 1;

//variable pour savoir si il y a un problème avec le x(tête pas entre les murs horizontaux s'est pris le murs)
			const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

//pour savoir à quel moment il y a une collision
			if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
				wallCollision = true;
			}
//pour savoir à quel moment le serpent s'est mangé tout seule(si le head et égal un élément du corps)
			for(let i = 0; i < rest.length ; i++){
				if(snakeX === rest[i] [0] && snakeY === rest[i][1]){
					snakeCollison = true;
				}
			}
		return wallCollision || snakeCollison;
		};
//pour que le serpent mange la pomme
		this.isEatingApple = function(appleToEat){
			const head = this.body[0];
		//si la tête de mon serpent(x position 0)est égal la tête pomme(x appleToEat position 0) et pareil pour y
		//if else n'en pas besoin de {} quand il y a qu'une ligne dedans
			if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				return true;
			else
				return false;
		};
	}
//Création de la pomme
	function Apple(position){
		this.position = position;

		this.draw = function(){
			const radius = blockSize/2;
			const x = this.position[0]*blockSize + radius;
			const y = this.position[1]*blockSize + radius;
			ctx.save();
			ctx.fillStyle = "#33cc33";
			//designé un rond
			ctx.beginPath();
			ctx.arc(x,y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
	//déplacer ma pomme (déplacement aléatoire)pour faire des chiffre aléatoire(grille de x =0 à29 et y=0 à 19) objet Math+fonction de l'objet ramdom
		this.setNewPosition = function(){
			const newX = Math.round(Math.random() * (widthInBlocks - 1));//donne un chiffre entre à et 29 round pour avoir pas que dépasser 29
			const newY = Math.round(Math.random() * (heightInBlocks - 1));
			this.position = [newX, newY];
		};
	//pour éviter que ma pompe se trouve sur mon serpent
		this.isOnSnake = function(snakeToCheck){
			let isOnSnake = false;
			//on passe sur tous le corps du serpent avec une boucle
			for(let i = 0 ; i < snakeToCheck.body.length; i++){
				if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
				{
					isOnSnake = true;
				}
			}
			return isOnSnake;
		};

	}

//document.onkeydown permet de changer quand l'utilisateur tape sur son clavier
	document.onkeydown = (e) => {
	// keycode= touche qui a été appuier
		const key = e.keyCode;
		let newDirection;
		switch(key){
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			//pour que la touche espace fonctionne(code espace 32) (fonction restart etreturn pour arrêter la function restart)
			case 32:
				launch();
				return;
			default:
				//return arret fonction ne continue pas 
				return;
		}
		snakee.setDirection(newDirection);
	}

	const socket = io('http://ws.jeune-vision.com:3000');
	socket.on('message', (telecommande) => {
		let newDirection;
		 switch(telecommande){
			case "TOP":
			newDirection = "up";
				break;
			case "LEFT":
			newDirection = "left";
				break;
			case "RIGHT":
				newDirection = "right";
				break;
		 	case "DOWN":
				newDirection = "down";
			break;
	}
		 snakee.setDirection(newDirection);
	})

	//init(); permet d'exécuter ma fonction
	init();
	
}

//telecommande
const socket = io('http://ws.jeune-vision.com:3000');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const button4 = document.getElementById('button4');

button1.onclick = (e) => {
	// keycode= touche qui a été appuier
	socket.emit('message', 'TOP');
	}

button2.onclick = (e) => {
	// keycode= touche qui a été appuier
	socket.emit('message', 'LEFT');
	}
button3.onclick = (e) => {
	// keycode= touche qui a été appuier
	socket.emit('message', 'RIGHT');
	}
button4.onclick = (e) => {
	// keycode= touche qui a été appuier
	socket.emit('message', 'DOWN');
	}

console.log(button1);




//var xCoord et yCoord permet de déterminé la taille
//xCoord += 5 
//setTime va me permettre de rappeler ma fonction refresh à chaque fois que le delai est fini
// les secondes s'écrit en milliseconde exemple: 1s=1000 100= 10éme de seconde
//propriété canvas permet de dessigner à l'intérieur d'une grille
//document.createElement est une fonction qui permet d'afficher élément créer sur notre page html
//document.body permet de rattacher un élément à ma page htlm
//appendChild ici fonction js qui tag
//variable ctx permet de designer dans le canvas
//ctx.fillRect création de mon rectangle
//ctx.fillStyle = "#ff0000" définie la couleur du rectangle
//ctx.fillRect(30,30 , 100, 50) fonction fillRect prend 4 arguments x distance horizontal y distance vertical (les deux premiers sont le y x par partir duquel on veut dessigné + larguer+ hauteur)

//designé un rect
//ctx.fillStyle = "#ff0000";
//ctx.fillRect(xCoord , yCoord , 150, 80);




//Création du serpent
//var canvasWidht et canvasHeight pour régler la taille de ma grille
//var blockSize taille de mes blocs dans ma grille 
