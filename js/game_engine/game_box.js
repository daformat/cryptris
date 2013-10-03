function GameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player, isActive) {
    this.director = director;
    this.boxOption = boxOption;
    this.relativeX = relativeX;
    this.relativeY = relativeY;
    this.current_length = current_length;
    this.key_info = key_info;
    this.my_message = my_message; // The list number of message.
    this.player = player;
    this.tryToResize = false;
    this.winScreen = null;
    this.isActive = isActive;

    /*
     * This function returns the computed width size of the gameBox
     * according the objects it contains.
     */
    this.sizeWidth = function() {
        return this.current_length * (this.boxOption.SPACE_WIDTH + this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH) - this.boxOption.SPACE_WIDTH + 2 * this.boxOption.BORDER_WIDTH;
    }

    /*
     * This function returns the computed height size of the gameBox
     * according the objects it contains.
     */
    this.sizeHeight = function() {
        return this.director.height - this.relativeY - this.boxOption.resizeOption.DEFAULT_BOTTOM_MARGIN;
    }


    var object = this;
    this.create = function() {

        /**
         * Create the game box.
         */
        this.gameBox = new CAAT.Foundation.ActorContainer()
                                        .setSize(this.sizeWidth(), this.sizeHeight())
                                        .setFillStyle('rgba(0, 113, 187, 0.2)');
        this.gameBox.cacheAsBitmap();



        /**
         * Create each column and set their color.
         */
        this.columnList = [];
        for (var i = 0; i < current_length; ++i) {
            var column = new CAAT.ShapeActor().setSize(this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.boardColorInfo.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .cacheAsBitmap();

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

        /**
         * We draw each column for key and message. (Always call the drawing method of message first : its calcultes the good height of each block).
         */
        this.message.redraw();
        this.crypt_key.firstDraw();

        /**
         * Set our resizeTimer at null.
         */
        this.resizeTimer = null;

        /**
         * Create the left part of the name box.
         */
        this.leftName = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('left-board'));

        /**
         * Create the center part of the name box.
         */
        this.centerName = new CAAT.Foundation.ActorContainer().
                                setSize(175, director.getImage('center-board').height).
                                setBackgroundImage(director.getImage('center-board'), false);

        this.centerName.paint = function(director) {
            var ctx = director.ctx;
            var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        /**
         * Create the text of the name box.
         */
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

        /**
         * Create the right part of the name box.
         */
        this.rightName = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('right-board'));

        /**
         * Add all the name box to the scene.
         */
        this.boxOption.scene.addChild(this.leftName);
        this.boxOption.scene.addChild(this.centerName);
        this.boxOption.scene.addChild(this.rightName);


        /**
         * Display all icons if this gameBox is active (to be active means we want to display the icons).
         */
        this.key_symbol_img = director.getImage(this.boxOption.boardColorInfo['key-symbol']);
        this.enveloppe_img = director.getImage(this.boxOption.boardColorInfo['enveloppe']);
        this.padlock_closed_img = director.getImage(this.boxOption.boardColorInfo['padlock-closed']);
        this.padlock_open_img = director.getImage(object.boxOption.boardColorInfo['padlock-open']);

        if (this.isActive === true) {
            this.keySymbol = new CAAT.Foundation.ActorContainer().
                                    setSize(this.key_symbol_img.width, this.key_symbol_img.height).
                                    setBackgroundImage(this.key_symbol_img, false);
            this.gameBox.addChild(this.keySymbol);

            this.enveloppe = new CAAT.Foundation.ActorContainer().
                                    setSize(this.enveloppe_img.width, this.enveloppe_img.height).
                                    setBackgroundImage(this.enveloppe_img, false);
            this.gameBox.addChild(this.enveloppe);


            this.padlock = new CAAT.Foundation.ActorContainer().
                                    setSize(this.padlock_closed_img.width, this.padlock_closed_img.height).
                                    setBackgroundImage(this.padlock_closed_img, false);
            this.gameBox.addChild(this.padlock);
        }
    }
    this.create();

    
    /**
     * Add a win Screen (black splash screen and message) to this gameBox.
     */
    this.addWinScreen = function(message, width, height) {
        if (this.winScreen === null) {

            this.winScreen = new CAAT.Actor().
                        setSize(this.gameBox.width, this.gameBox.height).
                        setLocation(0, 0);

            var winScreenWidth = width;
            var winScreenHeight = height;
            var winScreenMessage = message;
            this.winScreen.paint = function(director) {

                var ctx = director.ctx;

                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect((this.width - winScreenWidth) / 2, (this.height - winScreenHeight) / 2 - 5, winScreenWidth, winScreenHeight);

                ctx.strokeStyle = 'rgb(0, 0, 0)';
                ctx.strokeRect(0, 0, this.width, this.height);
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00FF9D';

                ctx.font = '14pt Inconsolata';
                ctx.fillStyle = '#00e770';
                ctx.textAlign = 'center';
                ctx.fillText(winScreenMessage, this.width / 2, this.height / 2);
            }
            this.gameBox.addChild(this.winScreen);
        }
    }

    // Create the time to animate the message and padlock when the gameBox is active.

    if (this.isActive === true) {
        var object = this;
        var animEnveloppeAndPadlockTimer = this.director.createTimer(0, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                /**
                 * Check if padlock needs some animation.
                 */
                if (object.message.padlock_need_anim === true) {
                    object.message.padlock_need_anim = false;

                    /**
                     * In any case we set a 'elastic ping pong' animation to simulate a vibration.
                     */
                    var path =  new CAAT.LinearPath().
                                    setInitialPosition(object.padlock.x, object.padlock.y).
                                    setFinalPosition(object.padlock.x + 3, object.padlock.y);
                    var pb = new CAAT.PathBehavior().
                                    setPath(path).
                                    setFrameTime(object.gameBox.time, 250).
                                    setCycle(false);

                    pb.setInterpolator(new CAAT.Behavior.Interpolator().createElasticInOutInterpolator(1.0, 0.2, true));
                    object.padlock.addBehavior(pb);

                    /**
                     * If message is resolved, we open the padlock and make it to fall.
                     */
                    if (object.message.resolved === true) {
                        /**
                         * We don't need this timer anymore.
                         */
                        animEnveloppeAndPadlockTimer.cancel();

                        /**
                         * We open the padlock by changing the background img.
                         */
                        object.padlock.setBackgroundImage(object.padlock_open_img, false);

                        /**
                         * Path to move down the padlock.
                         */
                        var path =  new CAAT.LinearPath().
                                        setInitialPosition(object.padlock.x, object.padlock.y).
                                        setFinalPosition(object.padlock.x, object.padlock.y + 20);
                        var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(object.gameBox.time + 200, 1000).setCycle(false);
                        pb.setInterpolator(new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(2, false));
                        object.padlock.addBehavior(pb);

                        /**
                         * Rotation for the padlock.
                         */
                        var rb = new CAAT.RotateBehavior().setAngles(0, Math.PI / 2).setFrameTime(object.gameBox.time + 250, 900).setCycle(false);
                        rb.setInterpolator(new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(2, false));
                        object.padlock.addBehavior(rb);

                        /**
                         * Set the fade on the padlock.
                         */
                        var fade = new CAAT.AlphaBehavior().setValues(1, 0.6).setFrameTime(object.gameBox.time + 200, 1000).setCycle(false);
                        object.padlock.addBehavior(fade);
                    }
                }
            }
        );
    }

    /**
     * Redraw the name box. If the box is a player box, the name is put at the left, else at the right.
     */
    this.redrawSurround = function() {

        /**
         * If this.player === true, we set the location for "name", "key symbol" and "message + caplock" at the left (player board).
         * Else at the right (IA board).
         */
        if (this.player === true) {
            this.leftName.setLocation(this.gameBox.x - 12, this.gameBox.y - this.director.getImage('left-board').height - 10);
            this.centerName.setLocation(this.leftName.x + this.leftName.width, this.leftName.y);
            this.rightName.setLocation(this.centerName.x + this.centerName.width, this.centerName.y);

            if (this.isActive === true) {
                this.keySymbol.setLocation(this.gameBox.width - 13, -25 + this.boxOption.BORDER_HEIGHT);
                this.enveloppe.setLocation(this.gameBox.width + 15, this.gameBox.height - this.enveloppe.height - this.boxOption.BORDER_HEIGHT + 3);
                this.padlock.setLocation(this.enveloppe.x + this.enveloppe.width - this.padlock.width / 2 - 2, this.enveloppe.y + this.enveloppe.height / 2 - 6);
            }

        } else {

            if (this.isActive === true) {
                this.keySymbol.setLocation(-1 * this.key_symbol_img.width + 13, -25 + this.boxOption.BORDER_HEIGHT);
                this.enveloppe.setLocation(-1 * this.enveloppe.height - 27, this.gameBox.height - this.enveloppe.height - this.boxOption.BORDER_HEIGHT + 3);
                this.padlock.setLocation(this.enveloppe.x + this.enveloppe.width - this.padlock.width / 2 - 2, this.enveloppe.y + this.enveloppe.height / 2 - 6);
            }

            this.rightName.setLocation(this.gameBox.x + this.gameBox.width - this.director.getImage('right-board').width + 12, this.gameBox.y - this.director.getImage('left-board').height - 10);
            this.centerName.setLocation(this.rightName.x - 175, this.rightName.y);
            this.leftName.setLocation(this.centerName.x - this.director.getImage('left-board').width, this.centerName.y);
        }


    }

    this.resize = function(scene) {
        /**
         * Resize the game box.
         */
        this.gameBox.setSize(this.sizeWidth(), this.sizeHeight())
                    .setLocation(this.relativeX, this.relativeY);

        /**
         * Resize the winScreen (if it exists)
         */
        if (this.winScreen !== null) {
            this.winScreen.setSize(this.gameBox.width, this.gameBox.height).
                           setLocation(0, 0);
        }

        /**
         * Resize each column of the game box.
         */
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].setSize(this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                              .setLocation(this.boxOption.BORDER_WIDTH + i * (this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT)
	                          .cacheAsBitmap();
        }
	    
        /**
         * Refresh the draw.
         */
	    this.gameBox.stopCacheAsBitmap();
	    this.gameBox.cacheAsBitmap();

        /**
         * If some moving key columns leaves the screen during the resize, the game will be stopped.
         * To avoid this, if we have some moving key columns (scene is not paused and key is in move)
         * we call a specific resize key function : it will be stopped all move and replace each key column at its correct place.
         */
        if (scene.isPaused() === false && this.crypt_key.keyInMove === true) {
            this.crypt_key.resize();
        }

        /**
         * Redraw the message (with the 'true' argument to invalidate the draw and refresh the cache.)
         */
        this.message.redraw(true);

        /**
         * Call this key redraw after the message redraw (the message redraw compute the good size of each block).
         */
        this.crypt_key.resizeRedraw();

        /**
         * Redraw each 'blockToDestroy'.
         */
        for (var i = 0; i < this.message.columnList.length; ++i) {
            if (this.message.columnList[i].blockToDestroy !== null) {
                this.message.columnList[i].blockToDestroy.redraw();
            }
        }

        /**
         * Redraw the name box.
         */
        this.redrawSurround();

        /**
         * If some elements are moving during their resize, this timer
         * replace them correctly.
         */
        if (scene.isPaused()) {
            this.message.redraw(true);
        } else {
            this.tryToResize = true;
            this.resizeTimer = scene.createTimer(0, Number.MAX_VALUE, null,
                function(time, ttime, timerTask) {
                    if (object.tryToResize === true) {

                        if (object.message.redraw(true) === true) {
                            object.crypt_key.resizeRedraw();
                            object.tryToResize = false;
                            object.resizeTimer.cancel();
                        }
                    }
                }
            );
        }
    }
}
