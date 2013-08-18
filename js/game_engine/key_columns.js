function KeyColumn(type, squareNumber, msgColumn, container) {
    this.type = type;
    this.shapeList = [];
    this.container = container;
    this.is_active = true;
    this.pb = null;
    this.object_in_move = false;

    this.column = new CAAT.Foundation.ActorContainer().setSize(SQUARE_WIDTH, squareNumber * SQUARE_HEIGHT);//.setFillStyle('#00FF00');
    this.container.addChild(this.column);

    for (var i = 0; i < squareNumber; ++i) {
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(Color[this.type])
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
        } else {

            alert(this.column.y);
        }
    }

    this.changeType = function() {
        if (this.type === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_2;
        } else if (this.type === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_1;
        }

        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(Color[this.type]);
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


function Key(keyLength, msgColumn, container, bottomLine, director) {
    this.type = KEY_TYPE_1;
    this.length = keyLength;
    this.columnList = [];
    this.msgColumn = msgColumn;
    this.container = container;
    this.bottomLine = bottomLine;

    var tmp_key = [COLUMN_TYPE_1, COLUMN_TYPE_2, COLUMN_TYPE_2, COLUMN_TYPE_1, COLUMN_TYPE_2, COLUMN_TYPE_1];
    var tmp_private_key = [COLUMN_TYPE_2, COLUMN_TYPE_1, COLUMN_TYPE_1, COLUMN_TYPE_2, COLUMN_TYPE_1, COLUMN_TYPE_2];
    var tmp_number = [1, 4, 3, 0, 1, 2];

    this.createKey = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.key_in_move = false;

        for (var i = 0; i < this.length; ++i) {
            if (this.type === KEY_TYPE_1) {
                this.columnList.push(new KeyColumn(tmp_key[i], tmp_number[i], msgColumn, container));
            } else if (this.type === KEY_TYPE_2) {
                this.columnList.push(new KeyColumn(tmp_private_key[i], tmp_number[i], msgColumn, container));
            }
            if (tmp_number[i] == 0) {
                this.columnList[i].column.setSize(SQUARE_WIDTH, SQUARE_HEIGHT / 2);
            }
        }

        this.redraw();
        return this;
    }

    this.redraw = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(i * SQUARE_WIDTH);
        }
    }

    this.changeKeyType = function() {
        if (this.key_in_move === false) {
            if (this.type === KEY_TYPE_1) {
                this.type = KEY_TYPE_2;
            } else {
                this.type = KEY_TYPE_1;
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

            tmp_key.push(tmp_key[0]);
            tmp_key.splice(0,1);

            tmp_private_key.push(tmp_private_key[0]);
            tmp_private_key.splice(0,1);

            tmp_number.push(tmp_number[0]);
            tmp_number.splice(0, 1);

            this.redraw();
        }
    }

    this.rotateRight = function() {
        if (this.key_in_move === false) {
            this.columnList.splice(0, 0, this.columnList[this.columnList.length - 1]);
            this.columnList.splice(this.columnList.length - 1, 1);

            tmp_key.splice(0, 0, tmp_key[tmp_key.length - 1]);
            tmp_key.splice(tmp_key.length - 1, 1);

            tmp_private_key.splice(0, 0, tmp_private_key[tmp_private_key.length - 1]);
            tmp_private_key.splice(tmp_private_key.length - 1, 1);

            tmp_number.splice(0, 0, tmp_number[tmp_number.length - 1]);
            tmp_number.splice(tmp_number.length - 1, 1);

            this.redraw();
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

    var object = this;
    this.key_in_move = false;
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
        if (key.getKeyCode() === CAAT.Keys.DOWN && key.getAction() === 'up' && object.key_in_move === false) {
            object.key_in_move = true;
            for (var i = 0; i < object.columnList.length; ++i) {
                var columnObject = object.columnList[i];
                var path =  new CAAT.LinearPath().setInitialPosition(columnObject.column.x, columnObject.column.y).setFinalPosition(columnObject.column.x, columnObject.container.height);
                columnObject.pb = new CAAT.PathBehavior().setPath(path).setFrameTime(columnObject.column.time, 1000).setCycle(false);
                columnObject.column.addBehavior(columnObject.pb);
                objects_in_move.push(true);
            }
        }
    });
}

