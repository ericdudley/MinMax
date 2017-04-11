function Bar(x, y, ang, w, l)
{
        this.x = x;
        this.dx = x;
        this.y = y;
        this.dy = y;
        this.ang = ang;
        this.dang = ang;
        this.w = w;
        this.l = l;
}

Bar.prototype.moveTo = function(x, y, ang){
        this.dx = x;
        this.dy = y;
        this.dang = ang;
}

Bar.prototype.update = function(){
        var scalar = 0.02;
        this.x += (this.dx-this.x)*scalar;
        this.y += (this.dy-this.y)*scalar;
        this.ang += (this.dang-this.ang)*scalar;
}

Bar.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        rotate(this.ang);
        rectMode(CENTER);
        rect(0, 0, this.w, this.l);
        pop();
}
