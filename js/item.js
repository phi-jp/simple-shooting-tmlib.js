
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
