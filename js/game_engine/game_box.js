/**
 *  Game_box.js
 *  Prepare a board for the player or the AI
 */

/**
 *  TODO
 */


function GameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player, isActive, isActiveKeySymbol, withName) {
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
  this.padlockIsFall = false;
  this.key_symbol_anim_is_needed = false;
  this.keyIsInPlace = false;
  this.keySymbol = null;
  this.lastLevel = 0;
  this.isActiveKeySymbol = isActiveKeySymbol;
  this.withName = true;

  if (withName === false) {
    this.withName = false;
  }

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
    this.gameBox = new CAAT.Foundation.ActorContainer().setSize(this.sizeWidth(), this.sizeHeight()).setFillStyle('rgba(0, 113, 187, 0.2)');
    this.gameBox.cacheAsBitmap();

    /**
     * Create each column and set their color.
     */
    this.columnList = [];
    for (var i = 0; i < current_length; ++i) {
      var column = new CAAT.ShapeActor().setSize(this.boxOption.resizeOption.DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                                        .setFillStyle(boxOption.boardColorInfo.columnColor).setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                        .cacheAsBitmap();

      this.gameBox.addChild(column);
      this.columnList.push(column);
    }

    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    this.message = new Message(director, current_length, my_message, this.gameBox, boxOption, isActive);
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
    this.leftName = new CAAT.Foundation.Actor().setBackgroundImage(director.getImage('left-board'));

    /**
     * Create the center part of the name box.
     */
    this.centerName = new CAAT.Foundation.ActorContainer().setSize(175, director.getImage('center-board').height).setBackgroundImage(director.getImage('center-board'), false);

    this.centerName.paint = function(director) {
      var ctx = director.ctx;
      var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Create the text of the name box.
     */
    this.nameText = new CAAT.Foundation.Actor().setSize(175, director.getImage('center-board').height).setLocation(0, 0);


    this.nameText.paint = function(director) {
      var ctx = director.ctx;

      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#00FF9D';

      ctx.font = '700 22px Quantico';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(object.player ? currentGame.username.substring(0, 14) : currentGame.ianame, this.width / 2, this.height / 2 + 7);
    }

    this.centerName.addChild(this.nameText);
    this.nameText.cacheAsBitmap();

    /**
     * Create the right part of the name box.
     */
    this.rightName = new CAAT.Foundation.Actor().setBackgroundImage(director.getImage('right-board'));

    /**
     * Add all the name box to the scene.
     */
    if (this.withName === true) {
      this.boxOption.scene.addChild(this.leftName);
      this.boxOption.scene.addChild(this.centerName);
      this.boxOption.scene.addChild(this.rightName);
    }

    /**
     * Display all icons if this gameBox is active (to be active means we want to display the icons).
     */
    this.enveloppe_img = director.getImage(this.boxOption.boardColorInfo['enveloppe']);
    this.padlock_closed_img = director.getImage(this.boxOption.boardColorInfo['padlock-closed']);
    this.padlock_open_img = director.getImage(object.boxOption.boardColorInfo['padlock-open']);

    if (this.isActive === true) {

      this.enveloppe = new CAAT.Foundation.ActorContainer().setSize(this.enveloppe_img.width, this.enveloppe_img.height).setBackgroundImage(this.enveloppe_img, false);
      this.gameBox.addChild(this.enveloppe);

      this.padlock = new CAAT.Foundation.ActorContainer().setSize(this.padlock_closed_img.width, this.padlock_closed_img.height).setBackgroundImage(this.padlock_closed_img, false);
      this.gameBox.addChild(this.padlock);
    }

  }
  this.create();

  this.changeToAnimateEncryption = function() {
    if (this.padlock != null) {
      this.padlock.setBackgroundImage(this.padlock_open_img, false);
    }
  }

  this.closePadlock = function() {
    if (this.padlock != null) {
      this.padlock.setBackgroundImage(this.padlock_closed_img, false);
    }
  }

  /**
   * Detect the event TooBlocksInAColumn
   */
  var object = this;
  $(document).on('tooManyBlocks', function(event, boxOption) {
    if (player === true && object.boxOption === boxOption) {
      currentGame.tooManyBlocksInAColumn = true;
    }
  });

  /**
   * If we have to decrypt a message, and if we have not added a keySymbol, add it.
   */
  this.addKeySymbol = function() {
    if (this.isActiveKeySymbol === true && this.keySymbol === null) {
      this.key_symbol_img = director.getImage(this.boxOption.boardColorInfo['key-symbol']);
      this.keychain_img = director.getImage(this.boxOption.boardColorInfo['keychain']);
      this.keychainX = this.boxOption.boardColorInfo['keychainX'];
      this.keySymbol = new CAAT.Foundation.ActorContainer().setSize(this.key_symbol_img.width, this.key_symbol_img.height);
      this.keySymbolImg = new CAAT.Foundation.ActorContainer().setSize(this.key_symbol_img.width, this.key_symbol_img.height).setBackgroundImage(this.key_symbol_img, false).setLocation(0, 0);
      this.keyChain = new CAAT.Foundation.ActorContainer().setSize(this.keychain_img.width, this.keychain_img.height).setBackgroundImage(this.keychain_img, false);

      if (this.player === true) {
        this.keyChain.setLocation(41, 6);
      } else {
        this.keyChain.setLocation(-43, 6);
      }

      this.keySymbol.addChild(this.keySymbolImg);
      this.keySymbol.addChild(this.keyChain);
      this.gameBox.addChild(this.keySymbol);

      var object = this;
      // Create the timer to animate key symbol.
      this.animKeySymbol = this.director.createTimer(0, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
                    
          if (object.key_symbol_anim_is_needed === true) {
            object.key_symbol_anim_is_needed = false;
            object.animKeySymbol.cancel();

            var finalXApparition = object.gameBox.width - 8;
            if (object.player !== true) {
              finalXApparition = -1 * object.key_symbol_img.width + 8;
            }

            var path =  new CAAT.LinearPath().setInitialPosition(object.keySymbol.x, object.keySymbol.y).setFinalPosition(finalXApparition, object.keySymbol.y);
            var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(object.gameBox.time, 250).setCycle(false);

            var keychainPath = null;
            var keychainPb = null;
            if (object.player === true) {
              keychainPath = new CAAT.CurvePath().setQuadric(object.keyChain.x, object.keyChain.y, object.keyChain.x , object.keyChain.y + 15, object.keyChain.x - 15, object.keyChain.y + 26);
              keychainPb = new CAAT.PathBehavior().setPath(keychainPath).setFrameTime(object.gameBox.time + 125, 500).setCycle(false);
              keychainRotate = new CAAT.RotateBehavior().setValues(0, Math.PI / 3).setFrameTime(object.gameBox.time + 125, 500).setCycle(false);
            } else {
              keychainPath = new CAAT.CurvePath().setQuadric(object.keyChain.x, object.keyChain.y, object.keyChain.x, object.keyChain.y + 15, object.keyChain.x + 15, object.keyChain.y + 26);
              keychainPb = new CAAT.PathBehavior().setPath(keychainPath).setFrameTime(object.gameBox.time + 125, 500).setCycle(false);
              keychainRotate = new CAAT.RotateBehavior().setValues(0, -1 * Math.PI / 3).setFrameTime(object.gameBox.time + 125, 500).setCycle(false);
            }
            keychainPb.setInterpolator(new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(1.0, false));
            keychainRotate.setInterpolator(new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(1.0, false));
            object.keyChain.addBehavior(keychainPb);
            object.keyChain.addBehavior(keychainRotate);

            var fadeMe = new CAAT.AlphaBehavior().setValues(0, 1).setFrameTime(object.gameBox.time, 250).setCycle(false);
            pb.setInterpolator(new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(1.0, false));
            object.keySymbol.addBehavior(pb);
            object.keySymbol.addBehavior(fadeMe);
          }
        }
      );
    }
  }
    
  /**
   * Add a win Screen (black splash screen and message) to this gameBox.
   */
  this.addWinScreen = function(message, width, height, winner, scene, hookActive) {
    // Add the winScreen.
    if (this.winScreen === null) {

      this.winScreen = new CAAT.Actor().setSize(this.gameBox.width, this.gameBox.height).setLocation(0, 0);

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
      this.gameBox.setZOrder(this.winScreen, Number.MAX_VALUE);
    }

    // Make the enveloppe twinkles three times.
    if (this.enveloppe != null && winner === true) {
      var nbrEnveloppeClipping = 0;
      var maxEnveloppeClipping = 3;
      var alphaD = new CAAT.AlphaBehavior().setValues(1,0).setCycle(false);
      var alphaC = new CAAT.AlphaBehavior().setValues(0,1).setCycle(false);

      var object = this;
      var halfTwinkleTime = 200;
      var alphaCBehaviorListener = {
        'behaviorExpired' : function(behavior, time, actor) {
          if (nbrEnveloppeClipping < maxEnveloppeClipping - 1) {
            object.enveloppe.addBehavior(alphaD.setFrameTime(time, halfTwinkleTime));
            nbrEnveloppeClipping = nbrEnveloppeClipping + 1;
          } else {
            if (scene != null && hookActive != null) {
              /* Stop the ia --- wrong way, we have to change this by a local variable. */
              currentGame.iaPlay = false;

              /* Launch an event to stop the increase of time */
              $(document).trigger('freezeTime', {'scene' : scene, 'timeLabel' : hookActive + 'Time'});

              currentGame[hookActive] = false;
            }
          }
        },
        'behaviorApplied' : null
      };
      alphaC.addListener(alphaCBehaviorListener);

      var alphaDBehaviorListener = {
        'behaviorExpired' : function(behavior, time, actor) {
          object.enveloppe.addBehavior(alphaC.setFrameTime(time, halfTwinkleTime));
        },
        'behaviorApplied' : null
      };
      alphaD.addListener(alphaDBehaviorListener);

      this.enveloppe.addBehavior(alphaD.setFrameTime(this.enveloppe.time, halfTwinkleTime));
    } else if (this.enveloppe === null) {
      if (scene != null && hookActive != null) {
        scene.setPaused(true);
        currentGame[hookActive] = false;
      }
    }
  }



  if (this.isActive === true) {
    var object = this;
    
    // -- Event to make the padlock vibrate.
    $(document).on('padlockVibration', function(event, boxOption) {
      if (boxOption === object.boxOption) {
        /**
         * In any case we set a 'elastic ping pong' animation to simulate a vibration.
         */
        var path =  new CAAT.LinearPath().setInitialPosition(object.padlock.x, object.padlock.y).setFinalPosition(object.padlock.x + 3, object.padlock.y);
        var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(object.gameBox.time, 250).setCycle(false);

        pb.setInterpolator(new CAAT.Behavior.Interpolator().createElasticInOutInterpolator(1.0, 0.2, true));
        object.padlock.addBehavior(pb);
      }
    });

    // -- Event to open the padlock and twinkle the enveloppe.
    $(document).on('msgResolved', function() {
      if (object.message.resolved === true && object.padlockIsFall === false) {
        /**
         * Make the padlock to vibrate.
         */
        $(document).trigger('padlockVibration', object.boxOption);

        /**
         * We open the padlock by changing the background img.
         */
        object.padlock.setBackgroundImage(object.padlock_open_img, false);

        /**
         * Path to move down the padlock.
         */
        var path =  new CAAT.LinearPath().setInitialPosition(object.padlock.x, object.padlock.y).setFinalPosition(object.padlock.x, $(window).height());
        var pathBehaviorListener = {
          'behaviorExpired' : function(behavior, time, actor) {
            object.padlockIsFall = true;
            $(document).trigger('padlockIsFall');
          },
          'behaviorApplied' : null
        };
        var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(object.gameBox.time + 200, 1000).setCycle(false);
        pb.addListener(pathBehaviorListener);
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
        var fade = new CAAT.AlphaBehavior().setValues(1, 0).setFrameTime(object.gameBox.time + 200, 1000).setCycle(false);
        object.padlock.addBehavior(fade);
      }
    });
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
      if (this.withName === true) {
        this.leftName.setLocation(this.gameBox.x - 12, this.gameBox.y - this.director.getImage('left-board').height - 10);
        this.centerName.setLocation(this.leftName.x + this.leftName.width, this.leftName.y);
        this.rightName.setLocation(this.centerName.x + this.centerName.width, this.centerName.y);
      }
      
      if (this.isActiveKeySymbol === true) {

        if (this.keySymbol != null) {
          var keySymbolX = object.gameBox.width - 8;
          if (this.keyIsInPlace === false && this.key_symbol_anim_is_needed === false) {
            this.key_symbol_anim_is_needed = true;
            this.keyIsInPlace = true;
            keySymbolX = this.gameBox.width + 260 / 2 + 12 - this. keySymbol.width;
          }
          this.keySymbol.setLocation(keySymbolX, -20 + this.boxOption.BORDER_HEIGHT);
        }
      }
      if (this.isActive === true) {
        this.enveloppe.setLocation(this.gameBox.width + 15, this.gameBox.height - this.enveloppe.height - this.boxOption.BORDER_HEIGHT + 3);
        if (!object.message.resolved) {
          this.padlock.setLocation(this.enveloppe.x + this.enveloppe.width - this.padlock.width / 2 - 2, this.enveloppe.y + this.enveloppe.height / 2 - 6);
        }
      }

    } else {

      if (this.isActiveKeySymbol === true) {

        if (this.keySymbol != null) {
          var keySymbolX = -1 * object.key_symbol_img.width + 8;
          if (this.keyIsInPlace === false && this.key_symbol_anim_is_needed === false) {
            this.key_symbol_anim_is_needed = true;
            this.keyIsInPlace = true;
            keySymbolX = -260 / 2 - 12;
          }
          this.keySymbol.setLocation(keySymbolX, -20 + this.boxOption.BORDER_HEIGHT);
        }
      }
      if (this.isActive === true) {
        this.enveloppe.setLocation(-1 * this.enveloppe.height - 27, this.gameBox.height - this.enveloppe.height - this.boxOption.BORDER_HEIGHT + 3);
        if (!object.message.resolved) {
          this.padlock.setLocation(this.enveloppe.x + this.enveloppe.width - this.padlock.width / 2 - 2, this.enveloppe.y + this.enveloppe.height / 2 - 6);
        }
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
    this.gameBox.setSize(this.sizeWidth(), this.sizeHeight()).setLocation(this.relativeX, this.relativeY);

    /**
     * Resize the winScreen (if it exists)
     */
    if (this.winScreen !== null) {
      this.winScreen.setSize(this.gameBox.width, this.gameBox.height).setLocation(0, 0);
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
