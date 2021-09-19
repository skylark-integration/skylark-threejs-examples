var t =0;

var state = "";

var speedWalk = 1;
var speedRun = 1;
var speedFly = 1;

var needWalkToRun = false;
var needRunToFly = false;
var needFlyToRun = false;


var walk = function(){

	t += 0.08 * speedWalk;
	t = t % (2* Math.PI);
	
	pawR.position.x =  Math.cos(t) * 15;
	pawR.position.y = -40 - Math.sin(t) * 15;
	
	//the lefft paw movement is alternated w.r.t to the right paw
	pawL.position.x =  Math.cos(t + Math.PI) * 15;
	pawL.position.y = -40 - Math.sin(t + Math.PI) * 15;
	
	pawR.position.y = Math.max(-40,pawR.position.y);
	pawL.position.y = Math.max(-40,pawL.position.y);
	
	
	
	//the right paw start to come off the ground
	if (t>Math.PI){ 
		pawR.rotation.z = -Math.sin(2*t)*0.5;
		pawL.rotation.z = 0;
	}
	
	//the left paw start to come off the ground
	else{ 
		pawL.rotation.z = -Math.sin(2*t)*0.5;
		pawR.rotation.z = 0;
	}
	
	//the assignmemnt is negative beacuse the movements of the hand are opposite to the movement of the paws
	handR.position.x = -Math.cos(t)*10;
	handR.rotation.y = -Math.cos(t)*0.5;
		
	handL.position.x = -Math.cos(t+ Math.PI)*10;
	handL.rotation.y = -Math.cos(t+ Math.PI)*0.5;
	
	
	body.rotation.x = Math.cos(t)*0.04;
		
	body.position.x += 0.8 * speedWalk;
	
	camera.position.x = body.position.x;


	if(!rotated)text.position.x = body.position.x -text_space;
	else text.position.x = body.position.x + text_space;
	
	//the light must remain at distance 150
	light.position.x = 150 + body.position.x;  

};



var walkToRun = function(){

	if(body.rotation.z > -Math.PI/2) body.rotation.z-= 0.05;
	
	body.rotation.x = 0;

    camera.position.x = body.position.x;
    light.position.x = 150  + body.position.x;
    
	if(!rotated)text.position.x = body.position.x -text_space;
	else text.position.x = body.position.x + text_space;
    
	
	//PAWS
	
	//you can include both the paws in the same IF, since you want that at the end of the transition they have the same x and y position
	if(pawR.position.x < 40){
		pawR.position.x += 0.9;
		pawL.position.x = pawR.position.x;
	}


	if(pawR.position.y <-25){
		pawR.position.y += 0.9;
		pawL.position.y = pawR.position.y;
	}
	
	
	//paws rotation
	if(pawR.rotation.z < Math.PI/2){
		pawR.rotation.z += 0.03;
		pawL.rotation.z = pawR.rotation.z;
	} 

	
	//paws scale
	pawR.scale.x = 2/3;
	pawL.scale.x = 2/3;


	//HANDS

	if(handR.rotation.z < Math.PI/2){
		handR.rotation.z += 0.06;
		handL.rotation.z = handR.rotation.z; 
	}

	
	if(handR.position.x < 40){
		handR.position.x += 1.2;
		handL.position.x = handR.position.x;
	}

	if(handR.position.y < 45){
		handR.position.y += 1.2;
		handL.position.y = handR.position.y;
		//as long as the hand doens't touch the ground, the body must go a bit forward
		body.position.x += 2; 
	}
	//when the hands touch the ground, the transition is ended and the dragon can start to run
	else{
		state = "run";
		needWalkToRun = false;
	}
	
	
	//adjust the y rotation of the hands, that was altered by the walking animation
	handR.rotation.y = 0 
	handL.rotation.y = 0 
	
	
	//WINGS

	if(pivotR.position.x < -12){
		pivotR.position.x += 0.5;
		pivotL.position.x = pivotR.position.x;
	}
	
	
	if(pivotR.position.y > -9){
		pivotR.position.y -= 0.5;
		pivotL.position.y = pivotR.position.y;
	}

	if(pivotR.position.z < 14) pivotR.position.z += 0.5;
	
	
	if(pivotL.position.z > -14) pivotL.position.z -= 0.5;
	
	pivotR.rotation.x = -0.1;
	pivotR.rotation.y = 0.4;
	pivotR.rotation.z = 1.9;
	

	
	pivotL.rotation.x = -pivotR.rotation.x;
	pivotL.rotation.y = -pivotR.rotation.y
	pivotL.rotation.z =  pivotR.rotation.z 
	

	if(wingR.position.y < 30){
		wingR.position.y += 0.9;
		wingL.position.y = wingR.position.y;
	}
	
	
	
	//HEAD
	
	if(head.position.x > -30) head.position.x -= 2;
	if(head.position.y < 85) head.position.y += 2/5;
	if(head.rotation.z < Math.PI/2) head.rotation.z += 0.05;
	

};



