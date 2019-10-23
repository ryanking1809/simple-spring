export class Spring {
  constructor({
    value = 0,
    target = 0,
    tension = 170,
    friction = 26,
    mass = 1,
    precision = 0.01,
    fps = 120,
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
    this.fps = Math.max(fps, 15) // calculation breaks if fps is too low
    this.prevTime = null
    this.velocity = 0
    this.resting = true
    this.ticker = null
    this.onStart = onStart
    this.onFrame = onFrame
    this.onRest = onRest
    this.onComplete = onComplete
  }
  getValue() {
    // get the most recent value at request time
    return this.tick().value
  }
  // mostly for chaining
  setTarget(val) {
    this.target = val
    return this
  }
  start() {
    this.resting = false
    if (!this.ticker) {
      this.ticker = setInterval(() => {
        this.tick()
        if (this.resting) {
          clearInterval(this.ticker)
          this.ticker = null
        }
      }, 1000 / this.fps)
    }
    if (this.onStart) this.onStart()
    return this
  }
  pause() {
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest()
    return this
  }
  stop() {
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest()
    return this
  }
  complete() {
    this.value = this.target
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest()
    if (this.onComplete) this.onComplete()
    return this
  }
  tick(t) {
    if (this.resting) {
      return this
    }
    if (this.restingAtTarget) {
      this.complete()
    }
    this.prevTime = this.prevTime || Date.now() / 1000
    // deltaTime is specified or calculated from previous tick
    const deltaTime = t || Date.now() / 1000 - this.prevTime || 1 / this.fps
    // theoretically we can be more effecient by limiting the number of calculated frames
    // rather than calculating every millisecond

    // Skip calculation if deltaTime is less than a frame length
    if (deltaTime * this.fps >= 1) {
      this.prevTime += deltaTime
      // Spring calculation needs to be done in small increments
      // otherwise changes in velocity are to large and the spring fails
      for (let i = 0; i < deltaTime * this.fps; ++i) {
        this.animateFrame()
        if (this.resting) {
          // jump out of loop if completes
          i = deltaTime * this.fps
        }
      }
    }
    return this
  }
  animateFrame() {
    let force = -this.tension * (this.value - this.target)
    let damping = -this.friction * this.velocity
    let acceleration = (force + damping) / this.mass
    this.velocity += acceleration / this.fps
    this.value += this.velocity / this.fps
    if (this.onFrame) this.onFrame()
    if (this.restingAtTarget) {
      this.complete()
    }
  }
  get restingAtTarget() {
    return Math.abs(this.value - this.target) < this.precision && Math.abs(this.velocity) < this.precision
  }
}
