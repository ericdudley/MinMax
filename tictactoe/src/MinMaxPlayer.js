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
