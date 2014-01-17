function KeyColumn(director, type, squareNumber, container, boxOption, msgColumn) {

    this.type = type;
    this.boxOption = boxOption;
    this.squareNumber = squareNumber;
    this.container = container;
    this.isActive = true;
    this.pb = null;
    this.msgColumn = msgColumn;
    this.keyInMove = false;
    this.keyFirstMove = false;
    this.pathContinue = false;
    this.isResize = false;
    this.pbFirstMove = null;

    this.column = new CAAT.Foundation.Actor();
    this.container.addChild(this.column);

    if (this.squareNumber === 0) {
        this.column.setSize(this.boxOption.SQUARE_WIDTH, this.boxOption.SQUARE_HEIGHT / 2);
    }

    this.gradient = null;
    this.computeGradient = function() {
        if (this.type != COLUMN_TYPE_3) {
            this.gradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, this.boxOption.boardColorInfo.colorLeft[this.type]);
            this.gradient.addColorStop(1, this.boxOption.boardColorInfo.colorRight[this.type]);
        } else {
            this.gradient = null;
        }
    };
    this.computeGradient();

	var object = this;
	this.column.paint = function(director, time) {
		if(this.height < 0) {
			return;
		}
		
		if (this.isCached()) {
			CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
			return;
		}

		var ctx = director.ctx;
		var x = 1.5;

		// Custom paint method.
		ctx.lineWidth = 1;
		ctx.strokeStyle = object.boxOption.boardColorInfo.strokeColor[object.type];
		ctx.fillStyle = object.gradient;
		
		for (var i = 0; i < object.squareNumber; ++i) {
			var y = 0.5 + i * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT);

			if (this.y + y >= object.boxOption.BORDER_HEIGHT) {
				ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);				
				ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
			} else if (this.y + y >= object.boxOption.BORDER_HEIGHT - object.boxOption.SQUARE_HEIGHT) {
				var diffNewHeight = 0;
				while (this.y + y + diffNewHeight <= object.boxOption.BORDER_HEIGHT) {
					++diffNewHeight;
				}
				var newHeight = object.boxOption.SQUARE_HEIGHT - diffNewHeight;
				y = y + diffNewHeight;

				ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, newHeight);
				ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, newHeight - 1);
			}
		}
	}
	
    this.redraw = function(x, y) {

        y = typeof y !== 'undefined' ? y : this.boxOption.BORDER_HEIGHT;
        this.column.setLocation(x, y);

        this.column.setSize(this.boxOption.COLUMN_WIDTH, this.squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) - this.boxOption.SPACE_HEIGHT);
    };

    this.firstDraw = function(x) {
        y = -1 * this.boxOption.maxKeyNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) + (this.boxOption.BORDER_HEIGHT + this.boxOption.SPACE_HEIGHT) - 10;
        this.column.setLocation(x, y);

        this.column.setSize(this.boxOption.COLUMN_WIDTH, this.squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) - this.boxOption.SPACE_HEIGHT);
    };

    this.firstMove = function() {
        this.keyFirstMove = true;
        var path =  new CAAT.LinearPath().setInitialPosition(this.column.x, this.column.y).setFinalPosition(this.column.x, this.boxOption.BORDER_HEIGHT);
        this.pbFirstMove = new CAAT.PathBehavior().setPath(path).setFrameTime(this.container.time, this.boxOption.timeInfo.keyFirstMoveTime).setCycle(false);

        var object = this;
        var behaviorListener = {'behaviorExpired' : function(behavior, time, actor) { object.keyFirstMove = false; object.pbFirstMove = null; }, 'behaviorApplied' : null};

        this.pbFirstMove.addListener(behaviorListener);
        this.column.addBehavior(this.pbFirstMove);
    };

    this.startFirstAnimation = function() {
        this.keyFirstMove = true;
        var path =  new CAAT.LinearPath().setInitialPosition(this.column.x, this.column.y).setFinalPosition(this.column.x, this.boxOption.BORDER_HEIGHT);
        this.pbFirstMove = new CAAT.PathBehavior().setPath(path).setFrameTime(this.container.time, this.boxOption.timeInfo.keyFirstMoveTime).setCycle(false);

        var object = this;
        var behaviorListener = {'behaviorExpired' : function(behavior, time, actor) { object.keyFirstMove = false; object.pbFirstMove = null; }, 'behaviorApplied' : null};

        this.pbFirstMove.addListener(behaviorListener);
        this.column.addBehavior(this.pbFirstMove);
    }

    this.stopMove = function() {
        if (this.pb !== null) {
            this.pb.setOutOfFrameTime();
            this.pb = null;
            return true;
        }
        return false;
    };

    this.stopFirstMove = function() {
        if (this.pbFirstMove !== null) {
            this.pbFirstMove.setOutOfFrameTime();
            this.pbFirstMove = null;
            return true;
        }
        return false;
    }

    this.changeType = function() {
        if (this.type === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_2;
        } else if (this.type === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_1;
        }

        this.computeGradient();
        this.redraw();
    };

    this.setInactive = function() {
        this.isActive = false;
    };

    this.clean = function() {
        this.squareNumber = 0;
        this.redraw();
    };

    this.keyDown = function() {
        if (this.type !== COLUMN_TYPE_3) {
            this.keyInMove = true;
            var finalDestination = this.msgColumn.column.y - this.column.height - this.boxOption.SPACE_HEIGHT - 0.5;
            var time = (finalDestination - this.column.y) / 1750 * 450 * this.boxOption.timeInfo.keyDownSpeed;

            var path =  new CAAT.LinearPath().setInitialPosition(this.column.x, this.column.y).setFinalPosition(this.column.x, finalDestination);
            this.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(this.column.time, time).setCycle(false);

            this.column.addBehavior(this.pb);
            this.boxOption.objectsInMove.push(true);
        }
    };

    this.startAnimation = function() {
            this.keyInMove = true;
            var finalDestination = this.msgColumn.column.y - this.column.height - this.boxOption.SPACE_HEIGHT - 0.5;
            var time = (finalDestination - this.column.y) / 1750 * 450 * this.boxOption.timeInfo.keyDownSpeed;

            var path =  new CAAT.LinearPath().setInitialPosition(this.column.x, this.column.y).setFinalPosition(this.column.x, finalDestination);
            this.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(this.column.time, time).setCycle(false);

            this.column.addBehavior(this.pb);
    }

    var object = this;
	
    this.myTimer = director.createTimer(director.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            if (director.currentScene.isPaused() === false && object.keyFirstMove === false && object.keyInMove === true && object.isActive === true) {
                var msgColumn = object.msgColumn.column;
                var keyColumn = object.column;

                if (object.isResize === true || keyColumn.y + keyColumn.height > msgColumn.y - 2 * object.boxOption.SPACE_HEIGHT) {
                    object.stopMove();

                    keyColumn.setLocation(msgColumn.x, msgColumn.y - keyColumn.height - object.boxOption.SPACE_HEIGHT);
                    object.msgColumn.mergeColumns(object);


                    if (object.pathContinue === true) {
                        object.pathContinue = false;
                        object.keyDown();
                    } else {
                        object.clean();
                        object.setInactive();
                    }

                    object.boxOption.objectsInMove.splice(0, 1);

                    if (object.boxOption.objectsInMove.length === 0) {
                        object.boxOption.keyNeedToUpdate = true;
                        
                        // ToFix: Actually we pass the boxOption object to know the padlock we want to animate.
                    	$(document).trigger('padlockVibration', [object.boxOption]);
                    }
                }
            }
        }
    );
}

