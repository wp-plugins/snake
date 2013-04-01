var snakeDefault = [[7,10],[7,9],[7,8],[7,7],[7,6]];
var snake;
var snakeDirection = 2;
var snakeChangeDirection = 0;
var snakeInterval = 0;
var snakeCellsx = 40;
var snakeCellsy = 15;
var snakeFood;
var snakeScore = 0;
var snakeHasStarted = false;

function snakeDefaultSettings() {
	if (typeof snakeSettings.roundedborders == 'undefined')
		snakeSettings.roundedborders = false;
	if (typeof snakeSettings.color == 'undefined')
		snakeSettings.color = 'red';
	if (typeof snakeSettings.foodcolor == 'undefined')
		snakeSettings.foodcolor = 'orange';
	if (typeof snakeSettings.timeout == 'undefined')
		snakeSettings.timeout = 200;
	else
		snakeSettings.timeout = parseInt(snakeSettings.timeout);
}

function snakeUpdateMessage(text) {
	jQuery('#snakeMessage').text(text);
}

function snakeBuildField() {
	var width = jQuery('#snake').parent().width();
	if (width > 600) width = 600;
	var cellwidth = Math.floor(width / snakeCellsx);
	width = cellwidth * snakeCellsx;
	cellwidth -= 1;
	var cellheight = cellwidth;
	var height = snakeCellsy * (cellheight + 1);
	
	jQuery('#snakeContainer').width( width );
	jQuery('#snake').width( width );
	jQuery('#snake').height( height );
	
	for (var y = 0; y < snakeCellsy; y++) {
		for (var x = 0; x < snakeCellsx; x++) {
			jQuery('#snake').append('<div class="snake_cell" id="snake_cell_'+x+'_'+y+'"></div>');
		}
	}
	jQuery('#snake').find('div.snake_cell').height(cellheight).width(cellwidth);
	if (snakeSettings.roundedborders == 'true')
		jQuery('#snake').find('div.snake_cell').css('border-radius',Math.floor(cellwidth/2)+'px');
}

function snakeClearField() {
	snake = [];
	for (var i in snakeDefault)
		snake.push([snakeDefault[i][0],snakeDefault[i][1]]);
	
	snakeScore = 0;
	jQuery('#snakeScore').text(snakeScore);
	
	snakeUpdateFood();
	
	snakeUpdate();
}

function snakeStart() {
	if (snakeInterval != 0)
		return;
		
	if (snakeHasStarted)
		snakeClearField();
	snakeHasStarted = true;
	
	snakeDirection = 2;
	snakeChangeDirection = 0;
	
	snakeInterval = window.setInterval(function(){
		snakeTick();
		snakeUpdate();
	},snakeSettings.timeout);
}

function snakeValidFood() {
	for (var i in snake)
		if (snake[i][0] == snakeFood[0] && snake[i][1] == snakeFood[1])
			return false;
	return true;
}

function snakeUpdateFood() {	
	do {
		snakeFood = [Math.floor(Math.random()*snakeCellsy), Math.floor(Math.random()*snakeCellsx)];
	} while (!snakeValidFood());
}

function snakeAddToScore(addition) {
	snakeScore += addition;
	jQuery('#snakeScore').text(snakeScore);
}

function snakeDie() {
	window.clearInterval(snakeInterval);
	snakeInterval = 0;
	snakeUpdateMessage("You're dead.");
	jQuery('#snake').css('background-color','#f00');
	window.setTimeout(function(){jQuery('#snake').css('background-color','transparent');},50);
	return false;
}

function snakeTick() {
	if (snakeChangeDirection!=0) {
		switch (snakeChangeDirection) {
			case 4: if (snakeDirection != 2) snakeDirection = 4; break;
			case 1: if (snakeDirection != 3) snakeDirection = 1; break;
			case 2: if (snakeDirection != 4) snakeDirection = 2; break;
			case 3: if (snakeDirection != 1) snakeDirection = 3; break;
		}
		direction = snakeChangeDirection;
		snakeChangeDirection = 0;
	}
	
	var oldPosition = snake[snake.length-1];
	
	for (var i = snake.length - 1; i > 0; i--)
		snake[i] = [snake[i-1][0],snake[i-1][1]];
		
	switch (snakeDirection) {
		case 1: snake[0][0]--; break;
		case 2: snake[0][1]++; break;
		case 3: snake[0][0]++; break;
		case 4: snake[0][1]--; break;
	}
	
	if (snake[0][0] == snakeFood[0] && snake[0][1] == snakeFood[1]) {
		snakeAddToScore(5);
		snake.push(oldPosition);
		snakeUpdateFood();
	}
}

function snakeUpdate() {
	if (snake[0][0] < 0 || snake[0][0] > snakeCellsy-1 || snake[0][1] < 0 || snake[0][1] > snakeCellsx-1)
		return snakeDie();
	
	if (snakeHasStarted) 
		if (snake[0][0] < 2 || snake[0][0] > snakeCellsy-3 || snake[0][1] < 2 || snake[0][1] > snakeCellsx-3)
			snakeUpdateMessage("Careful!");
		else
			snakeUpdateMessage("Good job.");
	
	for (var i in snake)
		if (i != 0 && (snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1]))
			return snakeDie();
		
	jQuery('.snake_cell').css('background-color','#fff');
	switch (snakeSettings.color) {
		case 'red': for (var i in snake)
			jQuery('#snake_cell_'+snake[i][1]+'_'+snake[i][0]).css('background-color','rgb('+Math.max(Math.floor(255-i*255/snake.length),0)+',0,0)');
			break;
		case 'green': for (var i in snake)
			jQuery('#snake_cell_'+snake[i][1]+'_'+snake[i][0]).css('background-color','rgb(0,'+Math.max(Math.floor(255-i*255/snake.length),0)+',0)');
			break;
		case 'blue': for (var i in snake)
			jQuery('#snake_cell_'+snake[i][1]+'_'+snake[i][0]).css('background-color','rgb(0,0,'+Math.max(Math.floor(255-i*255/snake.length),0)+')');
			break;
		default: for (var i in snake)
			jQuery('#snake_cell_'+snake[i][1]+'_'+snake[i][0]).css('background-color','rgb('+Math.max(Math.floor(255-i*255/snake.length),0)+',0,0)');
	}
	
	jQuery('#snake_cell_'+snakeFood[1]+'_'+snakeFood[0]).css('background-color',snakeSettings.foodcolor);
}

jQuery(document).ready(function(){
	snakeDefaultSettings();

	snakeBuildField();
	
	snakeClearField();

	jQuery(document).keydown(function (e){ 
		var preventDefault = true;
		if (snakeChangeDirection == 0) {
			switch (e.keyCode) {
				case 37: snakeChangeDirection = 4; break;
				case 38: snakeChangeDirection = 1; break;
				case 39: snakeChangeDirection = 2; break;
				case 40: snakeChangeDirection = 3; break;
				default: preventDefault = false;
			}
		} else if (e.keyCode < 37 || e.keyCode > 40) {
			preventDefault = false;
		}
		if (preventDefault)
			e.preventDefault();
	});
});