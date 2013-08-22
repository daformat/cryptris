/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/
function createBackButton(director, width, height, text, x, y, color) {
    var backButton = new CAAT.Actor().
        setSize(width, height).
        centerAt(x, y);

    backButton.paint = function(director) {

        var ctx = director.ctx;

        ctx.fillStyle = this.pointed ? 'orange' : color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = this.pointed ? 'red' : 'black';
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(text, 10, this.height / 2 + 5);
    };

    return backButton;
}

function createPlayScene(director) {
    /**
     * Create the dict to return.
     */
    var resultScene = {};

    /**
     * Define a TEMPORARY message.
     */
    var my_message = [COLUMN_TYPE_1, COLUMN_TYPE_2, COLUMN_TYPE_3, COLUMN_TYPE_3, COLUMN_TYPE_2, COLUMN_TYPE_1];

    /**
     * Position relative of the game box to the screen. 
     */
    var relativeX = 40;
    var relativeY = 10;
    var sizeWidth = $(window).width() - 400;
    var sizeHeight = $(window).height() - 40;

    /**
     * Create the game box.
     */
    resultScene['game_box'] = new CAAT.Foundation.ActorContainer()
                                        .setSize(sizeWidth, sizeHeight)
                                        .setFillStyle('rgb(199, 167, 192)')
                                        .setLocation(relativeX, relativeY);
    var gameBox = resultScene['game_box'];

    /**
     * Create a base line to our game box.
     */
    resultScene['bottom_line'] = new CAAT.ShapeActor().setLocation(gameBox.x, gameBox.y + gameBox.height)
                                                      .setSize(gameBox.width, 1)
                                                      .setFillStyle('#000000')
                                                      .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE);
    var bottomLine = resultScene['bottom_line'];

    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    var message = new Message(my_message, bottomLine, gameBox);
    message.createMessage();

    /**
     * Create my key object.
     * This object inserts all necessary columns to gameBox.
     */
    crypt_key = new Key(6, message, gameBox, bottomLine, director);
    crypt_key.createKey();

    /**
     * Create the play scene, and set the background color.
     */
    resultScene['scene'] = director.createScene().setFillStyle('rgb(144, 80, 131)');

    /**
     * Create each necessary button.
     */
    resultScene['back_button'] = createBackButton(director, 120, 40, "Back", director.width - 70, director.height - 100, "red");
    resultScene['up_button'] = createBackButton(director, 100, 100, "Up", director.width - 135, 70, "blue");
    resultScene['down_button'] = createBackButton(director, 100, 100, "Down", director.width - 135, 330, "blue");
    resultScene['left_button'] = createBackButton(director, 100, 100, "Left", director.width - 200, 200, "blue");
    resultScene['right_button'] = createBackButton(director, 100, 100, "Right", director.width - 70, 200, "blue");

    /**
     * If the button acts in this scene, we set its behavior.
     */
    resultScene['up_button'].mouseClick = function(e) {
        crypt_key.changeKeyType();
    };
    resultScene['down_button'].mouseClick = function(e) {
        crypt_key.keyDown();
    };
    resultScene['left_button'].mouseClick = function(e) {
        crypt_key.rotateLeft();
    };
    resultScene['right_button'].mouseClick = function(e) {
        crypt_key.rotateRight();
    };

    /**
     * Add each element to its scene.
     */
    resultScene['scene'].addChild(resultScene['game_box']);
    resultScene['scene'].addChild(resultScene['bottom_line']);
    resultScene['scene'].addChild(resultScene['back_button']);
    resultScene['scene'].addChild(resultScene['up_button']);
    resultScene['scene'].addChild(resultScene['down_button']);
    resultScene['scene'].addChild(resultScene['left_button']);
    resultScene['scene'].addChild(resultScene['right_button']);

    return resultScene;
}
