# simple-spring
A stripped-back spring animation library for high-frequency animations.

<p align="center">
	<a href="https://codesandbox.io/s/threejs-meshline-custom-spring-3-ypkxx"><img src="https://imgur.com/g8ts0vJ.gif" /></a>
</p>

Click example above to view the live code!

    npm install simple-spring

# How to use

#### Import Spring

```js
import { Spring } from 'simple-spring'
```

#### Create a Spring and set a Target Value

First we create a spring and set target value for it to animate to.

```js
const springValue = new Spring()
springValue.setTarget(100)
```

#### Start Animation

Then we start the animation which will begin animating the value towards the target.

```js
springValue.start()
```

#### Get Animated Value

We can retreive the animated value at any point in time via `getValue()`.

```js
springValue.getValue()
```

# API

`new Spring()` accepts an object with the following properties.

```js
const springValue = new Spring({
    value: 0, // initial value of Spring, Number or Array of Numbers
    target: 0, // target value of Spring, Number or Array of Numbers
    tension: 170, // spring tension value
    friction: 26, // spring friction value
    mass: 1, // spring mass value
    precision: 0.01, // precision - can be increased to optimise performance
    fps: 120,  // frame rate - can be redued to optimise performance
    onStart: null, // callback with value and spring instance as arguments, fires on animation start. eg. (value, spring) => function(value)
    onFrame: null, // callback with value and spring instance as arguments, fires on animation each frame. eg. (value, spring) => function(value)
    onRest: null, // callback with value and spring instance as arguments, fires when animations is stopped, pasued, or completed. eg. (value, spring) => function(value)
    onComplete: null // callback with value and spring instance as arguments, fires on animation completion. eg. (value, spring) => function(value)
})
```

These values can also be set after instanciation, eg. `springValue.onFrame = value => updateState(value)`

#### Animation controls

The following can be used to control the animation.

- `springValue.start()` - begins animation loop
- `springValue.complete()` - end animation loop, and sets value to the target
- `springValue.stop()` - stops animation loop, and sets velocity to 0
- `springValue.pause()` - stops animation loop, but retains velocity