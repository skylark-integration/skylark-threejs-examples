// Render Loop
var render = function () {
	requestAnimationFrame( render );
	
	if(needMoveCamera) moveCamera();
	
	if(state == "walk") walk();

	if(needWalkToRun) walkToRun();
	
	if(state == "run") run();
	
	if(needRunToFly) runToFly();
	
	if(state == "fly") fly();
	
	if(needFlyToRun) flyToRun();
	
	
	updateFloor();
	
	checkTime();
	
	renderer.render(scene, camera);
};

render();
