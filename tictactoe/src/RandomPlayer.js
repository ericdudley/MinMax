/**
 * Random player for tictactoe.
 * @param {int} id Player id.
 */
function RandomPlayer (id) {
  this.id = id
}

/**
 * Return move to be played.
 * @param  {Board} board Current board state.
 * @return {Move}       Random legal move.
 */
RandomPlayer.prototype.getMove = function (board) {
  var moves = board.getAllMoves(this.id)
  return moves[floor(random(0, moves.length))]
}
