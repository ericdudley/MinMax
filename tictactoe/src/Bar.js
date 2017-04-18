/**
 * A rectangle object that is a Mover.
 * Subclass of Mover.
 * @param {[float]} x      [see Mover]
 * @param {[float]} y      [see Mover]
 * @param {[float]} ang    [see Mover]
 * @param {[float]} spring [see Mover]
 * @param {[float]} w      [width]
 * @param {[height]} l      [height]
 */
function Bar (x, y, ang, spring, w, l) {
  this.super = Mover.prototype
  this.super.constructor.apply(this, [x, y, ang, spring])
  this.w = w
  this.l = l
}

Bar.prototype = Object.create(Mover.prototype)
Bar.prototype.constructor = Bar

/**
 * Draws rect with width w and height l.
 */
Bar.prototype.draw = function () {
  push()
  translate(this.x, this.y)
  rotate(this.ang)
  rectMode(CENTER)
  rect(0, 0, this.w, this.l)
  pop()
}
