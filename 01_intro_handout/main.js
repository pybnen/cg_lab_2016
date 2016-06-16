//the OpenGL context
var gl = null;

/**
 * initializes OpenGL context, compile shader, and load buffers
 */
function init(resources) {
  //create a GL context
  gl = createContext(400 /*width*/, 400 /*height*/);

  //in WebGL / OpenGL3 we have to create and use our own shaders for the programmable pipeline
  //create the shader program
  shaderProgram = createProgram(gl, resources.vs, resources.fs);

  // Create a buffer and put a single clipspace rectangle in
  // it (2 triangles)
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  //we need typed arrays
  const arr = new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0]);
  //copy data to GPU
  gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
  //same for the color
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 1, 0, 1,
    0, 0, 0, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
}

/**
 * render one frame
 */
function render() {
  //specify the clear color
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  //clear the buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderProgram);

  var userColor = { r: 0.6, g: 0.2, b: 0.8 };
  gl.uniform3f(gl.getUniformLocation(shaderProgram, 'u_usercolor'),
    userColor.r, userColor.g, userColor.b);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram,'a_position'));
  gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram,'a_position'), 2 /*per vertex*/, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(shaderProgram, 'a_color');
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6 /*count*/);
}

loadResources({
  vs: 'shader/simple.vs.glsl',
  fs: 'shader/simple.fs.glsl'
}).then(function (resources /*loaded resources*/) {
  init(resources);
  //render one frame
  render();
});
