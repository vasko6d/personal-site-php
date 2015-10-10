Homework 2: David Vasko 203879415

First off i called may files "cubert.html" and "cubert.js".

I did all the basic required parts. 

Additionally, 
	* I instanced each cube with a single triangle strip which means i only have total 14 vertices for all the 
	cubes.
	* I individually rotated or scaled each of the eight cubes

	* I did not directly use quaternions but i used the rotate function from the library which used quaternions, 
	and since the professor	said everyone gets the extra credit there wasnt really and incentive to change my 
	code.


Basic Explanation of my code:

"cubert.html"
	* In the vertex shader i used two uniform mat4s to tranform the vertices
	* In the fragment shader i used only a single uniform to change the color betwee cubes
	* I also styled my html page a little bit with css to make it look a little better on my device. I cant guarantee
	the styling looks good on your computer
	* I put all the camera controls i used directly on my html page so its easy to tell my intention.
"cubert.js"
	* I commented pretty well but i will briefly go over the important parts of my code. I implemented where that
	camera is looking, by directly manuplating the "at" and "up" vectors. "eye" was originally placed and stayed at
	the origin. The initial camera view icorperated all 8 cubes by translating the 8 cubes by 30 units in the positive
	direction (because "at" is initially [1, 0, 0]). In order for forward backward, left right, up down, to work as wanted, 
	i had to rotate the original orthonormal basis by theta around the z axis, and phi around the y axis. This changed the
	original orthonormal basis or [1 0 0] [0 1 0] [0 0 1] into a orthonormal basis based on the current camera angle. 
	Therefore forward will make the camera "move" directly toward whatever is in teh center of teh screen. Left and Right
	will strafe and up and down will raise or lower the height of the camera keeping the angle of the camera the same.
	* one importnat note is that i use an array called "stripArray" which originally only held the 14 vertices that made up
	our cube. However i ended up pushing teh corsshair data onto the stripArray as well which included a bunch of points
	for teh line loop that made the circle and the two lines that mad eup the plus sign.
	* everythign else is pretty basic or explained in the code.


	

