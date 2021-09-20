// Vertex shader program----------------------------------
var VSHADER_SOURCE = 
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 5.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program---------------------------------
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Global Variables ---------------------------------------
var MOVEMENT = 0.0; // for moving left or right
var DEPLOY = 0.0; // move down to grab

var ANGLE_STEP = 45.0;

var isDrag=false;   // mouse-drag: true when user holds down mouse button
var xMclik=0.0;     // last mouse button-down position (in CVV coords)
var yMclik=0.0;   
var xMdragTot=0.0;  // total (accumulated) mouse-drag amounts (in CVV coords).
var yMdragTot=0.0;  

var ccolor = 0.0; // to change the colors of the flowers


function main() {
//==============================================================================
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Create a local version of our model matrix in JavaScript 
  var modelMatrix = new Matrix4();

  // Create, init current rotation angle value in JavaScript
  var currentAngle = 0.0;

  // Register the event handler to be called
  document.onkeydown = function(ev){keydown(ev)};
  canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) };
  canvas.onmousemove =  function(ev){myMouseMove( ev, gl, canvas) };        
  canvas.onmouseup =    function(ev){myMouseUp( ev, gl, canvas) }; //onclick
            
  // Register all keyboard events found within our HTML webpage window:
  window.addEventListener("keydown", keydown, false);
  
  // Start drawing
  var tick = function() {
    currentAngle = animate(currentAngle);
    ccolor = animate4(ccolor);
    DEPLOY = animate2(DEPLOY);
    initVertexBuffers(gl, ccolor);
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick, canvas);
  };

  tick();

}


