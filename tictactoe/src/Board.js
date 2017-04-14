function Board(size){
        this.size = size;
        this.board = [];
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
                this.bars[i] = (new Bar(x, y, PI/4, SPRING, width, length));
                if(i<(this.size-1)){ // Horizontal
                        this.bars[i].moveTo(x, y - (length/2) + (i+1)*(length/this.size), PI/2);
                }
                else{ // Vertical
                        this.bars[i].moveTo(x - (length/2) + (i-(this.size-1)+1)*(length/this.size), y, 0);
                }
        }
        for(let i=0; i<this.size*this.size; i++){
                if(this.board[i] == X){
                        this.vboard[i] = (new XPiece(x, y, 0.9*(length/this.size)));
                }
                else if(this.board[i] == O){
                        this.vboard[i] = (new OPiece(x, y, 0.7*(length/this.size)));
                }
                else{
                        this.vboard[i] = (null);
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

Board.prototype.clone = function(){
        let b = new Board(this.size);
        for(let i=0; i<this.size*this.size; i++){
                b.board[i] = this.board[i];
        }
        return b;
};

Board.prototype.applyMove = function(move){
        if(this.board[move.index] == EMPTY){
                this.board[move.index] = move.value;
                return true;
        }
        return false;
}
