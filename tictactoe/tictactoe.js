var board;
function setup()
{
        createCanvas(windowWidth,windowHeight);
        board = new Board(13);
}

function draw()
{
        background(51);
        board.draw();
}
