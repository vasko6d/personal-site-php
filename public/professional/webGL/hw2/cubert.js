//css styling of page will look best in a laptop full screen
//keys different than in spec:
// ->I use "i adn k" for forward backward control and "j and l" for left right control not "ijkm"
// ->I use x for crosshair instead of c
// ->I added u and o to control up and down motion of camera

var canvas;
var gl;
var kc; //------------------------this is the "key code" for which key is pressed
var dt = 0.0; //------------------this is to keep tract of time to vary the size or rotation of each cube continuouslt

var cameraTranslation = translate(vec3(30,0,0)); //this is how we are susposed to translate the camera with the cartesian motions

//we want 8 cubes at the given indices
var numCubes = 8;
var cubePositions = [
		vec3( 10, -10, -10),
		vec3( 10, -10,  10),
		vec3( 10,  10, -10),
		vec3( 10,  10,  10),
		vec3(-10, -10, -10),
		vec3(-10, -10,  10),
		vec3(-10,  10, -10),
		vec3(-10,  10,  10)
	];

//we want 8 different colors, a way to index them and the location of the uniform from the fragment shader
var cIndex = 0;
var colorLoc;
var Colors = [
        vec4( 0.3, 0.3, 0.3, 1.0 ),  // grey
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];

//i made each cube with just one triangle strip so there are only 14 vertices total!
var numVertices  = 14;
var len = 1;// this lets us change the size o all cubes easilly
var verts = [
        vec4(  len, -len,  len, 1.0 ),//1
        vec4( -len, -len,  len, 1.0 ),//2
        vec4(  len, -len, -len, 1.0 ),//3
        vec4( -len, -len, -len, 1.0 ),//4
        vec4(  len,  len,  len, 1.0 ),//5
        vec4( -len,  len,  len, 1.0 ),//6
        vec4( -len,  len, -len, 1.0 ),//7
        vec4(  len,  len, -len, 1.0 ),//8
    ];
//Ideal Triangle strip goes 4 3 7 8 5 3 1 4 2 7 6 5 2 1
//With 0 as first indx      3 2 6 7 4 2 0 3 1 6 5 4 1 0
//which is the minimum numbers of points to define a cube

//stripArray has all the vertices of a cube in the correct order to use just 1 triangle strip
var stripArray = [];
	stripArray.push(verts[3]);
	stripArray.push(verts[2]);
	stripArray.push(verts[6]);
	stripArray.push(verts[7]);
	stripArray.push(verts[4]);
	stripArray.push(verts[2]);
	stripArray.push(verts[0]);
	stripArray.push(verts[3]);
	stripArray.push(verts[1]);
	stripArray.push(verts[6]);
	stripArray.push(verts[5]);
	stripArray.push(verts[4]);
	stripArray.push(verts[1]);
	stripArray.push(verts[0]);

//-----------Crosshair----------------------

var displayCrosshair = false;

//first find equation of a circle
for(var alpha = 0; alpha < 6.28; alpha = alpha + .1)
{
	stripArray.push(vec4(5*Math.cos(alpha),5*Math.sin(alpha), 14.9, 1));
};

//
	stripArray.push(vec4(7, 0, 14.9, 1));
	stripArray.push(vec4(-7, 0, 14.9, 1));
	stripArray.push(vec4(0, 7, 14.9, 1));
	stripArray.push(vec4(0, -7, 14.9, 1));
//
//Notice that strip array is used not only for the triangle strip that makes our cubes,
//but also for the crosshair
//
//---------------------------------------
//   Important camera definitions

var theta  = 0.0;
var phi    = 0.0;
var dr = 1 * Math.PI/180.0;

//These are used for teh orthographic projection of the crosshair
var near = -15;
var far = 15;
var left = -15.0;
var right = 15.0;
var ytop = 15.0;
var bottom = -15.0;


var mvMatrix, pMatrix;
var modelView, projection;

var eye = vec3(0,0,0);
var up = vec3(0.0, 1.0, 0.0);

var fovy = 90;

//-----------------------------------------


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stripArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
	colorLoc = gl.getUniformLocation(program, "Color");

//----------Keyboard Input----------------------------

