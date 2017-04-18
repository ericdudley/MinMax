/**
 * A rectangle object that is a Mover.
 * Subclass of Mover.
 * @param {[float]} x      [see Mover]
 * @param {[float]} y      [see Mover]
 * @param {[float]} ang    [see Mover]
 * @param {[float]} spring [see Mover]
 * @param {[float]} w      [width]
 * @param {[height]} l      [height]
 */
function Bar (x, y, ang, spring, w, l) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, ang, spring])
  this.w = w
  this.l = l
}

Bar.prototype = Object.create(Mover.prototype)
Bar.prototype.constructor = Bar

/**
 * Draws rect with width w and height l.
 */
Bar.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, this.w, this.l)
  pop()
}

var BOARD_BAR_WIDTH_SCALE = 0.1 // Width/Lenth scale for bars
var INITIAL_BAR_ANGLE = 9 / 4
var XPIECE_SCALE = 0.9 // Visual scale
var OPIECE_SCALE = 0.7 // Visual scale

/**
 * Dimension of one side of the board. Standard game is 3.
 * @param {initView} size Dimension of board.
 */
function Board (size) {
  this.size = size
  this.board = [] // Logical board
  this.vboard = [] // Visual object board
  this.bars = [] // Visual board bars
  this.view_initialized = false;
  for (let i = 0; i < this.size * this.size; i++) {
    this.board[i] = EMPTY
  }
}

/**
 * Initialize board to have visual properties, does not render.
 * @param  {float} x      x position
 * @param  {float} y      y position
 * @param  {float} length length of bars
 */
Board.prototype.initView = function (x, y, length) {
  this.view_initialized = true;
  var width = (length / this.size) * BOARD_BAR_WIDTH_SCALE
  this.x = x
  this.y = y
  this.length = length
  this.width = width
  // Initialize bars
  for (let i = 0; i < (this.size - 1) * 2; i++) {
    this.bars[i] = (new Bar(x, y, INITIAL_BAR_ANGLE, SPRING, width, length))
    if (i < (this.size - 1)) { // Horizontal
      this.bars[i].moveTo(x, y - (length / 2) + (i + 1) * (length / this.size), PI / 2)
    } else { // Vertical
      this.bars[i].moveTo(x - (length / 2) + (i - (this.size - 1) + 1) * (length / this.size), y, 0)
    }
  }
  // Initialize vboard
  for (let i = 0; i < this.size * this.size; i++) {
    if (this.board[i] == X) {
      this.vboard[i] = (new XPiece(x, y, XPIECE_SCALE * (length / this.size)))
    } else if (this.board[i] == O) {
      this.vboard[i] = (new OPiece(x, y, OPIECE_SCALE * (length / this.size)))
    } else {
      this.vboard[i] = (null)
    }
  }
}

/**
 * Draws board, view_initialized must be true.
 */
Board.prototype.draw = function () {
  if(this.view_initialized == false){
          return
  }
  // Draw/update bars
  for (let bar of this.bars) {
    bar.update()
    bar.draw()
  }
  // Draw/update pieces
  var segsize = this.length / this.size
  for (let i = 0; i < this.size * this.size; i += this.size) {
    for (let j = 0; j < this.size; j++) {
      if(this.board[i + j] === EMPTY){
        this.vboard[i + j] = null
      }
      if (this.vboard[i + j] === null) {
        continue
      }
      // Center - length/2 + (index+offset)*segsize
      this.vboard[i + j].moveTo(this.x - (this.length / 2) + (j + 0.5) * segsize,
                                             this.y - (this.length / 2) + ((i / this.size) + 0.5) * segsize,
                                            0)
      this.vboard[i + j].update()
      this.vboard[i + j].draw()
    }
  }
}

/**
 * Clones logical aspect of board.
 * @return {[Board]} Clone of this.
 */
Board.prototype.clone = function () {
  let b = new Board(this.size)
  for (let i = 0; i < this.size * this.size; i++) {
    b.board[i] = this.board[i]
  }
  return b
}

