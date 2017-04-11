var board;
function setup()
{
        createCanvas(windowWidth,windowHeight);
        board = new Board();
}

function draw()
{
        background(51);
        board.draw();
}
