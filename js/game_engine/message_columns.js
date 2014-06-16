
/**
 *  a levelMessage is the animated value of the current operation that we draw
 *  ontop of the column that got hit. This value slowly moves up and fades out
 *  
 */

function levelMessage(director, x, y, number, container, boxOption, column) {
    //console.log(arguments);

    this.isVisible = true;
    this.container = container;
    this.msg = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.msg);
    this.number = number;
    var number = this.number;
    this.x = x;
    this.y = y > 0 ? y : 0;
    this.boxOption = boxOption;
    this.clearTime = this.boxOption.timeInfo.levelUpNumberTime;
    this.delta = this.clearTime;

    var object = this;
    this.beginTime = this.msg.parent.time;
    var beginTime = this.beginTime;

    this.msg.setLocation(this.x, this.y);
    this.msg.setSize(this.boxOption.SQUARE_WIDTH, 20);

    this.finalDestination = this.y - 20;
    this.pb = null;

    this.startAnimation = function() {
        var path =  new CAAT.LinearPath().setInitialPosition(this.msg.x, this.msg.y).setFinalPosition(this.msg.x, this.finalDestination);
        this.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(this.container.time, this.delta).setCycle(false);

        var object = this;
        var behaviorListener = {'behaviorExpired' : function(behavior, time, actor) { }, 'behaviorApplied' : null};

        this.pb.addListener(behaviorListener);
        this.msg.addBehavior(this.pb);
    }
    this.startAnimation();

    this.stopAnimation = function() {
        if (this.pb !== null) {
            this.pb.setOutOfFrameTime();
            this.pb = null;
        }
    }


    this.msg.paint = function(director, time) {

        var clearTime = object.clearTime;
        object.delta = time - beginTime;
        object.msg.setSize(object.boxOption.SQUARE_WIDTH, 20);

        if(this.isCached()) {
            CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
            return;
        }
        var signe = "";

        if (column.type === COLUMN_TYPE_1) {
            signe = "+";
        } else if (column.type === COLUMN_TYPE_2) {
            signe = "-";
        }
        var ctx = director.ctx;

        if (object.delta <= clearTime) {

            // draw the animated current operation value

            ctx.globalAlpha = 1 - object.delta / clearTime;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 5;
            ctx.shadowColor = object.boxOption.boardColorInfo.numberGrow;

            ctx.font = '15px Inconsolata';
            ctx.fillStyle = object.boxOption.boardColorInfo.numberColor;
            ctx.textAlign = 'center';
            ctx.fillText(signe + number, this.width / 2, 0);
        } else {
            object.stopAnimation();
            object.msg.paint = function(director, time) {};
            ctx.globalAlpha = 0;
            object.isVisible = false;
        }
    }
}



/********/


