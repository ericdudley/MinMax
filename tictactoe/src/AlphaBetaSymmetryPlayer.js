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
