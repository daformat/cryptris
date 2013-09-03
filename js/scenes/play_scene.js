/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

/**
 * This function create the button we use in this scene.
 * @param director {CAAT.Director}
 * @param width {number}
 * @param height {number}
 * @param text {string}
 * @param x {number}
 * @param y {number}
 * @param color {string}
 */
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

function display_debug_message(director, boxOption, gameBox, current_length, message, container) {
    for (var i = 0; i < current_length; ++i) {

        var type = null;
        var initialNumber = 0;
        var gradient = null;

        if (message[i] == -1) {
            type = COLUMN_TYPE_2;
            initialNumber = 1;
        } else if (message[i] == 0) {
            type = COLUMN_TYPE_3;
            initialNumber = 0;
        } else {
            type = COLUMN_TYPE_1;
            initialNumber = 1;
        }

        if (type != COLUMN_TYPE_3) {
            gradient = director.ctx.createLinearGradient(0, 0, boxOption.SQUARE_WIDTH, 0);
            gradient.addColorStop(0, boxOption.ColorLeft[type]);
            gradient.addColorStop(1, boxOption.Color[type]);
        }

        for (var j = 0; j < initialNumber; ++j) {
            var shape = new CAAT.ShapeActor().setSize(boxOption.SQUARE_WIDTH, boxOption.SQUARE_HEIGHT)
                                                 .setFillStyle(gradient)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle(boxOption.StrokeColor[type])
                                                 .setLocation(gameBox.x + i * (boxOption.SPACE_WIDTH + boxOption.SQUARE_WIDTH) + boxOption.SPACE_WIDTH, gameBox.y + gameBox.height + 30);
            container.addChild(shape);
        }
    }
}

function createGameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player) {
    var sizeWidth = current_length * (boxOption.SPACE_WIDTH + boxOption.COLUMN_WIDTH) - boxOption.SPACE_WIDTH + 2 * boxOption.BORDER_WIDTH;
    var sizeHeight = $(window).height() - 100;

    /**
     * Create the game box.
     */
    var gameBox = new CAAT.Foundation.ActorContainer()
                                    .setSize(sizeWidth, sizeHeight)
                                    .setFillStyle('rgba(0, 113, 187, 0.2)')
                                    .setLocation(relativeX, relativeY)
                                    .enableEvents(false);

    /**
     * Create each column and set their color.
     */
    for (var i = 0; i < current_length; ++i) {
        var column = new CAAT.ShapeActor().setSize(boxOption.COLUMN_WIDTH, gameBox.height - 2 * boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setLocation(boxOption.BORDER_WIDTH + i * (boxOption.COLUMN_WIDTH + boxOption.SPACE_WIDTH), boxOption.BORDER_HEIGHT);
        gameBox.addChild(column);
    }

    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    var message = new Message(director, current_length, my_message, gameBox, boxOption);
    message.createMessage();

    /**
     * Create my key object.
     * This object inserts all necessary columns to gameBox.
     */
    var crypt_key = new Key(key_info, current_length, message, gameBox, director, boxOption, player);
    crypt_key.createKey();
    message.redraw();

    return {'game_box' : gameBox, 'crypt_key' : crypt_key, 'message' : message};
}

function handle_ia(director, rivalBoxInfo) {
    var is_launched = false;

    director.createTimer(this.container.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            var enumeration = [];
            var message = rivalBoxInfo['message'];
            var key = rivalBoxInfo['crypt_key'];

            for (var i = 0; i < message.length; ++i) {
                enumeration.push(-2);
            }

            if (message.boxOption.objectsInMove.length === 0) {
                key.changeKeyType();
                key.rotateLeft();
                key.keyDown();
            }
        }
    );
}


/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createPlayScene(director) {
    /**
     * Create the dict to return.
     */
    var resultScene = {};

    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = parseInt(getQuerystring("n", 8));

    /**
     * Generate my private and public keys.
     */
     var key_info_t = getKeyInfo(current_length);

    /**
     * Define a TEMPORARY message.
     */
    var tmp_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_message.push(Math.floor(Math.random() * 3 - 1));
    }
    var my_message = chiffre(current_length, tmp_message, key_info_t['public_key']['key']);

    /**
     * Position relative of the game box to the screen. 
     */
    var gameBoxInfo = createGameBox(director, new GameBoxOption(), 40, 30, current_length, key_info_t['private_key'], my_message, true);
    var crypt_key = gameBoxInfo['crypt_key'];
    resultScene['game_box'] = gameBoxInfo['game_box'];

    var rivalBoxInfo = createGameBox(director, new RivalBoxOption(), 80 + resultScene['game_box'].width, 30, current_length, key_info_t['public_key'], my_message, false);
    resultScene['rival_box'] = rivalBoxInfo['game_box'];

    /*
     * Call the IA script.
     */
    handle_ia(director, rivalBoxInfo);

    /**
     * Create the play scene, and set the background Image (see main.js => Image assets").
     */
    resultScene['scene'] = director.createScene();

    /**
     * Display our message for debug.
     */
    display_debug_message(director, new GameBoxOption(), resultScene['game_box'], current_length, tmp_message, resultScene['scene']);

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
    resultScene['scene'].addChild(resultScene['rival_box']);
    resultScene['scene'].addChild(resultScene['back_button']);
    resultScene['scene'].addChild(resultScene['up_button']);
    resultScene['scene'].addChild(resultScene['down_button']);
    resultScene['scene'].addChild(resultScene['left_button']);
    resultScene['scene'].addChild(resultScene['right_button']);

    return resultScene;
}


function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}
