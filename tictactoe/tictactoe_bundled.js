"use strict";
/**
 * A TicTacToe player that uses minmax algorithm with alpha beta pruning.
 * @param {int} id Player id
 */
function AlphaBetaPlayer (id, game) {
  this.id = id
  if (id == X) {
    this.enemy_id = O
  } else {
    this.enemy_id = X
  }
  this.super = Player.prototype
  this.super.constructor.apply(this, [id, game])
}

AlphaBetaPlayer.prototype = Object.create(Player.prototype)
AlphaBetaPlayer.prototype.constructor = AlphaBetaPlayer

/**
 * Standard player move.
 * @param  {Board} board Current state of board.
 * @return {Move}       Move to be played.
 */
AlphaBetaPlayer.prototype.getMove = function (board) {
  var best_move = this.get_max_move(board.clone(), null, -Infinity, Infinity)
  this.game.playMove(best_move)
}

/**
 * Returns move from a max node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @param  {int} a      Alpha
 * @param  {int} b      Beta
 * @return {Move}       Maximum minmax value move.
 */
AlphaBetaPlayer.prototype.get_max_move = function (board, pmove, a, b) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var max_move = {minmax: -Infinity}
  for (let move of board.getAllMoves(this.id)) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_min_move(nboard, move, a, b)
    if (nmove.minmax > max_move.minmax) {
      max_move = move.clone()
      max_move.minmax = nmove.minmax
    }
    if(max_move.minmax >= b){
      break
    }
    a = max(a, max_move.minmax)
  }
  return max_move
}

/**
 * Returns move from a min node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @param  {int} a      Alpha
 * @param  {int} b      Beta
 * @return {Move}       Minimum minmax value move.
 */
AlphaBetaPlayer.prototype.get_min_move = function (board, pmove, a, b) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var min_move = {minmax: Infinity}
  for (let move of board.getAllMoves(this.enemy_id)) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_max_move(nboard, move, a, b)
    if (nmove.minmax < min_move.minmax) {
      min_move = move.clone()
      min_move.minmax = nmove.minmax
    }
    if(min_move.minmax <= a){
      break
    }
    b = min(b, min_move.minmax)
  }
  return min_move
}


/**
 * Calculates minmax value of a terminal board state.
 * @param  {Board} board Current board state.
 * @return {int}       Minmax value.
 */
AlphaBetaPlayer.prototype.terminalValue = function (board) {
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

/**
 * Returns whether or not board is terminal.
 * @param  {Board} board Current board state.
 * @return {Boolean}
 */
AlphaBetaPlayer.prototype.isTerminal = function (board) {
  var winner = board.hasWinner()
  return winner || board.getAllMoves(X).length == 0
}

var ABSP_MAX_DEPTH = 3
/**
 * A TicTacToe player that uses minmax algorithm with alpha beta pruning.
 * @param {int} id Player id
 */
function AlphaBetaSymmetryPlayer (id, game) {
  this.id = id
  this.move_count = 0
  if (id == X) {
    this.enemy_id = O
  } else {
    this.enemy_id = X
  }
  this.super = Player.prototype
  this.super.constructor.apply(this, [id, game])
}

AlphaBetaSymmetryPlayer.prototype = Object.create(Player.prototype)
AlphaBetaSymmetryPlayer.prototype.constructor = AlphaBetaSymmetryPlayer

/**
 * Standard player move.
 * @param  {Board} board Current state of board.
 * @return {Move}       Move to be played.
 */
AlphaBetaSymmetryPlayer.prototype.getMove = function (board) {
  this.move_count = 0
  var best_move = this.get_max_move(board.clone(), null, -Infinity, Infinity, 0)
  this.move_count++
  this.game.playMove(best_move)
}

/**
 * Returns move from a max node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @param  {int} a      Alpha
 * @param  {int} b      Beta
 * @param  {int} depth Current depth in tree.
 * @return {Move}       Maximum minmax value move.
 */
AlphaBetaSymmetryPlayer.prototype.get_max_move = function (board, pmove, a, b, depth) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var max_move = {minmax: -Infinity}
  var all_moves = board.getAllMoves(this.id)
  if(depth + this.move_count < ABSP_MAX_DEPTH){
    all_moves = this.pruneMoves(board, all_moves)
  }
  for (let move of all_moves) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_min_move(nboard, move, a, b, depth + 1)
    if (nmove.minmax > max_move.minmax) {
      max_move = move.clone()
      max_move.minmax = nmove.minmax
    }
    if(max_move.minmax >= b){
      break
    }
    a = max(a, max_move.minmax)
  }
  return max_move
}

