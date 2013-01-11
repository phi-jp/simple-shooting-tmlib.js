

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
