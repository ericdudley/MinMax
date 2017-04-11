function Board(){
        this.board = [];
        for(let i=0; i<9; i++){
                this.board.push(-1);
        }
        this.bars = [];
        var length = min(windowWidth, windowHeight)*0.8;
        var width = 30;
        var offset = 0.16;
        this.bars.push(new Bar(random(-1000,-500), random(-1000,-500), random(-PI, PI), width, length));
        this.bars[0].moveTo(windowWidth/2-length*offset, windowHeight/2, 0);
        this.bars.push(new Bar(random(windowWidth+500,windowHeight+1000), random(windowWidth+500,windowHeight+1000), random(-PI, PI), width, length));
        this.bars[1].moveTo(windowWidth/2+length*offset, windowHeight/2, 0);
        this.bars.push(new Bar(random(windowWidth+500,windowHeight+1000), random(windowWidth+500,windowHeight+1000), random(0, PI), width, length));
        this.bars[2].moveTo(windowWidth/2, windowHeight/2-length*offset, PI/2);
        this.bars.push(new Bar(random(-1000,-500), random(-1000,-500), random(0, PI), width, length));
        this.bars[3].moveTo(windowWidth/2, windowHeight/2+length*offset, PI/2);
}

Board.prototype.draw = function(){
        for(let bar of this.bars){
                bar.update();
                bar.draw();
        }
}
