function convertTimeToString(time) {
	var timeInSecond = Math.floor(time / 1000);
	var hour = Math.floor(timeInSecond / 3600);
	var minuteInSecond = timeInSecond % 3600;
	var minute = Math.floor(minuteInSecond / 60);
	var second = minuteInSecond % 60;

	var hourString = "" + hour;
	if (hour < 10) {
		hourString = "0" + hourString;
	}

	var minuteString = "" + minute;
	if (minute < 10) {
		minuteString = "0" + minuteString;
	}

	var secondString = "" + second;
	if (second < 10) {
		secondString = "0" + secondString;
	}

	return hourString + ":" + minuteString + ":" + secondString;
}

function InfoColumn(director, resultScene, crypt_key, withGauge) {

	this.resultScene = resultScene;
	this.director = director;
	this.crypt_key = crypt_key;
	this.marge = 30;
	this.gameIsInProgress = false;
	this.currentTime = 0;
	this.withGauge = withGauge;
	this.timeElapseBeforeStart = 0;

	var object = this;
	$(document).on('startTime', function(event, scene) {
		if (resultScene.scene === scene) {
			object.timeElapseBeforeStart = scene.time;
			object.gameIsInProgress = true;
		}
	});

	$(document).on('freezeTime', function(event, argsEvent) {
		var scene = argsEvent['scene'];
		var timeLabel = argsEvent['timeLabel'];
		if (resultScene.scene === scene) {
			currentGame[timeLabel] = parseInt((scene.time - object.timeElapseBeforeStart) / 1000);
			object.gameIsInProgress = false;
		}
	});

	this.titleColumnContainer = new CAAT.Foundation.ActorContainer();
	this.infoColumnContainer = new CAAT.Foundation.ActorContainer();
	this.resultScene['scene'].addChild(this.infoColumnContainer);
	this.resultScene['scene'].addChild(this.titleColumnContainer);

	this.cryptrisLogo = new CAAT.Foundation.Actor().setBackgroundImage(director.getImage('logo-board')).setSize(240, 110);

	this.leftTimer = new CAAT.Foundation.Actor().
		setBackgroundImage(director.getImage('left-board'));


	this.centerTimer = new CAAT.Foundation.ActorContainer().
		setSize(105, director.getImage('center-board').height).
		setBackgroundImage(director.getImage('center-board'), false);

	this.centerTimer.paint = function(director) {
		var ctx = director.ctx;
		var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, this.width, this.height);
	}

	this.timerText = new CAAT.Foundation.Actor().setLocation(0, this.centerTimer.height / 2 + 8);
	this.timerText.paint = function(director) {

		var ctx = director.ctx;

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 5;
		ctx.shadowColor = '#00FF9D';

		ctx.font = '700 22px Quantico';
		ctx.fillStyle = 'white';
		if (object.gameIsInProgress === true) {
			object.currentTime = resultScene.scene.time - object.timeElapseBeforeStart;
		}
		ctx.fillText(convertTimeToString(object.currentTime), 0, 0);
	}

	this.centerTimer.addChild(this.timerText);

	this.rightTimer = new CAAT.Foundation.Actor().
		setBackgroundImage(director.getImage('right-board'));

	this.pauseButton = new CAAT.Foundation.Actor().
		setBackgroundImage(director.getImage('pause-up'));
	this.pauseButton.isPressed = false;

	this.helpButton = new CAAT.Foundation.Actor().
		setBackgroundImage(director.getImage('help-up'));
	this.helpButton.isPressed = false;



    /**
     * Create the gauge if necessary.
     */
    if (this.withGauge === true) {
      this.gauge0_img = director.getImage('gauge0');
      this.gauge1_img = director.getImage('gauge1');
      this.gauge2_img = director.getImage('gauge2');
      this.gauge3_img = director.getImage('gauge3');
      this.gauge4_img = director.getImage('gauge4');
      this.gauge5_img = director.getImage('gauge5');
      this.gauge6_img = director.getImage('gauge6');

      this.gaugeZone = new CAAT.Foundation.ActorContainer().setSize(this.gauge0_img.width, this.gauge0_img.height).setBackgroundImage(this.gauge0_img, false);

      var object = this;
	  this.resultScene['scene'].createTimer(this.director.time, Number.MAX_VALUE, null,
   		function(time, ttime, timerTask) {
          var scoreNumber = score(object.crypt_key.msgColumn.getNumbers());
          var test = 0;
          if (scoreNumber === 0) {
            object.gaugeZone.setBackgroundImage(object.gauge0_img, false);
          } else if (scoreNumber < 1.5) {
            object.gaugeZone.setBackgroundImage(object.gauge1_img, false);
          } else if (scoreNumber >= 1.5 && scoreNumber < 2) {
            object.gaugeZone.setBackgroundImage(object.gauge2_img, false);
          } else if (scoreNumber >= 2 && scoreNumber < 2.5) {
            object.gaugeZone.setBackgroundImage(object.gauge3_img, false);
          } else if (scoreNumber >= 2.5 && scoreNumber < 3) {
            object.gaugeZone.setBackgroundImage(object.gauge4_img, false);
          } else if (scoreNumber >= 3 && scoreNumber < 4) {
            object.gaugeZone.setBackgroundImage(object.gauge5_img, false);
          } else {
          	object.gaugeZone.setBackgroundImage(object.gauge6_img, false);
          }
        }
      );
/*
      */
    }



	this.pad = new CAAT.Actor().setSize(155, 152)
		.setBackgroundImage(director.getImage('pad-untouched'));

	this.titleColumnContainer.addChild(this.cryptrisLogo);
	this.infoColumnContainer.addChild(this.pad);
	this.infoColumnContainer.addChild(this.pauseButton);
	this.infoColumnContainer.addChild(this.helpButton);
	this.infoColumnContainer.addChild(this.leftTimer);
	this.infoColumnContainer.addChild(this.centerTimer);
	this.infoColumnContainer.addChild(this.rightTimer);
	if (this.withGauge === true) {
	    this.infoColumnContainer.addChild(this.gaugeZone);
	}

	this.redraw = function() {
		if (this.director.height < 600) {
			this.marge = 15;
		}
		else if (this.director.height > 800) {
			this.marge = 30;
		}
		else {
			this.marge = 15 / 200 * this.director.height - 30;
		}
		if (currentGame.miniScreen === true) {
			this.titleColumnContainer.setScale(0.9, 0.9);
			this.titleColumnContainer.centerAt(this.resultScene.game_box.gameBox.x + this.resultScene.game_box.gameBox.width + 25, 15);
			if (this.withGauge === true) {
				this.infoColumnContainer.setSize(240, this.marge * 3 - 10 + 455)
									.centerAt(this.resultScene.game_box.gameBox.x + this.resultScene.game_box.gameBox.width + 130, this.crypt_key.boxOption.resizeOption.DEFAULT_RELATIVE_Y_WITH_GAUGE + this.resultScene.game_box.gameBox.height / 2 + 30);
			} else {
				this.infoColumnContainer.setSize(240, this.marge * 3 - 10 + 455)
										.centerAt(this.resultScene.game_box.gameBox.x + this.resultScene.game_box.gameBox.width + 130, this.crypt_key.boxOption.resizeOption.DEFAULT_RELATIVE_Y + this.resultScene.game_box.gameBox.height / 2 + 20);
			}
		} else {
			this.titleColumnContainer.setScale(1, 1);
			if (this.withGauge === true) {
				this.titleColumnContainer.centerAt(this.resultScene.game_box.gameBox.x + this.resultScene.game_box.gameBox.width + 10, this.crypt_key.boxOption.resizeOption.DEFAULT_RELATIVE_Y + this.resultScene.game_box.gameBox.height / 2 - 200);
				this.infoColumnContainer.setSize(240, this.marge * 3 - 10 + 455).setLocation(this.titleColumnContainer.x, this.titleColumnContainer.y + this.titleColumnContainer.height);
			} else {
				this.titleColumnContainer.centerAt(this.resultScene.game_box.gameBox.x + this.resultScene.game_box.gameBox.width + 10, this.crypt_key.boxOption.resizeOption.DEFAULT_RELATIVE_Y + this.resultScene.game_box.gameBox.height / 2 - 180);
				this.infoColumnContainer.setSize(240, this.marge * 3 - 10 + 455).setLocation(this.titleColumnContainer.x, this.titleColumnContainer.y + this.titleColumnContainer.height);
			}
		}
		if (this.infoColumnContainer.y <= 90) {
			this.infoColumnContainer.setLocation(this.infoColumnContainer.x, 90);
		}

		this.cryptrisLogo.setLocation(0, 0);
		this.leftTimer.setLocation(35, this.cryptrisLogo.height + this.marge - 20);
		this.centerTimer.setLocation(this.leftTimer.x + this.leftTimer.width, this.leftTimer.y);
		this.rightTimer.setLocation(this.centerTimer.x + this.centerTimer.width, this.centerTimer.y);

		var relativePauseY = this.pauseButton.isPressed ? 3 : 0;
		this.pauseButton.setLocation(this.cryptrisLogo.x + 65, this.centerTimer.y + this.centerTimer.height + this.marge + 10 + relativePauseY);

		var relativeHelpY = this.helpButton.isPressed ? 3 : 0;
		this.helpButton.setLocation(this.pauseButton.x + this.pauseButton.width + 20, this.pauseButton.y - relativePauseY + relativeHelpY);


      	if (this.withGauge === true) {
        	this.gaugeZone.setLocation(this.cryptrisLogo.x + 30, this.pauseButton.y + this.pauseButton.height + this.marge);
        	this.pad.setLocation(this.cryptrisLogo.x + 45, this.gaugeZone.y + this.gaugeZone.height + this.marge);
      	} else {
			this.pad.setLocation(this.cryptrisLogo.x + 45, this.pauseButton.y + this.pauseButton.height + this.marge);
		}
	}
	this.redraw();

}
