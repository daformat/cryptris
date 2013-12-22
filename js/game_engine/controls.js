function bindPlayerKeyWithKeyboard(crypt_key, hookSceneActive) {
	var scene = crypt_key.boxOption.scene;

	CAAT.registerKeyListener(function (key) {
		if (scene.isPaused() === false && currentGame[hookSceneActive] === true  && crypt_key.msgColumn.resolved === false) {
			if (key.getKeyCode() === CAAT.Keys.LEFT && key.getAction() === 'down') {
				crypt_key.rotateLeft();
			}
			if (key.getKeyCode() === CAAT.Keys.RIGHT && key.getAction() === 'down') {
				crypt_key.rotateRight();
			}
			if ((key.getKeyCode() === CAAT.Keys.UP || key.getKeyCode() === 32) && key.getAction() === 'down') {
				crypt_key.changeKeyType();
			}

			if (key.getKeyCode() === CAAT.Keys.DOWN && key.getAction() === 'down') {
				crypt_key.keyDown();
			}
		}
	});
}

function bindCKPlayerKeyWithKeyboard(ia_process, scene, gameBox, hookSceneActive) {
	var crypt_key = gameBox.crypt_key;

	CAAT.registerKeyListener(function (key) {
		if (scene.isPaused() === false && currentGame[hookSceneActive] === true) {
			var keyIsActive = crypt_key.numberApplied <= currentGame.maxNewKeyMove;
			if (key.getKeyCode() === CAAT.Keys.LEFT && key.getAction() === 'down') {
				keyIsActive ? crypt_key.rotateLeft() : null;
			}
			if (key.getKeyCode() === CAAT.Keys.RIGHT && key.getAction() === 'down') {
				keyIsActive ?  crypt_key.rotateRight() : null;
			}
			if ((key.getKeyCode() === CAAT.Keys.UP || key.getKeyCode() === 32) && key.getAction() === 'down') {
				keyIsActive ? crypt_key.changeKeyType() : null;
			}
			if (key.getKeyCode() === CAAT.Keys.DOWN && key.getAction() === 'down') {
				keyIsActive ? crypt_key.keyDown() : null;
			}
		}
	});
}

function bindPadWithKey(pad, director, crypt_key, hookSceneActive) {

	pad.mouseUp = function(mouseEvent) {
		pad.setBackgroundImage(director.getImage('pad-untouched'));
	}

	pad.mouseDown = function(e) {

		var padIsActive = !crypt_key.boxOption.scene.isPaused() && currentGame[hookSceneActive] && crypt_key.msgColumn.resolved === false;

		var theta = Math.PI / 4;
		var x2 = (e.x - pad.width / 2) * Math.cos(theta) + (e.y - pad.height / 2) * Math.sin(theta);
		var y2 = (e.y - pad.height / 2) * Math.cos(theta) - (e.x - pad.width / 2) * Math.sin(theta);
		if (x2 * x2 + y2 * y2 <= 70 * 70) {

			if (x2 < 0 && y2 > 0) {
				pad.setBackgroundImage(director.getImage('pad-left'));
				padIsActive ? crypt_key.rotateLeft() : null;
			} else if (x2 > 0 && y2 < 0) {
				pad.setBackgroundImage(director.getImage('pad-right'));
				padIsActive ? crypt_key.rotateRight() : null;
			} else if (x2 > 0 && y2 > 0) {
				pad.setBackgroundImage(director.getImage('pad-down'));
				padIsActive ? crypt_key.keyDown() : null;
			} else if (x2 < 0 && y2 < 0) {
				pad.setBackgroundImage(director.getImage('pad-up'));
				padIsActive ? crypt_key.changeKeyType() : null;
			}
		}
	}
}