/**
 * Returns move from a min node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @param  {int} a      Alpha
 * @param  {int} b      Beta
 * @param  {int} depth Current depth in tree.
 * @return {Move}       Minimum minmax value move.
 */
AlphaBetaSymmetryPlayer.prototype.get_min_move = function (board, pmove, a, b, depth) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var min_move = {minmax: Infinity}
  var all_moves = board.getAllMoves(this.enemy_id)
  if(depth + this.move_count < ABSP_MAX_DEPTH){
    all_moves = this.pruneMoves(board, all_moves)
  }
  for (let move of all_moves) {
    var nboard = board.clone()
    nboard.applyMove(move)
    var nmove = this.get_max_move(nboard, move, a, b, depth + 1)
    if (nmove.minmax < min_move.minmax) {
      min_move = move.clone()
      min_move.minmax = nmove.minmax
    }
    if(min_move.minmax <= a){
      break
    }
    b = min(b, min_move.minmax)
  }
  return min_move
}


/**
 * Calculates minmax value of a terminal board state.
 * @param  {Board} board Current board state.
 * @return {int}       Minmax value.
 */
AlphaBetaSymmetryPlayer.prototype.terminalValue = function (board) {
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

/**
 * Returns whether or not board is terminal.
 * @param  {Board} board Current board state.
 * @return {Boolean}
 */
AlphaBetaSymmetryPlayer.prototype.isTerminal = function (board) {
  var winner = board.hasWinner()
  return winner || board.getAllMoves(X).length == 0
}

/**
 * Returns pruned version of list.
 * @param  {Board} board Context of moves.
 * @param  {Move[]} moves List to be pruned.
 * @return {Move[]}       Pruned list.
 */
AlphaBetaSymmetryPlayer.prototype.pruneMoves = function (board, moves)
{
  var pruned = []
  var board_states = []
  for(let i = 0; i < moves.length; i++){
    let temp_board = board.clone()
    temp_board.applyMove(moves[i])
    let newb = true
    for(let j = 0; j < 3; j++){
      for(let k = 0; k < board_states.length; k++){
        if(board_states[k].equals(temp_board)){
          newb = false
          break
        }
      }
      if(newb == false){
        break
      } else{
        temp_board.rotate()
      }
    }
    if(newb == true){
      board_states.push(temp_board)
      pruned.push(moves[i])
    }
  }
  return pruned
}

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
  this.sizesq = size * size
  this.board = [] // Logical board
  this.vboard = [] // Visual object board
  this.bars = [] // Visual board bars
  this.view_initialized = false;
  for (let i = 0; i < this.sizesq; i++) {
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
  for (let i = 0; i < this.sizesq; i++) {
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
  for (let i = 0; i < this.sizesq; i += this.size) {
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
  for (let i = 0; i < this.sizesq; i++) {
    b.board[i] = this.board[i]
  }
  b.x = this.x
  b.y = this.y
  b.length = this.length
  return b
}

/**
 * Clones logical and visual aspect of board.
 * Shallow copy.
 * @return {[Board]} Clone of this.
 */
Board.prototype.cloneWithVisual = function () {
  let b = new Board(this.size)
  for (let i = 0; i < this.sizesq; i++) {
    b.vboard[i] = this.vboard[i]
    b.board[i] = this.board[i]
  }
  b.x = this.x
  b.y = this.y
  b.length = this.length
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
  return  move != null && move.index >= 0 && move.index < this.sizesq &&
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
  for (let i = 0; i < this.sizesq; i += this.size) {
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
    for (let j = 0; j < this.sizesq; j += this.size) {
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
  for (let i = 0; i < this.sizesq; i += this.size + 1) {
    if (this.board[i] != winner || winner == EMPTY) {
      found_winner = false
      break
    }
  }
  if (found_winner) {
    return winner
  }

  // Check up diagonal
  winner = this.board[this.size - 1]
  found_winner = true
  for (let i = this.size - 1; i < this.sizesq - 1; i += this.size - 1) {
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
  for (let i = 0; i < this.sizesq; i++) {
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
  for (let i = 0; i < this.sizesq; i++) {
    this.board[i] = EMPTY
  }
}

/**
 * Resets board visually.
 */
Board.prototype.resetVisual = function () {
  for (let i = 0; i < this.sizsq; i++) {
    this.vboard[i] = null
  }
  this.view_initialized = false;
}

/**
 * Calculates move from coordinates.
 * @param  {float} x
 * @param  {float} y
 * @param  {int} player_idd
 */
Board.prototype.getMoveFromCoordinates = function(x, y, player_id)
{
  let ulx = this.x - this.length / 2
  let uly = this.y - this.length / 2
  let dx = x - ulx
  let dy = y - uly
  let unit_size = this.length / this.size
  let xindex = floor(dx / unit_size)
  let yindex = floor(dy / unit_size)
  let rindex = xindex + yindex * this.size
  return new Move(rindex, player_id)
}

/**
 * Rotates a board anticlockwise.
 */
Board.prototype.rotate = function()
{
  let copy = this.cloneWithVisual()

  for(let pos = this.sizesq-this.size; pos < this.sizesq; pos++){
      let row = pos - (this.sizesq-this.size)
      for(let off = 0; off < this.size; off++){
        this.board[pos - off * this.size] = copy.board[row * this.size + off]
        if(this.view_initialized){
          this.vboard[pos - off * this.size] = copy.vboard[row * this.size + off]
        }
      }
  }
}

/**
 * Compares 2 boards for equality.
 * @param  {Board} other Board to compare to.
 * @return {boolean}       this.board == other.board
 */
Board.prototype.equals = function(other)
{
  var same = true
  for(let i = 0; i<this.sizesq; i++){
    if(this.board[i] != other.board[i]){
      same = false
    }
  }
  return same
}

/**
 * Instance of the game of tictactoe.
 * @param {Board} board Initial board state.
 */
function Game (board) {
  this.board = board
  this.origBoard = board.clone()
  this.curr_turn = 0
  this.players = []
  this.winner_id;
  this.have_winner = false;
}

/**
 * Start game calllbacks.
 */
Game.prototype.start = function () {
  this.board.resetLogic()
  this.have_winner = false
  this.curr_turn = 0
  this.players[this.curr_turn].getMove(this.board.clone())
}

/**
 * Callback by players. Checks validity of move and increments curr_turn.
 * @param  {Move} move Move to be played.
 */
Game.prototype.playMove = function(move) {
  if( !this.have_winner && move != null && move.value == this.players[this.curr_turn].id && this.board.isValidMove(move)){
    this.board.applyMove(move)
    if (this.board.hasWinner()) {
      this.have_winner = true
      this.winner_id = this.board.getWinner();
    }
    else{
      let game = this
      setTimeout(function(){
        game.curr_turn++
        if(game.curr_turn == game.players.length){
          game.curr_turn = 0
        }
        game.players[game.curr_turn].getMove(game.board.clone())
      }, MOVE_DELAY)
    }
  }
}

/**
 * Adds player to list of players.
 * @param  {Player} player Player to add.
 */
Game.prototype.addPlayer = function(player)
{
  this.players.push(player)
}

/**
 * Human player for tictactoe.
 * @param {int} id Player id.
 */
function HumanPlayer (id, game) {
  this.super = Player.prototype
  this.super.constructor.apply(this, [id, game])
  this.board;
  var self = this
  document.addEventListener("mouseup", function(){
    if(self.game != null && self.board != null){
      self.game.playMove(self.board.getMoveFromCoordinates(mouseX, mouseY, self.id))
    }
  }, false)
}

HumanPlayer.prototype = Object.create(Player.prototype)
HumanPlayer.prototype.constructor = HumanPlayer

/**
 * Do nothing.
 * @param  {Board} board Current board state.
 */
HumanPlayer.prototype.getMove = function (board) {
  // Do nothing because player calculates move.
  this.board = board.clone()
}

/**
 * A TicTacToe player that uses minmax algorithm.
 * @param {int} id Player id
 */
function MinMaxPlayer (id, game) {
  this.id = id
  if (id == X) {
    this.enemy_id = O
  } else {
    this.enemy_id = X
  }
  this.super = Player.prototype
  this.super.constructor.apply(this, [id, game])
}

MinMaxPlayer.prototype = Object.create(Player.prototype)
MinMaxPlayer.prototype.constructor = MinMaxPlayer

/**
 * Standard player move.
 * @param  {Board} board Current state of board.
 * @return {Move}       Move to be played.
 */
MinMaxPlayer.prototype.getMove = function (board) {
  var best_move = this.get_max_move(board.clone(), null)
  this.game.playMove(best_move)
}

/**
 * Returns move from a max node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @return {Move}       Maximum minmax value move.
 */
MinMaxPlayer.prototype.get_max_move = function (board, pmove) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var max_move = {minmax: -Infinity}
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

/**
 * Returns move from a min node config.
 * @param  {Board} board Current board.
 * @param  {Move} pmove Last move to be played.
 * @return {Move}       Minimum minmax value move.
 */
MinMaxPlayer.prototype.get_min_move = function (board, pmove) {
  if (this.isTerminal(board)) {
    pmove.minmax = this.terminalValue(board)
    return pmove
  }
  var min_move = {minmax: Infinity}
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


/**
 * Calculates minmax value of a terminal board state.
 * @param  {Board} board Current board state.
 * @return {int}       Minmax value.
 */
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

/**
 * Returns whether or not board is terminal.
 * @param  {Board} board Current board state.
 * @return {Boolean}
 */
MinMaxPlayer.prototype.isTerminal = function (board) {
  var winner = board.hasWinner()
  return winner || board.getAllMoves(X).length == 0
}

/**
 * A tictactoe move.
 * @param {int} index Position in board {0..size*size}
 * @param {int} value Player id.
 */
function Move (index, value) {
  this.index = index
  this.value = value
  this.minmax = 0
}

/**
 * Creates deep copy of this.
 * @return {Move} Deep copy of this.
 */
Move.prototype.clone = function () {
  var n = new Move(this.index, this.value)
  n.minmax = this.minmax
  return n
}

/**
 * Visual object that is attracted towards a desired position/angle.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {float} ang    Initial angle.
 * @param {float} spring Rate of attraction {0..1}.
 */
function Mover (x, y, ang, spring) {
  this.x = x
  this.dx = x
  this.y = y
  this.dy = y
  this.ang = ang
  this.dang = ang
  this.spring = spring
}

/**
 * Sets desired position/angle.
 * @param {int} x      Desired x position.
 * @param {int} y      Desired y position.
 * @param {float} ang    Desired angle.
 */
Mover.prototype.moveTo = function (x, y, ang) {
  this.dx = x
  this.dy = y
  this.dang = ang
}

/**
 * Moves one tick towards desired position/angle.
 */
Mover.prototype.update = function () {
  var scalar = this.spring
  this.x += (this.dx - this.x) * scalar
  this.y += (this.dy - this.y) * scalar
  this.ang += (this.dang - this.ang) * scalar
}

/**
 * Draws to screen, by default a 20x100 rectangle.
 * @return {[type]} [description]
 */
Mover.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, 20, 100)
  pop()
}

/**
 * OPiece Mover.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {float} size Diameter.
 */
function OPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

OPiece.prototype = Object.create(Mover.prototype)
OPiece.prototype.constructor = OPiece

/**
 * Draws O shape with center x, y, diameter of size.
 */
OPiece.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  noFill()
  strokeWeight(this.size / 10)
  stroke(255)
  ellipse(0, 0, this.size, this.size)
  pop()
}

/**
 * Generic player for TicTacToe.
 * @param {int} id   Player id.
 * @param {Game} game Game that the player belongs to.
 */
function Player(id, game)
{
  this.id = id;
  this.game = game;
}

/**
 * Calculate move and call game.playMove().
 * By default plays random move.
 * @param  {Board} board Current board state.
 */
Player.prototype.getMove = function (board) {
  var moves = board.getAllMoves(this.id)
  this.game.playMove(moves[floor(random(0, moves.length))]);
}

/**
 * Random player for tictactoe.
 */
function RandomPlayer (id, game) {
    this.super = Player.prototype
    this.super.constructor.apply(this, [id, game])
}

RandomPlayer.prototype = Object.create(Player.prototype)
RandomPlayer.prototype.constructor = RandomPlayer

RandomPlayer.prototype.getMove = function (board) {
  var moves = board.getAllMoves(this.id)
  this.game.playMove(moves[floor(random(0, moves.length))]);
}

/**
 * XPiece Mover.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {int} size Bar length.
 */
function XPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

XPiece.prototype = Object.create(Mover.prototype)
XPiece.prototype.constructor = XPiece

/**
 * Draws two 45deg bars with length size.
 */
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

/**
 * Driver code for tictactoe game in p5.
 */
var board
var sizeSlider
var xSelect
var oSelect
var playButton
var SPRING = 0.1
var CENTER_BOARD_SIZE = 100
var X = 1
var O = 2
var EMPTY = -1
var MOVE_DELAY = 100
var PLAYER_CHOICES = {
  'Random': RandomPlayer,
  'MinMax': MinMaxPlayer,
  'AlphaBeta': AlphaBetaPlayer,
  'AlphaBetaSymmetry': AlphaBetaSymmetryPlayer,
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

  xSelect.position(windowWidth / 2 - xSelect.width * 6, windowHeight - 130)
  oSelect.position(windowWidth / 2 + oSelect.width * 4, windowHeight - 130)

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
