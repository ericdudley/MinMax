function Mover(x, y, ang, spring)
{
        this.x = x;
        this.dx = x;
        this.y = y;
        this.dy = y;
        this.ang = ang;
        this.dang = ang;
        this.spring = spring;
}

Mover.prototype.moveTo = function(x, y, ang){
        this.dx = x;
        this.dy = y;
        this.dang = ang;
}

Mover.prototype.update = function(){
        var scalar = this.spring;
        this.x += (this.dx-this.x)*scalar;
        this.y += (this.dy-this.y)*scalar;
        this.ang += (this.dang-this.ang)*scalar;
}

Mover.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        rotate(this.ang);
        rectMode(CENTER);
        rect(0, 0, 20, 100);
        pop();
}
