
var gl;
var canvas;
var shaderProgram;

var vertexPositionBuffer;
var OrangeVertexPositionBuffer;

var BlueIndexBuffer;
var blueIndices;
var OrangeIndexBuffer;
var OrangeIndices;


// Create a place to store vertex colors
var vertexColorBuffer;
var OrangeVertexColorBuffer;

var mvMatrix = mat4.create();
var mvMatrix2 = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var sinscalar = 0;
var tickscale = 0;
var rotatescale = 0;


/**
 * Sends projection/modelview matrices to shader
 */
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform2, false, mvMatrix2);
}


/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}


/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);

  // If we don't find an element with the specified id
  // we do an early exit
  if (!shaderScript) {
    return null;
  }

  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

/**
 * Populate buffers with data
 */
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  BlueIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  // The points of the blue part of the badge
  var triangleVertices = [
    -0.65,  0.9,  0.0,
    0.65,  0.9,  0.0,
    0.65,  0.6,  0.0,
    -0.65,  0.6,  0.0,

    -0.55,  0.6,  0.0,
    -0.25,  0.6,  0.0,
    -0.25, -0.2,  0.0,
    -0.55, -0.2,  0.0,

    0.55,  0.6,  0.0,
    0.25,  0.6,  0.0,
    0.25, -0.2,  0.0,
    0.55, -0.2,  0.0,

    -0.3,  0.6,  0.0,
    -0.15,  0.6,  0.0,
    -0.15,  -0.2,  0.0,
    -0.3,  -0.2,  0.0,

    0.3,  0.6,  0.0,
    0.15,  0.6,  0.0,
    0.15,  -0.2,  0.0,
    0.3,  -0.2,  0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 20;

  // Using indices for the order
  var blueIndices = new Int32Array([
    0,1,2,
    2,3,0,
    4,5,6,
    6,7,4,
    8,9,10,
    10,11,8,
    12,13,14,
    14,15,12,
    16,17,18,
    18,19,16
  ]);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BlueIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, blueIndices ,gl.STATIC_DRAW);

  BlueIndexBuffer.itemSize = 1;
  BlueIndexBuffer.numberOfItems = 30;

  // Set up colors for the blue badge
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,

    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,

    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,

    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,

    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0,
    0.0, 0.0, 0.4, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 20;


  // Set up buffer for the orange part of the badge
  OrangeVertexPositionBuffer = gl.createBuffer();
  OrangeIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, OrangeVertexPositionBuffer);
  var orangeTriangleVertices = [
    0.05,  -0.3,  0.0,
    0.15,  -0.3,  0.0,
    0.15,  (12/13)*0.15-0.9,  0.0,
    0.05,  (12/13)*0.05-0.9,  0.0,

    0.25,  -0.3,  0.0,
    0.35,  -0.3,  0.0,
    0.35,  (12/13)*0.35-0.9,  0.0,
    0.25,  (12/13)*0.25-0.9,  0.0,

    0.45,  -0.3,  0.0,
    0.55,  -0.3,  0.0,
    0.55,  (12/13)*0.55-0.9,  0.0,
    0.45,  (12/13)*0.45-0.9,  0.0,

    -0.45,  -0.3,  0.0,
    -0.55,  -0.3,  0.0,
    -0.55,  (12/13)*0.55-0.9,  0.0,
    -0.45,  (12/13)*0.45-0.9,  0.0,

    -0.25,  -0.3,  0.0,
    -0.35,  -0.3,  0.0,
    -0.35,  (12/13)*0.35-0.9,  0.0,
    -0.25,  (12/13)*0.25-0.9,  0.0,

    -0.05,  -0.3,  0.0,
    -0.15,  -0.3,  0.0,
    -0.15,  (12/13)*0.15-0.9,  0.0,
    -0.05,  (12/13)*0.05-0.9,  0.0



  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orangeTriangleVertices), gl.STATIC_DRAW);
  OrangeVertexPositionBuffer.itemSize = 3;
  OrangeVertexPositionBuffer.numberOfItems = 24;
  // Using indices for the order
  var OrangeIndices = new Int32Array([
    0,1,2,
    2,3,0,
    4,5,6,
    6,7,4,
    8,9,10,
    10,11,8,
    12,13,14,
    14,15,12,
    16,17,18,
    18,19,16,
    20,21,22,
    22,23,20
  ]);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OrangeIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, OrangeIndices ,gl.STATIC_DRAW);

  OrangeIndexBuffer.itemSize = 1;
  OrangeIndexBuffer.numberOfItems = 36;

  // Set up color buffer for the orange part of the badge
  OrangeVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, OrangeVertexColorBuffer);
  var orangeColors = [
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,

    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,

    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,

    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,

    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,

    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0,
    0.8, 0.2, 0.0, 1.0

  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orangeColors), gl.STATIC_DRAW);
  OrangeVertexColorBuffer.itemSize = 4;
  OrangeVertexColorBuffer.numItems = 24;
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 * Draw the blue part of the badge. Using the drawElements function to draw triangles.
 */
