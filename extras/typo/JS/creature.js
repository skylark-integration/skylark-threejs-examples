var geometry;
var material;
var mesh;

//BODY
geometry = new THREE.CylinderGeometry( 23, 23, 50, 12 );
material = new THREE.MeshStandardMaterial( { color: 0xf4ac66} );

var body = new THREE.Mesh( geometry, material );

scene.add(body);

//HEAD
geometry = new THREE.BoxGeometry( 100, 65, 50);
material = new THREE.MeshStandardMaterial( {  color: 0xfdb900 } );

var head = new THREE.Mesh( geometry, material );

head.position.x = 40;
head.position.y = 70;

body.add(head);

//EYE

var l = new THREE.TextureLoader();
var texture1 = l.load("Textures/file1.jpg");
var texture2 = l.load("Textures/file2.jpg");

geometry = new THREE.BoxGeometry( 30, 30, 4);
material = new THREE.MeshStandardMaterial( {map: texture1} );

var eye = new THREE.Mesh( geometry, material );

eye.position.z = head.geometry.parameters.depth/2 + eye.geometry.parameters.depth/2;
eye.position.x = -25;
eye.position.y = 10;

head.add(eye);


//MOUTH_HAPPY

material = new THREE.LineBasicMaterial( { color: 0x000000,linewidth: 3} );
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( -45, 15, 0) );
geometry.vertices.push(new THREE.Vector3( -30, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 0, -head.geometry.parameters.depth) );

var mouth1 = new THREE.Line( geometry, material );

mouth1.position.z = head.geometry.parameters.depth/2 +2 ;
mouth1.position.x += 50.5;
mouth1.position.y -= 20;


head.add(mouth1);

//MOUTH_ANGRY

material = new THREE.LineBasicMaterial( { color: 0x000000,linewidth: 3} );
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( -45, -3, 0) );
geometry.vertices.push(new THREE.Vector3( -30, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 0, -head.geometry.parameters.depth) );

var mouth2 = new THREE.Line( geometry, material );

mouth2.position.z = head.geometry.parameters.depth/2 +2 ;
mouth2.position.x += 50.5;
mouth2.position.y -= 20;
//head.add(mouth2);

//NOSE

geometry = new THREE.CircleGeometry(3,12);
material = new THREE.MeshStandardMaterial({ color: 0x000000});

var nose = new THREE.Mesh(geometry,material);

nose.position.x += 30;
nose.position.y += 15;
nose.position.z += head.geometry.parameters.depth/2+1;

head.add(nose);

//CIRCLES

geometry = new THREE.SphereGeometry( 8, 32);
material = new THREE.MeshStandardMaterial( {color: 0xfdfd96 } );

var circle1 = new THREE.Mesh(geometry,material);

circle1.position.y = 32;
circle1.position.x = 30;

geometry = new THREE.SphereGeometry( 12, 32);

var circle2 = new THREE.Mesh(geometry,material);
circle2.position.y = 32;
circle2.position.x = 5;


geometry = new THREE.SphereGeometry( 16, 32);

var circle3 = new THREE.Mesh(geometry,material);
circle3.position.y = 32;
circle3.position.x =-27;

head.add(circle1);
head.add(circle2);
head.add(circle3);

//PAWS

geometry = new THREE.BoxGeometry( 40, 10, 25);
material = new THREE.MeshStandardMaterial( {  color: 0xffce44} );

pawR = new THREE.Mesh( geometry, material );

pawR.position.y =-40;
pawR.position.x = 0;
pawR.position.z =40;

body.add(pawR);


pawL = pawR.clone();
pawL.position.z = -40;

body.add(pawL);

//HAND

handR = pawR.clone();
handR.scale.x = 2/3;

handR.position.x =0;
handR.position.y = 0;
handR.position.z = 35;

handR.rotation.x = Math.PI / 2;
handR.rotation.y = Math.PI / 2;

body.add(handR);


handL = handR.clone();
handL.position.z = -35;

body.add(handL);

//PIVOT-WINGS
geometry = new THREE.BoxGeometry( 5, 5, 5);
material = new THREE.MeshBasicMaterial( {  color: 0xffb347 } );

pivotR = new THREE.Mesh( geometry, material );

pivotR.position.x = -15;
pivotR.position.z = 8;
pivotR.rotation.z = -0.4;

body.add(pivotR);


var pivotL = pivotR.clone();
pivotL.position.z = -8;

body.add(pivotL);

//FIRST-WINGS

var colorWings = 0xee7600;

geometry = new THREE.BoxGeometry( 30, 40, 7);
material = new THREE.MeshStandardMaterial( { color:colorWings} );

var wingR = new THREE.Mesh( geometry, material );

pivotR.add(wingR);


var wingL = wingR.clone();
pivotL.add(wingL);

//SECOND-WINGS
geometry = new THREE.BoxGeometry( 30, 30, 7);
material = new THREE.MeshStandardMaterial( {  color:colorWings} );

var wingR_2 = new THREE.Mesh( geometry, material );

//transform it to pseudo triangle
wingR_2.geometry.vertices[0].x -= 12;
wingR_2.geometry.vertices[1].x -= 12;

wingR_2.geometry.vertices[4].x += 12;
wingR_2.geometry.vertices[5].x += 12;

wingR.add(wingR_2);


var wingL_2 = wingR_2.clone();
wingL.add(wingL_2);







