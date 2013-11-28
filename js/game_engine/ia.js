function IA(scene, key, message, boxOption) {
  // -- List of move
  this.ACTION_LEFT = 0;
  this.ACTION_RIGHT = 1;
  this.ACTION_INVERT = 2;
  this.ACTION_DOWN = 3;
  this.ACTION_WAIT_FOR_KEY_HIDDEN = 4;

  this.iaScene = scene;
  this.iaBoxOption = boxOption;
  this.iaKey = key;
  this.iaMessage = message;
  this.moveList = [];
  this.iaTimer = null;
  this.iaCurrentTime = this.iaScene.time;

  this.keyIsInvert = false;
  this.blankMessageIsAllowed = false;

  this.iaStop = 0;
  this.iaPause = 1;
  this.iaPlay = 2;
  this.iaState = this.iaStop;
  this.dontShowKey = false;

  this.addWaitForKeyHidden = function() {
    this.moveList.push(this.ACTION_WAIT_FOR_KEY_HIDDEN);
  }

  this.addMoveLeft = function() {
    this.moveList.push(this.ACTION_LEFT);
  }

  this.addMoveRight = function() {
    this.moveList.push(this.ACTION_RIGHT);
  }

  this.addMoveInvert = function() {
    this.moveList.push(this.ACTION_INVERT);
  }

  this.addMoveDown = function() {
    this.moveList.push(this.ACTION_DOWN);
  }

  this.startIA = function() {
    if (this.iaState !== this.iaStop && this.iaState !== this.iaPause) {
      return;
    }
    this.iaState = this.iaPlay;
    var object = this;
    this.iaTimer = this.iaScene.createTimer(0, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        var test = (object.iaKey.msgColumn.resolved === false || object.blankMessageIsAllowed === true) && object.iaKey.keyInMove === false && object.iaKey.keyFirstMove === false;
        if (test === true && object.moveList.length > 0 && (time - object.iaCurrentTime) > object.iaBoxOption.timeInfo.waitingIATime) {
          var action = object.moveList[0];
          if (action === object.ACTION_RIGHT) {
            object.iaKey.rotateRight();
          } else  if (action === object.ACTION_LEFT) {
            object.iaKey.rotateLeft();
          } else if (action === object.ACTION_INVERT) {
            object.iaKey.changeKeyType();
            object.keyIsInvert != object.keyIsInvert;
          } else if (action === object.ACTION_DOWN) {
            object.iaKey.keyDown();
          } else if (action === object.ACTION_WAIT_FOR_KEY_HIDDEN) {
            object.iaKey.waitForHidden = true;
          }
          object.iaCurrentTime = time;
          object.moveList.shift();
        }

        if (object.dontShowKey === true && object.moveList.length <= 1) {
          currentGame.dontShowKey = true;
        }
      }
    );
  }

  this.stopIA = function() {
    if (this.iaTimer !== null) {
      this.moveList = [];
      this.iaState = this.iaStop;
      this.iaTimer.cancel();
      this.iaTimer = null;
    }
  }

  this.pauseIA = function() {
    if (this.iaTimer !== null) {
      this.iaState = this.iaPause;
      this.iaTimer.cancel();
      this.iaTimer = null;
    }
  }
}