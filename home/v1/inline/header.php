<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width">
	<title>David Vasko</title>
	<link rel="SHORTCUT ICON" HREF="/favicon.png">
	<link rel="stylesheet" href="/home/v1/style.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<!-- phone home to google -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <!--script src="https://use.fontawesome.com/a633e84c9b.js"></script-->
	<style>
		.columns {
			-webkit-columns: 2;
			-moz-columns: 2; }
	</style>
</head>

<body>
	<div id="top_bar">
		<h1 id="top_bar">Vasko6d</h1>
	</div>
	<div id="nav1_bar">
		<?php
		switch($x['path']) {
			case "project":
			case "billiard-ball-robot":
			case "island-game":
			case "finite-volume":
			case "finite-element":
			case "webgl-graphic":?>
				<a class="nav1" href="/">HOME</a>
				<a id="cur_tab" href="/project">Project</a>
				<a class="nav1" href="/climbing">Climbing</a>
				<a class="nav1" href="/crossword">Crossword</a>
				<br clear="all" /><?php
				break;
			case "climbing":?>
				<a class="nav1" href="/">HOME</a>
				<a class="nav1" href="/project">Project</a>
				<a id="cur_tab" href="/climbing">Climbing</a>
				<a class="nav1" href="/crossword">Crossword</a>
				<br clear="all" /><?php
				break;
			case "crossword":?>
				<a class="nav1" href="/">HOME</a>
				<a class="nav1" href="/project">Project</a>
				<a class="nav1" href="/climbing">Climbing</a>
				<a id="cur_tab" href="/crossword">Crossword</a>
				<br clear="all" /><?php
				break;
			case "":?>
				<a id="cur_tab" href="/">HOME</a>
				<a class="nav1" href="/project">Project</a>
				<a class="nav1" href="/climbing">Climbing</a>
				<a class="nav1" href="/crossword">Crossword</a>
				<br clear="all" /><?php
				break;
			default:?>
				<a class="nav1" href="/">HOME</a>
				<a class="nav1" href="/project">Project</a>
				<a class="nav1" href="/climbing">Climbing</a>
				<a class="nav1" href="/crossword">Crossword</a>
				<br clear="all" /><?php
				break;
		} ?>
	</div>
	<div class="nav2"><?php
		switch($x['path']) {
			case "project":
			case "billiard-ball-robot":
			case "island-game":
			case "finite-volume":
			case "finite-element":
			case "webgl-graphic":?>
				<a href="/billiard-ball-robot">Ball Robot</a>
				<a href="/island-game">Island Game</a>
				<a href="/webgl-graphic">Graphics</a>
				<a href="/finite-volume">Finite Volume</a>
				<a href="/finite-element">Finite Element</a><?php
				break;
			default:
				echo "<br/>";
				break;
		} ?>
	</div>
	<div class="main">
