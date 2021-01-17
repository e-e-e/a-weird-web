import { Shader } from './shader'
import { Buffer } from './buffer'
import { Texture } from './texture'

function createGlContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
  let gl
  try {
    gl = canvas.getContext('webgl')
    // eslint-disable-next-line no-empty
  } catch (e) {}
  // try {
  //   gl = gl || canvas.getContext('experimental-webgl')
  //   // eslint-disable-next-line no-empty
  // } catch (e) {}
  if (!gl) throw new Error('WebGL not supported')
  return gl
}

export class GL {
  readonly gl: WebGLRenderingContext
  private _onUpdate: ((time: number) => void) | null = null
  private _onDraw: (() => void) | null = null
  private _time: number = 0
  private _intervalId: number | null = null
  running = false

  constructor(readonly canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.gl = createGlContext(canvas)
  }

  createTexture(width: number, height: number, options: any) {
    return new Texture(this.gl, width, height, options)
  }

  // createTexture3D(width: number, height: number, depth: number, options: any) {
  //   return new Texture3D(this.gl, width, height, depth, options)
  // }

  createShader(vertexShader: string, fragmentShader: string) {
    return new Shader(this.gl, vertexShader, fragmentShader)
  }

  createBuffer(target: GLenum, type: any) {
    return new Buffer(this.gl, target, type)
  }

  onUpdate(cb: (time: number) => void) {
    this._onUpdate = cb
  }

  onDraw(cb: () => void) {
    this._onDraw = cb
  }

  viewport(width: number, height: number) {
    this.gl.viewport(0, 0, width, height)
  }

  clear(r?: number, g?: number, b?: number, a?: number) {
    const gl = this.gl
    gl.clearColor(r || 0.0, g || 0.0, b || 0.0, a || 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  start() {
    if (this.running) return
    this._time = new Date().getTime()
    this.running = true
    this.update()
  }

  stop() {
    if (!this.running) return
    this.running = false
    if (this._intervalId) {
      window.cancelAnimationFrame(this._intervalId)
      this._intervalId = null
    }
  }

  private update = () => {
    if (!this.running) return
    const now = new Date().getTime()
    if (this._onUpdate) this._onUpdate((now - this._time) / 1000)
    if (this._onDraw) this._onDraw()
    this._intervalId = window.requestAnimationFrame(this.update)
    this._time = now
  }
}
