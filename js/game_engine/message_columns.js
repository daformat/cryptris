function blockToDestroy(director, msgType, keyType, x, y, squareNumber, keyNumber, msgNumber, container, boxOption)
{
    this.director = director;
    this.x = x;
    this.y = y;
    this.squareNumber = squareNumber;
    this.keyNumber = keyNumber;
    this.msgNumber = msgNumber;
    this.container = container;
    this.boxOption = boxOption;
    this.column = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.column);
    this.isMsgContaminated = false;

    this.msgType = msgType;
    this.keyType = keyType;
    this.blurGradient = null;
    this.keyBlurGradient = null;
    this.isVisible = true;

    this.computeBlurGradient = function()
    {
        if (this.msgType != COLUMN_TYPE_3)
        {
            this.blurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.blurGradient.addColorStop(0, this.boxOption.blurColorLeft[this.msgType]);
            this.blurGradient.addColorStop(1, this.boxOption.blurColor[this.msgType]);
        }
        else
        {
            this.blurGradient = null;
        }
    }

    this.computeKeyBlurGradient = function()
    {
        if (this.keyType != COLUMN_TYPE_3)
        {
            this.keyBlurGradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.keyBlurGradient.addColorStop(0, this.boxOption.blurColorLeft[this.keyType]);
            this.keyBlurGradient.addColorStop(1, this.boxOption.blurColor[this.keyType]);
        }
        else
        {
            this.keyBlurGradient = null;
        }
    }

    this.redraw = function()
    {
	    var height = (this.keyNumber + this.msgNumber) * (this.boxOption.SQUARE_HEIGHT + this.boxOption.SPACE_HEIGHT) + 1; 
        var columnY = this.y - height;

        this.column.setSize(this.boxOption.COLUMN_WIDTH, height);

        if (columnY > this.boxOption.BORDER_HEIGHT)
        {
            this.column.setLocation(this.x, columnY);
        }
        else
        {
            this.column.setLocation(this.x, this.boxOption.BORDER_HEIGHT);
        }
        this.computeBlurGradient();
        this.computeKeyBlurGradient();

        var object = this;
        var beginTime = $.now();
	    
        this.column.paint = function(director, time)
        {
            var relativeY = object.squareNumber > 0 ? 0 : 1;
            var j = 1;

	        var ctx = director.ctx;
            var x = 1.5;

            var clearTime = 250;

            ctx.lineWidth = 1;

	        var delta = $.now() - beginTime;
            if (delta <= 2 * clearTime) 
            {
                ctx.globalAlpha = 1 - delta / (clearTime * 2);
	            
	            // -- Disappearing message blocks
	            // Set drawing styles before the loop                                                                               
	            ctx.strokeStyle = object.boxOption.blurStrokeColor[object.keyType];
	            ctx.fillStyle = object.keyBlurGradient;
	            
                for (j = 1; j <= object.msgNumber; ++j)
                {
                    var y = object.column.height - 0.5 - j * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                    if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) 
                    {
                        break;
                    }

                    ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);                    
                    ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
                }
	            
	            // -- Disappearing key blocks
                for (k = 0; k < object.keyNumber; ++k) 
                {
                    var y = object.column.height - 0.5 - (j + k) * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                    if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) 
                    {
                        break;
                    }
                    
                    ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);                    
                    ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
                }
	            
	            
                if (delta <= clearTime) 
                {      
                    ctx.globalAlpha = 1 - delta / clearTime;
	                ctx.strokeStyle = object.boxOption.blurStrokeColor[object.msgType];
	                ctx.fillStyle = object.blurGradient;

                    for (j = 1; j <= object.msgNumber; ++j)
                    {
                        var y = object.column.height - 0.5 - j * (object.boxOption.SQUARE_HEIGHT + object.boxOption.SPACE_HEIGHT) + relativeY * object.boxOption.SPACE_HEIGHT;

                        if (y > object.container.height - 2 * object.boxOption.BORDER_HEIGHT) 
                        {
                            break;
                        }
                                                
                        ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);                        
                        ctx.fillRect(x + 0.5, y + 0.5, object.boxOption.SQUARE_WIDTH - 1, object.boxOption.SQUARE_HEIGHT - 1);
                    }
                }      
            } 
            else 
            {
                ctx.globalAlpha = 0;
                object.isVisible = false;
            }
        }
    }
}

