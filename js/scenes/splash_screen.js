/**
 * This function creates all necessary actors to display the splash screen.
 * @param director {CAAT.Director}
 * @param showtime {int}
 * @param sceneCreationCallback {Callback}
 */
function createSplashScene(director, showtime, sceneCreationCallback) {

    /**
     * Retrieve the splash image assets.
     */
    var spinnerImg = director.getImage('spinner');
    var splashImg =  director.getImage('splash');

    /**
     * Create the scene to display the splash screen.
     */
    var scene = director.createScene();

    /**
     * Set temporary background color.
     */
     scene.setFillStyle('rgb(189, 162, 129)');

    /**
     * Get the current time to handle the display time.
     */
    var time = new Date().getTime();

    /**
     * Add the background of the splash screen.
     * TODO: Set more images to create a diaporama ('inria' -> 'digital cuisine')
     */
    if (splashImg) {
        scene.addChild(
            new CAAT.Foundation.Actor().
                setBackgroundImage(splashImg, false).
                setBounds((director.width - splashImg.width) / 2, (director.height - splashImg.height) / 2, director.width, director.height)
        );
    }

    /**
     * Add the spinner image, and make it to rotate.
     */
    if (spinnerImg) {
        scene.addChild(
            new CAAT.Foundation.Actor().
                setBackgroundImage(spinnerImg).
                centerAt(scene.width/2, scene.height/2).
                addBehavior(
                    new CAAT.Behavior.RotateBehavior().
                        setValues(0,2 * Math.PI).
                        setFrameTime(0, 1000).
                        setCycle(true)
                )
        );
    }

    /**
     * Load the images and set the callback to call after splash screen.
     */
    scene.loadedImage = function(count, images) {
        if (!images || count === images.length) 
        {

            /**
             * Calculate the remaining time display. 
             */
            var difftime = new Date().getTime() - time;
            if (difftime < showtime) 
            {
                difftime = Math.abs(showtime - difftime);
                if (difftime > showtime) 
                {
                    difftime = showtime;
                }
	            
                setTimeout(function() {
                        endSplash(director, images, sceneCreationCallback);
                    },
                    difftime);

            } 
            else
            {
                endSplash(director, images, sceneCreationCallback);
            }

        }
    };

    return scene;
}
            
/**
 * Finish splash process by either timeout or resources allocation end.
 * @param {CAAT.Director}
 * @param {Array}
 * @param {Callback}
 */
function endSplash(director, images, onEndSplashCallback) {
    director.emptyScenes();
    director.setImagesCache(images);

    onEndSplashCallback(director);

    /**
     * Change this sentence's parameters to play with different entering-scene
     * curtains.
     * just perform a director.setScene(0) to play first director's scene.
     */
    director.setClear(CAAT.Foundation.Director.CLEAR_ALL);

    director.easeIn(
        0,
        CAAT.Foundation.Scene.EASE_SCALE,
        0,
        false,
        CAAT.Foundation.Actor.ANCHOR_CENTER,
        new CAAT.Behavior.Interpolator().createElasticOutInterpolator(0, 0)
    );
}
