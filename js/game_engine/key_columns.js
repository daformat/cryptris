function KeyColumn(director, type, squareNumber, container, boxOption) {
    this.type = type;
    this.boxOption = boxOption;
    this.squareNumber = squareNumber;
    this.container = container;
    this.is_active = true;
    this.pb = null;
    this.keyInMove = false;

    this.column = new CAAT.Foundation.ActorContainer().setSize(this.boxOption.SQUARE_WIDTH, squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT)).setLocation(0.5, this.boxOption.BORDER_HEIGHT);
    this.container.addChild(this.column);
    this.gradient = null;

    this.computeGradient = function() {
        if (this.type != COLUMN_TYPE_3) {
            this.gradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, this.boxOption.ColorLeft[this.type]);
            this.gradient.addColorStop(1, this.boxOption.Color[this.type]);
        } else {
            this.gradient = null;
        }
    }

    this.computeGradient();

    this.redraw = function(x) {
        this.column.setLocation(x, this.boxOption.BORDER_HEIGHT);


        var squareNumber = this.squareNumber;
        var type = this.type;
        var gradient = this.gradient;
        var boxOption = this.boxOption;

        this.column.setSize(this.boxOption.COLUMN_WIDTH, squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) - this.boxOption.SPACE_HEIGHT);

        this.column.paint = function(director, time) {
            if (this.isCached()) {
                CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
                return;
            }

            // Custom paint method.
            for (var i = 0; i < squareNumber; ++i) {
                var ctx = director.ctx;

                var x = 1.5;
                var y = 0.5 + i * (boxOption.SQUARE_HEIGHT + boxOption.SPACE_HEIGHT);

                ctx.lineWidth = 1;
                ctx.strokeStyle = boxOption.StrokeColor[type];
                ctx.strokeRect(x, y, boxOption.SQUARE_WIDTH, boxOption.SQUARE_HEIGHT);
                ctx.fillStyle = gradient;
                ctx.fillRect(x + 0.5, y + 0.5, boxOption.SQUARE_WIDTH - 1, boxOption.SQUARE_HEIGHT - 1);
            }
        }
    }

    this.stopMove = function() {
        if (this.pb !== null) {
            this.pb.setOutOfFrameTime();
        }
    }

    this.changeType = function() {
        if (this.type === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_2;
        } else if (this.type === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_1;
        }

        this.computeGradient();
        this.redraw();
    }

    this.setInactive = function() {
        this.is_active = false;
    }

    this.clean = function() {
        this.squareNumber = 0;
        this.redraw();
    }
}

function Key(keyInfo, keyLength, msgColumn, container, director, boxOption, player) {
    this.player = player;
    this.type = KEY_TYPE_NORMAL;
    this.length = keyLength;
    this.columnList = [];
    this.msgColumn = msgColumn;
    this.container = container;
    this.boxOption = boxOption;

    this.keyInfo = keyInfo;
    this.normalKey = [];
    for (var i = 0; i < this.keyInfo['normal_key'].length; ++i) {
        this.normalKey.push(this.keyInfo['normal_key'][i]);
    }
    this.reverseKey = [];
    for (var i = 0; i < this.keyInfo['reverse_key'].length; ++i) {
        this.reverseKey.push(this.keyInfo['reverse_key'][i]);
    }
    this.number = [];
    for (var i = 0; i < this.keyInfo['number'].length; ++i) {
        this.number.push(this.keyInfo['number'][i]);
    }


    this.createKey = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.keyInMove = false;

        for (var i = 0; i < this.length; ++i) {
            if (this.type === KEY_TYPE_NORMAL) {
                this.columnList.push(new KeyColumn(director, this.normalKey[i], this.number[i], container, this.boxOption));
            } else if (this.type === KEY_TYPE_REVERSE) {
                this.columnList.push(new KeyColumn(director, this.reverseKey[i], this.number[i], container, this.boxOption));
            }
            if (this.number[i] == 0) {
                this.columnList[i].column.setSize(this.boxOption.SQUARE_WIDTH, this.boxOption.SQUARE_HEIGHT / 2);
            }
        }

        this.redraw();
        return this;
    }

    this.redraw = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH));
        }
    }

    this.changeKeyType = function() {
        if (this.keyInMove === false) {
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

    this.rotateLeft = function() {
        if (this.keyInMove === false) {
            this.columnList.push(this.columnList[0]);
            this.columnList.splice(0, 1);

            this.normalKey.push(this.normalKey[0]);
            this.normalKey.splice(0,1);

            this.reverseKey.push(this.reverseKey[0]);
            this.reverseKey.splice(0,1);

            this.number.push(this.number[0]);
            this.number.splice(0, 1);

            this.redraw();
        }
    }

    this.rotateRight = function() {
        if (this.keyInMove === false) {
            this.columnList.splice(0, 0, this.columnList[this.columnList.length - 1]);
            this.columnList.splice(this.columnList.length - 1, 1);

            this.normalKey.splice(0, 0, this.normalKey[this.normalKey.length - 1]);
            this.normalKey.splice(this.normalKey.length - 1, 1);

            this.reverseKey.splice(0, 0, this.reverseKey[this.reverseKey.length - 1]);
            this.reverseKey.splice(this.reverseKey.length - 1, 1);

            this.number.splice(0, 0, this.number[this.number.length - 1]);
            this.number.splice(this.number.length - 1, 1);

            this.redraw();
        }
    }

    this.keyDown = function() {
        if (this.keyInMove === false) {
            this.keyInMove = true;
            for (var i = 0; i < this.columnList.length; ++i) {
                if (this.columnList[i].type !== COLUMN_TYPE_3) {
                    var columnObject = this.columnList[i];
                    var path =  new CAAT.LinearPath().setInitialPosition(columnObject.column.x, columnObject.column.y).setFinalPosition(columnObject.column.x, columnObject.container.height);
                    columnObject.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(columnObject.column.time, 1500).setCycle(false);
                    columnObject.column.addBehavior(columnObject.pb);
                    this.boxOption.objectsInMove.push(true);
                }
            }
        }
    }

    var object = this;
    director.createTimer(this.container.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            for (var i = 0; object.boxOption.objectsInMove.length > 0 && i < object.msgColumn.columnList.length; ++i) {

                if (object.columnList[i].is_active === false) {
                    continue;
                }

                var msgColumn = object.msgColumn.columnList[i].column;

                var keyColumn = object.columnList[i].column;

                if (keyColumn.y + keyColumn.height > msgColumn.y) {

                    object.columnList[i].stopMove();

                    keyColumn.setLocation(msgColumn.x, msgColumn.y - keyColumn.height - object.boxOption.SPACE_HEIGHT);
                    object.msgColumn.mergeColumns(i, object.columnList[i]);
                    object.columnList[i].clean();

                    object.boxOption.objectsInMove.splice(0, 1);
                    object.columnList[i].setInactive();

                    if (object.boxOption.objectsInMove.length == 0) {
                        object.msgColumn.redraw();
                        object.createKey();
                    }
                }
            }
        }
    );

    if (this.player === true) {
        CAAT.registerKeyListener(function(key) {
            if (key.getKeyCode() === CAAT.Keys.LEFT && key.getAction() === 'down') {
                object.rotateLeft();
            }
            if (key.getKeyCode() === CAAT.Keys.RIGHT && key.getAction() === 'down') {
                object.rotateRight();
            }
            if (key.getKeyCode() === CAAT.Keys.UP && key.getAction() === 'down') {
                object.changeKeyType();
            }
            if (key.getKeyCode() === CAAT.Keys.DOWN && key.getAction() === 'up') {
                object.keyDown();
            }
        });
    }
}