function blockToDestroy(director, msgType, keyType, x, y, squareNumber, keyNumber, msgNumber, container, boxOption) {
    this.director = director;
    this.x = x;
    this.y = y;
    this.squareNumber = squareNumber;
    this.keyNumber = keyNumber;
    this.msgNumber = msgNumber;
    this.container = container;
    this.boxOption = boxOption;
    this.column = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.column);
    this.isMsgContaminated = false;

    this.msgType = msgType;
    this.keyType = keyType;
    this.blurGradient = null;
    this.keyBlurGradient = null;
    this.isVisible = true;
    this.isBottom = false;

    if (this.container.height - this.boxOption.resizeOption.DEFAULT_BORDER_HEIGHT === y) {
        this.isBottom = true;
    }

    this.computeBlurGradient = function() {
        if (this.msgType != COLUMN_TYPE_3) {
            this.blurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.blurGradient.addColorStop(0, this.boxOption.boardColorInfo.blurColorLeft[this.msgType]);
            this.blurGradient.addColorStop(1, this.boxOption.boardColorInfo.blurColorRight[this.msgType]);
        } else {
            this.blurGradient = null;
        }
    }

    this.computeKeyBlurGradient = function() {
        if (this.keyType != COLUMN_TYPE_3) {
            this.keyBlurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.keyBlurGradient.addColorStop(0, this.boxOption.boardColorInfo.blurColorLeft[this.keyType]);
            this.keyBlurGradient.addColorStop(1, this.boxOption.boardColorInfo.blurColorRight[this.keyType]);
        } else {
            this.keyBlurGradient = null;
        }
    }

    this.beginTime = this.column.parent.time;

    this.redraw = function() {

	    var height = (this.keyNumber + this.msgNumber) * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) + 1; 
        var columnY = this.y - height;

        this.column.setSize(this.boxOption.COLUMN_WIDTH, height);

        if (columnY > this.boxOption.BORDER_HEIGHT) {
            this.column.setLocation(this.x, columnY);
        } else {
            this.column.setLocation(this.x, this.boxOption.BORDER_HEIGHT);
        }
        this.computeBlurGradient();
        this.computeKeyBlurGradient();

        var object = this;
        var beginTime = this.beginTime;
	    
        this.column.paint = function(director, time) {

            var clearTime = object.boxOption.timeInfo.blockDestroyedTime;
	        var delta = time - beginTime;
            if (delta <= 2 * clearTime) {

                var relativeY = object.squareNumber > 0 ? 0 : 1;
                var j = 1;

                var ctx = director.ctx;
                var x = 1.5;

                ctx.lineWidth = 1;
                ctx.globalAlpha = 1 - delta / (clearTime * 2);
	            
	            // -- Disappearing key and message blocks
	            // Set drawing styles before the loop                                                                               
	            ctx.strokeStyle = object.boxOption.boardColorInfo.blurStrokeColor[object.keyType];
	            ctx.fillStyle = object.keyBlurGradient;
	            
                for (j = 1; j <= object.msgNumber + object.keyNumber; ++j) {
                    var y = object.column.height + 0.5 - relativeY - j * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                    if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
                        break;
                    }

                    ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);                    
                    ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
                } 
	            
                if (delta <= clearTime) {
                    ctx.globalAlpha = 1 - delta / clearTime;
	                ctx.strokeStyle = object.boxOption.boardColorInfo.blurStrokeColor[object.msgType];
	                ctx.fillStyle = object.blurGradient;

                    for (j = 1; j <= object.msgNumber; ++j) {
                        var y = object.column.height + 0.5 - relativeY - j * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                        if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
                            break;
                        }
                                                
                        ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);                        
                        ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
                    }
                }
            } else {
                object.isVisible = false;
            }
        }
    }
}

