$(document).ready(function() {
    CAAT.registerKeyListener(function (key) {
        if (key.getKeyCode() === CAAT.Keys.a && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.b && key.getAction() === 'down') {

            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_min_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.e && key.getAction() === 'down') {
            if (currentGame.keyIsPregenerated === true) {
                ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);
            }
        }
        if (key.getKeyCode() === CAAT.Keys.r && key.getAction() === 'down') {
            preparePlayScene(currentGame.director, MIN_BOARD_LENGTH, 'play_min_scene', FIRST_MESSAGE);
        }
    });
});
