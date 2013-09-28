$(document).ready(function() {
    CAAT.registerKeyListener(function (key) {
        if (key.getKeyCode() === CAAT.Keys.a && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
            currentGame.playSceneActive = false;
            currentGame.createKeySceneActive = true;
        }
        if (key.getKeyCode() === CAAT.Keys.b && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_scene']['scene']), 0, 0, false);
            currentGame.playSceneActive = true;
            currentGame.createKeySceneActive = false;
        }
    });
});