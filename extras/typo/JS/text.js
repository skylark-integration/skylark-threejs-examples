//words typed
var count = 0; 
//errors done
var errors = 0;

var loader = new THREE.FontLoader();

var geomet;
var mat;
var mesh1;
var text = new THREE.Group();


var dict = ["HOUSE","CAT","PAPER","NEXT","ROCK","BAND","PEN","ART","HAND","NOSE","FIRE","EXIT","FOX","LIGHT","LAMP","TABLE","CARD","PLATE","BAG","PHONE",
			"WATER","WIND","TRIP","DRESS","GOLD","BEER","FIGHT","HEAT","QUICK","DUCK","CLOCK","NINJA","CHAIR","DOG","MOON","YOGA","GHOST","GAS","WISE","FAKE",
			"UNDO","HUMAN","HUG","BIRD","PUNCH","PRIDE","ROAD","URBAN","CAMP","DRUM","BOUND","TREE","TOOTH","FOOT","BOARD","SHIP","UNCLE","CARGO","MILK",
			"STREET","HIKE","BIKE","RIDE","HORSE","BEAR","TONE","BILL","CHART","ROOF","WHEEL","BONE","TORCH","MAIL","TOWN","DIRT","SAND","SHORE","HAT","CHILD",
			"KNIFE","SPORT","RIVER","STOCK","BUS","FIELD","GRASS","TRASH","NERD","GEEK","SMOKE","LION","DARK","PAINT","DRAW","PRINT","ELF","PHOTO","GLUE","CLAY",
			"HUNT","CHESS","SIN","EVIL","PEACE","PARTY","WATCH","PIECE","CASH","COIN","ROOM","CASTLE","BEAT","BEARD","FOAM","GEAR","PEAK","MOUNT","GATE","AIR",
			"BELT","ATOM","STEAM","VAPOR","CANDLE","CHIP","RAM","CLIENT","HATER","GENIUS","SALT","SUGAR","BREAK","GRACE","TITLE","TURTLE","LIFE","FILTER","FARMER","PARK",
			];

//index for the dict
var next; 
//flag for typing errors
var err = false; 

var word;

var hardMode = false;
var rotated = false;

var text_space;



var write = function(){

	loader.load( 'Fonts/optimer_regular.typeface.json', function ( font ) {

		text = new THREE.Group();
		
		//vedi se avendo un array moooolto grande, non ricapitano mai le stesse parole
		//altrimenti ti fa un array di appoggio, levi la parola dall'array principale e la inserisci in quello di appoggio
		
		
		next = Math.floor(Math.random()*dict.length);
		//next = dict.length-1;
		word = dict[next];


		for(var i = 0; i<word.length; i++){
			geo = new THREE.TextGeometry( word.charAt(i), {
				font: font,
				size: 150,
				height: 0.5,
				curveSegments: 0.6,
				bevelEnabled: true,
				bevelThickness: 20,
				bevelSize: 10,
				bevelSegments: 5
				} );
				
			mat = new THREE.MeshStandardMaterial({color: 0x0000ff});
			
			mesh1 = new THREE.Mesh(geo,mat);
			
			//adjust the space depending on the letters
			if(i>0){ 
				mesh1.position.x = text.children[i-1].position.x + 190;
				
				if(word.charAt(i-1) == 'I')  mesh1.position.x -= 90; 
					
				if(word.charAt(i-1) == 'J' || word.charAt(i-1) == 'Y' || word.charAt(i-1) == 'L' || word.charAt(i-1) == 'F' || 
				   word.charAt(i-1) == 'T' || word.charAt(i-1) == 'X' || word.charAt(i-1) == 'S' || word.charAt(i-1) == 'E' )  mesh1.position.x -= 70; 
				   
				if(word.charAt(i-1) == 'P' || word.charAt(i-1) == 'R' || word.charAt(i-1) == 'A' || word.charAt(i-1) == 'B' )  mesh1.position.x -= 50; 
				
			}

			text.add(mesh1);

		}
		
		text.rotation.x= -0.2;
		text.position.y =500;
		
		
		if(hardMode){
			if(Math.random() > 0.5){
				text.rotation.y = -Math.PI;
				rotated = true;
			}
			else rotated = false;
		}


		

		//if the word has an odd number of letters, take the x position of the central letter
		if(word.length % 2 != 0) text_space = text.children[(word.length-1)/2].position.x;
		
		//otherwise, take the next letter and subtract something 
		else text_space = text.children[word.length/2].position.x - 45;
		
		
		//now you can translate the position w.r.t. the position of the boy 
		//and according to the orientation of the word
		
		if (!rotated) text.position.x = body.position.x - text_space;
		else  text.position.x= body.position.x + text_space; 


		
		text.castShadow = true;
		
		
		scene.add(text);

	} );

}

//index for the letters of the word
var step = 0; 

var startTime = 0;

var feed = document.getElementById("feed");



document.addEventListener('keydown', function(event) {
	
	//the listener works only if the player is playing
	if(startTime != 0){
	
		if(event.keyCode == 13 && step == text.children.length){
				feed.style.color = "green";
				feed.innerHTML = "Good!";
				
				count ++;
				processCorrect();				
				step = 0;
				scene.remove(text);
				write();
		}
		
		

		else if(step < text.children.length) {
			if(String.fromCharCode(event.keyCode) == text.children[step].geometry.parameters.text){
				text.children[step].material.color.setHex(0x00ff00);
				step++;
				feed.innerHTML = "";
			}
			else if(text.children[step].material.color.getHex()!=0xff0000){
				text.children[step].material.color.setHex(0xff0000);
				errors++;
				feed.style.color = "red";
				feed.innerHTML = "Fix typo!";
				processError();	
			}
		}
	
	}
});



var processCorrect = function(){
	
	head.remove(mouth2);
	head.add(mouth1);
	
	eye.material.map = texture1;
	
	head.material.color.setHex(0xffb347);
	
	if(state == "walk") speedWalk +=1;
	if(speedWalk == 4){
		speedWalk = 1;
		needWalkToRun = true;
		state = "trans";
	}
		
	if(state == "run") speedRun +=1;
	if(speedRun == 4){
		speedRun = 3;
		needRunToFly = true;
		state = "trans";
	}
	
	if(state == "fly" && speedFly < 3) speedFly +=1;			
	
}

var processError = function(){
	
	head.remove(mouth1);
	head.add(mouth2);
	
	eye.material.map = texture2;
	
	head.material.color.setHex(0xff0000);
	
	if(state == "walk" && speedWalk !=1) speedWalk -=1;

	if(state == "run" && speedRun !=1) speedRun -=1;

	if(state == "fly") speedFly -=1;
	if(state == "fly" && speedFly == 0){
		speedFly = 1;
		needFlyToRun = true;
		state = "trans";
	}
}

