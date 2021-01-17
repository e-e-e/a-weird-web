import {GL} from './gl/gl'
import standardVertexShader from './shaders/standard.vert';
import textureFragmentShader from './shaders/texture.frag';
import hedgehog from './hedgehog.jpg'
import {Texture} from "./gl/texture";

function createMesh(context: GL) {
  const gl = context.gl
  const vertexBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array)
  vertexBuffer.data = [[-1, 1], [1, 1], [-1, -1], [1, -1]]
  vertexBuffer.compile()
  const textureCoordBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array)
  textureCoordBuffer.data = [[0, 1], [1, 1], [0, 0], [1, 0]]
  textureCoordBuffer.compile()
  return {
    aTextureCoord: textureCoordBuffer,
    aVertexPosition: vertexBuffer
  }
}


window.onload = () => {
  console.log(hedgehog);

  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 300
  const gl = new GL(canvas)
  gl.viewport(canvas.width, canvas.height)
  const image = new Image();
  image.src = hedgehog;
  let texture: Texture | null = null;
  image.onload = () => {
    console.log(image.width, image.height)
    texture = gl.createTexture(image.width,  image.height, { data: image, wrap: gl.gl.CLAMP_TO_EDGE})
  }
  const mesh = createMesh(gl)
  const shader = gl.createShader(
    standardVertexShader,
    textureFragmentShader
  )

  const drawTexture = (inputTexture: Texture) => {
    inputTexture.bind(0)
    shader.draw(mesh, {
      uInputTexture: 0
    })
  }

  gl.onDraw(() => {
    gl.clear()
    texture && drawTexture(texture)
  })
  gl.start()
  document.body.append(canvas)
}
