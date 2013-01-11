
var SCREEN_WIDTH    = 465;
var SCREEN_HEIGHT   = 465;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var PLAYER_LEVEL_MAX= 2;
var PLAYER_SIZE     = 50;
var PLAYER_IMAGE    = null;
var ENEMY_SIZE      = 80;
var ENEMY_IMAGE     = null;
var ENEMY_POS_OFFSET= 90;
var BULLET_SIZE     = 12;
var BULLET_IMAGE    = null;

tm.preload(function() {
    PLAYER_IMAGE = tm.graphics.Canvas().resize(PLAYER_SIZE, PLAYER_SIZE).setTransformCenter()
        .setColorStyle("white", "rgba(200, 200, 200, 0.9)").setLineStyle(4.0)
        .fillPolygon(0, 0, PLAYER_SIZE/2, 3).strokePolygon(0, 0, PLAYER_SIZE/2, 3);

    ENEMY_IMAGE = tm.graphics.Canvas().resize(ENEMY_SIZE, ENEMY_SIZE).setTransformCenter()
        .setColorStyle("white", "red").setLineStyle(4.0)
        .fillStar(0, 0, ENEMY_SIZE/2, 16, 0.6).strokeStar(0, 0, ENEMY_SIZE/2, 16, 0.6);

    BULLET_IMAGE = tm.graphics.Canvas().resize(BULLET_SIZE+4, BULLET_SIZE+4).setTransformCenter()
        .setColorStyle("white", "#444").setLineStyle(2.0)
        .fillCircle(0, 0, BULLET_SIZE/2).strokeCircle(0, 0, BULLET_SIZE/2);

    tm.sound.SoundManager.add("bgm", "bgm/Loop_35.wav", 1);
    tm.sound.SoundManager.add("crash", "se/crash.wav");
});