function MessageColumn(director, type, initialNumber, container, boxOption)
{
    this.type = type;
    this.director = director;
    this.boxOption = boxOption;
    this.squareNumber = initialNumber;
    this.container = container;
    this.blurSquareNumber = 0;
    this.lastType = type;

    this.column = new CAAT.Foundation.ActorContainer();
    this.container.addChild(this.column);

    this.displayValueHexa = new CAAT.Foundation.Actor();
    this.container.addChild(this.displayValueHexa);
    this.displayValue = new CAAT.Foundation.Actor();
    this.container.addChild(this.displayValue);

    this.gradient = null;
    this.blurGradient = null;

    this.keyType = COLUMN_TYPE_3;
    this.keyBlurGradient = null;
    this.keySquareNumber = 0;
    this.blockToDestroy = null;

    this.computeGradient = function()
    {
        if (this.type != COLUMN_TYPE_3)
        {
            this.gradient = director.ctx.createLinearGradient(0, 0, this.boxOption.SQUARE_WIDTH, 0);
            this.gradient.addColorStop(0, this.boxOption.ColorLeft[this.type]);
            this.gradient.addColorStop(1, this.boxOption.Color[this.type]);
        }
        else
        {
            this.gradient = null;
        }
    }



	var object = this;
	var signe = "";
	if (this.type === COLUMN_TYPE_1)
    {
		signe = "-";
	}

	this.displayValueHexa.paint = function(director, time)
    {
		if(this.isCached())
		{
			CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
			return;
		}

		var ctx = director.ctx;

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 5;
		ctx.shadowColor = object.boxOption.numberGrow;

		ctx.font = '15px Inconsolata';
		ctx.fillStyle = object.boxOption.numberColor;
		ctx.textAlign = 'center';
		ctx.fillText(signe + "0x" + object.squareNumber.toString(16).toUpperCase(), this.width / 2, 11);
	}

	this.displayValueHexa.setSize(this.boxOption.SQUARE_WIDTH, 15);
	this.displayValueHexa.cacheAsBitmap();


	this.displayValue.paint = function(director, time)
    {
		if(this.isCached())
		{
			CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
			return;
		}

		var ctx = director.ctx;

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 5;
		ctx.shadowColor = '#00FF9D';

		ctx.font = '12px Inconsolata';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		ctx.fillText("(" + signe + object.squareNumber + ")", this.width / 2, 11);
	}

	this.displayValue.setSize(this.boxOption.SQUARE_WIDTH, 15);
	this.displayValue.cacheAsBitmap();


	this.column.paint = function(director, time)
    {
		if (this.isCached()) 
		{
			CAAT.Foundation.ActorContainer.prototype.paint.call(this, director, time);
			return;
		}

		// Custom paint method.
		var ctx = director.ctx;
		var x = 1.5;
		ctx.lineWidth = 1;

		ctx.strokeStyle = object.boxOption.StrokeColor[object.type];
		ctx.fillStyle = object.gradient;

		for (var i = 0; i < object.squareNumber; ++i) 
		{
			var y = object.column.height - object.boxOption.SQUARE_HEIGHT - i * (boxOption.SQUARE_HEIGHT + boxOption.SPACE_HEIGHT);

			if (y < 0)
            {
				break;
			}

			ctx.fillRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);
			ctx.strokeRect(x, y, object.boxOption.SQUARE_WIDTH, object.boxOption.SQUARE_HEIGHT);			
		}
		
		object.boxOption.setDefaultColor();
	}
	
    this.redraw = function(x, invalidate /* = false */)
    {
	    // Don't invalidate drawing by default
	    if(invalidate === null)
	    {
		    invalidate = false;
	    }
	    
        /**
         * Set message display.
         */
        this.displayValueHexa.setLocation(x, this.container.height + 15).setSize(this.boxOption.SQUARE_WIDTH, 15);
	    this.displayValueHexa.stopCacheAsBitmap();
	    this.displayValueHexa.cacheAsBitmap();
	    
	    this.displayValue.setLocation(x, this.displayValueHexa.y + this.displayValueHexa.height).setSize(this.boxOption.SQUARE_WIDTH, 15);
	    this.displayValue.stopCacheAsBitmap();
	    this.displayValue.cacheAsBitmap();

	    this.columnSize = this.boxOption.SQUARE_HEIGHT * this.squareNumber + (this.squareNumber - 1) * this.boxOption.SPACE_HEIGHT;


        if (this.columnSize <= object.container.height - 2 * object.boxOption.BORDER_HEIGHT) 
        {
            object.boxOption.setDefaultColor();
        } 
        else 
        {
            object.boxOption.setFullColor();
        }

	    if (this.type === COLUMN_TYPE_3)
	    {
		    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.boxOption.SPACE_HEIGHT);
		    this.column.setLocation(x, this.container.height - this.boxOption.BORDER_HEIGHT);
	    }
	    else
	    {
		    if (this.columnSize <= this.container.height - 2 * this.boxOption.BORDER_HEIGHT)
		    {
			    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.columnSize);
			    this.column.setLocation(x, this.container.height - this.boxOption.BORDER_HEIGHT - this.columnSize);
		    }
            else
		    {
			    this.column.setSize(this.boxOption.COLUMN_WIDTH, this.container.height - 2 * this.boxOption.BORDER_HEIGHT);
			    this.column.setLocation(x, this.boxOption.BORDER_HEIGHT);
		    }
	    }
	    
        this.computeGradient();
	    
        if (this.blurSquareNumber > 0 || this.keySquareNumber > 0) 
        {
	        this.column.stopCacheAsBitmap();
            this.blockToDestroy = new blockToDestroy(this.director, this.lastType, this.keyType, this.column.x, this.column.y, this.squareNumber, this.keySquareNumber, this.blurSquareNumber, this.container, this.boxOption);
            this.blockToDestroy.redraw();
            this.blurSquareNumber = 0;
            this.keySquareNumber = 0;
        }
	    else if (!this.column.isCached() || invalidate)
        {
	        if(invalidate)
	        {
		        this.column.stopCacheAsBitmap();
	        }
	        
	        this.column.cacheAsBitmap();
        }
    }

    this.changeType = function(newType)
    {
        if (this.type === COLUMN_TYPE_3) 
        {
            if (newType === COLUMN_TYPE_1) 
            {
                this.lastType = COLUMN_TYPE_2;
            } 
            else 
            {
                this.lastType = COLUMN_TYPE_1;
            }
        } 
        else 
        {
            this.lastType = this.type;
        }
	    
    	this.type = newType;
	    this.column.stopCacheAsBitmap();
	    
        this.redraw(this.column.x);
    }

    this.mergeColumns = function(column) 
    {
        if (column.squareNumber > 0) 
        {
            if (this.type === COLUMN_TYPE_3 || this.type === column.type) 
            {
                this.addSquares(column);
            }
            else if (this.type !== column.type) 
            {
                this.subSquares(column);
            }
        }
	    
        this.redraw(this.column.x);
    }

    this.addSquares = function(column)
    {
        if (column.squareNumber > 0)
        {
            if (this.type === COLUMN_TYPE_3) 
            {
                this.changeType(column.type);
                this.squareNumber = column.squareNumber;
            }
            else 
            {
                this.squareNumber += column.squareNumber;
	            this.redraw(this.column.x, true);
            }
	        
            this.blurSquareNumber = 0;
        }
    }

    this.subSquares = function(keyColumn)
    {
        newSquareNumber = this.squareNumber - keyColumn.squareNumber;

        if (newSquareNumber < 0) 
        {
            this.keySquareNumber = this.squareNumber;
            this.keyType = keyColumn.type;
            keyColumn.pathContinue = true;
            keyColumn.squareNumber = newSquareNumber * (-1);
            keyColumn.redraw(keyColumn.column.x, keyColumn.column.y);
            this.blurSquareNumber = this.squareNumber;
            this.squareNumber = 0;
            this.changeType(COLUMN_TYPE_3);
        }
        else if (newSquareNumber === 0) 
        {
            this.changeType(COLUMN_TYPE_3);
            this.squareNumber = 0;
            this.blurSquareNumber = keyColumn.squareNumber;
            this.keySquareNumber = keyColumn.squareNumber;
            this.keyType = keyColumn.type;
        }
        else 
        {
            this.keySquareNumber = keyColumn.squareNumber;
            this.keyType = keyColumn.type;
            this.squareNumber = newSquareNumber;
            this.blurSquareNumber = keyColumn.squareNumber;
        }
	    
        keyColumn = null;
    }
}