/**
 * Applies move to board, and updates vboard if needed.
 * First validates move.
 * @param  {Move} move Move to be applied.
 */
Board.prototype.applyMove = function (move) {
  if(this.isValidMove(move) == false){
          console.log("Invalid move, move not applied.");
  }
  this.board[move.index] = move.value
  if(this.view_initialized == true){
  if (move.value == X) {
    this.vboard[move.index] = (new XPiece(this.x, this.y, XPIECE_SCALE * (this.length / this.size)))
  }
  if (move.value == O) {
    this.vboard[move.index] = (new OPiece(this.x, this.y, OPIECE_SCALE * (this.length / this.size)))
  }
  }
}

/**
 * Checks if move is valid for this board.
 * 0 <= index < this.size*this.size
 * value == X,O
 * spot is empty
 * @param  {move} move Move to be checked.
 * @return {boolean}      Whether or not move is valid.
 */
Board.prototype.isValidMove = function (move) {
  return move.index >= 0 && move.index < this.size * this.size &&
                (move.value == X || move.value == O) &&
                this.board[move.index] == EMPTY
}

/**
 * Returns the id of the winner of the game.
 * @return {int} id of winner or -1 if no winner.
 */
Board.prototype.getWinner = function () {
  let winner, found_winner;
  // Check rows
  for (let i = 0; i < this.size * this.size; i += this.size) {
    winner = this.board[i]
    found_winner = true
    for (let j = 0; j < this.size; j++) {
      if (this.board[i + j] != winner || winner == EMPTY) {
        found_winner = false
        break
      }
    }
    if (found_winner) {
      return winner
    }
  }
  // Check columns
  for (let i = 0; i < this.size; i++) {
    winner = this.board[i]
    found_winner = true
    for (let j = 0; j < this.size * this.size; j += this.size) {
      if (this.board[i + j] != winner || winner == EMPTY) {
        found_winner = false
        break
      }
    }
    if (found_winner) {
      return winner
    }
  }
  // Check down diagonal
  winner = this.board[0]
  found_winner = true
  for (let i = 0; i < this.size * this.size; i += this.size + 1) {
    if (this.board[i] != winner || winner == EMPTY) {
      found_winner = false
      break
    }
  }
  if (found_winner) {
    return winner
  }

  // Check up diagonal
  winner = this.board[0]
  found_winner = true
  for (let i = this.size - 1; i < this.size * this.size - 1; i += this.size - 1) {
    if (this.board[i] != winner || winner == EMPTY) {
      found_winner = false
      break
    }
  }
  if (found_winner) {
    return winner
  }
  return -1
}

/**
 * Returns if board has a winner.
 * @return {boolean} Whether or not board has winner.
 */
Board.prototype.hasWinner = function () {
  return this.getWinner() != -1
}

/**
 * Returns all valid moves for player with player_id.
 * @param  {int} player_id ID of player to be used as value of move.
 * @return {array<Move>}           Array of moves.
 */
Board.prototype.getAllMoves = function (player_id) {
  var moves = []
  for (let i = 0; i < this.size * this.size; i++) {
    if (this.board[i] == EMPTY) {
        let move = new Move(i, player_id)
        if(this.isValidMove(move)){
              moves.push(move)
        }
    }
  }
  return moves
}

/**
 * Resets board logically.
 */
Board.prototype.resetLogic = function () {
  for (let i = 0; i < this.size * this.size; i++) {
    this.board[i] = EMPTY
  }
}

/**
 * Resets board visually.
 */
Board.prototype.resetVisual = function () {
  for (let i = 0; i < this.size * this.size; i++) {
    this.vboard[i] = null
  }
  this.view_initialized = false;
}

function Game (board, players) {
  this.board = board
  this.origBoard = board.clone()
  this.players = players
  this.winner_id;
}

Game.prototype.play = function () {
  this.board.resetLogic()
  var have_winner = false
  while (have_winner == false) {
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i]
      do {
        var move = player.getMove(this.board.clone())
      }
      while (this.board.isValidMove(move) == false)
      this.board.applyMove(move)
      if (this.board.hasWinner()) {
        have_winner = true
        break
      }

      if (this.board.getAllMoves(this.players[i].id).length == 0) {
        have_winner = true
        break
      }
    }
  }
  return this.board.getWinner()
}

