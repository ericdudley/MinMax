function Bar (x, y, ang, spring, w, l) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, ang, spring])
  this.w = w
  this.l = l
}

Bar.prototype = Object.create(Mover.prototype)
Bar.prototype.constructor = Bar

Bar.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, this.w, this.l)
  pop()
}

function Board (size) {
  this.size = size
  this.board = []
  this.vboard = []
  this.bars = []
  for (let i = 0; i < this.size * this.size; i++) {
    this.board[i] = EMPTY
  }
}

Board.prototype.initView = function (x, y, length) {
  var width = (length / this.size) * 0.1
  this.x = x
  this.y = y
  this.length = length
  this.width = width
  for (let i = 0; i < (this.size - 1) * 2; i++) {
    this.bars[i] = (new Bar(x, y, PI / 4, SPRING, width, length))
    if (i < (this.size - 1)) { // Horizontal
      this.bars[i].moveTo(x, y - (length / 2) + (i + 1) * (length / this.size), PI / 2)
    } else { // Vertical
      this.bars[i].moveTo(x - (length / 2) + (i - (this.size - 1) + 1) * (length / this.size), y, 0)
    }
  }
  for (let i = 0; i < this.size * this.size; i++) {
    if (this.board[i] == X) {
      this.vboard[i] = (new XPiece(x, y, 0.9 * (length / this.size)))
    } else if (this.board[i] == O) {
      this.vboard[i] = (new OPiece(x, y, 0.7 * (length / this.size)))
    } else {
      this.vboard[i] = (null)
    }
  }
}

Board.prototype.draw = function () {
  for (let bar of this.bars) {
    bar.update()
    bar.draw()
  }
  var segsize = this.length / this.size
  for (let i = 0; i < this.size * this.size; i += this.size) {
    for (let j = 0; j < this.size; j++) {
      if (this.vboard[i + j] === null) {
        continue
      }
      this.vboard[i + j].moveTo(this.x - (this.length / 2) + (j + 0.5) * segsize,
                                             this.y - (this.length / 2) + ((i / this.size) + 0.5) * segsize,
                                            0)
      this.vboard[i + j].update()
      this.vboard[i + j].draw()
    }
  }
}

Board.prototype.clone = function () {
  let b = new Board(this.size)
  for (let i = 0; i < this.size * this.size; i++) {
    b.board[i] = this.board[i]
  }
  return b
}

Board.prototype.applyMove = function (move) {
  this.board[move.index] = move.value
  if (move.value == X) {
    this.vboard[move.index] = (new XPiece(this.x, this.y, 0.9 * (this.length / this.size)))
  }
  if (move.value == O) {
    this.vboard[move.index] = (new OPiece(this.x, this.y, 0.9 * (this.length / this.size)))
  }
}

Board.prototype.isValidMove = function (move) {
  return move.index >= 0 && move.index < this.size * this.size &&
                (move.value == X || move.value == O) &&
                this.board[move.index] == EMPTY
}

Board.prototype.getWinner = function () {
  let winner = 0
  let count = 0
  for (let i = 0; i < this.size * this.size; i += this.size) {
    count = 0
    for (let j = 0; j < this.size; j++) {
      if (count == 0 && this.board[i + j] != EMPTY) {
        winner = this.board[i + j]
        count = 1
      } else {
        if (this.board[i + j] == winner) {
          count += 1
        } else {
          count = 0
        }
      }
    }
    if (count == this.size) {
      return winner
    }
  }

  for (let i = 0; i < this.size; i++) {
    count = 0
    for (let j = 0; j < this.size * this.size; j += this.size) {
      if (count == 0 && this.board[i + j] != EMPTY) {
        winner = this.board[i + j]
        count = 1
      } else {
        if (this.board[i + j] == winner) {
          count += 1
        } else {
          count = 0
        }
      }
    }
    if (count == this.size) {
      return winner
    }
  }

  count = 0
  for (let i = 0; i < this.size * this.size; i += this.size + 1) {
    if (count == 0 && this.board[i] != EMPTY) {
      winner = this.board[i]
      count += 1
    } else {
      if (this.board[i] == winner) {
        count += 1
      } else {
        count = 0
      }
    }
  }
  if (count == this.size) {
    return winner
  }

  count = 0
  for (let i = this.size - 1; i < this.size * this.size - 1; i += this.size - 1) {
    if (count == 0 && this.board[i] != EMPTY) {
      winner = this.board[i]
      count += 1
    } else {
      if (this.board[i] == winner) {
        count += 1
      } else {
        count = 0
      }
    }
  }
  if (count == this.size) {
    return winner
  }
  return false
}

Board.prototype.hasWinner = function () {
  return this.getWinner() != false
}

Board.prototype.getAllMoves = function (player_id) {
  var moves = []
  for (let i = 0; i < this.size * this.size; i++) {
    if (this.board[i] == EMPTY) {
      moves.push(new Move(i, player_id))
    }
  }
  return moves
}

Board.prototype.reset = function () {
  for (let i = 0; i < this.size * this.size; i++) {
    this.board[i] = EMPTY
    this.vboard[i] = null
  }
}

function Game (board, players) {
  this.board = board
  this.origBoard = board.clone()
  this.players = players
}

Game.prototype.play = function () {
  this.board.reset()
  var have_winner = false
  while (have_winner == false) {
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i]
      do {
        var move = player.getMove(this.board.clone())
      }
      while (this.board.isValidMove(move) == false)
      this.board.applyMove(move)
      var winner = this.board.getWinner()
      if (winner) {
        have_winner = true
        break
      }

      if (this.board.getAllMoves(this.players[i]).length == 0) {
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
  return game.play()
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
