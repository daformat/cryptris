var SQUARE_WIDTH = 40;
var SQUARE_HEIGHT = 20;

var COLUMN_TYPE_1 = 'red';
var COLUMN_TYPE_2 = 'blue';
var COLUMN_TYPE_3 = 'unknown';
var COLOR_TYPE_1 = '#FF0000';
var COLOR_TYPE_2 = '#0000FF';

var KEY_TYPE_1 = 'public';
var KEY_TYPE_2 = 'private';

var crypt_key = null;
var objects_in_move = [];

function createBackButton(director) {
    var backButton = new CAAT.Actor().
        setSize(120, 40).
        centerAt(director.width - 70, director.height - 100);

    backButton.paint = function(director, time) {

        var ctx = director.ctx;

        ctx.fillStyle = this.pointed ? 'orange' : 'red';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = this.pointed ? 'red' : 'black';
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Back', 25, 30);


    };

    return backButton;
}

function KeyColumn(type, squareNumber, msgColumn, container) {
    this.type = type;
    this.shapeList = [];
    this.fillColor = null;
    this.container = container;
    this.is_active = true;
    this.pb = null;
    this.object_in_move = false;

    this.column = new CAAT.Foundation.ActorContainer().setSize(SQUARE_WIDTH, squareNumber * SQUARE_HEIGHT);//.setFillStyle('#00FF00');
    this.container.addChild(this.column);

    if (this.type === COLUMN_TYPE_1) {
        this.fillColor = COLOR_TYPE_1;
    } else {
        this.fillColor = COLOR_TYPE_2;
    }

    for (var i = 0; i < squareNumber; ++i) {
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(this.fillColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle('#000000'));
        this.column.addChild(this.shapeList[i]);
    }

    this.redraw = function(x) {
        this.column.setLocation(x, 0);
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setLocation(0, i * SQUARE_HEIGHT);
        }
    }

    this.stopMove = function() {
        this.pb.setOutOfFrameTime();
    }

    this.changeType = function() {
        if (this.type === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_2;
            this.fillColor = COLOR_TYPE_2;
        } else if (this.type === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_1;
            this.fillColor = COLOR_TYPE_1;
        }

        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(this.fillColor);
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


function MessageColumn(type, container) {
    this.type = type;
    this.shapeList = [];
    this.fillColor = null;
    this.container = container;

    this.column = new CAAT.Foundation.ActorContainer().setSize(SQUARE_WIDTH, SQUARE_HEIGHT);

    this.container.addChild(this.column);

    if (this.type === COLUMN_TYPE_1) {
        this.fillColor = COLOR_TYPE_1;
    } else if (this.type == COLUMN_TYPE_2) {
        this.fillColor = COLOR_TYPE_2;
    }

    if (this.type === COLUMN_TYPE_3) {
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE));
                                                 //.setStrokeStyle('#000000'));
        this.column.addChild(this.shapeList[this.shapeList.length - 1]);
    } else {
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(this.fillColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle('#000000'));
        this.column.addChild(this.shapeList[this.shapeList.length - 1]);
    }

    this.redraw = function(x, relativeY) {
        this.column.setLocation(x, this.container.height - relativeY - SQUARE_HEIGHT * this.shapeList.length);
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setLocation(0, i * SQUARE_HEIGHT);
        }
    }

    this.changeType = function(newType) {
        if (newType === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_1;
            this.fillColor = COLOR_TYPE_1;
        } else if (newType === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_2;
            this.fillColor = COLOR_TYPE_2;
        } else if (newType === COLUMN_TYPE_3) {
            this.type = COLUMN_TYPE_3;
            this.fillColor = null;
        }
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(this.fillColor);
        }
    }

    this.switchType = function() {
        if (this.type === COLUMN_TYPE_1) {
            this.type = COLUMN_TYPE_2;
            this.fillColor = COLOR_TYPE_2;
        } else if (this.type === COLUMN_TYPE_2) {
            this.type = COLUMN_TYPE_1;
            this.fillColor = COLOR_TYPE_1;
        }
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(this.fillColor);
        }
    }

    this.saveChild = [];

    this.clean = function() {
        for (var i = 0; i < this.saveChild.length; ++i) {
            this.column.removeChild(this.saveChild[i]);
        }
    }

    this.addSquares = function(numberSquare, type) {
        if (numberSquare > 0 && this.type === COLUMN_TYPE_3) {
            this.saveChild = this.shapeList;
            this.shapeList = [];
            this.changeType(type);
        }
        var referent = this.shapeList.length;
        for (var i = referent; i < referent + numberSquare; ++i) {
            this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(this.fillColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle('#000000'));
            this.column.addChild(this.shapeList[i]);
        }
    }

    this.subSquares = function(numberSquare, type) {
        newSquareNumber = this.shapeList.length - numberSquare;
        if (newSquareNumber === 0) {
            this.changeType(COLUMN_TYPE_3);
            this.saveChild = this.shapeList;
            this.shapeList = [];
            this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE));
                                                 //.setStrokeStyle('#000000'));
            this.column.addChild(this.shapeList[this.shapeList.length - 1]);
        } else {
            if (newSquareNumber < 0) {
                newSquareNumber = newSquareNumber * (-1);
                this.changeType(type);
            }
            this.saveChild = this.shapeList;
            this.shapeList = [];
            this.addSquares(newSquareNumber, type);
        }
    }
}