function MinMaxPlayer (id) {
  this.id = id
  if (id == X) {
    this.enemy_id = O
  } else {
    this.enemy_id = X
  }
}

MinMaxPlayer.prototype.getMove = function (board) {
  var best_move = this.get_max_move(board.clone(), null)
  return best_move
}

MinMaxPlayer.prototype.get_max_move = function (board, pmove) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var max_move = {minmax: -100}
  for (let move of board.getAllMoves(this.id)) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_min_move(nboard, move)
    if (nmove.minmax > max_move.minmax) {
      max_move = move.clone()
      max_move.minmax = nmove.minmax
    }
  }
  return max_move
}

MinMaxPlayer.prototype.get_min_move = function (board, pmove) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var min_move = {minmax: 100}
  for (let move of board.getAllMoves(this.enemy_id)) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_max_move(nboard, move)
    if (nmove.minmax < min_move.minmax) {
      min_move = move.clone()
      min_move.minmax = nmove.minmax
    }
  }
  return min_move
}

MinMaxPlayer.prototype.terminalValue = function (board) {
  if (board.hasWinner()) {
    var winner = board.getWinner()
    if (winner == this.id) {
      return 3
    } else {
      return 1
    }
  } else {
    if (board.getAllMoves(X).length == 0) {
      return 2
    }
  }
  return 23
}

MinMaxPlayer.prototype.isTerminal = function (board) {
  var winner = board.hasWinner()
  return winner || board.getAllMoves(X).length == 0
}

function Move (index, value) {
  this.index = index
  this.value = value
  this.minmax = 0
}

Move.prototype.clone = function () {
  var n = new Move(this.index, this.value)
  n.minmax = this.minmax
  return n
}

function Mover (x, y, ang, spring) {
  this.x = x
  this.dx = x
  this.y = y
  this.dy = y
  this.ang = ang
  this.dang = ang
  this.spring = spring
}

Mover.prototype.moveTo = function (x, y, ang) {
  this.dx = x
  this.dy = y
  this.dang = ang
}

Mover.prototype.update = function () {
  var scalar = this.spring
  this.x += (this.dx - this.x) * scalar
  this.y += (this.dy - this.y) * scalar
  this.ang += (this.dang - this.ang) * scalar
}

Mover.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, 20, 100)
  pop()
}

function OPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

OPiece.prototype = Object.create(Mover.prototype)
OPiece.prototype.constructor = OPiece

OPiece.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  noFill()
  strokeWeight(this.size / 10)
  stroke(255)
  ellipse(0, 0, this.size, this.size)
  pop()
}

function RandomPlayer (id) {
  this.id = id
}

RandomPlayer.prototype.getMove = function (board) {
  var moves = board.getAllMoves(this.id)
  return moves[floor(random(0, moves.length))]
}

function XPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

XPiece.prototype = Object.create(Mover.prototype)
XPiece.prototype.constructor = XPiece

XPiece.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  fill(255)
  rectMode(CENTER)
  rotate(PI / 4)
  rect(0, 0, this.size / 8, this.size)
  rotate(-PI / 2)
  rect(0, 0, this.size / 8, this.size)
  pop()
}

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
  'MinMax': MinMaxPlayer
}

function sleep (milliseconds) {
  var start = new Date().getTime()
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break
    }
  }
}

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

function draw () {
  background(51)
  fill(255)
  text('Board size', sizeSlider.x, sizeSlider.y - sizeSlider.height)
  board.draw()
}

function sizeChanged () {
  board = new Board(sizeSlider.value())
  board.initView(windowWidth / 2, windowHeight / 2, CENTER_BOARD_SIZE)
}

function startGame () {
  var players = []
  players.push(new PLAYER_CHOICES[xSelect.value()](X))
  players.push(new PLAYER_CHOICES[oSelect.value()](O))
  var game = new Game(board, players)
  var winner = game.play()
  console.log(winner)
  return winner
}