function bindCKPadWithKey(pad, director, ia_process, scene, gameBox, hookSceneActive) {
	pad.mouseUp = function(mouseEvent) {
		pad.setBackgroundImage(director.getImage('pad-untouched'));
	}


	pad.mouseDown = function(e) {
		var crypt_key = gameBox.crypt_key;
		var padIsActive = !crypt_key.boxOption.scene.isPaused() && currentGame[hookSceneActive];
		var padMoveKey = padIsActive && crypt_key.numberApplied < currentGame.maxNewKeyMove;

		var theta = Math.PI / 4;
		var x2 = (e.x - pad.width / 2) * Math.cos(theta) + (e.y - pad.height / 2) * Math.sin(theta);
		var y2 = (e.y - pad.height / 2) * Math.cos(theta) - (e.x - pad.width / 2) * Math.sin(theta);
		if (x2 * x2 + y2 * y2 <= 70 * 70) {

			if (x2 < 0 && y2 > 0) {
				pad.setBackgroundImage(director.getImage('pad-left'));
				padMoveKey ? crypt_key.rotateLeft() : null;
			} else if (x2 > 0 && y2 < 0) {
				pad.setBackgroundImage(director.getImage('pad-right'));
				padMoveKey ? crypt_key.rotateRight() : null;
			} else if (x2 > 0 && y2 > 0) {
				pad.setBackgroundImage(director.getImage('pad-down'));
				padMoveKey ? crypt_key.keyDown() : null;
			} else if (x2 < 0 && y2 < 0) {
				pad.setBackgroundImage(director.getImage('pad-up'));
				padMoveKey ? crypt_key.changeKeyType() : null;
			}
		}
	}
}


function bindPadWithKeyboard(pad, director, hookSceneActive) {

	CAAT.registerKeyListener(function(key) {
		if (currentGame[hookSceneActive]) {
			if (key.getKeyCode() === CAAT.Keys.LEFT) {
				if (key.getAction() === 'down') {
					pad.setBackgroundImage(director.getImage('pad-left'));
				} else if (key.getAction() === 'up') {
					pad.setBackgroundImage(director.getImage('pad-untouched'));
				}
			}
			if (key.getKeyCode() === CAAT.Keys.RIGHT) {
				if (key.getAction() === 'down') {
					pad.setBackgroundImage(director.getImage('pad-right'));
				} else if (key.getAction() === 'up') {
					pad.setBackgroundImage(director.getImage('pad-untouched'));
				}
			}
			if (key.getKeyCode() === CAAT.Keys.UP || key.getKeyCode() === 32) {
				if (key.getAction() === 'down') {
					pad.setBackgroundImage(director.getImage('pad-up'));
				} else if (key.getAction() === 'up') {
					pad.setBackgroundImage(director.getImage('pad-untouched'));
				}
			}
			if (key.getKeyCode() === CAAT.Keys.DOWN) {
				if (key.getAction() === 'down') {
					pad.setBackgroundImage(director.getImage('pad-down'));
				} else if (key.getAction() === 'up') {
					pad.setBackgroundImage(director.getImage('pad-untouched'));
				}
			}
		}
	});
}


function bindPauseButtonWithObjects(pauseButton, director, hookSceneActive, pauseEvent) {

	var relativeY = 3;
	pauseButton.mouseDown = function(mouseEvent) {
		if (currentGame[hookSceneActive]) {
			pauseButton.setBackgroundImage(director.getImage('pause-down')).setLocation(pauseButton.x, pauseButton.y + relativeY);
		}
	}

	pauseButton.mouseUp = function(mouseEvent) {
		if (currentGame[hookSceneActive]) {
			console.log('ici');
			pauseEvent ? $(document).trigger(pauseEvent) : null;
			pauseButton.setBackgroundImage(director.getImage('pause-up')).setLocation(pauseButton.x, pauseButton.y - relativeY);
			pauseButton.isPressed = false;
		}
	}
}

function bindHelpButtonByDefault(helpButton, director, hookSceneActive, helpEvent) {

	var relativeY = 3;
	helpButton.mouseDown = function(mouseEvent) {
		if (currentGame[hookSceneActive]) {
			helpButton.setBackgroundImage(director.getImage('help-down')).setLocation(helpButton.x, helpButton.y + relativeY);
		}
	}

	helpButton.mouseUp = function(mouseEvent) {
		if (currentGame[hookSceneActive]) {
			helpEvent ? $(document).trigger(helpEvent) : null;
			helpButton.setBackgroundImage(director.getImage('help-up')).setLocation(helpButton.x, helpButton.y - relativeY);
			helpButton.isPressed = false;
		}
	}
}
