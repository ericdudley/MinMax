function Move (index, value) {
  this.index = index
  this.value = value
  this.minmax = 0
}

Move.prototype.clone = function () {
  var n = new Move(this.index, this.value)
  n.minmax = this.minmax
  return n
}