var run = function(){ 
	
	
	t += 0.2* speedRun;
	t = t % (2* Math.PI);
	
	
	pawR.position.x =  40 - Math.cos(t) * 30;
	pawR.position.y = -25 + Math.sin(t) * 15;
	
	
	pawL.position.x =  40 - Math.cos(t) * 30;
	pawL.position.y = -25 + Math.sin(t) * 15;
	
	pawR.position.x = Math.min(40,pawR.position.x);
	pawL.position.x = Math.min(40,pawL.position.x);
	
	
	handR.position.x =  40 - Math.cos(t + Math.PI) * 15;
	handR.position.y = 45 + Math.sin(t + Math.PI) * 15;
	
	handL.position.x =  40 - Math.cos(t+ Math.PI) * 15;
	handL.position.y = 45 + Math.sin(t+ Math.PI) * 15;
	
	handR.position.x = Math.min(40,handR.position.x);
	handL.position.x = Math.min(40,handL.position.x);

	
	body.rotation.z = -Math.PI/2 - Math.sin(t)*0.05;
	
	head.rotation.y = Math.sin(t)*0.08;
	
	
	

	//the circular movement has 4 phases
	//1. the paw goes directly on the maximum height and falls down going to the left
	//2. the paw goes from the extreme right to centre
	//3. the paw goes from the centre to the extreme left
	//4. the paw goes up to the initial position
	

	//this is the phase 4: I want that the paw is inclined upwards
	if(t > Math.PI*3/2 && t < Math.PI*2) pawR.rotation.z = pawL.rotation.z  = Math.PI/2 + Math.cos(t)*0.6;
	
	//this is the phase 1: I want that the paw returns to the original position
	if(t < Math.PI/2) pawR.rotation.z = pawL.rotation.z  = Math.PI/2 - Math.sin(t)*0.6 +0.6;


	pivotR.rotation.y = 0.8 + Math.cos(t+Math.PI)*0.3;
	pivotL.rotation.y = -0.8 - Math.cos(t+Math.PI)*0.3;


	body.position.x += 4* speedRun;
	camera.position.x = body.position.x;
	light.position.x = 150 + body.position.x;
	if(!rotated)text.position.x = body.position.x - text_space;
	else text.position.x = body.position.x +text_space;
	
	
}


var runToFly = function(){
	
	t += 0.25;
	t = t % (2* Math.PI);
	
	
    pawR.position.x = pawL.position.x = handR.position.x = handL.position.x = 40;
    pawR.position.y = pawL.position.y = -20;
    handR.position.y = handL.position.y = 20;

    
     
	pivotR.rotation.y = 0.8 + Math.cos(t+Math.PI)*0.8;
	pivotL.rotation.y = -0.8 - Math.cos(t+Math.PI)*0.8;
	
	if(wingR_2.position.y < 35){
		wingR_2.position.y += 1;
		wingL_2.position.y += 1;
	}
	
	body.rotation.z = -Math.PI/2 - Math.sin(t)*0.05;
	head.rotation.y = Math.sin(t)*0.04;
	
	
	if(pawR.rotation.z > Math.PI/2 -2.5){
		pawR.rotation.z -= 0.05;
		pawL.rotation.z  -=  0.05;
	}
	
	if(handR.rotation.y > -2.5){
		handR.rotation.y -= 0.05;
		handL.rotation.y -= 0.05;
	}
    
    
    //when the dragon arrives at the right altitude, we are done
    if(body.position.y < 250){
		body.position.y += 3 + Math.sin(t)*2;
		body.position.x += 16;
	}
	

	else{
		state = "fly";
		needRunToFly = false;
	}



    camera.position.x=body.position.x;
   
    light.position.x=150 +body.position.x;
    light.position.y=150+ body.position.y;
    
	if(!rotated)text.position.x = body.position.x -text_space;
	else text.position.x = body.position.x + text_space;
	
	
	//the speeds are:
	//walk: 0.8 - 1.6 - 2.4
	//run: 4 - 8 -12
	//fly: 16 - 32 - 48
	//so when starts to fly, it goeas at the mimimum speed of flight, that is 16
	

}


var fly = function(){
	
	t += 0.25*speedFly;
	t = t % (2* Math.PI);
	

	pivotR.rotation.y = 0.8 + Math.cos(t+Math.PI)*0.8;
	pivotL.rotation.y = -0.8 - Math.cos(t+Math.PI)*0.8;

	body.rotation.z = -Math.PI/2 - Math.sin(t)*0.05;
	head.rotation.y = Math.sin(t)*0.04;

	body.position.y = 250 + Math.sin(t)*3;
	body.position.x += 16 * speedFly;

	
    camera.position.x=body.position.x;
    
    light.position.x=150 + body.position.x;

	if(!rotated)text.position.x = body.position.x - text_space;
	else text.position.x = body.position.x + text_space;
	

}


var flyToRun = function(){
	
	t += 0.2;
	t = t % (2* Math.PI);
	
	camera.position.x=body.position.x;
	
	light.position.x=150 + body.position.x;
    light.position.y=150 + body.position.y;
    
    if(!rotated)text.position.x = body.position.x - text_space;
	else text.position.x = body.position.x + text_space;
    
	
	//reset the position of the paws/hands of the running state
	pawR.position.x = pawL.position.x = handR.position.x = handL.position.x = 40;
    pawR.position.y = pawL.position.y = -25;
    handR.position.y = handL.position.y = 45;
    
    if(wingR_2.position.y > 0){
		wingR_2.position.y -= 1;
		wingL_2.position.y -= 1;
	}


	if(pawR.rotation.z < Math.PI/2){
		pawR.rotation.z += 0.05;
		pawL.rotation.z  +=  0.05;
	}
	
	if(handR.rotation.y < 0){
		handR.rotation.y += 0.05;
		handL.rotation.y += 0.05;
	}

	
	pivotR.rotation.y = 0.5 + Math.cos(t+Math.PI)*0.4;
	pivotL.rotation.y = -0.5 - Math.cos(t+Math.PI)*0.4;


	
	
	body.rotation.z = -Math.PI/2;
	
	if(body.position.y > 0){
		body.position.y -= 3 + Math.sin(t)*2;
		body.position.x += 12;
		//goes to the ground with a speed equal to the max speed of the running, that is 12
	}
	
	else{
		state = "run";
		needFlyToRun = false;
	}

	
	
	
}
