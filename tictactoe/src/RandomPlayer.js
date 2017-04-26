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
