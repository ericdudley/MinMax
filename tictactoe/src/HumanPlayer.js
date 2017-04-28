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
