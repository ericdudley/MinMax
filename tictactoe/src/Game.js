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
