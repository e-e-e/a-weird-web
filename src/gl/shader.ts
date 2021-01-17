function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error("Cannot create new GL Shader")
  }
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('compile error: ' + gl.getShaderInfoLog(shader))
  }
  return shader
}

function createShaderProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
  const program = gl.createProgram()
  if (!program) {
    throw new Error("Cannot create new GL Program")
  }
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShader))
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  )
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('link error: ' + gl.getProgramInfoLog(program))
  }
  return program
}

function extractArrayNumber(str: string): number {
  return parseInt(str.slice(1, -1), 10)
}

type Uniforms = Record<string, { type: keyof UniformFunctionsByType, location?: WebGLUniformLocation }>

function attachUniform(uniforms: Uniforms, name: string, type: string) {
  if (uniforms[name]) {
    throw new Error(`uniform declared more than once`)
  }
  uniforms[name] = { type: type as keyof UniformFunctionsByType }
}

function extractUniforms(str: string): Uniforms {
  const re = /uniform (\w+(\[\d+])?) ([a-zA-Z0-9_]*)(\[\d+])?;/gm
  let match
  const uniforms: Uniforms = {}
  while ((match = re.exec(str)) !== null) {
    console.log(match)
    const [_, type, arrayType, varName, arrayTypeInName] = match
    if (arrayType || arrayTypeInName) {
      const num = extractArrayNumber(arrayType || arrayTypeInName)
      const typeWithoutArray = type.replace(arrayType || '', '')
      const nameWithoutArray = varName.replace(arrayTypeInName || '', '')
      if (type.startsWith('mat')) {
        for (let i = 0; i < num; i++) {
          const name = `${nameWithoutArray}[${i}]`
          attachUniform(uniforms, name, typeWithoutArray)
        }
      } else {
        attachUniform(uniforms, nameWithoutArray, typeWithoutArray + 'Array')
      }
    } else {
      attachUniform(uniforms, varName, type)
    }
  }
  console.log(uniforms)
  return uniforms
}

type UniformFunctionsByType = {
  float: (location: WebGLUniformLocation | null, data: number) => void,
  floatArray: (location: WebGLUniformLocation | null, data: Float32List) => void,
  int: (location: WebGLUniformLocation | null, data: number) => void,
  // uint: (location: WebGLUniformLocation | null, data) => void,
  sampler2D: (location: WebGLUniformLocation | null, data: number) => void,
  sampler2DArray: (location: WebGLUniformLocation | null, data: Int32List) => void,
  sampler3D: (location: WebGLUniformLocation | null, data: number) => void,
  vec2: (location: WebGLUniformLocation | null, data: Float32List) => void,
  vec3: (location: WebGLUniformLocation | null, data: Float32List) => void,
  vec4: (location: WebGLUniformLocation | null, data: Float32List) => void,
  mat2: (location: WebGLUniformLocation | null, data: Float32List) => void,
  mat3: (location: WebGLUniformLocation | null, data: Float32List) => void,
  mat4: (location: WebGLUniformLocation | null, data: Float32List) => void,
}

export class Shader {
  readonly program: WebGLProgram;
  private readonly _uniformFuncByType: UniformFunctionsByType;
  private readonly _uniforms: Uniforms
  private readonly _attributes: any

  constructor(private readonly gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
    this.program = createShaderProgram(gl, vertexShader, fragmentShader)
    this._uniforms = extractUniforms(vertexShader + fragmentShader)
    this._attributes = {}
    this._uniformFuncByType = {
      float: (location: WebGLUniformLocation | null, data: number) => gl.uniform1f(location, data),
      floatArray: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniform1fv(location, data),
      int: (location: WebGLUniformLocation | null, data: number) => gl.uniform1i(location, data),
      // uint: (location: WebGLUniformLocation | null, data) => gl.uniform1ui(location, data),
      sampler2D: (location: WebGLUniformLocation | null, data: number) => gl.uniform1i(location, data),
      sampler2DArray: (location: WebGLUniformLocation | null, data: Int32List) => gl.uniform1iv(location, data),
      sampler3D: (location: WebGLUniformLocation | null, data: number) => gl.uniform1i(location, data),
      vec2: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniform2fv(location, data),
      vec3: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniform3fv(location, data),
      vec4: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniform4fv(location, data),
      mat2: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniformMatrix2fv(location, false, data),
      mat3: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniformMatrix3fv(location, false, data),
      mat4: (location: WebGLUniformLocation | null, data: Float32List) => gl.uniformMatrix4fv(location, false, data)
    }
  }

  uniforms(uniforms: Record<string, number | Float32List | Int32List>) {
    const gl = this.gl
    gl.useProgram(this.program)
    for (let name in uniforms) {
      const uniform = this._uniforms[name]
      if (!uniform) continue
      const location =
        uniform.location || gl.getUniformLocation(this.program, name)
      if (!location) continue
      uniform.location = location
      const setUniformOfType = this._uniformFuncByType[uniform.type]
      setUniformOfType(location, uniforms[name] as any)
    }
  }

  draw(buffers: any, uniforms: Record<string, number | Float32List | Int32List>, mode?: GLenum) {
    const indexBuffer = buffers.indexBuffer
    const vertexBuffers = indexBuffer ? buffers.vertexBuffers : buffers
    const gl = this.gl
    this.uniforms(uniforms || {})
    // Create and enable attribute pointers as necessary.
    let length = 0
    let attribute = null
    for (attribute in vertexBuffers) {
      var buffer = vertexBuffers[attribute]
      var location =
        this._attributes[attribute] ||
        gl.getAttribLocation(this.program, attribute)
      if (location == -1 || !buffer.buffer) continue
      this._attributes[attribute] = location
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(
        location,
        buffer.spacing,
        gl.FLOAT,
        false,
        0,
        0
      )
      length = buffer.length / buffer.spacing
    }

    // Disable unused attribute pointers.
    for (attribute in this._attributes) {
      if (!(attribute in vertexBuffers)) {
        gl.disableVertexAttribArray(this._attributes[attribute])
      }
    }
    if (length) {
      if (!indexBuffer) {
        gl.drawArrays(mode || gl.TRIANGLE_STRIP, 0, length)
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer)
        gl.drawElements(
          mode || gl.TRIANGLES,
          indexBuffer.bufferLength,
          gl.UNSIGNED_SHORT,
          0
        )
      }
    }
  }
}
