function MessageColumn(director, type, initialNumber, container, boxOption) {
    this.type = type;
    this.boxOption = boxOption;
    this.squareNumber = initialNumber;
    this.container = container;

    this.column = new CAAT.Foundation.ActorContainer();
    this.saveChild = [];

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

    this.redraw = function(x) {

        var columnY = this.container.height - this.boxOption.SQUARE_HEIGHT * this.squareNumber - this.boxOption.BORDER_HEIGHT - (this.squareNumber - 1) * this.boxOption.SPACE_HEIGHT;

        if (columnY > 0) {
            this.column.setLocation(x, columnY);
        } else {
            this.column.setLocation(x, 0);
        }

        var squareNumber = this.squareNumber;
        var type = this.type;
        this.computeGradient();
        var gradient = this.gradient;
        var boxOption = this.boxOption;

        if (this.type === COLUMN_TYPE_3) {
            this.column.setSize(this.boxOption.COLUMN_WIDTH, this.boxOption.SQUARE_HEIGHT);
            this.column.setLocation(x, this.container.height - this.boxOption.SQUARE_HEIGHT - this.boxOption.BORDER_HEIGHT);
        } else {
            this.column.setSize(this.boxOption.COLUMN_WIDTH, this.squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) - this.boxOption.SPACE_HEIGHT);
        }
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

    this.changeType = function(newType) {
    	this.type = newType;
    	this.fillColor = this.boxOption.Color[newType];
        this.computeGradient();
        this.redraw();
    }

    this.addSquares = function(squareNumber, type) {
        if (squareNumber > 0) {
            if (this.type === COLUMN_TYPE_3) {
                this.type = type;
                this.squareNumber = squareNumber;
            } else {
                this.squareNumber += squareNumber;
            }
        }
    }

    this.subSquares = function(squareNumber, type) {
        newSquareNumber = this.squareNumber - squareNumber;

        if (newSquareNumber === 0) {
            this.changeType(COLUMN_TYPE_3);
            this.squareNumber = 0;
        } else {
            if (newSquareNumber > 0) {
                this.squareNumber = newSquareNumber;
            } else {
                this.squareNumber = (-1) * newSquareNumber;
                this.changeType(type);
            }
        }
    }
}

function Message(director, messageLength, message, container, boxOption) {
    this.length = messageLength;
    this.boxOption = boxOption;
    this.message = message;
    this.columnList = [];
    this.container = container;

    this.createMessage = function() {
        for (var i = 0; i < this.length; ++i) {
            this.columnList.push(new MessageColumn(director, this.message['message_type'][i], this.message['message_number'][i], container, this.boxOption));
        }
        this.redraw();
        return this;
    }

    this.mergeColumns = function(index, column) {
        if (column.squareNumber > 0) {
            if (this.columnList[index].type === COLUMN_TYPE_3 || this.columnList[index].type === column.type) {
                this.addSquaresAtColumn(index, column.squareNumber, column.type);
            }
            else if (this.columnList[index].type !== column.type) {
                this.subSquaresAtColumn(index, column.squareNumber, column.type);
            }
        }
        this.redraw();
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
        //Todo : Calculate the max key number;
        if (this.boxOption.objectsInMove.length === 0) {
            var maxKeyNumber = 20;
            var max_column = this.columnList[0].squareNumber;
            for (var i = 1; i < this.columnList.length; ++i) {
                if (this.columnList[i].squareNumber > max_column) {
                    max_column = this.columnList[i].squareNumber;
                }
            }

            var newHeight = parseInt((container.height - 2 * this.boxOption.BORDER_HEIGHT) / (maxKeyNumber + max_column)  - this.boxOption.SPACE_HEIGHT);
            if (newHeight > 20) {
                this.boxOption.SQUARE_HEIGHT = 20;
            }
            else {
                this.boxOption.SQUARE_HEIGHT = newHeight;
            }
        }

        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH));
        }
    }
}
