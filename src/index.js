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
    this.springStartValue = 0
    this.springValue = 0
    this.springTargetValue = 0
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
    this.getValue = this.getValue.bind(this)
    this.setTarget = this.setTarget.bind(this)
    this.start = this.start.bind(this)
    this.pause = this.pause.bind(this)
    this.stop = this.stop.bind(this)
    this.complete = this.complete.bind(this)
    this.tick = this.tick.bind(this)
    this.animateFrame = this.animateFrame.bind(this)
  }
  set value(val) {
    if (val.constructor === Array) {
      const sumVals = val.reduce((previous, current) => (current += previous))
      const avgVal = sumVals / val.length
      this.springStartValue = avgVal
      this.springValue = avgVal
      this.startValue = val
      this.dataType = 'array'
    } else {
      this.springStartValue = val
      this.springValue = val
      this.startValue = val
      this.dataType = 'number'
    }
  }
  get value() {
    if (this.dataType === 'array') {
      if (this.restingAtStart) return this.startValue
      if (this.restingAtTarget) return this.targetValue
      const percentProgress = (this.springValue - this.springStartValue) / ((this.springTargetValue - this.springStartValue) || 1)
      return this.startValue.map((v, i) => {
        return (this.targetValue[i] - this.startValue[i]) * percentProgress + this.startValue[i]
      })
    } else {
      return this.springValue
    }
  }
  getValue() {
    // get the most recent value at request time
    return this.tick().value
  }
  set target(val) {
    if (val.constructor === Array) {
      const sumVals = val.reduce((previous, current) => (current += previous))
      const avgVal = sumVals / val.length
      this.springTargetValue = avgVal
      this.targetValue = val
    } else {
      this.springTargetValue = val
      this.targetValue = val
    }
  }
  get target() {
    return this.targetValue
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
    if (this.onStart) this.onStart(this.value, this)
    return this
  }
  pause() {
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest(this.value, this)
    return this
  }
  stop() {
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest(this.value, this)
    return this
  }
  complete() {
    this.springValue = this.springTargetValue
    this.velocity = 0
    this.prevTime = null
    this.resting = true
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
    if (this.onRest) this.onRest(this.value, this)
    if (this.onComplete) this.onComplete(this.value, this)
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
    let force = -this.tension * (this.springValue - this.springTargetValue)
    let damping = -this.friction * this.velocity
    let acceleration = (force + damping) / this.mass
    this.velocity += acceleration / this.fps
    this.springValue += this.velocity / this.fps
    if (this.onFrame) this.onFrame(this.springValue, this)
    if (this.restingAtTarget) {
      this.complete()
    }
  }
  get restingAtTarget() {
    return Math.abs(this.springValue - this.springTargetValue) < this.precision && Math.abs(this.velocity) < this.precision
  }
  get restingAtStart() {
    return Math.abs(this.springValue - this.springStartValue) < this.precision && Math.abs(this.velocity) < this.precision
  }
}