//letters used
	//i 73   c 67  left  37
	//j 74   x 88  up    38
	//k 75   w 87  right 39
	//l 76   n 78  down  40
	//space  32
	//u 85   o 79

		window.onkeydown = function(e) {
			kc = e.keyCode.toString();
			//increase Altitude
			if(kc == 38){ 
				if(theta < 1.550){
					theta += dr;}
				//else{ alert("Max altitude has been reached");}
			}

			//decrease Altitude
			if(kc == 40){ 
				if(theta > -1.550){
					theta -= dr;}
				//else{ alert("Min altitude has been reached");}
			}

			//increas or decreas azimuth
			if(kc == 39){ phi += dr;}
			if(kc == 37){ phi -= dr;}

			//widen or narrow the verticle feild of view
			if(kc == 87){ fovy += 1;}
			if(kc == 78){ fovy -= 1;}

//------------------------------------------------------------------------
//keep tract of which direction is backward, up and left by rotating the 
//original orthonomal basis {1 0 0, 0 1 0, 0 0 1}

			var orthoNormal = rotate(phi*180/Math.PI, [0,1,0]);
			orthoNormal = mult(rotate(-1*theta*180/Math.PI, [0,0,1]), orthoNormal);
			up = vec3(orthoNormal[1][0], orthoNormal[1][1], orthoNormal[1][2]);

//by rotating the original orthonormal basis twice we get a new ortonormal 
//basis that is based on our current camera positio
//--------------------------------------------------------------------------

			//change the colors
			if(kc == 67){ cIndex += 1; if(cIndex >7){cIndex = 0;}}

			//choose to display teh corsshair
			if(kc == 88){ displayCrosshair = !displayCrosshair;}

			//reset everythign to default
			if(kc == 32){
				near = -15;
				far = 15;
				theta  = 0.0;
				phi    = 0.0;
				fovy = 90;
				cIndex = 0;
				displayCrosshair = false;
				cameraTranslation = translate(vec3(30,0,0));
				orthoNormal = mat4();
				up = vec3(0,1,0);
			}

			//using the orthonormal basis we made, move teh camera forward, backward, left, right, up and down
			if(kc == 74){ cameraTranslation = mult(cameraTranslation, translate(vec3(0.25*orthoNormal[2][0],
																					 0.25*orthoNormal[2][1],
																					 0.25*orthoNormal[2][2])));}
			if(kc == 75){ cameraTranslation = mult(cameraTranslation, translate(vec3(0.25*orthoNormal[0][0],
																					 0.25*orthoNormal[0][1],
																					 0.25*orthoNormal[0][2])));}
			if(kc == 76){ cameraTranslation = mult(cameraTranslation, translate(vec3(-0.25*orthoNormal[2][0],
																					 -0.25*orthoNormal[2][1],
																					 -0.25*orthoNormal[2][2])));}
			if(kc == 73){ cameraTranslation = mult(cameraTranslation, translate(vec3(-0.25*orthoNormal[0][0],
																					 -0.25*orthoNormal[0][1],
																					 -0.25*orthoNormal[0][2])));}
			if(kc == 85){ cameraTranslation = mult(cameraTranslation, translate(vec3(-0.25*orthoNormal[1][0],
																					 -0.25*orthoNormal[1][1],
																					 -0.25*orthoNormal[1][2])));}
			if(kc == 79){ cameraTranslation = mult(cameraTranslation, translate(vec3(0.25*orthoNormal[1][0],
																					 0.25*orthoNormal[1][1],
																					 0.25*orthoNormal[1][2])));}
		}

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var at = vec3(Math.cos(theta)*Math.cos(phi), Math.sin(theta), 
             Math.cos(theta)*Math.sin(phi));
		// note that initially at starts as [1, 0, 0] so we are looking at teh positive x axis
		// looking toward teh origin
		//document.getElementById("test").innerHTML = up;

		dt = dt + 0.1; //keep tract of "time"

		pMatrix = perspective(fovy, 1.0, 0.1, 100);
		mvMatrix = mult(lookAt(eye, at, up), cameraTranslation);

//-------------Go through and animate each cube-------------------
		for(var i = 0; i < numCubes; ++i){

			//first set teh color
			var icIndex = i+cIndex;
			if(icIndex > 7) {icIndex = icIndex-8;}
			gl.uniform4f(colorLoc, Colors[icIndex][0],Colors[icIndex][1],Colors[icIndex][2],Colors[icIndex][3]);

			//second move the cube where we want it
			var temp = translate(cubePositions[i]);
			var temp2 = mult( mvMatrix, temp);

//-----------Individually Scale or Rotate each Cube--------------
// Begin Scaled Cubes
// ***scale function was not working for me for some reason so i just manually made the scale matrix
			if(i == 0){ 
				scale_matrix = mat4()
				var perc = 1 + 0.1*Math.sin(dt/2);
				scale_matrix[0][0] = perc;
				scale_matrix[1][1] = perc;
				scale_matrix[2][2] = perc;
				temp2 = mult(temp2, scale_matrix);
			}
			if(i == 1){ 
				scale_matrix = mat4()
				var perc = 1 + 0.03*Math.sin(dt+i/1.17);
				scale_matrix[0][0] = perc;
				scale_matrix[1][1] = perc;
				scale_matrix[2][2] = perc;
				temp2 = mult(temp2, scale_matrix);
			}
			if(i == 6){ 
				scale_matrix = mat4()
				var perc = 1 + 0.1*Math.sin(dt+i/1.17);
				scale_matrix[0][0] = perc;
				scale_matrix[1][1] = perc;
				scale_matrix[2][2] = perc;
				temp2 = mult(temp2, scale_matrix);
			}
			if(i == 7){ 
				scale_matrix = mat4()
				var perc = 1 + 0.1*Math.sin(dt*2+i/1.17);
				scale_matrix[0][0] = perc;
				scale_matrix[1][1] = perc;
				scale_matrix[2][2] = perc;
				temp2 = mult(temp2, scale_matrix);
			}
// Begin Rotated Cubes
			else if(i == 2){
				temp2 = mult(temp2, rotate(dt*180/Math.PI/2, [1,0,0]));
			}
			else if(i == 3){
				temp2 = mult(temp2, rotate(dt*180/Math.PI, [0,1,0]));
			}
			else if(i == 4){
				temp2 = mult(temp2, rotate(dt*180/Math.PI/4, [0,0,1]));
			}
			else if(i == 5){
				temp2 = mult(temp2, rotate(dt*180/Math.PI, [1,1,1]));
			}
//---------------------------------------------------------------------------	
		    gl.uniformMatrix4fv( modelView, false, flatten(temp2) );
		    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
	        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14);
		};

		if(displayCrosshair){
			//i chose to have the corsshair be red
			gl.uniform4f(colorLoc, Colors[1][0],Colors[1][1],Colors[1][2],Colors[1][3]);
	        opMatrix = ortho(left, right, bottom, ytop, near, far);
	        gl.uniformMatrix4fv( modelView, false, flatten(mat4()) );
	        gl.uniformMatrix4fv( projection, false, flatten(opMatrix) );
			//I chose to display teh crosshair as a line loop and 2 lines
	        gl.drawArrays( gl.LINE_LOOP, 14, 63);
	        gl.drawArrays( gl.LINES, 77, 4);
		};
        requestAnimFrame(render);
    }
