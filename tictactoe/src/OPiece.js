/**
 * OPiece Mover.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {float} size Diameter.
 */
function OPiece (x, y, size) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, 0, SPRING])
  this.size = size
}

OPiece.prototype = Object.create(Mover.prototype)
OPiece.prototype.constructor = OPiece

/**
 * Draws O shape with center x, y, diameter of size.
 */
OPiece.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  noFill()
  strokeWeight(this.size / 10)
  stroke(255)
  ellipse(0, 0, this.size, this.size)
  pop()
}
