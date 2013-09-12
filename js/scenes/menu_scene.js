/**
 * Define information for each button.
 */
var infoPlayButton = new infoButton(0, -60, "Nouvelle partie", 150, 30, true, "black", "white", "royalblue");
var infoCreditsButton = new infoButton(0, 0, "En savoir plus", 150, 30, true, "black", "white", "royalblue");
var infoSeeMoreButton = new infoButton(0, 60, "Credits", 150, 30, true, "black", "white", "royalblue");
var shortcutButton = new infoButton(0, 120, "ShortCut", 150, 30, true, "black", "white", "royalblue");

var mainTitleRelativeY = -150;

/**
 * Define a button class.
 */
function infoButton (x, y, text, textX, textY, isFill, strokeColor, fillColor, hoverFillColor) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.textX = textX;
    this.textY = textY;
    this.isFill = isFill;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.hoverFillColor = hoverFillColor;
}

/**
 * This function creates a square with rounded edges.
 * @param context {Canvas.context} canvas rendering context.
 * @param x {number}
 * @param y {number}
 * @param w {number}
 * @param h {number}
 * @param radius {number}
 * @param isFill {boolean}
 * @param strokeColor {string}
 * @param fillColor {string}
 * @param hoverFillColor {string}
 * @param button {CAAT.Actor}
 */
function roundRect(context, x, y, w, h, radius, isFill, strokeColor, fillColor, hoverFillColor, button) {
    /**
     * Define r(ight) and b(ottom) belong to x, w, y and h.
     */
    var r = x + w;
    var b = y + h;

    context.beginPath();
    context.strokeStyle = strokeColor;
    context.lineWidth = "4";

    context.moveTo(x + radius, y);
    context.lineTo(r - radius, y);
    context.quadraticCurveTo(r, y, r, y + radius);

    context.lineTo(r, y + h - radius);
    context.quadraticCurveTo(r, b, r - radius, b);

    context.lineTo(x + radius, b);
    context.quadraticCurveTo(x, b, x, b - radius);

    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);

    context.stroke();

    if (isFill) {
        context.fillStyle = button.pointed ? hoverFillColor : fillColor;
        context.fill();
    }
}

/**
 * Create each menu button.
 * @param director {CAAT.director}
 * @param infoButton {infoButton}
 */
function createMenuButton(director, infoButton) {
    var button = new CAAT.Actor().
        setSize(300, 40).
        centerAt(director.width / 2, director.height / 2 + infoButton.y);

    button.paint = function(director, time) {

        /**
         * Get the current context.
         */
        var ctx = director.ctx;

        /**
         * Create the button.
         */
        roundRect(ctx, infoButton.x, 0, this.width, this.height, 20, infoButton.isFill, infoButton.strokeColor, infoButton.fillColor, infoButton.hoverFillColor, button);

        /**
         * Set the text of the button.
         */
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(infoButton.text, infoButton.x + infoButton.textX, infoButton.textY);

    };

    return button;
}

/**
 * Create the actor for the main Title of the menu screen.
 * @param director {CAAT.director}
 * @param relativeY {number} It depends of the number of buttons.
 */
function createMainTitle(director, relativeY) {
    /**
     * Create the actor and center it.
     */
    var mainTitle = new CAAT.Actor().
        centerAt(director.width / 2, director.height / 2 + relativeY);

    /**
     * Paint the title.
     */
    mainTitle.paint = function(director, time) {
        var ctx = director.ctx;

        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText("CRYPTRIS", 0, 0);
    };

    return mainTitle;
}

/**
 * Function to resize the menu scene.
 */
function resizeMenuScene(director, menuScene) {
    if (director.height > 400) {
        menuScene['mainTitle'].centerAt(director.width / 2, director.height / 2 + mainTitleRelativeY);
        menuScene['playButton'].centerAt(director.width / 2, director.height / 2 + infoPlayButton.y);
        menuScene['creditButton'].centerAt(director.width / 2, director.height / 2 + infoCreditsButton.y);
        menuScene['seeMoreButton'].centerAt(director.width / 2, director.height / 2 + infoSeeMoreButton.y);
        menuScene['shortcutButton'].centerAt(director.width / 2, director.height / 2 + shortcutButton.y);
    } else {
        menuScene['mainTitle'].setLocation((director.width - menuScene['mainTitle'].width) / 2, 50);
        menuScene['playButton'].setLocation((director.width - menuScene['playButton'].width) / 2, 100);
        menuScene['creditButton'].setLocation((director.width - menuScene['creditButton'].width) / 2, 150);
        menuScene['seeMoreButton'].setLocation((director.width - menuScene['seeMoreButton'].width) / 2, 200);
        menuScene['shortcutButton'].setLocation((director.width - menuScene['shortcutButton'].width) / 2, 250);
    }
}

/**
 * This function creates all necessary actors to display the menu screen.
 * @param director {CAAT.Director}
 */
function createMenuScene(director) {

    /**
     * Create the dict to return.
     */
     var resultScene = {};

    /**
     * Create the menu scene, and set the background color.
     */
    resultScene['scene'] = director.createScene();

    /**
     * Create the main title Actor.
     */
    resultScene['mainTitle'] = createMainTitle(director, mainTitleRelativeY);

    /**
     * Create each necessary button.
     */
    resultScene['playButton'] = createMenuButton(director, infoPlayButton);
    resultScene['creditButton'] = createMenuButton(director, infoCreditsButton);
    resultScene['seeMoreButton'] = createMenuButton(director, infoSeeMoreButton);

    /**
     * Register our resize function.
     */
    resultScene['resize'] = resizeMenuScene;

    /**
     * Create a temporary button for test.
     */
    resultScene['shortcutButton'] = createMenuButton(director, shortcutButton);


    /**
     * Add each element to its scene.
     */
    resultScene['scene'].addChild(resultScene['mainTitle']);
    resultScene['scene'].addChild(resultScene['playButton']);
    resultScene['scene'].addChild(resultScene['creditButton']);
    resultScene['scene'].addChild(resultScene['seeMoreButton']);
    resultScene['scene'].addChild(resultScene['shortcutButton']);


    return resultScene;
}
