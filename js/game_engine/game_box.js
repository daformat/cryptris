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
        return this.current_length * (this.boxOption.SPACE_WIDTH + DEFAULT_COLUMN_WIDTH) - this.boxOption.SPACE_WIDTH + 2 * this.boxOption.BORDER_WIDTH;
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
        var column = new CAAT.ShapeActor().setSize(DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setLocation(this.boxOption.BORDER_WIDTH + i * (DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT);
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
    this.crypt_key = new Key(key_info, current_length, this.message, this.gameBox, director, boxOption, player);
    this.crypt_key.createKey();
    this.message.redraw();
    this.crypt_key.firstDraw();
    this.resizeTimer = null;

    this.resize = function(scene, left, center, right, info /* = false */) {
        this.gameBox.setSize(this.sizeWidth(), this.sizeHeight())
                    .setLocation(this.relativeX, this.relativeY);

        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].setSize(DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                              .setLocation(this.boxOption.BORDER_WIDTH + i * (DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT)
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
        var object = this;
        if (this.tryToResize === true && scene.isPaused()) {

            if (object.message.redraw(true) === true) {
                if (object.player === true) {
                    left.setLocation(object.gameBox.x - 12, object.gameBox.y - object.director.getImage('left-board').height - 10);
                    center.setLocation(left.x + left.width, left.y);
                    right.setLocation(center.x + center.width, center.y);

                    info.redraw();
                } else {
                    right.setLocation(object.gameBox.x + object.gameBox.width - object.director.getImage('right-board').width + 12, object.gameBox.y - object.director.getImage('left-board').height - 10);
                    center.setLocation(right.x - 175, right.y);
                    left.setLocation(center.x - object.director.getImage('left-board').width, center.y);
                }
                object.tryToResize = false;
            }
        }

        this.resizeTimer = scene.createTimer(0, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (object.tryToResize === true) {

                    if (object.message.redraw(true) === true) {
                        if (object.player === true) {
                            left.setLocation(object.gameBox.x - 12, object.gameBox.y - object.director.getImage('left-board').height - 10);
                            center.setLocation(left.x + left.width, left.y);
                            right.setLocation(center.x + center.width, center.y);

                            info.redraw();
                        } else {
                            right.setLocation(object.gameBox.x + object.gameBox.width - object.director.getImage('right-board').width + 12, object.gameBox.y - object.director.getImage('left-board').height - 10);
                            center.setLocation(right.x - 175, right.y);
                            left.setLocation(center.x - object.director.getImage('left-board').width, center.y);
                        }
                        object.tryToResize = false;
                    }
                }
            }
        );
    }

    return this;
}
