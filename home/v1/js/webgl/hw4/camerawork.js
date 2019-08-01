//Variable Needed in Main Function to use this utility function
//phi, keepTime, theta, fovy, cameraTranslation,

function controlCamera (kc){

//	document.getElementById("test").innerHTML = kc;
	var dr = 1 *Math.PI/180;
	var dx = 0.025;
//New Functions for this particular assignment
			//begin rotation of both cubes. with r
			if(kc == 82){
				rotateCubes = !rotateCubes; 
				if(!rotateCubes){
					tauR = time + tauR;}
				else{
					tauR = -(time - tauR);}
				return;}	
			//rotate tex on cube 3 with p
			if(kc == 84){
				rotateTEX = !rotateTEX; 
				if(!rotateTEX){
					tauTR = time + tauTR;}
				else{
					tauTR = -(time - tauTR);}
				return;}
			//translate TEX on cube 4 with s
			if(kc == 83){
				translateTEX = !translateTEX; 
				if(!translateTEX){
					tauTT = time + tauTT;}
				else{
					tauTT = -(time - tauTT);}
				return;}
			

			//increas or decreas azimuth with left adn right arrows
			if(kc == 39){ phi += dr; return;}
			if(kc == 37){ phi -= dr; return;}
			//revert to teh original view with spacebar
			if(kc == 32){
				phi = 0.0;
				theta = 0.0;
				fovy = 90;
				cameraTranslation = translate(vec3(3.0,0.0,0.0));
				time = 0.0;
				timer.reset();
				rotateCubes = false;
				rotateTEX = false;
				translateTEX = false;
				tauR = 0.0;
				tauTR = 0.0;
				tauTT = 0.0;
				return;}
			//increase Altitude with up
			if(kc == 38){ 
				if(theta < 1.550){
					theta += dr;}
				return;}
			//decrease Altitude with down
			if(kc == 40){ 
				if(theta > -1.550){
					theta -= dr;}
				return;}
			//widen or narrow the verticle feild of view with w, n
			if(kc == 87){ fovy += 1; return;}
			if(kc == 78){ fovy -= 1; return;}

//------------------------------------------------------------------------
//keep tract of which direction is backward, up and left by rotating the 
//original orthonomal basis {1 0 0, 0 1 0, 0 0 1}

			var orthoNormal = rotate(phi*180/Math.PI, [0,1,0]);
			orthoNormal = mult(rotate(-1*theta*180/Math.PI, [0,0,1]), orthoNormal);

//by rotating the original orthonormal basis twice we get a new ortonormal 
//basis that is based on our current camera positio
//--------------------------------------------------------------------------

			//using the orthonormal basis we made, move teh camera forward, backward, left, right, up and down
			if(kc == 74){ cameraTranslation = mult(cameraTranslation, translate(vec3(dx*orthoNormal[2][0],
																					 dx*orthoNormal[2][1],
																					 dx*orthoNormal[2][2])));}
			if(kc == 75){ cameraTranslation = mult(cameraTranslation, translate(vec3(dx*orthoNormal[0][0],
																					 dx*orthoNormal[0][1],
																					 dx*orthoNormal[0][2])));}
			if(kc == 76){ cameraTranslation = mult(cameraTranslation, translate(vec3(-dx*orthoNormal[2][0],
																					 -dx*orthoNormal[2][1],
																					 -dx*orthoNormal[2][2])));}
			if(kc == 73){ cameraTranslation = mult(cameraTranslation, translate(vec3(-dx*orthoNormal[0][0],
																					 -dx*orthoNormal[0][1],
																					 -dx*orthoNormal[0][2])));}
			if(kc == 85){ cameraTranslation = mult(cameraTranslation, translate(vec3(-dx*orthoNormal[1][0],
																					 -dx*orthoNormal[1][1],
																					 -dx*orthoNormal[1][2])));}
			if(kc == 79){ cameraTranslation = mult(cameraTranslation, translate(vec3(dx*orthoNormal[1][0],
																					 dx*orthoNormal[1][1],
																					 dx*orthoNormal[1][2])));}
			return;	
	
}


