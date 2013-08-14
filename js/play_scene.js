
function createBackButton(director) {
    var backButton = new CAAT.Actor().
        setSize(120, 40).
        centerAt(director.width - 70, director.height - 30);

    backButton.paint = function(director, time) {

        var ctx = director.ctx;

        ctx.fillStyle = this.pointed ? 'orange' : 'red';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = this.pointed ? 'red' : 'black';
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Back', 25, 30);


    };

    return backButton;
}

function squareActor(director, x, y, width, height, fillColor, strokeColor, container, is_key, enemies) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.container = container;

    this.shape = new CAAT.ShapeActor().setLocation(this.x, this.y)
            .setSize(this.width, this.height)
            .setFillStyle(this.fillColor)
            .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
            .setStrokeStyle(this.strokeColor);

    this.container.addChild(this.shape);

    var rect_move = true;
    var shape = this.shape;


    if (is_key === true) {

        var path = null;
        var pb = null;

        CAAT.registerKeyListener(function(key) {
            if (key.getKeyCode() === CAAT.Keys.DOWN && key.getAction() === 'up' && rect_move) {
                path =  new CAAT.LinearPath().setInitialPosition(x, y).setFinalPosition(x, container.height - 20 + y);
                pb = new CAAT.PathBehavior().setPath(path).setFrameTime(shape.time, 1000).setCycle(false);
                shape.addBehavior(pb);
                rect_move = false;
            }
        });

        director.createTimer(container.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {

                var hash = new CAAT.Module.Collision.SpatialHash().initialize(container.width, container.height, 10, 16 );

                for (i = 0; i < enemies.length; i++) {
                    var enemy_is_touched = false;
                    hash.clearObject();

                    var enemy = enemies[i].shape.AABB;

                    hash.addObject( {
                        id          : enemies[i].shape.getId(),
                        x           : enemy.x - container.x,
                        y           : enemy.y - container.y,
                        width       : enemy.width,
                        height      : enemy.height,
                        rectangular : true
                    });

                    hash.collide(shape.x, shape.y + 2, shape.width, shape.height + 1,
                        function(collide_width) {
                            if (enemy_is_touched === false) {
                                if (fillColor !== enemies[i].fillColor) {
                                    container.removeChild(enemies[i].shape);
                                    container.removeChild(shape);
                                    enemies.splice(i, 1);
                                }
                                else {
                                    shape.setLocation(enemies[i].x, enemies[i].y - enemies[i].height);
                                    pb.setOutOfFrameTime();
                                }
                                enemy_is_touched = true;
                            }
                            return true;
                        }
                    );
                }
            }
        );
    }
}



function createPlayScene(director) {

    var relativeX = 40;
    var relativeY = 10;

    var container = new CAAT.Foundation.ActorContainer().
        setSize($(window).width() - 400, $(window).height() - 40).
        setFillStyle('rgb(199, 167, 192)').
        setLocation(relativeX, relativeY);
    var bottom = container.height - 20;
/*
    var keyColumns = [];
    var msgColumns = [];

    var length = 5;

    for (var i = 0; i < length; i++) {
        var new_column = new CAAT.Foundation.ActorContainer().
                            setFillStyle('rgb(100, 100, 100)').
                            setStrokeStyle('rgb(0, 0, 255').
                            setLocation(0, i * 40);
        keyColumns.push(new_column);
    }*/

    //var rect3 = new squareActor(director, 40, bottom - 20, 40, 20, '#00FF00', '#000000', keyColumns[0], false, null);
    /*
    for (var i = 0; i < keyColumns.length; i++) {
        container.addChild(keyColumns[i]);
    }*/

    var playScene = director.createScene().setFillStyle('rgb(144, 80, 131)');


    var rect3 = new squareActor(director, 40, bottom - 20, 40, 20, '#00FF00', '#000000', container, false, null);
    var rect5 = new squareActor(director, 40, bottom, 40, 20, '#00FF00', '#000000', container, false, null);

    var enemies = [];
    enemies.push(rect3);
    enemies.push(rect5);

    var rect1 = new squareActor(director, 0, 0, 40, 20, '#0000FF', '#000000', container, true, enemies);
    var rect2 = new squareActor(director, 40, 20, 40, 20, '#0000FF', '#000000', container, true, enemies);
    var rect4 = new squareActor(director, 40, 0, 40, 20, '#00FF00', '#000000', container, true, enemies);


    playScene.addChild(container);

    var backButton = createBackButton(director, false);
    backButton.mouseClick= function(e) {
        director.switchToPrevScene(
            2000,
            false,
            false
        );
    };

    playScene.addChild(backButton);

    return {'scene' : playScene};
}