function Message(director, messageLength, message, container, boxOption)
{
    this.length = messageLength;
    this.boxOption = boxOption;
    this.message = message;
    this.columnList = [];
    this.container = container;
    this.resolved = false;

    this.resetMessage = function(key)
    {
        for (var i = 0; i < this.columnList.length; ++i)
        {
            this.container.removeChild(this.columnList[i].column);
        }
        this.columnList = [];
        this.createMessage();
        key.reAssignColumns();
    }

    this.createMessage = function()
    {
        for (var i = 0; i < this.length; ++i) 
        {
            this.columnList.push(new MessageColumn(director, this.message['message_type'][i], this.message['message_number'][i], container, this.boxOption));
        }
        this.redraw();
        return this;
    }

    this.redraw = function()
    {
        if (this.boxOption.objectsInMove.length === 0) 
        {
	        var oldSquareHeight = this.boxOption.SQUARE_HEIGHT;
	        
            this.boxOption.SQUARE_WIDTH = DEFAULT_SQUARE_WIDTH;
            this.boxOption.COLUMN_WIDTH = DEFAULT_COLUMN_WIDTH;

            var max_column = this.columnList[0].squareNumber;
            for (var i = 1; i < this.columnList.length; ++i) 
            {
                if (this.columnList[i].squareNumber > max_column)
                {
                    max_column = this.columnList[i].squareNumber;
                }
            }

            if (this.boxOption.SPACE_HEIGHT === 4) 
            {
                var newHeight = parseInt((container.height - 2 * this.boxOption.BORDER_HEIGHT) / (this.boxOption.maxKeyNumber + max_column)) - this.boxOption.SPACE_HEIGHT;
                if (newHeight > 20) 
                {
                    this.boxOption.SQUARE_HEIGHT = 20;
                    this.boxOption.SPACE_HEIGHT = 4;
                }
                else if (newHeight <= 1) 
                {
                    this.boxOption.SQUARE_HEIGHT = 1;
                    this.boxOption.SPACE_HEIGHT = 2;
                }
                else 
                {
                    this.boxOption.SQUARE_HEIGHT = newHeight;
                }
            } 
            else 
            {
                this.boxOption.SPACE_HEIGHT = 4;
                var newHeight = parseInt((container.height - 2 * this.boxOption.BORDER_HEIGHT) / (this.boxOption.maxKeyNumber + max_column)) - this.boxOption.SPACE_HEIGHT;

                if (newHeight <= 1) 
                {
                    this.boxOption.SPACE_HEIGHT = 2;
                } 
                else 
                {
                    this.boxOption.SQUARE_HEIGHT = newHeight;
                }
            }
        }

        for (var i = 0; i < this.columnList.length; ++i) 
        {
	        var invalidate = (oldSquareHeight != this.boxOption.SQUARE_HEIGHT);
            this.columnList[i].redraw(this.boxOption.BORDER_WIDTH + i * (this.boxOption.COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), invalidate);
        }
    }

    this.isResolved = function()
    {
        var tmpResolved = true;

        for (var i = 0; i < this.columnList.length; ++i)
        {
            if (this.columnList[i].squareNumber > 1) 
            {
                tmpResolved = false;
            }
        }
	    
        this.resolved = tmpResolved;
    }
}
