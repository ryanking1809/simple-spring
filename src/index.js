export class Spring {
  constructor({
    value = 0,
    target = 0,
    tension = 170,
    friction = 26,
    mass = 1,
    precision = 0.01,
    onStart = null,
    onFrame = null,
    onRest = null,
    onComplete = null,
  } = {}) {
    this.value = value
    this.target = target
    this.tension = tension
    this.friction = friction
    this.mass = mass
    this.precision = precision
    this.prevTime = null
    this.velocity = 0
    this.resting = true
    this.onStart = onStart
    this.onFrame = onFrame
    this.onRest = onRest
    this.onComplete = onComplete
    this.getValue = this.getValue.bind(this)
    this.setTarget = this.setTarget.bind(this)
    this.start = this.start.bind(this)
    this.pause = this.pause.bind(this)
    this.stop = this.stop.bind(this)
    this.complete = this.complete.bind(this)
    this.tick = this.tick.bind(this)
  }
  getValue() {
    // get the most recent value at request time
    return this.value
  }
  // mostly for chaining
  setTarget(val) {
    this.target = val
    return this
  }
  start() {
    this.resting = false
    requestAnimationFrame(this.tick)
    if (this.onStart) this.onStart(this.value, this)
    return this
  }
  pause() {
    this.prevTime = null
    this.resting = true
    if (this.onRest) this.onRest(this.value, this)
    return this
  }
  stop() {
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.onRest) this.onRest(this.value, this)
    return this
  }
  complete() {
    this.value = this.target
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.onRest) this.onRest(this.value, this)
    if (this.onComplete) this.onComplete(this.value, this)
    return this
  }
  tick() {
    this.prevTime = this.prevTime || Date.now() / 1000
    this.deltaTime = Date.now() / 1000 - this.prevTime || 1 / 1000
    this.prevTime += this.deltaTime
    let force = -this.tension * (this.value - this.target)
    let damping = -this.friction * this.velocity
    let acceleration = (force + damping) / this.mass
    this.velocity += acceleration * this.deltaTime
    this.value += this.velocity * this.deltaTime
    if (this.onFrame) this.onFrame(this.value, this)
    if (this.restingAtTarget) {
      this.complete()
    }
    if (!this.resting) {
      requestAnimationFrame(this.tick)
    }
  }
  get restingAtTarget() {
    return Math.abs(this.value - this.target) < this.precision && Math.abs(this.velocity) < this.precision
  }
}