function MessageColumn(director, type, initialNumber, container, boxOption) {
    this.type = type;
    this.director = director;
    this.boxOption = boxOption;
    this.squareNumber = initialNumber;
    this.container = container;
    this.blurSquareNumber = 0;
    this.lastType = type;

    this.column = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.column);

    this.displayValue = new CAAT.Foundation.Actor();
    this.container.addChild(this.displayValue);

    this.gradient = null;
    this.blurGradient = null;

    this.keyType = COLUMN_TYPE_3;
    this.keyBlurGradient = null;
    this.keySquareNumber = 0;
    this.blockToDestroy = null;
    this.levelMsg = null;

    this.computeGradient = function() {
        if (this.type != COLUMN_TYPE_3) {
            this.gradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, this.boxOption.boardColorInfo.colorLeft[this.type]);
            this.gradient.addColorStop(1, this.boxOption.boardColorInfo.colorRight[this.type]);
        } else {
            this.gradient = null;
        }
    }



	var object = this;

    this.displayValue.paint = function(director, time) {
        if (this.isCached()) {
            CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
            return;
        }

        var signe = "";
        if (object.type === COLUMN_TYPE_2) {
            signe = "-";
        }

        var ctx = director.ctx;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;
        ctx.shadowColor = object.boxOption.boardColorInfo.numberGrow;

        if (object.boxOption.SQUARE_WIDTH <= 20) {
            ctx.font = '11px Inconsolata';
        } else if (object.boxOption.SQUARE_WIDTH > 20 && object.boxOption.SQUARE_WIDTH <= 30) {
            ctx.font = '13px Inconsolata';
        } if (object.boxOption.SQUARE_WIDTH > 30) {
            ctx.font = '15px Inconsolata';
        }

        ctx.fillStyle = object.boxOption.boardColorInfo.numberColor;
        ctx.textAlign = 'center';

        ctx.fillText(signe + object.squareNumber, this.width / 2, 15);
    }
    this.displayValue.setSize(this.boxOption.SQUARE_WIDTH, 30);
    this.displayValue.cacheAsBitmap();

	this.column.paint = function(director, time) {
		if (this.isCached()) {
			CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
			return;
		}

		// Custom paint method.
		var ctx = director.ctx;
		var x = 1.5;
		ctx.lineWidth = 1;

		ctx.strokeStyle = object.boxOption.boardColorInfo.strokeColor[object.type];
		ctx.fillStyle = object.gradient;

		for (var i = 0; i < object.squareNumber; ++i) {
			var y = object.column.height - object.boxOption.SQUARE_HEIGHT - i * (boxOption.SQUARE_HEIGHT + boxOption.SPACE_HEIGHT) - 0.5;

			if (y < 0) {
				break;
			}

			ctx.fillRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);
			ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);			
		}
		
		object.boxOption.setDefaultColor();
	}
	
    this.redraw = function(x, invalidate /* = false */) {
	    // Don't invalidate drawing by default
	    if(invalidate === null) {
		    invalidate = false;
	    }
	    
        /**
         * Set message display.
         */
	    this.displayValue.setLocation(x, this.container.height + 10).setSize(this.boxOption.SQUARE_WIDTH, 30);
        this.displayValue.stopCacheAsBitmap();

	    this.columnSize = this.boxOption.SQUARE_HEIGHT * this.squareNumber + (this.squareNumber - 1) * this.boxOption.SPACE_HEIGHT + 1;

        if (this.columnSize <= object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
            object.boxOption.setDefaultColor();
        } else {
            object.boxOption.setFullColor();
        }

	    if (this.type === COLUMN_TYPE_3) {
		    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.boxOption.SPACE_HEIGHT);
		    this.column.setLocation(x, this.container.height - this.boxOption.BORDER_HEIGHT);
	    } else {
		    if (this.columnSize <= this.container.height - 2 * this.boxOption.BORDER_HEIGHT) {
			    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.columnSize);
			    this.column.setLocation(x, this.container.height - this.boxOption.BORDER_HEIGHT - this.columnSize);
		    } else {
			    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.container.height - 2 * this.boxOption.BORDER_HEIGHT);
			    this.column.setLocation(x, this.boxOption.BORDER_HEIGHT);
		    }
	    }
        
        this.computeGradient();
        if (this.blockToDestroy !== null) {
            if (this.blockToDestroy.isBottom === false) {
                this.blockToDestroy.column.setLocation(this.column.x, this.column.y - this.blockToDestroy.column.height);
            } else {
                this.blockToDestroy.column.setLocation(this.column.x, this.container.height - this.boxOption.resizeOption.DEFAULT_BORDER_HEIGHT - this.blockToDestroy.column.height);
            }
        }
	    
        if (this.blurSquareNumber > 0 || this.keySquareNumber > 0) {
	        this.column.stopCacheAsBitmap();
            this.blockToDestroy = new blockToDestroy(this.director, this.lastType, this.keyType, this.column.x, this.column.y, this.squareNumber, this.keySquareNumber, this.blurSquareNumber, this.container, this.boxOption);
            this.blockToDestroy.redraw();

            this.blurSquareNumber = 0;
            this.keySquareNumber = 0;
        } else if (!this.column.isCached() || invalidate) {
	        if(invalidate) {
		        this.column.stopCacheAsBitmap();
	        }
        }
        
        if (this.levelMsg !== null) {
            this.levelMsg.msg.setLocation(this.column.x, this.levelMsg.msg.y);
        }
        this.column.cacheAsBitmap();

        // TOFIX : Actually this line is commented to avoid number disparition during resize.
        //this.displayValue.cacheAsBitmap();
    }

    this.changeType = function(newType) {
        if (this.type === COLUMN_TYPE_3) {
            if (newType === COLUMN_TYPE_1) {
                this.lastType = COLUMN_TYPE_2;
            } else {
                this.lastType = COLUMN_TYPE_1;
            }
        } else {
            this.lastType = this.type;
        }
	    
    	this.type = newType;
	    this.column.stopCacheAsBitmap();
	    
        this.redraw(this.column.x);
    }

    this.mergeColumns = function(column) {
        if (column.squareNumber > 0) {
            if (this.type === COLUMN_TYPE_3 || this.type === column.type) {
                this.addSquares(column);
            } else if (this.type !== column.type) {
                this.subSquares(column);
            }
        }
	    
        this.redraw(this.column.x, true);
    }

    this.addSquares = function(column) {
        //console.log('\nAdding squares...\n--------------------');
        if (column.squareNumber > 0) {
            var y = 0;
            if (this.type === COLUMN_TYPE_3) {
                this.changeType(column.type);
                this.squareNumber = column.squareNumber;
                y = column.column.y;
            } else {
                this.squareNumber += column.squareNumber;
	            this.redraw(this.column.x, true);
                y = this.column.y;
            }
	        
            if (this.levelMsg === null) {
                //console.log('message column:', this, '\n\nKey column:', column, '\n');
                this.levelMsg = new levelMessage(this.director, this.column.x, y - this.boxOption.SPACE_HEIGHT, column.squareNumber, this.container, this.boxOption, column);
            }

            this.blurSquareNumber = 0;
        }
    }

    this.subSquares = function(keyColumn) {
        //console.log('\nSubstracting squares...\n--------------------');
        newSquareNumber = this.squareNumber - keyColumn.squareNumber;
        var number = keyColumn.squareNumber;

        if (newSquareNumber < 0) {
            this.keySquareNumber = this.squareNumber;
            this.keyType = keyColumn.type;
            keyColumn.pathContinue = true;
            keyColumn.squareNumber = newSquareNumber * (-1);
            keyColumn.redraw(keyColumn.column.x, keyColumn.column.y);
            this.blurSquareNumber = this.squareNumber;
            this.squareNumber = 0;
            this.changeType(COLUMN_TYPE_3);
        } else if (newSquareNumber === 0) {
            this.changeType(COLUMN_TYPE_3);
            this.squareNumber = 0;
            this.blurSquareNumber = keyColumn.squareNumber;
            this.keySquareNumber = keyColumn.squareNumber;
            this.keyType = keyColumn.type;
        } else {
            this.keySquareNumber = keyColumn.squareNumber;
            this.keyType = keyColumn.type;
            this.squareNumber = newSquareNumber;
            this.blurSquareNumber = keyColumn.squareNumber;
        }
	   
        if (this.levelMsg === null) {
            //console.log('message column:', this, '\n\nKey column:', keyColumn, '\n');
            this.levelMsg = new levelMessage(this.director, this.column.x, keyColumn.column.y - this.boxOption.SPACE_HEIGHT, number, this.container, this.boxOption, keyColumn);
        }
    }

    this.signedNumber = function() {
        if (this.type === COLUMN_TYPE_1 || this.type === COLUMN_TYPE_3) {
            return this.squareNumber;
        } else {
            return -1 * this.squareNumber;
        }
    }
}

