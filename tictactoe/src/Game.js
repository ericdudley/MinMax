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