function getSecondString(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

function Key(keyInfo, keyLength, msgColumn, container, director, boxOption) {
  	this.ACTION_LEFT = 0;
 	this.ACTION_RIGHT = 1;
 	this.ACTION_INVERT = 2;
  	this.ACTION_DOWN = 3;
	this.director = director;
	this.type = KEY_TYPE_NORMAL;
	this.length = keyLength;
	this.columnList = [];
	this.msgColumn = msgColumn;
	this.container = container;
	this.boxOption = boxOption;
	this.keyInMove = false;
	this.keyFirstMove = false;
	this.numberApplied = -1;
	this.key_symbol_anim_is_needed = false;
	this.latteral_move = 0;
	this.is_inverted = false;
	this.last_move = [];
	this.all_moves = [];

	this.waitForHidden = false;
	this.keyHidden = false;

    this.resize = function(isPaused) {
		for (var i = 0; i < this.columnList.length; ++i) {
    	    this.columnList[i].isResize = true;
   		}

	    if (this.keyFirstMove === true) {

    	    for (var i = 0; i < this.columnList.length; ++i) {
        	    this.columnList[i].stopFirstMove();
           	}
            this.keyFirstMove = false;
    		this.redraw();
        }
    }

	this.keyInfo = keyInfo;
	this.normalKey = [];
	for (var i = 0; i < this.keyInfo['normal_key'].length && i < keyLength; ++i) {
		this.normalKey.push(this.keyInfo['normal_key'][i]);
	}
	this.reverseKey = [];
	for (var i = 0; i < this.keyInfo['reverse_key'].length && i < keyLength; ++i) {
		this.reverseKey.push(this.keyInfo['reverse_key'][i]);
	}
	this.number = [];
	for (var i = 0; i < this.keyInfo['number'].length && i < keyLength; ++i) {
		this.number.push(this.keyInfo['number'][i]);
	}

	this.createKey = function () {
		this.key_symbol_anim_is_needed = true;

		for (var i = 0; i < this.columnList.length; ++i) {
			this.container.removeChild(this.columnList[i].column);
			this.columnList[i].myTimer.cancel();
		}


		this.latteral_move = 0;
		this.is_inverted = false;
		this.columnList = [];
		this.keyInMove = false;
		this.keyFirstMove = true;

		this.boxOption.maxKeyNumber = 0;

		if (this.keyHidden === false && !currentGame.dontShowKey && (this.msgColumn.resolved === false || currentGame.stopCreateKeyAfterResolve === false)) {
			for (var i = 0; i < this.length; ++i) {
				if (this.number[i] > this.boxOption.maxKeyNumber) {
					this.boxOption.maxKeyNumber = this.number[i];
				}
				if (this.type === KEY_TYPE_NORMAL) {
					this.columnList.push(new KeyColumn(director, this.normalKey[i], this.number[i], container, this.boxOption, this.msgColumn.columnList[i]));
				} else if (this.type === KEY_TYPE_REVERSE) {
					this.columnList.push(new KeyColumn(director, this.reverseKey[i], this.number[i], container, this.boxOption, this.msgColumn.columnList[i]));
				}
			}
		}

		this.numberApplied = this.numberApplied + 1;

		this.firstDraw();	
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

	this.firstDraw = function () {
		
			for (var i = 0; i < this.columnList.length; ++i) {
				this.columnList[i].firstDraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH));
				this.columnList[i].firstMove();
			}

	}

	this.redraw = function () {
		for (var i = 0; i < this.columnList.length; ++i) {
			this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH));
		}
	}
	this.resizeRedraw = function () {
		for (var i = 0; i < this.columnList.length; ++i) {
			this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.columnList[i].column.y);
		}
	}

	this.hidden = function() {
		for (var i = 0; i < this.columnList.length; ++i) {
			this.columnList[i].container.removeChild(this.columnList[i].column);
		}
		this.columnList = [];
	}

	this.changeKeyType = function () {
		if (this.keyFirstMove === false && this.keyInMove === false) {
			this.all_moves.push(this.ACTION_INVERT);
			this.is_inverted = !this.is_inverted;
			if (this.type === KEY_TYPE_NORMAL) {
				this.type = KEY_TYPE_REVERSE;
			} else {
				this.type = KEY_TYPE_NORMAL;
			}

			for (var i = 0; i < object.columnList.length; ++i) {
				object.columnList[i].changeType();
				object.redraw();
			}
		}
	}

	this.rotateLeft = function () {
		if (this.keyFirstMove === false && this.keyInMove === false) {
			this.all_moves.push(this.ACTION_LEFT);
			this.latteral_move = this.latteral_move - 1;
			this.columnList.push(this.columnList[0]);
			this.columnList.splice(0, 1);

			this.normalKey.push(this.normalKey[0]);
			this.normalKey.splice(0, 1);

			this.reverseKey.push(this.reverseKey[0]);
			this.reverseKey.splice(0, 1);

			this.number.push(this.number[0]);
			this.number.splice(0, 1);

			this.reAssignColumns();
			this.redraw();
		}
	}

	this.rotateRight = function () {
		if (this.keyFirstMove === false && this.keyInMove === false) {
			this.all_moves.push(this.ACTION_RIGHT);

			this.latteral_move = this.latteral_move + 1;
			this.columnList.splice(0, 0, this.columnList[this.columnList.length - 1]);
			this.columnList.splice(this.columnList.length - 1, 1);

			this.normalKey.splice(0, 0, this.normalKey[this.normalKey.length - 1]);
			this.normalKey.splice(this.normalKey.length - 1, 1);

			this.reverseKey.splice(0, 0, this.reverseKey[this.reverseKey.length - 1]);
			this.reverseKey.splice(this.reverseKey.length - 1, 1);

			this.number.splice(0, 0, this.number[this.number.length - 1]);
			this.number.splice(this.number.length - 1, 1);

			this.reAssignColumns();
			this.redraw();
		}
	}

	this.reAssignColumns = function () {
		for (var i = 0; i < this.columnList.length; ++i) {
			this.columnList[i].msgColumn = this.msgColumn.columnList[i];
		}
	}

	this.keyDown = function () {
		if (this.keyFirstMove === false && this.keyInMove === false) {
			if (this.waitForHidden === true) {
				this.keyHidden = true;
			}
			this.all_moves.push(this.ACTION_DOWN);
			this.last_move.push([this.latteral_move, this.is_inverted]);
			this.keyInMove = true;
			for (var i = 0; i < this.columnList.length; ++i) {
				this.columnList[i].keyDown();
			}
		} else if (this.keyInMove === true) {
			if (this.waitForHidden === true) {
				this.keyHidden = true;
			}
			this.resize();
		}
	}

	this.stoppedKey = [];
	this.stoppedFirstKey = [];
	this.stopAnimation = function() {
		for (var i = 0; i < this.columnList.length; ++i) {
			if (this.columnList[i].stopMove() === true) {
				this.stoppedKey.push(this.columnList[i]);
			}
			if (this.columnList[i].stopFirstMove() === true) {
				this.stoppedFirstKey.push(this.columnList[i]);
			}
		}
	}

	this.startAnimation = function() {
		for (var i = 0; i < this.stoppedKey.length; ++i) {
			this.stoppedKey[i].startAnimation();
		}
		this.stoppedKey = [];

		for (var i = 0; i < this.stoppedFirstKey.length; ++i) {
			this.stoppedFirstKey[i].startFirstAnimation();
		}
		this.stoppedFirstKey = [];
	}

	var object = this;

	var test = false;
	director.createTimer(this.container.time, Number.MAX_VALUE, null,
		function (time, ttime, timerTask) {
			if (object.keyFirstMove === true) {
				var newKeyFirstMove = false;
				for (var i = 0; i < object.columnList.length; ++i) {
					if (object.columnList[i].keyFirstMove === true) {
						newKeyFirstMove = true;
					}
				}
				object.keyFirstMove = newKeyFirstMove;
			}

			if (object.keyFirstMove === false && object.boxOption.keyNeedToUpdate === true) {
				object.boxOption.keyNeedToUpdate = false;
				var needToUpdateAgain = false;
				for (var k = 0; k < object.msgColumn.columnList.length; ++k) {
					var msgColumn = object.msgColumn.columnList[k];
					if (msgColumn.blockToDestroy !== null) {
						if (msgColumn.blockToDestroy.isVisible === false) {
							msgColumn.container.removeChild(msgColumn.blockToDestroy.column);
							msgColumn.blockToDestroy = null;
						} else {
							needToUpdateAgain = true;
						}
					}
					if (msgColumn.levelMsg !== null) {
						if (msgColumn.levelMsg.isVisible === false) {
							msgColumn.container.removeChild(msgColumn.levelMsg.msg);
							msgColumn.levelMsg = null;
						} else {
							needToUpdateAgain = true;
						}
					}

					object.msgColumn.columnList[k].blurSquareNumber = 0;
					object.msgColumn.columnList[k].keySquareNumber = 0;
				}

				if (needToUpdateAgain === true) {
					object.boxOption.keyNeedToUpdate = true;
				} else {
					object.msgColumn.redraw();
					object.msgColumn.isResolved();
					object.createKey();
				}
			}
		}
	);
}
