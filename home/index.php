<?php

# Copyright 2003-2015 John Vasko III
#
# This file is part of the Vaskos Framework
#
# The Vaskos Framework is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# The Vaskos Framework is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with The Vaskos Framework. If not, see <http://www.gnu.org/licenses/>.

########
# David to self, how to start the php server:
#  php -S localhost:8000
########

function get_x() {
	# When a form is used with POST the action on the form must be set to "/index.php"
	# "/index.php" is the ONLY page that really exists
	# ALL other pages are loaded through the "404 page" and do NOT have access to POST variables.

	# Assumes 1 ? is allowed in URL
	$a0 = explode('?', $_SERVER['REQUEST_URI']);

	# Needed to force get values when using get variables in the <form action="">
	if (isset($a0[1]))
		parse_str($a0[1], $_GET);

	if (isset($_GET['x']))
		$a1 = explode('/', ltrim($_GET['x'], '/'));
	elseif (isset($_POST['x']))
		$a1 = explode('/', ltrim($_POST['x'], '/'));
	else
		$a1 = explode('/', ltrim($a0[0], '/'));

	$i1 = count($a1) - 1;
	if (empty($a1[$i1]))
		unset($a1[$i1]);
	if (empty($a1))
		$a1 = array(
			'0' => '',
		);

	return $a1;
}

$x['raw'] = get_x();
debug_to_console($x['raw']);

# /
$x['path'] = implode('/', $x['raw']);

# /sUbDiR/
# array_shift($x['raw']);
# $x['path'] = implode('/', $x['raw']);

switch($x['path']) {
	case '':
	# case 'index.php': # no need to use here (everything loads through this file anyway)
		header('HTTP/1.0 200 Found');
		include('home/v1/inline/header.php');
		include('home/v1/page/main.php');
		include('home/v1/inline/footer.php');
	break;
	case 'project':
		header('HTTP/1.0 200 Found');
		include('home/v1/inline/header.php');
		include('home/v1/page/billiard-ball-robot.php');
		include('home/v1/inline/footer.php');
	break;
	case 'billiard-ball-robot':
	case 'island-game':
	case 'webgl-graphic':
	case 'finite-volume':
	case 'finite-element':
	case 'climbing':
	case 'crossword':
		header('HTTP/1.0 200 Found');
		include('home/v1/inline/header.php');
		include('home/v1/page/' . $x['path'] . '.php');
		include('home/v1/inline/footer.php');
	break;
	default:
		header('HTTP/1.0 404 Not Found');
		die('File NOT found. Please return to: <a href="/">The Home Page</a>');
		# can add a more beautiful page here if you want
		# include('home/v1/inline/header.php');
		# include('home/v1/page/404.php');
		# include('home/v1/inline/footer.php');
	break;
} ?>