function Message(message, bottomLine, container) {
    this.message = message;
    this.columnList = [];
    this.bottomLine = bottomLine;
    this.container = container;

    this.createMessage = function() {
        for (var i = 0; i < this.message.length; ++i) {
            this.columnList.push(new MessageColumn(this.message[i], container));
        }
        this.redraw();
        return this;
    }

    this.mergeColumns = function(index, column) {
        if (column.shapeList.length > 0) {
            if (this.columnList[index].type === COLUMN_TYPE_3) {
                this.addSquaresAtColumn(index, column.shapeList.length, column.type);
            }
            else if (this.columnList[index].type === column.type) {
                this.addSquaresAtColumn(index, column.shapeList.length, column.type);
            }
            else if (this.columnList[index].type !== column.type) {
                this.subSquaresAtColumn(index, column.shapeList.length, column.type);
            }
        }
    }

    this.subSquaresAtColumn = function(index, numberSquare, type) {
        this.columnList[index].subSquares(numberSquare, type);
        return this;
    }

    this.addSquaresAtColumn = function(index, numberSquare, type) {
        this.columnList[index].addSquares(numberSquare, type);
        return this;
    }

    this.redraw = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(i * SQUARE_WIDTH, bottomLine.height);
        }
    }

    this.clean = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].clean();
        }
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
    var tmp_number = [6, 4, 3, 0, 1, 2];

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

            for (var i = 0; i < object.msgColumn.columnList.length; ++i) {

                if (object.columnList[i].is_active === false) {
                    continue;
                }

                var column = object.msgColumn.columnList[i].column;

                var enemyColumn = object.columnList[i].column;
                var enemy = enemyColumn.AABB;

                if (enemy.y + enemy.height - 5 >= column.y &&
                    enemy.y + enemy.height - 5 <= column.y + column.height &&
                    enemy.x >= column.x &&
                    enemy.x <= column.x + column.width) {

                    object.columnList[i].stopMove();
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
        if (key.getKeyCode() === CAAT.Keys.UP && key.getAction() === 'up') {
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



function createPlayScene(director) {

    var relativeX = 40;
    var relativeY = 10;

    var container = new CAAT.Foundation.ActorContainer().
        setSize($(window).width() - 400, $(window).height() - 40).
        setFillStyle('rgb(199, 167, 192)').
        setLocation(relativeX, relativeY);
    var bottom = container.height - 20;

    var bottomLine = new CAAT.ShapeActor().setLocation(container.x, container.y + container.height - 10)
                            .setSize(container.width, 10)
                            .setFillStyle('#000000')
                            .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE);

    var my_message = [COLUMN_TYPE_1, COLUMN_TYPE_2, COLUMN_TYPE_3, COLUMN_TYPE_3, COLUMN_TYPE_2, COLUMN_TYPE_1];
    var message = new Message(my_message, bottomLine, container);
    message.createMessage();

    crypt_key = new Key(6, message, container, bottomLine, director);
    crypt_key.createKey();

    var playScene = director.createScene().setFillStyle('rgb(144, 80, 131)');

    playScene.addChild(container);
    playScene.addChild(bottomLine);

    var backButton = createBackButton(director, false);
    backButton.mouseClick= function(e) {
        director.switchToPrevScene(
            2000,
            false,
            false
        );
    };

    playScene.addChild(backButton);

    return {'scene' : playScene};
}
