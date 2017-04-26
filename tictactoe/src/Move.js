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
