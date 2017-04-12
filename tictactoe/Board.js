function Board(size){
        this.size = size;
        this.board = [2,1,1,1,1,2,2,-1,1];
        this.vboard = [];
        this.bars = [];
}

Board.prototype.initView = function(x, y, length){
        var width = (length/this.size)*0.1;
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        for(let i=0; i<(this.size-1)*2; i++){
                this.bars.push(new Bar(x, y, 0, SPRING, width, length));
                if(i<(this.size-1)){ // Horizontal
                        this.bars[i].moveTo(x, y - (length/2) + (i+1)*(length/this.size), PI/2);
                }
                else{ // Vertical
                        this.bars[i].moveTo(x - (length/2) + (i-(this.size-1)+1)*(length/this.size), y, 0);
                }
        }
        for(let i=0; i<this.size*this.size; i++){
                if(this.board[i] == 1){
                        this.vboard.push(new XPiece(x, y, 0.9*(length/this.size)));
                }
                else if(this.board[i] == 2){
                        this.vboard.push(new OPiece(x, y, 0.7*(length/this.size)));
                }
                else{
                        this.vboard.push(null);
                }
        }
};

Board.prototype.draw = function(){
        for(let bar of this.bars){
                bar.update();
                bar.draw();
        }
        var segsize = this.length/this.size;
        for(let i=0; i<this.vboard.length; i+=this.size){
                for(let j=0; j<this.size; j++){
                        if(this.vboard[i+j] === null){
                                continue;
                        }
                        this.vboard[i+j].moveTo(this.x - (this.length/2) + (j+0.5)*segsize,
                                             this.y - (this.length/2) + ((i/this.size)+0.5)*segsize,
                                            0);
                        this.vboard[i+j].update();
                        this.vboard[i+j].draw();
                }
        }
}