function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Set up matrices
  mat4.identity(mvMatrix);
  mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));
  // Bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BlueIndexBuffer);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  var ext = gl.getExtension('OES_element_index_uint');
  // Call draw function
  gl.drawElements(gl.TRIANGLES, BlueIndexBuffer.numberOfItems, gl.UNSIGNED_INT, 0);
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 * Draw the orange part of the badge. Using the drawElements function to draw triangles.
 */
function draw2() {
  // Set up matrices
  mat4.identity(mvMatrix2);
  mat4.rotateY(mvMatrix2, mvMatrix2, degToRad(0));
  // Bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, OrangeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         OrangeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, OrangeVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                            OrangeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OrangeIndexBuffer);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix2);
  var ext = gl.getExtension('OES_element_index_uint');
  // Call draw function
  gl.drawElements(gl.TRIANGLES, OrangeIndexBuffer.numberOfItems, gl.UNSIGNED_INT, 0);
}


/**
 * Animation to be called from tick. Updates globals and performs animation for each tick.
 */
function animate() {
    // Set rotation degree for the blue part of the badge in each tick
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        rotAngle= (rotAngle+rotatescale) % 360;
    }
    lastTime = timeNow;
    sinscalar += tickscale;
    // Recalculate the vertex buffer for orange part of the badge for each tick
    gl.bindBuffer(gl.ARRAY_BUFFER, OrangeVertexPositionBuffer);
    var orangeTriangleVertices = [
      0.05+Math.cos(sinscalar+0.05)*0.15,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.15+Math.cos(sinscalar+0.15)*0.15,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.15+Math.cos(sinscalar+0.15)*0.15,  (12/13)*0.15-0.9+Math.sin(sinscalar)*0.07,  0.0,
      0.05+Math.cos(sinscalar+0.05)*0.15,  (12/13)*0.05-0.9+Math.sin(sinscalar)*0.07,  0.0,

      0.25+Math.cos(sinscalar+0.25)*0.2,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.35+Math.cos(sinscalar+0.35)*0.2,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.35+Math.cos(sinscalar+0.35)*0.2,  (12/13)*0.35-0.9+Math.sin(sinscalar)*0.07,  0.0,
      0.25+Math.cos(sinscalar+0.25)*0.2,  (12/13)*0.25-0.9+Math.sin(sinscalar)*0.07,  0.0,

      0.45+Math.cos(sinscalar+0.45)*0.25,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.55+Math.cos(sinscalar+0.55)*0.25,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      0.55+Math.cos(sinscalar+0.55)*0.25,  (12/13)*0.55-0.9+Math.sin(sinscalar)*0.07,  0.0,
      0.45+Math.cos(sinscalar+0.45)*0.25,  (12/13)*0.45-0.9+Math.sin(sinscalar)*0.07,  0.0,

      -0.45+Math.cos(sinscalar-0.45)*0.25,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.55+Math.cos(sinscalar-0.55)*0.25,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.55+Math.cos(sinscalar-0.55)*0.25,  (12/13)*0.55-0.9+Math.sin(sinscalar)*0.07,  0.0,
      -0.45+Math.cos(sinscalar-0.45)*0.25,  (12/13)*0.45-0.9+Math.sin(sinscalar)*0.07,  0.0,

      -0.25+Math.cos(sinscalar-0.25)*0.2,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.35+Math.cos(sinscalar-0.35)*0.2,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.35+Math.cos(sinscalar-0.35)*0.2,  (12/13)*0.35-0.9+Math.sin(sinscalar)*0.07,  0.0,
      -0.25+Math.cos(sinscalar-0.25)*0.2,  (12/13)*0.25-0.9+Math.sin(sinscalar)*0.07,  0.0,

      -0.05+Math.cos(sinscalar-0.05)*0.15,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.15+Math.cos(sinscalar-0.15)*0.15,  -0.3+Math.sin(sinscalar)*0.07,  0.0,
      -0.15+Math.cos(sinscalar-0.15)*0.15,  (12/13)*0.15-0.9+Math.sin(sinscalar)*0.07,  0.0,
      -0.05+Math.cos(sinscalar-0.05)*0.15,  (12/13)*0.05-0.9+Math.sin(sinscalar)*0.07,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orangeTriangleVertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numberOfItems = 24;

}

/**
 * Startup function called from html code to start program.
 */
 function startup(type) {
  if (type == 1) {
        tickscale = 0.3;
        rotatescale = 4;
  }
  else {
    tickscale = 0.05;
        rotatescale = 1;
  }
    canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders();
  setupBuffers();
  gl.enable(gl.DEPTH_TEST);
  tick();
  
}

/**
 * Tick called for every animation frame.
 */
function tick() {
    requestAnimFrame(tick);
    draw();
    draw2();
    animate();
}
