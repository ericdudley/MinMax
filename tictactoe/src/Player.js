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
