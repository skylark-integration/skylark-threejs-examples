//FLOOR(S)

geometry = new THREE.BoxGeometry( window.innerWidth , 300, 600);
material = new THREE.MeshStandardMaterial({color: 0x234d20 } );

var floor1 = new THREE.Mesh( geometry, material );

floor1.position.y = -197;
floor1.position.x = -window.innerWidth;

scene.add(floor1);


geometry = new THREE.BoxGeometry( window.innerWidth , 300, 600);
material = new THREE.MeshStandardMaterial({color:0x36802d} );

var floor2 = new THREE.Mesh( geometry, material );
floor2.position.y = -197;

scene.add(floor2);


geometry = new THREE.BoxGeometry( window.innerWidth , 300, 600);
material = new THREE.MeshStandardMaterial({color: 0x77ab59} );

var floor3 = new THREE.Mesh( geometry, material );
floor3.position.y = -197;

floor3.position.x = window.innerWidth;

scene.add(floor3);


geometry = new THREE.BoxGeometry( window.innerWidth , 300, 600);
material = new THREE.MeshStandardMaterial({color: 0xc9df8a } );

var floor4 = new THREE.Mesh( geometry, material );
floor4.position.y = -197;

floor4.position.x = window.innerWidth*2;

scene.add(floor4);

//save the floors in an array

var floors = [];

floors.push(floor1);
floors.push(floor2);
floors.push(floor3);
floors.push(floor4);



//Update Floors

var floorIndex = 0;

var updateFloor = function(){
	if(body.position.x - floors[floorIndex%4].position.x > window.innerWidth*2){
		floors[floorIndex%4].position.x += window.innerWidth *4,
		floorIndex++;
	}
}
