function Bar(x, y, ang, spring, w, l)
{
        this.super = Mover.prototype;
        this.super.constructor.apply(this, [x, y, ang, spring]);
        this.w = w;
        this.l = l;
}

Bar.prototype = Object.create(Mover.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        rotate(this.ang);
        rectMode(CENTER);
        rect(0, 0, this.w, this.l);
        pop();
}
