//Functions to Generate Triangles that make a sphere

function triangle(a, b, c) {

     normalsArray.push(a);
     normalsArray.push(b);
     normalsArray.push(c);

     flat_normalsArray.push(a);
     flat_normalsArray.push(a);
     flat_normalsArray.push(a);

     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}
//-------------------------------------------------------------
//-------------Auxillarily Functions------------------------

//this function take 3 vec4s adn a float as its argumets that represent the desired
//material properties of teh planet. It takes those values computes the product with
//the light properties adn changes the state of 4 uniorms that are important for color
//---> this saves us from having to rewrite teh same code fore every planet when we want
//---> to change teh state. 
function setPlanetProperties (materialAmbient, materialDiffuse, materialSpecular, materialShininess){
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	gl.uniform4fv(ambientLoc,flatten(ambientProduct));
	gl.uniform4fv(diffuseLoc,flatten(diffuseProduct));
	gl.uniform4fv(specularLoc,flatten(specularProduct));
    gl.uniform1f( shineLoc, materialShininess );
}
//For some reason the scale function from teh library never works on my computer,
//so i made my own.
function scales (x, y, z) {

		var scale_matrix = mat4()
		scale_matrix[0][0] = x;
		scale_matrix[1][1] = y;
		scale_matrix[2][2] = z;
		
		return scale_matrix;
}

//----------------------function to specify the properties and positions of each planet--------------------------------

	//this function makes the orbits for teh planets, sets each planets propertes and sends teh appropriate uniforms to 
	//the shaders

	//IMPORTANT: note that i chose to animate the planets orbiting with just one translation. This saves one whole multiplication step
	//and it also means that we do NOT have to multiply our normals by the modelMatrix in the shader! Pure translation does not change
	//the normals, so this choice saves us alot of computation in the shaders.

function animatePlanets() {

var eccentricity = 1;
	//eccentricity could be changed if we wanted elliptical orbits 

	//sun--------------------
		setPlanetProperties(vec4( 0.48, 0.48, 3.0, 1.0 ), vec4( 0.0, 0.0, 0.0, 1.0 ),vec4( 0.0, 0.0, 0.0, 1.0 ), 0.0);
		gl.uniform1f(whichShadingLoc, gourandShading);
			//we can choose our shading simply with the above statment. This tells the shaders which section of code to use
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(scales(0.2, 0.2, 0.2)) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[3][0], bigInd[3][1]);

	//planet 1----------------------
	//icy white, faceted, diamond-­‐like planet (medium-­‐low complexity sphere, flat shaded,  specular highlight).
	
		var p1Radius = 2;
		var p1Matrix = mult(translate(vec3(eccentricity*p1Radius*Math.cos(time*1.177+.3), 0, p1Radius*Math.sin(time*1.177+.3))), scales(0.25, 0.25, 0.25));
		setPlanetProperties(vec4( 0.5, 0.5, 0.5, 1.0 ), vec4( 0.9, 0.9, 0.9, 1.0 ),vec4( 1.0, 1.0, 1.0, 1.0 ), 100.0);
	
		gl.uniform1f(whichShadingLoc, flatShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(p1Matrix) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[1][0], bigInd[1][1]);
	
	//planet 2----------------------
	//Second, there is a swampy, watery green planet.(medium-­‐low complexity sphere, Gouraud shaded, specular highlight)
	
		var p2Radius = 7;
		var p2Matrix = mult(translate(vec3(eccentricity*p2Radius*Math.cos(time/2.3+1.2), 0, p2Radius*Math.sin(time/2.3+1.2))), scales(0.8, 0.8, 0.8));
		setPlanetProperties(vec4( 0.33*.5, 0.42*.5, 0.18*.5, 1.0 ), vec4( 0.25, 0.38, 0.13, 1.0 ),vec4( 0.25, .38, .13, 1.0 ), 10.0);
		
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(p2Matrix) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[2][0], bigInd[2][1]);
	
	//planet 3----------------------
	//Third,there is a planet covered in clam smooth water (high complexity, Phong shaded, specular highlight)
	
		var p3Radius = 12;
		var p3Matrix = mult(translate(vec3(eccentricity*-p3Radius*Math.cos(time/2.7+.3), 0, p3Radius*Math.sin(time/2.7+.3))), scales(1, 1, 1));
			setPlanetProperties(vec4( 0.0, 0.0, 0.25, 1.0 ), vec4( 0.0, 0.0, 0.8, 1.0 ),vec4( .2, 0.2, 0.3, 1.0 ), 50.0);
		
		gl.uniform1f(whichShadingLoc, phongShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(p3Matrix) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[5][0], bigInd[5][1]);
	
		var moonMatrix = mult(mult(p3Matrix, translate(3 * Math.cos(time*3), 0, 3* Math.sin(time*3))), scales(0.25, 0.25, 0.25));
		setPlanetProperties(vec4( 0.7, 0.1, 0.5, 1.0 ), vec4( 0.8, 0.0, 0.4, 1.0 ),vec4( 1.0, 0.0, 0.0, 1.0 ), 50.0);
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(moonMatrix) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[4][0], bigInd[4][1]);
	
	//planet 4----------------------
	// a mud covered planet, brownish-orange with a dull appearance (medium-­‐high complexity, no specular highlight)
	
		var p4Radius = 20;
		var p4Matrix = mult(translate(vec3(eccentricity*p4Radius*Math.cos(time/3.2-.8), 0, p4Radius*Math.sin(time/3.2-.8))), scales(0.5, 0.5, 0.5));
		setPlanetProperties(vec4( 0.2, 0.08, 0.01, 1.0 ), vec4( 0.54*.3, 0.27*.3, 0.07*.3, 1.0 ),vec4( .54, .27, 0.17, 1.0 ), 0.0);
		
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(p4Matrix) );
	    gl.drawArrays( gl.TRIANGLES, bigInd[2][0], bigInd[2][1]);
	
}

