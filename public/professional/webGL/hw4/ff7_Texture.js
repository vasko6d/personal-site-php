var canvas;
var gl;

var length = 0.5; //this is an easy way to scale ALL cubes
var time = 0.0; //time is stored in seconds using getelapsedtime from timer
var timer = new Timer();

//All the uniforms used
var UNIFORM_pMatrix, UNIFORM_viewMatrix, UNIFORM_modelMatrix;
var UNIFORM_lightPosition, UNIFORM_shininess;
var UNIFORM_texScale, UNIFORM_texRotate, UNIFORM_texTranslate;

var viewMatrix, projectionMatrix, modelMatrix;
var shininess = 50;
var lightPosition = vec3(-2.0, 2.0, 2.0);

var myTexture;

var eye = vec3(0, 0, 0);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

//vaiables to use camerawork.js
var phi = 0;
var theta = 0;
var fovy = 90;
var cameraTranslation = translate(vec3(3.0,0.0,0.0));

// Bools to control whether or not to rotate/scroll
var rotateCubes = false;
var rotateTEX = false;
var translateTEX = false;

//variable for a time constant to "save" how far the particular
//element has rotates/scrolled
var tauR = 0.0;
var tauTR = 0.0;
var tauTT = 0.0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

    gl.enable(gl.DEPTH_TEST);

//----------Make Cube and store the appropriate normals and UV data-----

    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    var points = [];
    var normals = [];
    var uv = [];
    Cube(vertices, points, normals, uv);

//------------------------------Textureing--------------------------------------------

    myTexture = gl.createTexture();
    myTexture.image = new Image();
    myTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, myTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		//use nearest neighbor for zooming in
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		//use mipmap trilinear filtering for zoomed out
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl_REPEAT.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl_REPEAT.CLAMP_TO_EDGE);
		//use repeat to make the texture repeat in both the s and t directions
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

    myTexture.image.src = "./Images/ff7.png";

//-------------Shaders, Buffers, ETC--------------------------------
//I have 3 attributes per vertex in this implementation. Position, Normal Vector
//and UV_Coordinate

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );

    var ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    var ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );

    var ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);

    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

//-------------UNIFORMS-------------------------------------------------

    UNIFORM_viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_modelMatrix = gl.getUniformLocation(program, "modelMatrix");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");
    UNIFORM_texScale = gl.getUniformLocation(program, "texScale");
    UNIFORM_texRotate = gl.getUniformLocation(program, "texRotate");
    UNIFORM_texTranslate = gl.getUniformLocation(program, "texTranslate");
	var loc = gl.getUniformLocation(program, "uSampler");
		gl.uniform1i(loc, myTexture);

//--------------------Keyboard Input----------------------------
	window.onkeydown = function(e) {
		var kc = e.keyCode.toString();
		controlCamera (kc);
		//put all the code for camera navigation in a different file (camerawork.js) to keep
		//this script cleaner and make the navigation system easier to use again in the future
	}
//-----------------------------------------------------------------
    timer.reset();
    render();
}

function Cube(vertices, points, normals, uv){
	//can change the orientation of the texture with the order of the
	//vertices
    Quad(vertices, points, normals, uv, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, points, normals, uv, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, points, normals, uv, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, points, normals, uv, 2, 3, 6, 7, vec3(-1, 0, 0));
    Quad(vertices, points, normals, uv, 6, 7, 4, 5, vec3(0, 0, -1));
    Quad(vertices, points, normals, uv, 1, 5, 3, 7, vec3(0, -1, 0 ));
}

function Quad( vertices, points, normals, uv, v1, v2, v3, v4, normal){
//store normal
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
//store uv coordinate
    uv.push(vec2(1,0));
    uv.push(vec2(0,0));
    uv.push(vec2(0,1));
    uv.push(vec2(1,0));
    uv.push(vec2(0,1));
    uv.push(vec2(1,1));
//store position
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
    time += timer.getElapsedTime() / 1000;
	
	//camera implementation uses phi and theta to generate where we are looking
	at = vec3(Math.cos(theta)*Math.cos(phi), Math.sin(theta), Math.cos(theta)*Math.sin(phi));

	//cameraTranslation stores where teh camera has been moved to
    viewMatrix = mult(lookAt(eye, at, up), cameraTranslation);

    projectionMatrix = perspective(fovy, 1, 0.001, 1000);
//---------------FIRST CUBE-------------------------------------------
	if(rotateCubes == true){
		modelMatrix = mult(translate(vec3(0,0,0.75)), rotate((time+tauR)*360, [0, 1, 0]));}
	else{
		modelMatrix = mult(translate(vec3(0,0,0.75)), rotate(tauR*360, [0, 1, 0]));}

    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(viewMatrix));
    gl.uniformMatrix4fv(UNIFORM_modelMatrix, false, flatten(modelMatrix));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1f(UNIFORM_texScale,  Math.sqrt(1));
	if(rotateTEX){
		gl.uniformMatrix2fv(UNIFORM_texRotate, false, flatten(twoDRotate((time+tauTR)*360)));}
	else{
		gl.uniformMatrix2fv(UNIFORM_texRotate, false, flatten(twoDRotate(tauTR*360)));}
	
    gl.uniform1f(UNIFORM_texTranslate,  0.0);
    gl.uniform1i(UNIFORM_sampler, 0)

    gl.drawArrays( gl.TRIANGLES, 0, 36);
//--------------SECOND CUBE------------------------------------------
	if(rotateCubes == true){
		modelMatrix = mult(translate(vec3(0,0,-0.75)), rotate((time+tauR)*180, [1, 0, 0]));}
	else{
		modelMatrix = mult(translate(vec3(0,0,-0.75)), rotate(tauR*180, [1, 0, 0]));}

    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(viewMatrix));
    gl.uniformMatrix4fv(UNIFORM_modelMatrix, false, flatten(modelMatrix));

    gl.uniform1f(UNIFORM_texScale,  Math.sqrt(4));
	gl.uniformMatrix2fv(UNIFORM_texRotate, false, flatten(mat2()));

	if(translateTEX){
    	gl.uniform1f(UNIFORM_texTranslate,  (time+tauTT)%2 -1);}
	else{
    	gl.uniform1f(UNIFORM_texTranslate,  tauTT%2 -1);}
		

    gl.drawArrays( gl.TRIANGLES, 0, 36);
//------------------------------------------------------------------------
//document.getElementById("test").innerHTML = time % 1;

    window.requestAnimFrame( render );
}

//this function is a 2d version of the rotate function that generates a 2 by 2 matrix
function twoDRotate(theta){
	var temp = mat2();
	theta = Math.PI*theta/180;
	temp[0][0] = Math.cos(theta);
	temp[0][1] = Math.sin(theta);
	temp[1][0] = -temp[0][1];
	temp[1][1] = temp[0][0];
	return temp;
}

