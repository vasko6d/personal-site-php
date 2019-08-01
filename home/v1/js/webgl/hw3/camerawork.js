function controlCamera (kc){

			//increas or decreas azimuth with left adn right arrows
			if(kc == 39){ phi += dr; return;}
			if(kc == 37){ phi -= dr; return;}
			//freeze time with "p"
			if(kc == 80){
				keepTime = !keepTime;
				timer.reset()
				return;}

	if(onPlanet3){
	//if we are on planet 3 the only navigation commands avaliable are
	//the two key codes above, or
	//----------increasing or decreasing azimuth
	//----------freezing time
	//you can only leave planet 3 with anothe push of the "3" key 
		if(kc == 51){
			onPlanet3 = false;
			eye = vec3(0,0,0);
			controlCamera(32);
			return;
		}
	}
	else{
	//if we arent on planet 3 you can use all teh navigation commands
			
			//revert to teh original view with spacebar
			if(kc == 32){
				phi = 0.0;
				theta = -30*Math.PI/180;;
				fovy = 90;
				cameraTranslation = translate(vec3(scl*90,scl*-51.91254,0));
				return;
			}
			//top view "t"
			if(kc == 84){
				theta = -89.9*Math.PI/180;
				phi = 0;
				cameraTranslation = translate(vec3(0, -25, 0));
				return;
			}
			// xaxis view "b"
			// this was very nice for testing purposes, it puts you at a view in the 
			// orbit plane, close to teh sun looking at the sun
			if(kc == 66){
				theta = 0;
				phi = 0;
				cameraTranslation = translate(vec3(2.5, 0, 0));
				return;}
			//attach to planet 3 with "3"
			if(kc == 51){
				onPlanet3 = true;
				theta = 0;
				phi = 0;
				cameraTranslation = mat4();
				return;}
			


			//increase Altitude with up
			if(kc == 38){ 
				if(theta < 1.550){
					theta += dr;
				}
				return;
				//else{ alert("Max altitude has been reached");}
			}

			//decrease Altitude with down
			if(kc == 40){ 
				if(theta > -1.550){
					theta -= dr;
				}
				return;
				//else{ alert("Min altitude has been reached");}
			}


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
			return;	
	}
}


