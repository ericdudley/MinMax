/**
 * XPiece Mover.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {int} size Bar length.
 */
function XPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

XPiece.prototype = Object.create(Mover.prototype)
XPiece.prototype.constructor = XPiece

/**
 * Draws two 45deg bars with length size.
 */
XPiece.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  fill(255)
  rectMode(CENTER)
  rotate(PI / 4)
  rect(0, 0, this.size / 8, this.size)
  rotate(-PI / 2)
  rect(0, 0, this.size / 8, this.size)
  pop()
}
