var menu = document.getElementById("menu");
var time = document.getElementById("time");
var mt = document.getElementById("mt");

//move camera when game starting
var needMoveCamera = false;

var gameTime = 30;

var moveCamera = function(){
	if(camera.position.z > 800){
		camera.position.z -= 3;
		camera.position.y -= 6;
		time.innerHTML =  gameTime;
	}
	else{
		needMoveCamera = false;
		//set the focus on the world to type words
		document.getElementById("play").blur();
		document.getElementById("hard").blur();
		document.getElementById('world').focus();
		//start animation
		state = "walk";
		//write the first word
		write();
		//save the starting time
		startTime = Date.now();
	}
	
}


document.getElementById("play").addEventListener("click", function(){
	//make the menu disappear and move it up
	menu.style.opacity = "0";
	//menu.style.top = "-900px";
	//disable the buttons
	document.getElementById("play").disabled = true; 
	document.getElementById("hard").disabled = true; 

	needMoveCamera = true;
}); 

document.getElementById("hard").addEventListener("click", function(){

	menu.style.opacity = "0";
	//menu.style.top = "-900px";
	document.getElementById("play").disabled = true; 
	document.getElementById("hard").disabled = true; 

	needMoveCamera = true;

	//active the hard mode
	hardMode = true;
}); 


var checkTime = function(){
	
	//if the starTime is setted, it means that the game is started
	if(startTime !=0){
		//update clock on the screen
		time.innerHTML = gameTime - Math.floor((Date.now() - startTime) /1000);
		
		//update the meters done
		var meters = Math.floor(body.position.x)/100;
		mt.innerHTML = Math.floor(meters) + " Mt";
		
		//if the time is over, give the results and reset all
		if(Date.now() - startTime > gameTime* 1000){

			//MENU
			menu.style.opacity = "1";
			//menu.style.top = "0px";
			
			document.getElementById("play").disabled = false;
			document.getElementById("hard").disabled = false;
			
			document.getElementById("rule").innerHTML = "<p>" +
				"Typed words: " + count + "<br><br>" +
				"Words per second: " + Math.floor(count/gameTime*100)/100 + "<br><br>"+
				"Errors: " + errors + "<br><br>" +
				"Meters: " + meters + "<br><br>" +
				"</p>"
			;
					
			feed.innerHTML = "";
			mt.innerHTML = "";
			
			//CAMERA
			camera.position.set(0,430,900);

			//CREATURE
			body.position.set(0,0,0);
			body.rotation.set(0,0,0);
			
			head.position.set(40,70,0);
			head.rotation.set(0,0,0);
			
			pawR.position.set(0,-40,40);
			pawR.rotation.set(0,0,0);
			pawL.position.set(0,-40,-40);
			pawL.rotation.set(0,0,0);
			
			pawR.scale.x = 1;
			pawL.scale.x = 1;
			
			handR.position.set(0,0,35);
			handR.rotation.set(Math.PI / 2,Math.PI / 2,0);
			handL.position.set(0,0,-35);
			handL.rotation.set(Math.PI / 2,Math.PI / 2,0);
			
			pivotR.position.set(-15,0,8);
			pivotR.rotation.set(0,0,-0.4);
			
			pivotL.position.set(-15,0,-8);
			pivotL.rotation.set(0,0,-0.4);
			
			wingR.position.set(0,0,0);
			wingR.rotation.set(0,0,0);
			
			wingL.position.set(0,0,0);
			wingL.rotation.set(0,0,0);
			
			wingR_2.position.set(0,0,0);
			wingL_2.position.set(0,0,0);
			
			//FLOOR(S)
			floor1.position.y = floor2.position.y = floor3.position.y = floor4.position.y = -197;
			
			floor1.position.x = -window.innerWidth;
			floor2.position.x = 0;
			floor3.position.x = window.innerWidth;
			floor4.position.x = window.innerWidth*2;
			
			floorIndex = 0
			
			//LIGHT
			light.position.set(150, 150, 30 ); 	
			
			//HAPPY
			head.remove(mouth2);
			head.add(mouth1);
			
			eye.material.map = texture1;
			
			head.material.color.setHex(0xffb347);				
					
			//TEXT
			count = 0;
			errors = 0;
						
			scene.remove(text);
			step = 0
			next = 0
			rotated = false;
			
			//MOVEMENTS
			state = "";	
			
			speedWalk = 1;
			speedRun = 1;
			speedFly = 1;

			needWalkToRun = false;
			needRunToFly = false;
			needFlyToRun = false;
			
			t = 0;
			
			//GAME 
			hardMode = false;
						
			startTime = 0;

		}
	}
	
}
