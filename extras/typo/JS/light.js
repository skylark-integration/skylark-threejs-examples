//ambient light
var light1 = new THREE.AmbientLight(0xffffff);
scene.add(light1);


//directional lights
var light = new THREE.DirectionalLight( 0xffffff, 1);
light.position.set(150, 150, 30 ); 			
light.castShadow = true;            
scene.add( light );

light.target = body;

//var helper = new THREE.DirectionalLightHelper( light, 200);
//scene.add( helper );

light.shadow.mapSize.width = 512;  
light.shadow.mapSize.height = 512; 
light.shadow.camera.near = 0.1;    
light.shadow.camera.far = 1000;     

light.shadowCameraLeft = -300;
light.shadowCameraRight = 300;
light.shadowCameraTop = 300;
light.shadowCameraBottom = -300;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


//creature
body.castShadow = true;
head.castShadow = true;
pawR.castShadow = true;
pawL.castShadow = true;
handR.castShadow = true;
handL.castShadow = true;
wingR.castShadow = true;
wingL.castShadow = true;
wingR_2.castShadow = true;
wingL_2.castShadow = true;
circle1.castShadow = true;
circle2.castShadow = true;
circle3.castShadow = true;

//floor
floor1.receiveShadow = true;
floor2.receiveShadow = true;
floor3.receiveShadow = true;
floor4.receiveShadow = true;


