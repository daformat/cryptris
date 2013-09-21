
function GameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player)
{
    this.director = director;
    this.boxOption = boxOption;
    this.relativeX = relativeX;
    this.relativeY = relativeY;
    this.current_length = current_length;
    this.key_info = key_info;
    this.my_message = my_message;
    this.player = player;

    this.sizeWidth = function()
    {
        console.log(this.boxOption.SPACE_WIDTH + " - " + DEFAULT_SQUARE_WIDTH);
        return this.current_length * (this.boxOption.SPACE_WIDTH + DEFAULT_COLUMN_WIDTH) - this.boxOption.SPACE_WIDTH + 2 * this.boxOption.BORDER_WIDTH;
    }

    this.sizeHeight = function()
    {
        return this.director.height - this.relativeY - 100;
    }

    /**
     * Create the game box.
     */
    this.gameBox = new CAAT.Foundation.ActorContainer()
                                    .setSize(this.sizeWidth(), this.sizeHeight())
                                    .setFillStyle('rgba(0, 113, 187, 0.2)')
                                    .setLocation(relativeX, relativeY);
	this.gameBox.cacheAsBitmap();
	

    this.columnList = [];
    /**
     * Create each column and set their color.
     */
    for (var i = 0; i < current_length; ++i)
    {
        var column = new CAAT.ShapeActor().setSize(DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setLocation(this.boxOption.BORDER_WIDTH + i * (DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT);
	    column.cacheAsBitmap();
        this.gameBox.addChild(column);
        this.columnList.push(column);
    }
	
    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    this.message = new Message(director, current_length, my_message, this.gameBox, boxOption);
    this.message.createMessage();

    /**
     * Create my key object.
     * This object inserts all necessary columns to gameBox.
     */
    this.crypt_key = new Key(key_info, current_length, this.message, this.gameBox, director, boxOption, player);
    this.crypt_key.createKey();
    this.message.redraw();
    this.crypt_key.firstRedraw();

    this.resize = function()
    {
        this.gameBox.setSize(this.sizeWidth(), this.sizeHeight())
                    .setLocation(this.relativeX, this.relativeY);

        for (var i = 0; i < this.columnList.length; ++i)
        {
            this.columnList[i].setSize(DEFAULT_COLUMN_WIDTH, this.gameBox.height - 2 * this.boxOption.BORDER_HEIGHT)
                              .setLocation(this.boxOption.BORDER_WIDTH + i * (DEFAULT_COLUMN_WIDTH + this.boxOption.SPACE_WIDTH), this.boxOption.BORDER_HEIGHT)
	                          .cacheAsBitmap();
        }
	    
	    this.gameBox.stopCacheAsBitmap();
	    this.gameBox.cacheAsBitmap();

        if (this.crypt_key.keyInMove !== true && this.crypt_key.keyFirstMove !== true)
        {
            //this.message.redraw();
            this.crypt_key.redraw();
        }
    }

    return this;
}
