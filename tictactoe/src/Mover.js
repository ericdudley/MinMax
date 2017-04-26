/**
 * Visual object that is attracted towards a desired position/angle.
 * @param {int} x      Initial x position.
 * @param {int} y      Initial y position.
 * @param {float} ang    Initial angle.
 * @param {float} spring Rate of attraction {0..1}.
 */
function Mover (x, y, ang, spring) {
  this.x = x
  this.dx = x
  this.y = y
  this.dy = y
  this.ang = ang
  this.dang = ang
  this.spring = spring
}

/**
 * Sets desired position/angle.
 * @param {int} x      Desired x position.
 * @param {int} y      Desired y position.
 * @param {float} ang    Desired angle.
 */
Mover.prototype.moveTo = function (x, y, ang) {
  this.dx = x
  this.dy = y
  this.dang = ang
}

/**
 * Moves one tick towards desired position/angle.
 */
Mover.prototype.update = function () {
  var scalar = this.spring
  this.x += (this.dx - this.x) * scalar
  this.y += (this.dy - this.y) * scalar
  this.ang += (this.dang - this.ang) * scalar
}

/**
 * Draws to screen, by default a 20x100 rectangle.
 * @return {[type]} [description]
 */
Mover.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, 20, 100)
  pop()
}
