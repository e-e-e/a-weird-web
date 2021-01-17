export type Newable<T> = { new (...args: any[]): T; };

export class Buffer<T extends Float32Array | Int32Array> {
  buffer: WebGLBuffer | null = null
  length = 0
  spacing = 0
  data: number[][] = []
  constructor(private readonly gl: WebGLRenderingContext, private readonly target: GLenum, readonly type: Newable<T>) {
    this.gl = gl
    this.type = type
  }

  compile(type?: GLenum) {
    const gl = this.gl
    let data: number[] = []
    for (let i = 0, chunk = 10000; i < this.data.length; i += chunk) {
      data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk))
    }
    const spacing = this.data.length ? data.length / this.data.length : 0
    if (spacing != Math.round(spacing)) {
      throw new Error(
        'buffer elements not of consistent size, average size is ' + spacing
      )
    }
    this.buffer = this.buffer || gl.createBuffer()
    this.length = data.length
    this.spacing = spacing
    gl.bindBuffer(this.target, this.buffer)
    gl.bufferData(this.target, new this.type(data), type || gl.STATIC_DRAW)
  }
}

export class Mesh {}
