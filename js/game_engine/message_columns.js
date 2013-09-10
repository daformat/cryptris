function MessageColumn(director, type, initialNumber, container, boxOption) {
    this.type = type;
    this.boxOption = boxOption;
    this.squareNumber = initialNumber;
    this.container = container;
    this.blurSquareNumber = 0;
    this.lastType = type;

    this.column = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.column);

    this.gradient = null;
    this.blurGradient = null;

    this.keyType = COLUMN_TYPE_3;
    this.keyBlurGradient = null;
    this.keySquareNumber = 0;

    this.computeGradient = function() {
        if (this.type != COLUMN_TYPE_3) {
            this.gradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, this.boxOption.ColorLeft[this.type]);
            this.gradient.addColorStop(1, this.boxOption.Color[this.type]);
        } else {
            this.gradient = null;
        }
    }

    this.computeBlurGradient = function() {
        if (this.lastType != COLUMN_TYPE_3) {
            this.blurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.blurGradient.addColorStop(0, this.boxOption.blurColorLeft[this.lastType]);
            this.blurGradient.addColorStop(1, this.boxOption.blurColor[this.lastType]);
        } else {
            this.blurGradient = null;
        }
    }

    this.computeKeyBlurGradient = function() {
        if (this.keyType != COLUMN_TYPE_3) {
            this.keyBlurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.keyBlurGradient.addColorStop(0, this.boxOption.blurColorLeft[this.keyType]);
            this.keyBlurGradient.addColorStop(1, this.boxOption.blurColor[this.keyType]);
        } else {
            this.keyBlurGradient = null;
        }
    }

    this.redraw = function(x) {

        var columnY = this.container.height - this.boxOption.SQUARE_HEIGHT * this.squareNumber - this.boxOption.BORDER_HEIGHT - (this.squareNumber - 1) * this.boxOption.SPACE_HEIGHT;
        if (columnY > 0) {
            this.column.setLocation(x, columnY);
        } else {
            this.column.setLocation(x, this.boxOption.BORDER_HEIGHT + this.boxOption.SPACE_HEIGHT);
        }


        if (this.type === COLUMN_TYPE_3) {
            this.column.setSize(this.boxOption.COLUMN_WIDTH, this.boxOption.SPACE_HEIGHT);
            this.column.setLocation(x, this.container.height - this.boxOption.BORDER_HEIGHT);
        } else {
            this.column.setSize(this.boxOption.COLUMN_WIDTH, this.squareNumber * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) - this.boxOption.SPACE_HEIGHT);
        }

        this.computeGradient();
        this.computeBlurGradient();
        this.computeKeyBlurGradient();
        var object = this;

        this.column.paint = function(director, time) {

            if (this.isCached()) {
                CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
                return;
            }

            // Custom paint method.
            var ctx = director.ctx;
            var x = 1.5;
            ctx.lineWidth = 1;
            for (var i = 0; i < object.squareNumber; ++i) {

                var y = i * (boxOption.SQUARE_HEIGHT + boxOption.SPACE_HEIGHT) - 0.5;

                if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
                    break;
                }

                if (columnY > 0) {
                    object.boxOption.setDefaultColor();
                } else {
                    object.boxOption.setFullColor();
                }
                ctx.strokeStyle = object.boxOption.StrokeColor[object.type];
                ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);
                ctx.fillStyle = object.gradient;
                ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
            }

            var relativeY = object.squareNumber > 0 ? 0 : 1;
            var j = 1;
            for (j = 1; j <= object.blurSquareNumber; ++j) {
                var y = 0 - 0.5 - j * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
                    break;
                }

                ctx.strokeStyle = object.boxOption.blurStrokeColor[object.lastType];
                ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);
                ctx.fillStyle = object.blurGradient;
                ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
            }


            for (k = 0; k < object.keySquareNumber; ++k) {
                var y = 0 - 0.5 - (j + k) * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) {
                    break;
                }

                ctx.strokeStyle = object.boxOption.blurStrokeColor[object.keyType];
                ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);
                ctx.fillStyle = object.keyBlurGradient;
                ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
            }
        }

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
        this.redraw(this.column.x);
    }

    this.mergeColumns = function(column) {
        if (column.squareNumber > 0) {
            if (this.type === COLUMN_TYPE_3 || this.type === column.type) {
                this.addSquares(column);
            }
            else if (this.type !== column.type) {
                this.subSquares(column);
            }
        }
        this.redraw(this.column.x);
    }

    this.addSquares = function(column) {
        if (column.squareNumber > 0) {
            if (this.type === COLUMN_TYPE_3) {
                this.changeType(column.type);
                this.squareNumber = column.squareNumber;
            } else {
                this.squareNumber += column.squareNumber;
            }
            this.blurSquareNumber = 0;
        }
    }

    this.subSquares = function(keyColumn) {
        newSquareNumber = this.squareNumber - keyColumn.squareNumber;

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
    }
}

function Message(director, messageLength, message, container, boxOption) {
    this.length = messageLength;
    this.boxOption = boxOption;
    this.message = message;
    this.columnList = [];
    this.container = container;
    this.resolved = false;

    this.resetMessage = function(key) {
        for (var i = 0; i < this.columnList.length; ++i) {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.createMessage();
        key.reAssignColumns();
    }

    this.createMessage = function() {
        for (var i = 0; i < this.length; ++i) {
            this.columnList.push(new MessageColumn(director, this.message['message_type'][i], this.message['message_number'][i], container, this.boxOption));
        }
        this.redraw();
        return this;
    }

    this.redraw = function() {
        if (this.boxOption.objectsInMove.length === 0) {

            var max_column = this.columnList[0].squareNumber;
            for (var i = 1; i < this.columnList.length; ++i) {
                if (this.columnList[i].squareNumber > max_column) {
                    max_column = this.columnList[i].squareNumber;
                }
            }

            var newHeight = parseInt((container.height - 2 * this.boxOption.BORDER_HEIGHT) / (this.boxOption.maxKeyNumber + max_column)) - this.boxOption.SPACE_HEIGHT;
            if (newHeight > 20) {
                this.boxOption.SQUARE_HEIGHT = 20;
            }
            else if (newHeight < 1) {
                this.boxOption.SQUARE_HEIGHT = 1;
            } else {
                this.boxOption.SQUARE_HEIGHT = newHeight;
            }
        }

        for (var i = 0; i < this.columnList.length; ++i) {
            this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH));
        }
    }

    this.isResolved = function() {
        var tmpResolved = true;

        for (var i = 0; i < this.columnList.length; ++i) {
            if (this.columnList[i].squareNumber > 1) {
                tmpResolved = false;
            }
        }

        this.resolved = tmpResolved;
    }

}
