
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





var GameScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function() {
        this.superInit();

        /*
        var bgm = tm.sound.SoundManager.get("bgm");
        bgm.loop = true;
        bgm.play();
        */

        for (var i=0; i<32; ++i) {
            var size = tm.util.Random.randint(8, 16);
            var bgStar = BGStar(size).addChildTo(this);
            bgStar.x = tm.util.Random.randint(0, SCREEN_WIDTH);
            bgStar.y = tm.util.Random.randint(0, SCREEN_HEIGHT);
        }

        this.scoreLabel = tm.app.Label();
        this.scoreLabel.align = "right";
        this.scoreLabel.addChildTo(this).setPosition(SCREEN_WIDTH-10, 30);
        this.scoreLabel.width = 200;

        this.player = Player().addChildTo(this);
        this.player.x = SCREEN_CENTER_X;
        this.player.y = SCREEN_HEIGHT-80;
    },

    update: function(app) {
        if (app.frame % 4 == 0) {
            this.player.shot(app.currentScene);
        }

        if (app.frame % 60 == 0) {
            for (var i=0; i<5; ++i) {
                var enemy = Enemy().addChildTo(this);
                var x = SCREEN_CENTER_X + ENEMY_POS_OFFSET*(i-2);
//                enemy.x = tm.util.Random.randint(0, SCREEN_WIDTH);
                enemy.x = x;
                enemy.y = -100;
            }
        }

        // プレイヤーと敵
        for (var i=0, len=Enemy.list.length; i<len; ++i) {
            var enemy = Enemy.list[i];
            if (this.player.isHitElement(enemy)) {
                app.stop();
                break;
            }
        }

        // プレイヤーとアイテム
        for (var i=0, len=Item.list.length; i<len; ++i) {
            var item = Item.list[i];
            if (this.player.isHitElement(item)) {
                item.giveEffect(this.player);
                item.destroy = true;
                break;
            }
        }

        for (var i=0, len=Enemy.list.length; i<len; ++i) {
            var enemy = Enemy.list[i];
            if (enemy.life <= 0) continue ;

            for (var j=0, len2=Bullet.list.length; j<len2; ++j) {
                var bullet = Bullet.list[j];
                if (bullet.destroy <= 0) continue ;
                if (enemy.isHitElement(bullet)) {
                    enemy.life -= bullet.power;
                    bullet.life -= 1;
                }
            }
       }

       this.scoreLabel.text = app.frame + " km";
    },
});

var BGStar = tm.createClass({
    superClass: tm.app.Shape,

    init: function(size) {
        this.superInit(size, size);

        this.canvas.globalCompositeOperation = "lighter";
        var colorAngle = tm.util.Random.randint(0, 360);
        this.canvas.fillStyle = "hsla({0}, 75%, 75%, 0.5)".format(colorAngle);
        this.canvas.setTransformCenter();
        this.canvas.fillStar(0, 0, size/2, 4, 0.5);
        this.canvas.fillStar(0, 0, size/2*0.5, 4, 0.5);

        this.speed = size/2;
        this.offset = tm.util.Random.randint(0, 360);
    },

    update: function(app) {
        this.y += this.speed;

        this.alpha = (Math.sin(Math.degToRad((app.frame+this.offset)*10))+1)/2;

        if (this.y > SCREEN_HEIGHT+20) {
            this.y = -20;
        }

        this.time++;
    }
});





var Player = tm.createClass({
    superClass: tm.app.Sprite,

    init: function() {
        this.superInit(PLAYER_SIZE, PLAYER_SIZE, PLAYER_IMAGE);
        /*
        this.superInit(50, 50, {
            fillStyle: "rgba(200, 200, 200, 0.9)",
        });
*/
        this.level = 0;

        this.move = this.moveByPointing;
    },

    update: function(app) {
        this.move(app);

        var left = this.width/2;
        var right = SCREEN_WIDTH - this.width/2;

        if (this.x < left) this.x = left;
        else if (this.x > right) this.x = right;
    },

    moveByPointing: function(app) {
        var p = app.pointing;
        if (p.getPointing()) {
            this.x += p.deltaPosition.x*1.5;
        }
    },

    moveByAccel: function(app) {
        var a = app.accelerometer;
        var gravity = a.gravity;
        this.x += gravity.x*4;
//        this.x = ((gravity.x+1)*100)|0;
    },

    shot: function(scene) {
        switch (this.level) {
            case 0 :
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x, this.y-30);
                break;
            case 1 :
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x-20, this.y-5);
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x+20, this.y-5);
                break;
            case 2 :
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x, this.y-30);
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x-20, this.y-5);
                Bullet().addChildTo(this).addChildTo(scene).setPosition(this.x+20, this.y-5);
                break;
            default :
                assert(false);
                break;
        }

    }
})

var Bullet = tm.createClass({
    superClass: tm.app.Sprite,

    init: function() {
        this.superInit(BULLET_SIZE, BULLET_SIZE, BULLET_IMAGE);
        Bullet.list.push(this);

        this.power = 1;
        this.life  = 1;
    },
    update: function() {
        this.y -= 16;

        if (this.y < 0 || this.life <= 0) {
            this.remove();
            Bullet.list.erase(this);
        }
    }
});
Bullet.list = [];




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


var Item = tm.createClass({
    superClass: tm.app.Shape,

    init: function() {
        this.superInit(32, 32);
        this.v = tm.geom.Vector2.random(225, 315, 8);
        Item.list.push(this);
    },

    update: function() {
        this.v.y += 0.25;
        this.position.add(this.v);

        var left = this.width/2;
        var right = SCREEN_WIDTH - this.width/2;

        if (this.x < left) {
            this.x = left;
            this.v.x *= -1;
        }
        else if (this.x > right) {
            this.x = right;
            this.v.x *= -1;
        }

        if (this.destroy) {
            this.remove();
            Item.list.erase(this);
        }
    },

    giveEffect: function() {

    }
});
Item.list = [];


var Coin = tm.createClass({
    superClass: Item,

    init: function() {
        this.superInit();

        this.canvas.setTransformCenter();
        this.canvas.scale(0.8, 1.0);
        this.canvas.setFillStyle("yellow").fillCircle(0, 0, 6);
        this.canvas.setLineStyle(2).setStrokeStyle("white").strokeCircle(0, 0, 6);
    }
});

var Star = tm.createClass({
    superClass: Item,

    init: function() {
        this.superInit();

        this.canvas.setTransformCenter();
        this.canvas.setFillStyle("yellow").fillStar(0, 0, 15, 5);
        this.canvas.setLineStyle(2).setStrokeStyle("white").strokeStar(0, 0, 15, 5);
    },

    giveEffect: function(player) {
        player.level = Math.min(player.level+1, PLAYER_LEVEL_MAX);
    }
});
