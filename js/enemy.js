

var Enemy = tm.createClass({
    superClass: tm.app.Sprite,

    init: function() {
        this.superInit(ENEMY_SIZE, ENEMY_SIZE, ENEMY_IMAGE);
        Enemy.list.push(this);

        this.life = 2;
    },
    update: function(app) {
        this.y += 8;
        this.rotation += 8;

        if (this.y > SCREEN_HEIGHT+50 || this.life <= 0) {
            this.remove();
            Enemy.list.erase(this);

            if (this.life <= 0) {
                var crash = Crash();
                crash.position.set(this.x, this.y);
                crash.addChildTo(app.currentScene);
                tm.sound.SoundManager.get("crash").play();

                // アイテム
                if (tm.util.Random.randint(0, 100) < 10) {
                    Star().setPosition(this.x, this.y).addChildTo(app.currentScene);
                }
            }
        }
    }
});
Enemy.list = [];



var Crash = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function() {
        this.superInit();

        this.timer = 30;
        
        var self = this;
        for (var i=0; i<16; ++i) {
            var particle = tm.app.Sprite(20, 20, ENEMY_IMAGE);
            particle.v = tm.geom.Vector2.random(0, 360, 2);
            particle.blendMode = "lighter";
            particle.update = function() {
                this.x += this.v.x;
                this.y += this.v.y;
                this.v.mul(0.95);
                this.alpha = (self.timer/30.0);
            }
            this.addChild(particle);
        }
    },
    update: function() {
        this.timer -= 1;
        if (this.timer <= 0) {
            this.remove();
        }
    },
    onanimationend: function() {
        this.remove();
    }
});