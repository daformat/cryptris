

/**
 *  TODO
 */


$(document).ready(function() {
    CAAT.registerKeyListener(function (key) {
        if (key.getKeyCode() === CAAT.Keys.a && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
        }
        if (key.getKeyCode() === CAAT.Keys.b && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_min_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_min_scene.rival_box.boxOption.timeInfo = rivalPMinSceneTime;
            currentGame.scenes.play_min_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_min_scene);
            currentGame.playMinSceneActive = true;
        }
        if (key.getKeyCode() === CAAT.Keys.c && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_medium_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_medium_scene.rival_box.boxOption.timeInfo = rivalPMediumSceneTime;
            currentGame.scenes.play_medium_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_medium_scene);
            currentGame.playMediumSceneActive = true;
        }
        if (key.getKeyCode() === CAAT.Keys.d && key.getAction() === 'down') {
            currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['play_max_scene']['scene']), 0, 0, false);
            currentGame.scenes.play_max_scene.rival_box.boxOption.timeInfo = rivalPMaxSceneTime;
            currentGame.scenes.play_max_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_max_scene);
            currentGame.playMaxSceneActive = true;
        }
        if (key.getKeyCode() === CAAT.Keys.e && key.getAction() === 'down') {
                ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);
        }
        if (key.getKeyCode() === CAAT.Keys.r && key.getAction() === 'down') {
            currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_BATTLE_MESSAGE);
            preparePlayScene(currentGame.director, MIN_BOARD_LENGTH, 'play_min_scene', currentGame.play_min_scene_msg, 'playMinSceneActive', true);
            currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_BATTLE_MESSAGE);
            preparePlayScene(currentGame.director, MEDIUM_BOARD_LENGTH, 'play_medium_scene', currentGame.play_medium_scene_msg, 'playMediumSceneActive', true);
            currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_BATTLE_MESSAGE);
            preparePlayScene(currentGame.director, MAX_BOARD_LENGTH, 'play_max_scene', currentGame.play_max_scene_msg, 'playMaxSceneActive', true);
        }
    });
});
