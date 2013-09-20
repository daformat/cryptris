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

function setTextTimerPaint(timerText, text) {
    timerText.paint = function(director) {

        var ctx = director.ctx;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00FF9D';

        ctx.font = '22px Quantico';
        ctx.fillStyle = 'white';
        ctx.fillText(text, 0, 0);
    }
}

function InfoColumn(director, resultScene, crypt_key) {

	this.resultScene = resultScene;
	this.director = director;
	this.crypt_key = crypt_key;

	this.infoColumnContainer = new CAAT.Foundation.ActorContainer();
	this.resultScene['scene'].addChild(this.infoColumnContainer);

	this.infoColumnContainer.setSize(240, 440).centerAt(resultScene['game_box'].gameBox.x + resultScene['game_box'].gameBox.width + 130, 80 + resultScene['game_box'].gameBox.height / 2);

    this.cryptrisLogo = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('logo-board')).
                            setLocation(0, 0).
                            setSize(240, 110);

    this.leftTimer = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('left-board')).
                            setLocation(this.cryptrisLogo.x + 35, this.cryptrisLogo.y + this.cryptrisLogo.height + 20);


    this.centerTimer = new CAAT.Foundation.ActorContainer().
                            setSize(105, director.getImage('center-board').height).
                            setBackgroundImage(director.getImage('center-board'), false).
                            setLocation(this.leftTimer.x + this.leftTimer.width, this.leftTimer.y);

    this.centerTimer.paint = function(director) {
        var ctx = director.ctx;
        var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    this.timerText = new CAAT.Foundation.Actor().
                            setLocation(0, this.centerTimer.height / 2 + 8);
    this.centerTimer.addChild(this.timerText);

    this.rightTimer = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('right-board')).
                            setLocation(this.centerTimer.x + this.centerTimer.width, this.centerTimer.y);

    this.pauseButton = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('pause-up')).
                            setLocation(this.cryptrisLogo.x + 65, this.centerTimer.y + this.centerTimer.height + 30);

    this.helpButton = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('help-up')).
                            setLocation(this.pauseButton.x + this.pauseButton.width + 20, this.pauseButton.y);

    this.pad = new CAAT.Actor().setSize(155, 152)
                    .setBackgroundImage(director.getImage('pad-untouched'))
                    .setLocation(this.cryptrisLogo.x + 45, this.pauseButton.y + this.pauseButton.height + 30);

    var object = this;
    this.pad.mouseDown = function(e) {
        var theta = Math.PI / 4;
        var x2 = (e.x - object.pad.width / 2) * Math.cos(theta) + (e.y - object.pad.height / 2) * Math.sin(theta);
        var y2 = (e.y - object.pad.height / 2) * Math.cos(theta) - (e.x - object.pad.width / 2) * Math.sin(theta);        
        if (x2 * x2 + y2 * y2 <= 70 * 70) {

            if (x2 < 0 && y2 > 0) {
                object.pad.setBackgroundImage(object.director.getImage('pad-left'));
                object.crypt_key.rotateLeft();
            }
            if (x2 > 0 && y2 < 0) {
                object.pad.setBackgroundImage(object.director.getImage('pad-right'));
                object.crypt_key.rotateRight();
            }
            if (x2 > 0 && y2 > 0) {
               	object.pad.setBackgroundImage(object.director.getImage('pad-down'));
                object.crypt_key.keyDown();
            }
            if (x2 < 0 && y2 < 0) {
                object.pad.setBackgroundImage(object.director.getImage('pad-up'));
                object.crypt_key.changeKeyType();
            }
        }
    }

    CAAT.registerKeyListener(function(key) {
        if (key.getKeyCode() === CAAT.Keys.LEFT) {
            if (key.getAction() === 'down') {
                object.pad.setBackgroundImage(object.director.getImage('pad-left'));
            } else if (key.getAction() === 'up') {
                object.pad.setBackgroundImage(object.director.getImage('pad-untouched'));
            }
        }
        if (key.getKeyCode() === CAAT.Keys.RIGHT) {
            if (key.getAction() === 'down') {
                object.pad.setBackgroundImage(object.director.getImage('pad-right'));
            } else if (key.getAction() === 'up') {
                object.pad.setBackgroundImage(object.director.getImage('pad-untouched'));
            }
        }
        if (key.getKeyCode() === CAAT.Keys.UP || key.getKeyCode() === 32) {
            if (key.getAction() === 'down') {
                object.pad.setBackgroundImage(object.director.getImage('pad-up'));
            } else if (key.getAction() === 'up') {
                object.pad.setBackgroundImage(object.director.getImage('pad-untouched'));
            }
        }
        if (key.getKeyCode() === CAAT.Keys.DOWN) {
            if (key.getAction() === 'down') {
                object.pad.setBackgroundImage(object.director.getImage('pad-down'));
            } else if (key.getAction() === 'up') {
                object.pad.setBackgroundImage(object.director.getImage('pad-untouched'));
            }
        }
    });

    this.pad.mouseUp = function(mouseEvent) {
        object.pad.setBackgroundImage(object.director.getImage('pad-untouched'));
    }


    /**
     * Add a paused behavior on pause button.
     */
     var isPauseDown = false;
     var pauseX = this.pauseButton.x;
     var pauseY = this.pauseButton.y;
     this.pauseButton.mouseDown = function(mouseEvent) {
        if (isPauseDown === false) {
            object.pauseButton.setBackgroundImage(object.director.getImage('pause-down')).setLocation(pauseX, pauseY + 3);
            isPauseDown = true;
        } else {
            object.pauseButton.setBackgroundImage(object.director.getImage('pause-up')).setLocation(pauseX, pauseY);
            isPauseDown = false;
        }
     }
     this.pauseButton.mouseUp = function(mouseEvent) {
        if (isPauseDown === false) {
            object.resultScene['scene'].setPaused(false);
        } else {
            object.resultScene['scene'].setPaused(true);
        }
     }

     /**
      * Add a behavior for help button (to upgrade).
      */
    var isHelpDown = false;
    var helpX = this.helpButton.x;
    var helpY = this.helpButton.y;
    this.helpButton.mouseDown = function(mouseEvent) {
        if (isHelpDown === false) {
            object.helpButton.setBackgroundImage(object.director.getImage('help-down')).setLocation(helpX, helpY + 3);
            isHelpDown = true;
        } else {
            object.helpButton.setBackgroundImage(object.director.getImage('help-up')).setLocation(helpX, helpY);
            isHelpDown = false;
        }
    }

    this.infoColumnContainer.addChild(this.cryptrisLogo);
    this.infoColumnContainer.addChild(this.pad);
    this.infoColumnContainer.addChild(this.pauseButton);
    this.infoColumnContainer.addChild(this.helpButton);
    this.infoColumnContainer.addChild(this.leftTimer);
    this.infoColumnContainer.addChild(this.centerTimer);
    this.infoColumnContainer.addChild(this.rightTimer);

    resultScene['scene'].createTimer(resultScene['scene'].time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

            /**
             * Update the timer value.
             */
            setTextTimerPaint(object.timerText, convertTimeToString(time));
        }
    );
}