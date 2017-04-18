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
