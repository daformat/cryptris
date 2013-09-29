$(document).ready(function() {
    CAAT.registerKeyListener(function (key) {
        if (key.getKeyCode() === CAAT.Keys.a && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.b && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_min_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_min_scene.rival_box.boxOption.timeInfo = rivalPMinSceneTime;
        }
        if (key.getKeyCode() === CAAT.Keys.c && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_medium_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_medium_scene.rival_box.boxOption.timeInfo = rivalPMediumSceneTime;
        }
        if (key.getKeyCode() === CAAT.Keys.d && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_max_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_max_scene.rival_box.boxOption.timeInfo = rivalPMaxSceneTime;
        }
        if (key.getKeyCode() === CAAT.Keys.e && key.getAction() === 'down') {
            if (currentGame.keyIsPregenerated === true) {
                ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);
            }
        }
        if (key.getKeyCode() === CAAT.Keys.r && key.getAction() === 'down') {
            preparePlayScene(currentGame.director, MIN_BOARD_LENGTH, 'play_min_scene', FIRST_BATTLE_MESSAGE, 'playMinSceneActive', true);
            preparePlayScene(currentGame.director, MEDIUM_BOARD_LENGTH, 'play_medium_scene', SECOND_BATTLE_MESSAGE, 'playMediumSceneActive', true);
            preparePlayScene(currentGame.director, MAX_BOARD_LENGTH, 'play_max_scene', THIRD_BATTLE_MESSAGE, 'playMaxSceneActive', true);
        }
    });
});
