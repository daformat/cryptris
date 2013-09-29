$(document).ready(function() {
    CAAT.registerKeyListener(function (key) {
        if (key.getKeyCode() === CAAT.Keys.a && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.b && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.e && key.getAction() === 'down') {
            if (currentGame.keyIsPregenerated === true) {
                ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);
            }
        }
        if (key.getKeyCode() === CAAT.Keys.r && key.getAction() === 'down') {

                
                            // Make a key to appear.
                            createKeyScene = currentGame.scenes.create_key_scene.scene;
                            gameBox = currentGame.scenes.create_key_scene.game_box.gameBox;
                            gameBoxInfo = currentGame.scenes.create_key_scene.game_box;


        }
    });
});