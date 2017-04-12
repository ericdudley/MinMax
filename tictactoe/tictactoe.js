var board;
var SPRING = 0.1;
function setup()
{
        createCanvas(windowWidth,windowHeight);
        board = new Board(3);
        board.initView(600,windowHeight/2,600);
}

function draw()
{
        background(51);
        board.draw();
}
