function GameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player) {
    this.director = director;
    this.boxOption = boxOption;
    this.relativeX = relativeX;
    this.relativeY = relativeY;
    this.current_length = current_length;
    this.key_info = key_info;
    this.my_message = my_message;
    this.player = player;
    this.tryToResize = false;

    this.sizeWidth = function() {
        return this.current_length * (this.boxOption.SPACE_WIDTH + this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH) - this.boxOption.SPACE_WIDTH + 2 * this.boxOption.BORDER_WIDTH;
    }

    this.sizeHeight = function() {
        return this.director.height - this.relativeY - 100;
    }

    /**
     * Create the game box.
     */
    this.gameBox = new CAAT.Foundation.ActorContainer()
                                    .setSize(this.sizeWidth(), this.sizeHeight())
                                    .setFillStyle('rgba(0, 113, 187, 0.2)')
                                    .setLocation(relativeX, relativeY);
	this.gameBox.cacheAsBitmap();
	

    this.columnList = [];
    /**
     * Create each column and set their color.
     */
    for (var i = 0; i < current_length; ++i) {
        var column = new CAAT.ShapeActor().setSize(this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.boardColorInfo.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setLocation(this.boxOption.BORDER_WIDTH + i * (this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT);
	    column.cacheAsBitmap();
        this.gameBox.addChild(column);
        this.columnList.push(column);
    }
	
    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    this.message = new Message(director, current_length, my_message, this.gameBox, boxOption);
    this.message.createMessage();

    /**
     * Create my key object.
     * This object inserts all necessary columns to gameBox.
     */
    this.crypt_key = new Key(key_info, current_length, this.message, this.gameBox, director, boxOption);
    this.crypt_key.createKey();
    this.message.redraw();
    this.crypt_key.firstDraw();
    this.resizeTimer = null;


    var object = this;

    this.leftName = new CAAT.Foundation.Actor().
                        setBackgroundImage(director.getImage('left-board'));

    this.centerName = new CAAT.Foundation.ActorContainer().
                            setSize(175, director.getImage('center-board').height).
                            setBackgroundImage(director.getImage('center-board'), false);

    this.centerName.paint = function(director) {
        var ctx = director.ctx;
        var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    this.nameText = new CAAT.Foundation.Actor().
                            setSize(175, director.getImage('center-board').height).
                            setLocation(0, 0);


    this.nameText.paint = function(director) {

        var ctx = director.ctx;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00FF9D';

        ctx.font = '700 22px Quantico';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(object.player ? currentGame.username : currentGame.ianame, this.width / 2, this.height / 2 + 7);
    }

    this.centerName.addChild(this.nameText);
    this.nameText.cacheAsBitmap();

    this.rightName = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('right-board'));

    this.boxOption.scene.addChild(this.leftName);
    this.boxOption.scene.addChild(this.centerName);
    this.boxOption.scene.addChild(this.rightName);


    this.redrawName = function(info /* = false */) {
        if (this.player === true) {
            this.leftName.setLocation(this.gameBox.x - 12, this.gameBox.y - this.director.getImage('left-board').height - 10);
            this.centerName.setLocation(this.leftName.x + this.leftName.width, this.leftName.y);
            this.rightName.setLocation(this.centerName.x + this.centerName.width, this.centerName.y);
            info ? info.redraw() : null;
        } else {
            this.rightName.setLocation(this.gameBox.x + this.gameBox.width - this.director.getImage('right-board').width + 12, this.gameBox.y - this.director.getImage('left-board').height - 10);
            this.centerName.setLocation(this.rightName.x - 175, this.rightName.y);
            this.leftName.setLocation(this.centerName.x - this.director.getImage('left-board').width, this.centerName.y);
        }
    }

    this.resize = function(scene, info /* = false */) {
        this.gameBox.setSize(this.sizeWidth(), this.sizeHeight())
                    .setLocation(this.relativeX, this.relativeY);

        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].setSize(this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                              .setLocation(this.boxOption.BORDER_WIDTH + i * (this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT)
	                          .cacheAsBitmap();
        }
	    
	    this.gameBox.stopCacheAsBitmap();
	    this.gameBox.cacheAsBitmap();

        if (scene.isPaused() === false && this.crypt_key.keyInMove === true) {
            this.crypt_key.resize();
        }

        this.message.redraw(true);

        this.crypt_key.resizeRedraw();

        for (var i = 0; i < this.message.columnList.length; ++i) {
            if (this.message.columnList[i].blockToDestroy !== null) {
                this.message.columnList[i].blockToDestroy.redraw();
            }
        }

        this.tryToResize = true;
        if (this.tryToResize === true && scene.isPaused()) {

            if (this.message.redraw(true) === true) {
                this.redrawName(info);
            }
        }

        this.resizeTimer = scene.createTimer(0, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (object.tryToResize === true) {

                    if (object.message.redraw(true) === true) {
                        object.redrawName(info);
                        object.tryToResize = false;
                    }
                }
            }
        );
    }

    return this;
}
