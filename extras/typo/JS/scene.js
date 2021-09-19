//SCENE
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ffff);

//CAMERA
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 900;
camera.position.y = 430;

//RENDERER

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );

container = document.getElementById('world');
container.appendChild(renderer.domElement);

//document.body.appendChild( renderer.domElement );


window.addEventListener('resize', handleWindowResize, false);

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
