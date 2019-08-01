var canvas;
var gl;

var time = 0.0;
var timer = new Timer();
var keepTime = true;

var pointsArray = [];
var normalsArray = [];
var flat_normalsArray = [];
var index = 0;
var bigInd = [
	vec2(0, 0),
	vec2(0, 0),
	vec2(0, 0),
	vec2(0, 0),
	vec2(0, 0),
	vec2(0, 0)
];

onPlanet3 = false;
	//this is a simple bool to keep tract of when the user has requested 
	//to view from planet 3

//----set up consts so its more obvious which shading we are using-------

const flatShading = 0;
const gourandShading = 1;
const phongShading = 2;

//-----Important camera definitions-----

var theta  = -30*Math.PI/180;//we start looking down at an angle 30
var phi    = 0.0;
var dr     = 1*Math.PI/180;

var viewMatrix, pMatrix;

var eye = vec3(0,0,0);
var up = vec3(0.0, 1.0, 0.0);
var fovy = 90;
var scl = 0.1;
var cameraTranslation = translate(vec3(scl*90,scl*-51.91254,0)); 
	//we start wtih the "whole" solar system visible in one view
	//NOTE: In the starting view some planets may not be visible
	//initally. Planets 3 and 4 have large orbits so i intentionally
	//chose the scale to only show them on part of the orbit.

//------seed points, light properties, declaration of uniformLoc-------------

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
 
var lightPosition = vec4(0.0, 0.0, 0.0, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var ambientLoc, diffuseLoc,specularLoc, shineLoc;
var viewMatrixLoc, projectionMatrixLoc, modelMatrixLoc;
var whichShadingLoc; 

//---------------------------------------------------------------------

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

//----Load shaders and initialize attribute buffers--------------
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

//set up a huge array with these different complexity spheres stored consecutively, 
//additionally use bigInd (big index) to keep tract of where each complexity
//splere is stored in the pointsArray
    tetrahedron(va, vb, vc, vd, 1);
		bigInd[0][0] = 0;
		bigInd[0][1] = index;
    tetrahedron(va, vb, vc, vd, 2);
		bigInd[1][0] = bigInd[0][0] + bigInd[0][1];
		bigInd[1][1] = index-bigInd[1][0];
    tetrahedron(va, vb, vc, vd, 3);
		bigInd[2][0] = bigInd[1][0] + bigInd[1][1];
		bigInd[2][1] = index-bigInd[2][0];
    tetrahedron(va, vb, vc, vd, 4);
		bigInd[3][0] = bigInd[2][0] + bigInd[2][1];
		bigInd[3][1] = index-bigInd[3][0];
	tetrahedron(va, vb, vc, vd, 5);
		bigInd[4][0] = bigInd[3][0] + bigInd[3][1];
		bigInd[4][1] = index-bigInd[4][0];
	tetrahedron(va, vb, vc, vd, 6);
		bigInd[5][0] = bigInd[4][0] + bigInd[4][1];
		bigInd[5][1] = index-bigInd[5][0];
//	document.getElementById("test").innerHTML = bigInd;

//-------------Set up buffers and attributes---------
	
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var flatBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, flatBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(flat_normalsArray), gl.STATIC_DRAW );
    
    var flatNormal = gl.getAttribLocation( program, "flatNormal" );
    gl.vertexAttribPointer( flatNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( flatNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

//------------Get Uniform Locations---------------
    
    viewMatrixLoc = gl.getUniformLocation( program, "viewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	modelMatrixLoc = gl.getUniformLocation( program, "modelMatrix" );

	whichShadingLoc = gl.getUniformLocation( program, "whichShading" );

    ambientLoc= gl.getUniformLocation(program, "ambientProduct");
    diffuseLoc= gl.getUniformLocation(program, "diffuseProduct");
    specularLoc= gl.getUniformLocation(program, "specularProduct");
    shineLoc= gl.getUniformLocation(program, "shininess");

    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );

//---------Camera Work----------------------------
	
	window.onkeydown = function(e) {
		var kc = e.keyCode.toString();
		controlCamera (kc);
		//put all the code for camera navigation in a different file (camerawork.js) to keep
		//this script cleaner and make the navigation system easier to use again in the future
	}
//------------------------------------------------	
	timer.reset();
    render();
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if(keepTime){
		time += timer.getElapsedTime() / 1000;}
	
	if(onPlanet3){
		eye = vec3(-12*Math.cos(time/2.7+.3), 0, 12*Math.sin(time/2.7+.3));
	    var at = vec3(Math.cos(-phi)-12*Math.cos(time/2.7+.3), 0, -Math.sin(-phi)+12*Math.sin(time/2.7+.3));
	    pMatrix = perspective(fovy, 1, 1, 1000);}
	else{
	    pMatrix = perspective(fovy, 1, 0.1, 1000);
	    var at = vec3(Math.cos(theta)*Math.cos(phi), Math.sin(theta), Math.cos(theta)*Math.sin(phi));}

	viewMatrix = mult(lookAt(eye, at, up), cameraTranslation);
    
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(pMatrix) );
	
	//Choose if i am only testing a planet or animating them all
	// testPlanet(1);
	animatePlanets();

    window.requestAnimFrame(render);
}


