HOMEWORK #4 Textures

203879415 David Vasko

I didnt check other browsers until just now and it only works on firefox. In chrome the texture
was not loading correctly so i do not know what is wrong. But it works perfectly on my firefox. 

I did all the required parts of the spec including all the extra credit. I styled an HTML
page that tells you what each button press does. 
NOTE: i used different keys to zoom in and out than what the spec says. The spec asked for
i and o to zoom in and out. I used our previuos camera implementation with 'i' being forward
and 'k' backward. 'n' is narrow field of view, 'w' us widen field of view. Other key presses
are commented in the code and stated on teh HTML page.

Design Choices:

I have three seperate documents. Two scripts and one html file. The scripts are
"camerawork.js"
	This is essentially just a big switch statment that figures out which button was pressed
	and if any of the prescribed keys are pressed perform a particular action. The hardest 
	part was setting my variable of "tau" correctly. Tau basically saves how far the element
	in question has rotates/scrolled so that way the next time the rotate or scroll button is
	it resumes rotating/scrolling from the where it left off.
"ff7_Texture.js"
	This is the bulk of the assignment. Generates the cube with 36 vertices, also when generating
	each vertex it saves that correct normal ad uv data. It sets up a timer and when rotating the
	cubes or rotating the textures since time is stored in seconds to get the cube to rotate at
	60 rpm we must multiply time by 360 becuase i want it to rotate 360 degrees a second or one
	rotation a second. 
"ff7_Texture.html"
	The main things to note here is the shading, which is implemented in the fragent shader to 
	make the spectral highlight to look more natural. The text is rotated or scrolled by adding
	or multiplring the texture coordinate u v by the appropriate matrix.

Look at comments in teh code for further explanation.