function initVertexBuffers(gl, ccolor) {
//==============================================================================

  var colorShapes = new Float32Array ([
     //  ------------- handle  -------------

     // for the top part that moves left to right
     // rectangle, black
     // V = 0, 4
     -0.30, 0.30, 0.00, 1.00,   0.0, 0.0, 0.0, 
     -0.30, 0.27, 0.00, 1.00,   0.0, 0.0, 0.0, 
     0.30, 0.30,　0.00, 1.00,    0.0, 0.0, 0.0, 
     0.30, 0.27, 0.00, 1.00,    0.0, 0.0, 0.0, 

     //  ------------- claw  -------------
     // for the pincers and arm
     // triangles, grayish
     // V = 4, 6
     0.00, 0.00, 0.00, 1.00,    0.7, 0.7, 0.7,
     0.60, 0.00, 0.00, 1.00,    0.9, 0.9, 0.9,
     0.00, 0.08, 0.00, 1.00,    0.7, 0.7, 0.7,
     0.60, 0.00, 0.00, 1.00,    0.72, 0.72, 0.72,
     0.60, 0.08, 0.00, 1.00,    0.9, 0.9, 0.9,
     0.00, 0.08, 0.00, 1.00,    0.95, 0.95, 0.95,

     // ------------- candy objects  -------------

     // bow
     // V = 10, 6
     0.0, 0.0, 0.00, 1.00,      0.73, 0.16, 0.96,
     0.4, 0.1, 0.00, 1.00,      0.73, 0.16, 0.96,
     0.3, 0.1,　0.00, 1.00,      0.73, 0.16, 0.96,
     0.3, 0.2, 0.00, 1.00,      0.73, 0.16, 0.96,
     0.2, 0.2, 0.00, 1.00,      0.73, 0.16, 0.96,
     0.2, 0.3, 0.00, 1.00,      0.73, 0.16, 0.96,

     // octagon
     // V = 16, 8
     -0.2, -0.3, 0.00, 1.00,    1.0, 0.53, 0.6,
     0.1, -0.3, 0.00, 1.00,     1.0, 0.53, 0.6,
     0.3, -0.1,　0.00, 1.00,     1.0, 0.53, 0.6,
     0.3, 0.1, 0.00, 1.00,      1.0, 0.53, 0.6,
     0.1, 0.3,　0.00, 1.00,      1.0, 0.53, 0.6,
     -0.2, 0.3, 0.00, 1.00,     1.0, 0.53, 0.6,
     -0.4, 0.1,　0.00, 1.00,     1.0, 0.53, 0.6,
     -0.4, -0.1, 0.00, 1.00,    1.0, 0.53, 0.6,

     // flower, triangle
     // V = 24, 3
     -0.6, 0.6, 0.00, 1.00,     ccolor*0.2, 0.8, 0.3+ccolor,
     -0.6, -0.6, 0.00, 1.00,    ccolor+0.2, 0.8, 0.3+ccolor,
     0.3, 0.6,　0.00, 1.00,      ccolor*0.2, 0.8, 0.3+ccolor,
     
     // brown bear box
     // V = 27, 6
     -0.5, 0.5, 0.00, 1.00,     0.92, 0.78, 0.62,
     -0.5, -0.5, 0.00, 1.00,    0.92, 0.78, 0.62,
     0.5, 0.5,　0.00, 1.00,      0.92, 0.78, 0.62,
     -0.5, -0.5, 0.00, 1.00,    0.92, 0.78, 0.62,
     0.5, 0.5,　0.00, 1.00,      0.92, 0.78, 0.62,
     0.5, -0.5, 0.00, 1.00,     0.92, 0.78, 0.62,

     // brown bear rectangular arms
     // V = 33, 4
     -0.65, 0.65, 0.00, 1.00,   0.92, 0.78, 0.62, 
     -0.65, 0.45, 0.00, 1.00,   0.92, 0.78, 0.62, 
     0.65, 0.65,　0.00, 1.00,    0.92, 0.78, 0.62,
     0.65, 0.45, 0.00, 1.00,    0.92, 0.78, 0.62,

     // singluar point, black, and line
     // V = 37, 2
     0.0, 0.0, 0.0, 1.0,        0.0, 0.0, 0.0,
     0.0, 1.0, 0.0, 1.0,        0.0, 0.0, 0.0,

     // diamond
     // V = 39, 7
     0.0, 0.0, 0.0, 1.0,        0.85, 0.85, 0.95,
     0.4, 0.4, 0.0, 1.0,        0.85, 0.85, 0.95,
     0.4, 0.6, 0.0, 1.0,        0.85, 0.85, 0.95,
     0.2, 0.8, 0.0, 1.0,        0.95, 0.95, 0.95,
     -0.2, 0.8, 0.0, 1.0,        0.95, 0.95, 0.95,
     -0.4, 0.6, 0.0, 1.0,        0.85, 0.85, 0.95,
     -0.4, 0.4, 0.0, 1.0,        0.85, 0.85, 0.95,
  ])
  
  var n = 46;   // The number of vertices

  // Create a buffer object
  var shapeBufferHandle = gl.createBuffer();  
  if (!shapeBufferHandle) {
    console.log('Failed to create the shape buffer object');
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);
  
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);

  // Specify how many bytes per stored value?
  var FSIZE = colorShapes.BYTES_PER_ELEMENT; 

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // How to retrieve position data from our VBO
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE *7, 0);
	
  gl.enableVertexAttribArray(a_Position);


  // Get graphics system's handle for our Vertex Shader's color-input variable;
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  // How to retrieve color data from VBO
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
                    
  gl.enableVertexAttribArray(a_Color);

  // Unbind the buffer object 
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
//==============================================================================
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // ------------------------- draw the handle

  modelMatrix.setTranslate(MOVEMENT + xMdragTot, 0.7, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // ------------------------- draw the claw
  // FIRST, the arm
  modelMatrix.translate(0.02, DEPLOY + 0.63, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 4, 6);
  modelMatrix.translate(0.0, 0.0, 0);

  // SECOND, the chain
  modelMatrix.rotate(90.0, 0,0,1);
  modelMatrix.translate(0.042, 0.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 37, 2);
  modelMatrix.rotate(-90.0, 0,0,1);
  modelMatrix.translate(0.57, -0.03, 0);


  // THIRD, the claw
  // left side
  pushMatrix(modelMatrix);

  modelMatrix.scale(0.4, 0.4, 0.4);
  modelMatrix.rotate(-62.0, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 4, 6);

  //pincer
  modelMatrix.translate(0.62, 0.01, 0.0);
  modelMatrix.rotate(41.0 - currentAngle*0.5, 0, 0, 1);    // make bend in the lower jaw
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 4, 6);

  // right side
  modelMatrix = popMatrix();

  modelMatrix.scale(0.4, 0.4, 0.4);
  modelMatrix.rotate(62.0, 0, 0, 1);
  modelMatrix.translate(0.13, 0.0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 4, 6);
  modelMatrix.translate(0.58, -0.01, 0.0);

  //pincer
  modelMatrix.rotate(-180.0 + currentAngle*0.9, 0,0,1);    // make bend in the lower jaw
  modelMatrix.translate(-0.51, -0.03, 0.0);  // r-center the outer segment,
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 4, 6);




  // ------------------------- draw the "candy"

  // candy 1 - candy
  modelMatrix.setTranslate(-0.65, -0.75, 0.0);
  modelMatrix.rotate(-20, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.rotate(180, 0,0,1);
  modelMatrix.translate(-0.03, -0.02, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.translate(0.01, 0.02, 0.0);
  modelMatrix.scale(0.4, 0.4, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 16, 8);

  // candy 1 - repeat 1
  modelMatrix.setTranslate(0.65, -0.3, 0.0);
  modelMatrix.rotate(-70, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.rotate(180, 0,0,1);
  modelMatrix.translate(-0.03, -0.02, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.translate(0.01, 0.02, 0.0);
  modelMatrix.scale(0.4, 0.4, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 16, 8);

  // candy 1 - repeat 2
  modelMatrix.setTranslate(-0.1, -0.3, 0.0);
  modelMatrix.rotate(-20, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.rotate(180, 0,0,1);
  modelMatrix.translate(-0.03, -0.02, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);

  modelMatrix.translate(0.01, 0.02, 0.0);
  modelMatrix.scale(0.4, 0.4, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 16, 8);


  // ----------------------------------------------------

  // candy 2 - flower
  modelMatrix.setTranslate(-0.78, -0.43, 0.0);
  modelMatrix.rotate(90-currentAngle*0.7, 0,0,1);
  modelMatrix.scale(0.25, 0.25, 0.25);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(45, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(90, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(135, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(180, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(225, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(270, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(315, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  // candy 2 - repeat 1
  modelMatrix.setTranslate(0.8, -0.85, 0.0);
  modelMatrix.rotate(currentAngle, 0,0,1);
  modelMatrix.scale(0.25, 0.25, 0.25);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(45, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(90, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(135, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(180, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(225, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(270, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

  modelMatrix.rotate(315, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 24, 3);

 
  // ----------------------------------------------------

  // candy 3 - brown bear
  modelMatrix.setTranslate(0.2, -0.9, 0.0);
  modelMatrix.scale(0.4, 0.4, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 27, 6);

  modelMatrix.translate(0.0, 0.81, 0.0);
  modelMatrix.scale(0.6, 0.6, 0.6);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 27, 6);

  //bear's ears
  pushMatrix(modelMatrix);

  modelMatrix.translate(0.28, 0.68, 0.0);
  modelMatrix.scale(0.3, 0.3, 0.3);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 27, 6);

  modelMatrix.translate(-1.9, 0.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 27, 6);

  modelMatrix = popMatrix();
  
  //bear's arms
  pushMatrix(modelMatrix);

  modelMatrix.translate(-0.4, -0.35, 0.0);
  modelMatrix.rotate(30.0-currentAngle, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 33, 4);

  modelMatrix = popMatrix();

  modelMatrix.translate(0.4, -0.35, 0.0);
  modelMatrix.rotate(-30 + currentAngle, 0,0,1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 33, 4);

  //bear's eyes
  modelMatrix.setTranslate(0.26, -0.55, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 37, 1);

  modelMatrix.translate(-0.11, 0.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 37, 1);

  // bear's mouth
  modelMatrix.rotate(90.0, 0,0,1);
  modelMatrix.translate(-0.11, -0.08, 0.0);
  modelMatrix.scale(0.0, 0.06, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 37, 2);

 
 // ----------------------------------------------------


  // candy 4 - diamond
  modelMatrix.setTranslate(-0.2, -0.98, 0.0);
  modelMatrix.scale(0.4, 0.37, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 39, 7);

  // candy 4 - repeat 1
  modelMatrix.setTranslate(0.83, -0.27, 0.0);
  modelMatrix.scale(0.4, 0.37, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 39, 7);

  // candy 4 - repeat 2
  modelMatrix.setTranslate(-0.7, -0.2, 0.0);
  modelMatrix.scale(0.4, 0.37, 0.4);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 39, 7);

}


// to update currentAngle
var g_last = Date.now();

function animate(angle) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  if(angle >   -70.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
  if(angle <  -130.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
  
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  var counter = 0;

  return newAngle %= 360;
}



// to change the color of the flowers as smoothly as possible
var a_last = Date.now();

function animate4(color) {
  var now = Date.now();
  var elapsed = now - a_last;
  a_last = now;
  var newColor = 0;

  for (var i = 0; i < 100; i ++) {
    color += 0.001*elapsed;
    if(color > 1 && color < 10) {
      color = color/10;
      newColor = 0.2 + (color * elapsed) / 100.0;
    };
    return color;
  }
}



// to update DEPLOY (up down movement)
var b_last = Date.now();

function animate2(down) {
  var now = Date.now();
  var elapsed = now - b_last;
  b_last = now;

  var updown = 0.0;
  var counter = 0;
  var downup = 0.0;

  for (var i = 0; i < 2; i ++) {
    updown = down + (DEPLOY*0.001*elapsed);

    if (DEPLOY < -1.5) {
      updown = updown - updown%10; 

      if (updown == 0) {
        endgame();
      }
    }

    
  }

  return updown;
}



// ----------------------------- keyboard animations
function keydown(ev) {
  if(ev.keyCode == 32) { // SPACEBAR
    DEPLOY -= 0.02;
  } else
  if(ev.keyCode == 37) { // LEFT ARROW
    MOVEMENT -= 0.1;
  } else
  if (ev.keyCode == 39) { // RIGHT ARROW
    MOVEMENT += 0.1;
  } else { return; }
}


// ----------------------------- button animations
function movedown() {
  DEPLOY -= 0.02;
}

function moveleft() {
  MOVEMENT -= 0.1;
}

function moveright() { 
  MOVEMENT += 0.1;
}


// ----------------------------- mouse animations
function myMouseDown(ev, gl, canvas) {

  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  
  // Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);
  //console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);
  
  isDrag = true;                      // set our mouse-dragging flag
  xMclik = x;                         // record where mouse-dragging began
  yMclik = y;
};


function myMouseMove(ev, gl, canvas) { 

  if(isDrag==false) return;       // IGNORE all mouse-moves except 'dragging'

  // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  //  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);
  
  // Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);

  // find how far we dragged the mouse:
  xMdragTot += (x - xMclik);          // Accumulate change-in-mouse-position,&
  yMdragTot += (y - yMclik);
  xMclik = x;                         // Make next drag-measurement from here.
  yMclik = y;
};

function myMouseUp(ev, gl, canvas) {
  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  
  // Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);
  
  isDrag = false;                     // CLEAR our mouse-dragging flag, and
  // accumulate any final bit of mouse-dragging we did:
  xMdragTot += (x - xMclik);
  yMdragTot += (y - yMclik);

  DEPLOY -= 0.02;
  return animate2(DEPLOY);
};



// ----------------------------- other functions
$(function() {
  $('body').on('keypress', function(e) {
    var $start = $("#start"),
        $end = $('#end');

    if ( $start.is(':visible') && e.which === 97 ) {
      startgame();
    }

    else if ( $end.is(':visible') && e.which === 114 ) {
      reloadPage();
    }
  });
});

function startgame() {
  console.log('starting game');

  $("#start").slideUp(600, function() {
    $('#game, #help').fadeIn();
  });
}

function endgame() {
  setTimeout(function(){
      document.getElementById('help').style.display='none'; 
      $("#game").slideUp(600);
      document.getElementById('end').style.display='block';
    },
    1000);
}

function reloadPage() {
  location.reload();
}