//test planet----------------------
	//this function was used to animate one planet at a time, so i could test the properties i wanted for each planet,
	//notice that the test radius is set to 1, so that the orbit is smaller and easier to see the planet in question

function testPlanet(which){
		setPlanetProperties(vec4( 0.48, 0.48, 3.0, 1.0 ), vec4( 0.0, 0.0, 0.0, 1.0 ),vec4( 0.0, 0.0, 0.0, 1.0 ), 0.0);
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(scales(0.05, 0.05, 0.05)) );
		gl.drawArrays( gl.TRIANGLES, 1008, 3072);
	var testRadius = 1;
	var testMatrix = mult(translate(vec3(testRadius*Math.cos(time), 0, testRadius*Math.sin(time))), scales(0.5, 0.5, 0.5));
	if(which == 1){
		setPlanetProperties(vec4( 0.5, 0.5, 0.5, 1.0 ), vec4( 0.9, 0.9, 0.9, 1.0 ),vec4( 1.0, 1.0, 1.0, 1.0 ), 100.0);
		gl.uniform1f(whichShadingLoc, flatShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(testMatrix) );
	    gl.drawArrays( gl.TRIANGLES, 48, 192);}
	else if(which == 2){
		setPlanetProperties(vec4( 0.33, 0.42, 0.18, 1.0 ), vec4( 0.25, 0.38, 0.13, 1.0 ),vec4( 0.25*2, .38*2, .13*2, 1.0 ), 100.0);
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(testMatrix) );
	    gl.drawArrays( gl.TRIANGLES, 240, 768);}
	else if(which == 3){
		setPlanetProperties(vec4( 0.0, 0.0, 0.5, 1.0 ), vec4( 0.0, 0.0, 0.7, 1.0 ),vec4( .4, 0.4, 0.6, 1.0 ), 200.0);
		gl.uniform1f(whichShadingLoc, phongShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(testMatrix) );
    	gl.drawArrays( gl.TRIANGLES, 16368, 49152);
		}
	else {
		setPlanetProperties(vec4( 0.2, 0.08, 0.01, 1.0 ), vec4( 0.54*.3, 0.27*.3, 0.07*.3, 1.0 ),vec4( .54, .27, 0.17, 1.0 ), 0.0);
		gl.uniform1f(whichShadingLoc, gourandShading);
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(testMatrix) );
    	gl.drawArrays( gl.TRIANGLES, 1008, 3072);}

}
//---------------------------------
