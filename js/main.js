
tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    app.replaceScene(GameScene());

    var stats = new Stats();
    // 右上に設定
    stats.getDomElement().style.position = "fixed";
    stats.getDomElement().style.left     = "5px";
    stats.getDomElement().style.top      = "5px";
    document.body.appendChild(stats.getDomElement());

    app.update = function() {
        stats.update();
    };

    app.run();

});