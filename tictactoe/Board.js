function Board(size){
        this.board = [];
        for(let i=0; i<size; i++){
                this.board.push(0);
        }
        this.bars = [];
        var length = min(windowWidth, windowHeight)*0.8;
        var width = 30;
        var offset = 0.16;
        for(let i=0; i<(size-1)*2; i++){
                this.bars.push(new Bar(random(0,windowWidth), random(0,windowHeight), random(-TWO_PI, TWO_PI), 0.02, width, length));
                if(i<(size-1)){
                        this.bars[i].moveTo(windowWidth/2, windowHeight/2 - (length/2) + (i+1)*(length/size), PI/2);
                }
                else{
                        this.bars[i].moveTo(windowWidth/2 - (length/2) + (i-(size-1)+1)*(length/size), windowHeight/2, 0);
                }
        }
}

Board.prototype.draw = function(){
        for(let bar of this.bars){
                bar.update();
                bar.draw();
        }
        for(let i=0; i<size; i++){
                if(this.board[i] == 0){

                }
                else{

                }
        }
}
