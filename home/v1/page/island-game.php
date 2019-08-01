<h2> Island Mystery Survival </h2>
<h4>Final project for CS 174A, Introduction to Computer Graphics, UCLA Fall 2014</h4>
<center><img src="home/v1/img/island_pic.jpg" style="width:50%;"></center>
<h4>Created by Kyle Kodani, Kevin Lu, Ivan Petkov, Xiaosong Shi, and David Vasko</h4>

<h3>Welcome to Mystery Island!</h3>

<p>See a demo <a href="http://ipetkov.github.io/IslandMysteryGame">here</a>! And see the source code on GitHub <a href="https://github.com/ipetkov/IslandMysteryGame">here</a>.</p>

<p>The object of the game is to enjoy the island. Things you can do: </p>

<ul>
	<li>pick up branches from trees to start a fire (hint: find the firepit!)</li>
	<li>relax and listen to the soothing sounds of nature</li>
	<li>throw rocks</li>
	<li>climb the mountain</li>
	<li>explore!</li>
</ul>
<p>Works best on current versions of Firefox for Mac or Windows.
Works on current versions of Chrome.
Safari untested.</p>
<p>Our advanced topics are: collision, physics, bump mapping.</p>
<h3>
	<a id="user-content-other-cool-stuff" class="anchor" href="#other-cool-stuff" aria-hidden="true"><span class="octicon octicon-link"></span></a>
	Other cool stuff:
</h3>
<ul>
<li>The island is partially randomly generated.  There are 4 regions: rolling hills, forest, bay, and mountain.  Each has randomly generated terrain by using a height map.  The trees and other objects are also randomly placed.</li>
<li>There are lots of sound effects, and there is spooky music at night!</li>
<li>A fire can be made from sticks found on the island </li>
<li>A lit fire will light up the rocks that make up the fire pit</li>
<li>Bumpmapping is only implemented on the trunks of the trees but an example cube is commeneted out in scene.js that shows a gloriously bumped texture</li>
<li>If there are no branches within jumpable height you can knock them off the trees with rocks found on the island!</li>
<li>Thrown rocks will reflect off trees in realistic ways.</li>
</ul>

<h3><a id="user-content-who-did-what" class="anchor" href="#who-did-what" aria-hidden="true"><span class="octicon octicon-link"></span></a>Who did what:</h3>
<h5> Ivan </h5>
<p>Grandmaster of the project. Taught us all how to use git. Main feature worked on was collisions. Collisions was also used to pick up sticks and stones for thin inventory. Implemented the original skeleton code we all followed. Implemented simple lighting.</p>
<h5> Kevin </h5>
<p>Physics king. In charge of player movements and object movements. Ex throwing rocks, bouncing rocks falling sticks. Jumping. All that jazz.</p>
<h5> Kyle </h5>
<p>Mountain and Music maker. He was in charge of the height map which is what gives our island its beautiful appearance. He also implemented all the sound features which add alot to the game. </p>
<h5> David </h5>
<p>Bump Man and Fire Man. Worked with lighting. Made the campfire object, and stick objetcs. </p>
<h5> Ray </h5>
<p>Pig Man. In charge of animating and moving the pig and various other tasks along the way.</p>
