declare module 'simple-spring' {
  export interface SpringOptions {
    value?: number | number[]
    target?: number | number[]
    tension?: number
    friction?: number
    mass?: number
    precision?: number
    fps?: number
    onStart?: ((value: number | number[], spring: Spring) => void) | null
    onFrame?: ((value: number | number[], spring: Spring) => void) | null
    onRest?: ((value: number | number[], spring: Spring) => void) | null
    onComplete?: ((value: number | number[], spring: Spring) => void) | null
  }

  export class Spring {
    constructor(options?: SpringOptions)
    set value(val: number | number[])
    get value(): number | number[]
    getValue(): number | number[]
    set target(val: number | number[])
    get target(): number | number[]
    setTarget(val: number | number[]): this
    start(): this
    pause(): this
    stop(): this
    complete(): this
    tick(t?: number): this
    animateFrame(): void
    get restingAtTarget(): boolean
    get restingAtStart(): boolean
  }
}
