
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
