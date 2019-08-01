David Vasko - 203879415 - readme for homework # 3

First off, I did all the required parts of the assignment and both extra credit options.
Also for some reason it would not run on internet explorer. It worked on Firefox(my default)
and Chrome

Importnat note is that i split my code into multiple files to make them more readable. 
The division is as follows:
	galaxy.html - the main file which is linked to the other files. This file also sytles 
				html page (styled for a laptop sixed screen). On the HTML pages it also
				says what navigation controls are avaliable to teh viewer.
				- also this code has the shader codes, which was super important in this
				assignment. There are 3 different cases of planets we want to shade:
				flat, gourand, and phong. In order to do this, i set up if statments inside
				the shader code itself. The if statments are tirggered by a uniform float 
				passed in form the main js file. The three values for this uniform float are
				0 (flat), 1 (gourand), and 2 (phong). Note since i used floats i had to use
				< and > instead of = in the if statments. 
	galaxy.js   - the main script where all the variables, programs, uniforms, locations etc 
				are set up. To make this code look neater, i put alot of the auxilailry 
				functions in different files. Set up the arrays for points and normals.
				The view matrix and projection matrix are also created here. Keep tract of time.
				- note that i kinda cheated when it came to auxilarily functions. In js, global 
				variables can be altered inside the function, so must of my functions have no
				arguments and just act using the global variables. This work in this case 
				because everythign is compiled together, so the variables are accesible to the
				functions. However, the functions i wrote will not work outside of this context
				unless the appropriate global variables are established. That being said.
	camerawork.js
			    - the whole navigation system is set up here. Its basically the same as HW2
				with a few bugs fixed and different options. The HTML page as well as the
				comments themselves do a good job explaining what each button press does.
				My navigation system works by changing the "at" vector and translating the whole
				"lookAt" matrix. 
				- the function itself is called cameraControl(kc); and its one argument is the 
				keycode that was pressed
	genPlanets.js
				- this script has all teh other auxiliary functions:
				- triangle(a,b,c) - divideTriangle(a,b,c,count) - tetrahetron(a,b,c,d,n) - 
				- setPlanetProperties(materialAmbient, materialDiffuse, materialspecular, shininess) -
				- scales(x,y,z) - animatePlanets() - testPlanet(which) 
				triangle
					given three points pushes them on the points array and also pushes their
					normals on the normals array. NOTE: I chose to have 2 normal buffers, 1 for
					flat shading, adn one for pong/gourand. 
				dividTriangle,
					give 3 points on a UNIT sphere, this function makes 3 more points on a unit shpere
					by normalizing the half way points of the original 3 vertices. It then calls teh same 
					function on each new triangle. (1 triangle in -->  4 out). it is recursive an teh 
					end condition is when count is zero. This then calls triangle, because we have our final
					resolution.
				tetrahedron
					this is the mother function for the prevous two, just calls the above two functions 
					on a already defined tetrahedron with vertices on teh unit circle
				setPlanetProperties
					this sets the ambient, diffuse, specular and shiniess properties of teh current state
				scales
					teh scale function never works for me so i always have to make a new one
				animatePlanets
					this is the mother function for planets. goes though and for each desired planet
					sets teh properties, sets the modelMatrix for that planet and sends it all to the shader
				testPlanet
					this was a function so i could test one planet at a time instead of animating htem all 
OVERALL:
	- I creaded a bnunch of varrying complexity spheres initially and stored them all in an array, as well as 
	their flat and real normals. This way i never have to regenerate th epoints i just have to store them in 
	memory and access them when i want. I used a 2 dimensional index to keep track of which parts of the big
	arrays belonged to which sphere.
	- Another importnat choice was to use if statments to control which part of the shader codes were executed.
	- Last importnat choice was to use pure translation to position the planets. This means i do not have to 
	multiply my normals by the modelMatrix because translation does NOTHING to normals.

	-also note that when i made my normals arrays, i accidently gave teh vectors a 4th component of 1 instead
	of 0. This just meant that i had to fix that in the shader code. Look at teh comments in galaxy.html for 
	clarification on this point.
