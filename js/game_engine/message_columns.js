function MessageColumn(director, type, initialNumber, container) {
    this.type = type;
    this.initialNumber = initialNumber;
    this.shapeList = [];
    this.container = container;

    this.column = new CAAT.Foundation.ActorContainer().setSize(SQUARE_WIDTH, SQUARE_HEIGHT);
    this.saveChild = [];

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

    for (var i = 0; i < initialNumber; ++i) {
        this.computeGradient();
        this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(this.gradient)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle(StrokeColor[this.type]));
        this.column.addChild(this.shapeList[this.shapeList.length - 1]);
    }

    this.redraw = function(x, relativeY) {
        var columnY = this.container.height - relativeY - SQUARE_HEIGHT * this.shapeList.length - BORDER_HEIGHT - (this.shapeList.length - 1) * SPACE_HEIGHT;

        if (columnY > 0) {
            this.column.setLocation(x, columnY);
        } else {
            this.column.setLocation(x, 0);
        }
        for (var i = 0; i < this.shapeList.length; ++i) {
            if (columnY > 0) {
                this.shapeList[i].setLocation(0, i * (SQUARE_HEIGHT + SPACE_HEIGHT));
            } else {
                if (this.container.height - BORDER_HEIGHT - i * (SQUARE_HEIGHT + SPACE_HEIGHT) >  this.container.y) {
                    this.shapeList[i].setLocation(0, this.container.height - (BORDER_HEIGHT + SQUARE_HEIGHT) - i * (SQUARE_HEIGHT + SPACE_HEIGHT));
                } else {
                    this.shapeList[i].setLocation(0, BORDER_HEIGHT);
                }
            }
        }
    }

    this.changeType = function(newType) {
    	this.type = newType;
    	this.fillColor = Color[newType];
        this.computeGradient();
        for (var i = 0; i < this.shapeList.length; ++i) {
            this.shapeList[i].setFillStyle(this.gradient);
        }
    }

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
        this.computeGradient();
        for (var i = referent; i < referent + numberSquare; ++i) {
            this.shapeList.push(new CAAT.ShapeActor().setSize(SQUARE_WIDTH, SQUARE_HEIGHT)
                                                 .setFillStyle(this.gradient)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle(StrokeColor[this.type]));
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

function Message(director, messageLength, message, bottomLine, container) {
    this.length = messageLength;
    this.message = message;
    this.columnList = [];
    this.bottomLine = bottomLine;
    this.container = container;

    this.createMessage = function() {
        for (var i = 0; i < this.length; ++i) {
            this.columnList.push(new MessageColumn(director, this.message['message_type'][i], this.message['message_number'][i], container));
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
            this.columnList[i].redraw(i * (SQUARE_WIDTH + SPACE_WIDTH) + SPACE_WIDTH, bottomLine.height);
        }
    }

    this.clean = function() {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].clean();
        }
    }
}
