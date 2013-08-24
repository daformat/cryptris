function KeyColumn(director, type, squareNumber, msgColumn, container) {
    this.type = type;
    this.shapeList = [];
    this.container = container;
    this.is_active = true;
    this.pb = null;
    this.key_in_move = false;

    this.column = new CAAT.Foundation.ActorContainer().setSize(SQUARE_WIDTH, squareNumber * SQUARE_HEIGHT);//.setFillStyle('#00FF00');
    this.container.addChild(this.column);
    this.gradient = null;

    this.computeGradient = function() {
        if (this.type != COLUMN_TYPE_3) {
            this.gradient = director.ctx.createLinearGradient(0, 0, SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, ColorLeft[this.type]);
            this.gradient.addColorStop(1, Color[this.type]);
        } else {
            this.gradient = null;
        }
    }
    for (var i = 0; i < squareNumber; ++i) {
        this.computeGradient();
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 //.setFillStyle(Color[this.type])
                                                 .setFillStyle(this.gradient)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle(StrokeColor[this.type]));
        this.column.addChild(this.shapeList[i]);
    }

    this.redraw = function(x) {
        this.column.setLocation(x, 0);
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setLocation(0, i * SQUARE_HEIGHT);
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
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(this.gradient).setStrokeStyle(StrokeColor[this.type]);
        }
    }

    this.setInactive = function() {
        this.is_active = false;
    }


    this.clean = function() {
        for (var i = 0; i < this.saveChild.length; ++i) {
            this.column.removeChild(this.saveChild[i]);
        }
        this.saveChild = [];
    }
}

function Key(keyInfo, keyLength, msgColumn, container, bottomLine, director) {
    this.type = KEY_TYPE_NORMAL;
    this.length = keyLength;
    this.columnList = [];
    this.msgColumn = msgColumn;
    this.container = container;
    this.bottomLine = bottomLine;

    this.keyInfo = keyInfo;
    var normal_key = this.keyInfo['normal_key'];
    var reverse_key = this.keyInfo['reverse_key'];
    var number = this.keyInfo['number'];


    this.createKey = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.key_in_move = false;

        for (var i = 0; i < this.length; ++i) {
            if (this.type === KEY_TYPE_NORMAL) {
                this.columnList.push(new KeyColumn(director, normal_key[i], number[i], msgColumn, container));
            } else if (this.type === KEY_TYPE_REVERSE) {
                this.columnList.push(new KeyColumn(director, reverse_key[i], number[i], msgColumn, container));
            }
            if (number[i] == 0) {
                this.columnList[i].column.setSize(SQUARE_WIDTH, SQUARE_HEIGHT / 2);
            }
        }

        this.redraw();
        return this;
    }

    this.redraw = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(i * (SQUARE_WIDTH + SPACE_WIDTH));
        }
    }

    this.changeKeyType = function() {
        if (this.key_in_move === false) {
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
        if (this.key_in_move === false) {
            this.columnList.push(this.columnList[0]);
            this.columnList.splice(0, 1);

            normal_key.push(normal_key[0]);
            normal_key.splice(0,1);

            reverse_key.push(reverse_key[0]);
            reverse_key.splice(0,1);

            number.push(number[0]);
            number.splice(0, 1);

            this.redraw();
        }
    }

    this.rotateRight = function() {
        if (this.key_in_move === false) {
            this.columnList.splice(0, 0, this.columnList[this.columnList.length - 1]);
            this.columnList.splice(this.columnList.length - 1, 1);

            normal_key.splice(0, 0, normal_key[normal_key.length - 1]);
            normal_key.splice(normal_key.length - 1, 1);

            reverse_key.splice(0, 0, reverse_key[reverse_key.length - 1]);
            reverse_key.splice(reverse_key.length - 1, 1);

            number.splice(0, 0, number[number.length - 1]);
            number.splice(number.length - 1, 1);

            this.redraw();
        }
    }

    this.keyDown = function() {
        if (this.key_in_move === false) {
            this.key_in_move = true;
            for (var i = 0; i < this.columnList.length; ++i) {
                var columnObject = this.columnList[i];
                var path =  new CAAT.LinearPath().setInitialPosition(columnObject.column.x, columnObject.column.y).setFinalPosition(columnObject.column.x, columnObject.container.height);
                columnObject.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(columnObject.column.time, 1000).setCycle(false);
                columnObject.column.addBehavior(columnObject.pb);
                objects_in_move.push(true);
            }
        }
    }

    var object = this;
    director.createTimer(this.container.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            for (var i = 0; i < object.msgColumn.columnList.length && objects_in_move.length > 0; ++i) {

                if (object.columnList[i].is_active === false) {
                    continue;
                }

                var column = object.msgColumn.columnList[i].column;

                var enemyColumn = object.columnList[i].column;
                var enemy = enemyColumn.AABB;

                if (enemy.y + enemy.height > column.y) {

                    object.columnList[i].stopMove();

                    var relativeColumnY = 0;
                    if (object.msgColumn.columnList[i].type === COLUMN_TYPE_3)
                        relativeColumnY = column.height;

                    enemyColumn.setLocation(column.x, column.y + relativeColumnY - enemy.height);

                    object.msgColumn.mergeColumns(i, object.columnList[i]);
                    objects_in_move.splice(0, 1);
                    object.columnList[i].setInactive();

                    if (objects_in_move.length == 0) {
                        crypt_key.createKey();
                        object.msgColumn.redraw();
                        object.msgColumn.clean();
                    }
                }
            }
        }
    );

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

