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

function Game(board, players)
{
        this.board = board;
        this.origBoard = board.clone();
        this.players = players;
}

Game.prototype.play = function()
{
        
}

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

function OPiece(x, y, size)
{
        this.super = Mover.prototype;
        this.super.constructor.apply(this, [x, y, 0, SPRING]);
        this.size = size;
}

OPiece.prototype = Object.create(Mover.prototype);
OPiece.prototype.constructor = OPiece;

OPiece.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        noFill();
        strokeWeight(this.size/10);
        stroke(255);
        ellipse(0, 0, this.size, this.size);
        pop();
}

function XPiece(x, y, size)
{
        this.super = Mover.prototype;
        this.super.constructor.apply(this, [x, y, 0, SPRING]);
        this.size = size;
}

XPiece.prototype = Object.create(Mover.prototype);
XPiece.prototype.constructor = XPiece;

XPiece.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        fill(255);
        rectMode(CENTER);
        rotate(PI/4);
        rect(0, 0, this.size/8, this.size);
        rotate(-PI/2);
        rect(0, 0, this.size/8, this.size);
        pop();
}

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

function Game(board, players)
{
        this.board = board;
        this.origBoard = board.clone();
        this.players = players;
}

Game.prototype.play = function()
{
        
}

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

function OPiece(x, y, size)
{
        this.super = Mover.prototype;
        this.super.constructor.apply(this, [x, y, 0, SPRING]);
        this.size = size;
}

OPiece.prototype = Object.create(Mover.prototype);
OPiece.prototype.constructor = OPiece;

OPiece.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        noFill();
        strokeWeight(this.size/10);
        stroke(255);
        ellipse(0, 0, this.size, this.size);
        pop();
}

function XPiece(x, y, size)
{
        this.super = Mover.prototype;
        this.super.constructor.apply(this, [x, y, 0, SPRING]);
        this.size = size;
}

XPiece.prototype = Object.create(Mover.prototype);
XPiece.prototype.constructor = XPiece;

XPiece.prototype.draw = function(){
        push();
        translate(this.x, this.y);
        fill(255);
        rectMode(CENTER);
        rotate(PI/4);
        rect(0, 0, this.size/8, this.size);
        rotate(-PI/2);
        rect(0, 0, this.size/8, this.size);
        pop();
}

var board;
var sizeSlider;
var playButton;
var SPRING = 0.1;
var CENTER_BOARD_SIZE = 100;
var X = 1;
var O = 2;
var EMPTY = -1;
function setup()
{
        createCanvas(windowWidth,windowHeight);
        CENTER_BOARD_SIZE = min(windowWidth, windowHeight)*0.6;
        board = new Board(3);
        board.initView(windowWidth/2,windowHeight/2, CENTER_BOARD_SIZE);

        sizeSlider = createSlider(3,9,3);
        sizeSlider.position(windowWidth/2 - sizeSlider.width/2, windowHeight-100);
        sizeSlider.changed(sizeChanged);

        playButton = createButton("Start game");
        playButton.position(windowWidth/2  - playButton.width/2, windowHeight-50);
        playButton.mousePressed(startGame);
}

function draw()
{
        background(51);
        fill(255);
        text("Board size", sizeSlider.x, sizeSlider.y-sizeSlider.height);
        board.draw();
}

function sizeChanged()
{
        board = new Board(sizeSlider.value());
        board.initView(windowWidth/2,windowHeight/2, CENTER_BOARD_SIZE);
}

function startGame()
{
        console.log("he");
}

var board;
var sizeSlider;
var playButton;
var SPRING = 0.1;
var CENTER_BOARD_SIZE = 100;
var X = 1;
var O = 2;
var EMPTY = -1;
function setup()
{
        createCanvas(windowWidth,windowHeight);
        CENTER_BOARD_SIZE = min(windowWidth, windowHeight)*0.6;
        board = new Board(3);
        board.initView(windowWidth/2,windowHeight/2, CENTER_BOARD_SIZE);

        sizeSlider = createSlider(3,9,3);
        sizeSlider.position(windowWidth/2 - sizeSlider.width/2, windowHeight-100);
        sizeSlider.changed(sizeChanged);

        playButton = createButton("Start game");
        playButton.position(windowWidth/2  - playButton.width/2, windowHeight-50);
        playButton.mousePressed(startGame);
}

function draw()
{
        background(51);
        fill(255);
        text("Board size", sizeSlider.x, sizeSlider.y-sizeSlider.height);
        board.draw();
}

function sizeChanged()
{
        board = new Board(sizeSlider.value());
        board.initView(windowWidth/2,windowHeight/2, CENTER_BOARD_SIZE);
}

function startGame()
{
        console.log("he");
}