function Message(director, messageLength, message, container, boxOption, isActive) {
    this.length = messageLength;
    this.boxOption = boxOption;
    this.message = message;
    this.columnList = [];
    this.container = container;
    this.resolved = false;
    this.base_line_position = 0;
    this.message.anim_not_decrypted === false;
    this.isActive = isActive // A message is active when it appears in a decrypted process. By example : a create_key message is not active.

    this.triangle_left = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('triangle-left')).
                            setSize(8, 9).
                            setAlpha(0.9);
    this.container.addChild(this.triangle_left);

    this.triangle_right = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('triangle-right')).
                            setSize(8, 9).
                            setAlpha(0.9);
    this.container.addChild(this.triangle_right);

    this.base_line = new CAAT.Foundation.Actor().
                        setSize(1, this.container.height);
    this.container.addChild(this.base_line);

    this.symbols = [];

    var columnList = this.columnList;
    this.createADisplaySymbol = function(indexBegin) {
            var symbol = new CAAT.Foundation.Actor();

            symbol.paint = function(director, time) {
                if (this.isCached()) {
                    CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
                    return;
                }

                var ctx = director.ctx;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.shadowColor = object.boxOption.boardColorInfo.letterColorGrow;
                ctx.font = '15px Inconsolata';

                ctx.strokeStyle = object.boxOption.boardColorInfo.letterBoxColor;
                ctx.strokeRect(0.5, 0.5, this.width, this.height);
                ctx.fillStyle = object.boxOption.boardColorInfo.letterColor;
                ctx.textAlign = 'center';

                var ternaries = [];
                for (var j = 0; j < 4; ++j) {
                    ternaries.push(columnList[indexBegin + j].signedNumber());
                }

                ctx.fillText(ternary_to_symbol(ternaries[0], ternaries[1], ternaries[2], ternaries[3]), this.width / 2, this.height - 5);
            }
            this.container.addChild(symbol);
            return symbol;
    }

    this.createADisableDisplaySymbol = function(indexBegin) {
            var symbol = new CAAT.Foundation.Actor();

            symbol.paint = function(director, time) {
                if (this.isCached()) {
                    CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
                    return;
                }

                var ctx = director.ctx;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#AAAAAA';
                ctx.font = '15px Inconsolata';

                ctx.strokeStyle = '#AAAAAA';
                ctx.strokeRect(0.5, 0.5, this.width / 2, this.height);
                ctx.fillStyle = '#AAAAAA';
                ctx.textAlign = 'center';

                var ternaries = [];

                ctx.fillText('...', this.width / 4, this.height - 5);
            }
            this.container.addChild(symbol);
            return symbol;
    }

    this.createMessage = function() {
        for (var i = 0; i < this.length; ++i) {
            this.columnList.push(new MessageColumn(director, this.message['message_type'][i], this.message['message_number'][i], container, this.boxOption));
        }
        this.redraw();


        // --- If message is active, we set the display ternary value.
        if (this.isActive === true) {
            var object = this;
            for (var i = 0; i < this.length && i + 3 < this.length; i = i + 4) {
                this.symbols.push(this.createADisplaySymbol(i));
            }
            if (this.length % 4 !== 0) {
                this.symbols.push(this.createADisableDisplaySymbol(this.length - 2));
            }
        }

        return this;
    }

    this.getNumbers = function() {
        var numbers = [];

        for (var i = 0; i < this.columnList.length; ++i) {
            var signe = 1;
            if (this.columnList[i].type === COLUMN_TYPE_2) {
                signe = -1;
            }
            numbers.push(signe * this.columnList[i].squareNumber);
        }

        return numbers;
    }

    var object = this;
    this.base_line.paint = function(director, time) {
        if (this.isCached()) {
            CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
            return;
        }

        // Custom paint method.
        var ctx = director.ctx;

        ctx.strokeStyle = '#00bbb2';
        var width = 9;
        for (var j = object.base_line_position; j < object.container.width; j = j + 2 * width) {
            ctx.strokeRect(j, -0.5, width, 0);
        }
    }

    this.stopAnimation = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            if (this.columnList[i].levelMsg !== null) {
                this.columnList[i].levelMsg.stopAnimation();
            }
        }
    }

    this.startAnimation = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            if (this.columnList[i].levelMsg !== null) {
                this.columnList[i].levelMsg.startAnimation();
            }
        }
    }

    this.upMessage = function() {
        var msgOnMove = 0;
        for (var i = 0; i < this.columnList.length; ++i) {
            ++msgOnMove;
            var msgColumn = this.columnList[i];

            var path =  new CAAT.LinearPath().setInitialPosition(msgColumn.column.x, msgColumn.column.y).setFinalPosition(msgColumn.column.x, this.boxOption.BORDER_HEIGHT);
            var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(msgColumn.column.time, this.boxOption.timeInfo.messageUpTime).setCycle(false);
                pb.setInterpolator(CAAT.Behavior.Interpolator.enumerateInterpolators()[16]);

            var behaviorListener = {'behaviorExpired' : function(behavior, time, actor) { --msgOnMove; }, 'behaviorApplied' : null};
            pb.addListener(behaviorListener);

            msgColumn.column.addBehavior(pb);
        }

        var waitToContinue = director.createTimer(director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (msgOnMove === 0) {
                    waitToContinue.cancel();
                    currentGame.displayKey = true;
                }
            }
        );
    }

    this.resetMessage = function(key) {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.createMessage();
        key.reAssignColumns();
    }

    this.redraw = function(isInvalidate /* = false */) {
        // -- Do not invalidate by default.
        if (isInvalidate === null) {
            isInvalidate = false;
        }
        if (this.boxOption.objectsInMove.length === 0 || isInvalidate) {

	        var oldSquareHeight = this.boxOption.SQUARE_HEIGHT;
            var oldSpaceHeight = this.boxOption.SPACE_HEIGHT;
	        
            this.boxOption.SQUARE_WIDTH = this.boxOption.resizeOption.DEFAULT_SQUARE_WIDTH;
            this.boxOption.COLUMN_WIDTH = this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH;

            var max_column = this.columnList[0].squareNumber;
            for (var i = 1; i < this.columnList.length; ++i) {
                if (this.columnList[i].squareNumber > max_column) {
                    max_column = this.columnList[i].squareNumber;
                }
            }

            if (director.currentScene.isPaused() === false) {
                var newHeight = 0;
                var totalSquares = this.boxOption.maxKeyNumber + max_column;
                var totalHeight = this.container.height - 2 * this.boxOption.BORDER_HEIGHT;
 
                if (this.boxOption.SQUARE_HEIGHT > 1) {
                    newHeight = parseInt(totalHeight / totalSquares) - this.boxOption.SPACE_HEIGHT;
                    if (newHeight > 20) {
                        this.boxOption.SQUARE_HEIGHT = this.boxOption.resizeOption.DEFAULT_SQUARE_HEIGHT;
                    } else if (newHeight <= 1) {
                        this.boxOption.SQUARE_HEIGHT = 1;
                    } else {
                        this.boxOption.SQUARE_HEIGHT = newHeight;
                    }
                } else {
                    newHeight = parseInt(totalHeight / totalSquares) - this.boxOption.SPACE_HEIGHT;
                    if (newHeight < 1) {
                        if (this.boxOption.SPACE_HEIGHT > 2) {
                            this.boxOption.SPACE_HEIGHT = this.boxOption.SPACE_HEIGHT - 1;
                        }
                    } else {
                        if (this.boxOption.SPACE_HEIGHT < this.boxOption.resizeOption.DEFAULT_SPACE_HEIGHT) {
                            this.boxOption.SPACE_HEIGHT = this.boxOption.SPACE_HEIGHT + 1;
                            newHeight = parseInt(totalHeight / totalSquares) - this.boxOption.SPACE_HEIGHT;

                            if (newHeight < 1) {
                                this.boxOption.SPACE_HEIGHT = this.boxOption.SPACE_HEIGHT - 1;
                            }
                        } else {
                            var columnHeight = (newHeight + this.boxOption.SPACE_HEIGHT) * totalSquares + 2 * this.boxOption.BORDER_HEIGHT;
                            if (columnHeight <= this.container.height) {
                                this.boxOption.SQUARE_HEIGHT = newHeight;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < this.symbols.length; ++i) {
                var symbolWidth = 4 * (this.boxOption.SQUARE_WIDTH + 2) + 3 * this.boxOption.SPACE_WIDTH;
                var symbolHeight = 20;

                var symbolX = this.boxOption.BORDER_WIDTH + i * (symbolWidth + this.boxOption.SPACE_WIDTH * 2);
                var symbolY = this.container.height + this.columnList[i].displayValue.height + 10;

                this.symbols[i].setSize(symbolWidth, symbolHeight).setLocation(symbolX, symbolY);
            }

            this.triangle_left.setLocation(-this.triangle_left.width, this.container.height - this.boxOption.BORDER_HEIGHT - this.boxOption.SQUARE_HEIGHT - parseInt((this.boxOption.SPACE_HEIGHT + this.triangle_left.height) / 2) - 1);
            this.triangle_right.setLocation(this.container.width, this.container.height - this.boxOption.BORDER_HEIGHT - this.boxOption.SQUARE_HEIGHT - parseInt((this.boxOption.SPACE_HEIGHT + this.triangle_right.height) / 2) - 1);
            this.base_line.setLocation(0, this.container.height - this.boxOption.BORDER_HEIGHT - this.boxOption.SQUARE_HEIGHT - parseInt((this.boxOption.SPACE_HEIGHT) / 2));
            this.base_line_position = parseInt((this.container.width % 9) / 2);

            for (var i = 0; i < this.columnList.length; ++i) {
                var invalidate = (isInvalidate || oldSquareHeight !== this.boxOption.SQUARE_HEIGHT || oldSpaceHeight !== this.boxOption.SPACE_HEIGHT);
                this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), invalidate);
            }

            return true;
        }
        return false;
    }

    this.isBlank = function() {
        var isBlank = true;

        for (var i = 0; i < this.columnList.length; ++i) {
            if (this.columnList[i].squareNumber > 0) {
                isBlank = false;
            }
        }

        return isBlank;
    }

    this.isResolved = function() {
        var tmpResolved = true;

        for (var i = 0; i < this.columnList.length; ++i) {
            if (this.columnList[i].squareNumber > 1) {
                tmpResolved = false;
            }
            // -- Test if we have too many blocks in a column.
            if (this.columnList[i].squareNumber > MAX_BLOCKS_IN_A_COLUMN) {
                $(document).trigger('tooManyBlocks', [this.boxOption]);
            }
        }

        if (this.isActive) {
            this.resolved = tmpResolved;
        }
        if (this.resolved === true && this.isActive === true) {
            $(document).trigger('msgResolved');
        }
    }
}
