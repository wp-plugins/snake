<?php
/*
Plugin Name: Snake
Plugin URI: http://wordpress.camilstaps.nl/plugins/snake/
Description: Let your users play snake on your website!
Version: 1.0
Author: Camil Staps
Author URI: http://camilstaps.nl
License: GPL2

Copyright 2012  Camil Staps  (email : info@camilstaps.nl)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as 
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/

register_activation_hook(__FILE__,'snake_install');
function snake_install() {
	add_option('snake_rounded_borders',false,'','yes');
}

register_deactivation_hook(__FILE__, 'snake_remove' );
function snake_remove() {
	delete_option('snake_rounded_borders');
}

/* ADMIN MENU */
add_action('admin_menu', 'snake_admin_menu');
function snake_admin_menu() {
	add_options_page('Snake', 'Snake', 'administrator','snake', 'snake_option_page');
}
function snake_option_page() {
	?>
	<h1>Snake</h1>
	<h2>How can I insert snake?</h2>
	<p>It's really easy. The only thing you have to do is adding the <code>[snake]</code> shortcode to your post. Give it a try!</p>
	<h3>Shortcode variables</h3>
	<p>This shortcode accepts variables, like this: <code>[snake color=blue]</code>. This would make the color of the snake blue. Here's an overview of the variables you can use:</p>
	<ul>
		<li><code>color</code>: set the color of the snake. Accepted values are <code>red</code>, <code>green</code> and <code>blue</code>. Default: <code>red</code>.</li>
		<li><code>foodcolor</code>: set the color of the food. Accepted values are any color definitions (<code>#ff0000</code> for red, e.g.). Default: <code>orange</code>.</li>
		<li><code>timeout</code>: set the timeout for the snake to walk. You need to enter an integer, this will be the timeout in milliseconds. Default: <code>200</code>. It is highly recommended to keep this value above 100, since slower computers might not be able to handle the game with a low timeout.</li>
	</ul>
	<h3>Example</h3>
	<p><code>[snake color=green foodcolor=red timeout=100]</code></p>
	<p>This would give you a green snake, red food and a timeout of 100 milliseconds.</p>
	<h2>Who am I?</h2>
	<p>I'm Camil Staps, a freelance webdeveloper & WordPress specialist. You can check out my website at <a href="http://www.camilstaps.nl/">camilstaps.nl</a>, or my WordPress shack at <a href="http://wordpress.camilstaps.nl">wordpress.camilstaps.nl</a>.</p>
	<?php
}

/* SHORTCODE */

function playSnake($atts) {
	wp_enqueue_style('snake',plugins_url().'/snake/snake.css');
	wp_enqueue_script('snake',plugins_url().'/snake/snake.js',array('jquery'));
	
	if (is_array($atts))
		wp_localize_script( 'snake', 'snakeSettings', $atts );
	else 
		wp_localize_script( 'snake', 'snakeSettings', array() );
	
	$return = '<div id="snakeContainer">';
	$return .= '<span class="snakeLabel"><span class="snakeButton" onclick="snakeStart();">Start</span></span>';
	$return .= '<span class="snakeLabel">Score: <span class="snakeInput" id="snakeScore">0</span></span>';
	$return .= '<span class="snakeLabel"><span class="snakeText" id="snakeMessage">Press the start button to begin.</span></span>';
	//$return .= '<span class="snakeLabel snakeLabelRight"><span class="snakeText"><a href="http://wordpress.camilstaps.nl/plugins/snake" target="_blank">Snake</a> by <a href="http://www.camilstaps.nl/" target="_blank">Camil Staps</a></span></span>';
	$return .= '<div id="snake"></div>';
	$return .= '</div><br style="clear:both;"/>';
	return $return;
}
add_shortcode('snake','playSnake');
?>