/**
 * Driver code for tictactoe game in p5.
 */
var board
var sizeSlider
var playButton
var SPRING = 0.1
var CENTER_BOARD_SIZE = 100
var X = 1
var O = 2
var EMPTY = -1
var PLAYER_CHOICES = {
  'Random': RandomPlayer,
  'MinMax': MinMaxPlayer,
  'Human': HumanPlayer
}

/**
 * Setup visual objects.
 */
function setup () {
  createCanvas(windowWidth, windowHeight)
  CENTER_BOARD_SIZE = min(windowWidth, windowHeight) * 0.6
  board = new Board(3)
  board.initView(windowWidth / 2, windowHeight / 2 * 0.9, CENTER_BOARD_SIZE)

  sizeSlider = createSlider(3, 9, 3)
  sizeSlider.position(windowWidth / 2 - sizeSlider.width / 2, windowHeight - 180)
  sizeSlider.changed(sizeChanged)

  xSelect = createSelect()
  oSelect = createSelect()

  for (let ch in PLAYER_CHOICES) {
    xSelect.option(ch)
    oSelect.option(ch)
  }

  xSelect.position(windowWidth / 2 - xSelect.width * 3, windowHeight - 130)
  oSelect.position(windowWidth / 2 + oSelect.width * 2, windowHeight - 130)

  playButton = createButton('Start game')
  playButton.position(windowWidth / 2 - playButton.width / 2, windowHeight - 50)
  playButton.mousePressed(startGame)
}

/**
 * Draw 60 times a second.
 */
function draw () {
  background(51)
  fill(255)
  text('Board size', sizeSlider.x, sizeSlider.y - sizeSlider.height)
  board.draw()
}

/**
 * Callback for board size slider changed.
 */
function sizeChanged () {
  board = new Board(sizeSlider.value())
  board.initView(windowWidth / 2, windowHeight / 2, CENTER_BOARD_SIZE)
}

/**
 * Callback for start game button.
 * @return {int} Winning player id.
 */
function startGame () {
  var game = new Game(board)
  game.addPlayer(new PLAYER_CHOICES[xSelect.value()](X, game))
  game.addPlayer(new PLAYER_CHOICES[oSelect.value()](O, game))
  game.start()
}
