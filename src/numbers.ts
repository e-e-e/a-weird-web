import { GL } from "./gl/gl";
import standardVertexShader from "./shaders/number/number.vert";
import textureFragmentShader from "./shaders/number/number.frag";

function createTextCanvas(limit: number) {
  const w = 20;
  const h = 20;
  const canvas = document.createElement("canvas");
  canvas.width = w * limit;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw new Error("Could not get 2d context from canvas");
  }
  ctx.fillStyle = "#000"; // This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  ctx.textAlign = "center"; // This determines the alignment of text, e.g. left, center, right
  ctx.textBaseline = "middle"; // This determines the baseline of the text, e.g. top, middle, bottom
  ctx.font = "9px sans-serif"; // This determines the size of the text and the font family used
  for (let i = 0; i < limit; i++) {
    ctx.fillText((i-Math.floor(limit/2)).toString(), i * w + w / 2, h / 2);
  }
  // document.body.append(canvas);
  return canvas;
}

function createMesh(context: GL) {
  const gl = context.gl;
  const vertexBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array);
  vertexBuffer.data = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  vertexBuffer.compile();
  const textureCoordBuffer = context.createBuffer(
    gl.ARRAY_BUFFER,
    Float32Array
  );
  textureCoordBuffer.data = [
    [0, 1],
    [1, 1],
    [0, 0],
    [1, 0],
  ];
  textureCoordBuffer.compile();
  const viewBuffer = context.createBuffer(
    gl.ARRAY_BUFFER,
    Float32Array
  );
  viewBuffer.data = [
    [0, 1 ],
    [1, 1],
    [0, 0],
    [1, 0],
  ];
  viewBuffer.compile();
  return {
    aTextureCoord: textureCoordBuffer,
    aVertexPosition: vertexBuffer,
    aViewDimensions: viewBuffer,
  };
}



function createTextTexture(context: GL, width: number, height: number) {
  const limit = 20.0;
  const limitHalf = Math.floor(limit/2);
  const canvas = createTextCanvas(limit);
  const texture = context.createTexture(canvas.width, canvas.height, {
    data: canvas,
    wrap: context.gl.CLAMP_TO_EDGE,
    magFilter: context.gl.NEAREST,
    minFilter: context.gl.NEAREST,
  });
  const mesh = createMesh(context);
  const shader = context.createShader(
    standardVertexShader,
    textureFragmentShader,
  );
  const state: { verts: number[][]; cords: number[][], dims: number[][] } = {
    verts: [],
    cords: [],
    dims: [],
  };
  return {
    add(n: number, x: number, y: number) {
      // console.log('n:', n, x, y, width)
      // const nx = (x * 2.0 * xscale) - 1.0;
      // const ny = (y * 2.0 * yscale) - 1.0;
      const verts = [
        [x - 10, y - 10],
        [x + 10, y - 10],
        [x - 10, y + 10],
        [x + 10, y + 10],
      ];
      if (state.verts.length == 0) {
        state.verts = verts;
      } else {
        state.verts.push(state.verts[state.verts.length-1])
        state.verts.push(verts[0])
        state.verts.push(...verts)
      }
      const cords = [
        [(n+limitHalf) / limit, 0],
        [(n+limitHalf+1) / limit, 0],
        [(n+limitHalf) / limit, 1],
        [(n+limitHalf+1) / limit, 1],
      ];
      if (state.cords.length == 0) {
        state.cords = cords;
      } else {
        state.cords.push(state.cords[state.cords.length-1])
        state.cords.push(cords[0])
        state.cords.push(...cords)
      }
      // todo: make efficient
      state.dims = state.verts.map(() => [width, height])
    },
    draw() {
      mesh.aVertexPosition.data = state.verts;
      mesh.aVertexPosition.compile();
      mesh.aTextureCoord.data = state.cords;
      mesh.aTextureCoord.compile();
      mesh.aViewDimensions.data = state.dims;
      mesh.aViewDimensions.compile();
      texture.bind(0);
      shader.draw(mesh, {
        uInputTexture: 0,
      });
      state.verts = []
      state.cords = []
    },
  };
}

export function createNumbers(context: GL, width: number, height: number) {
  return createTextTexture(context, width, height);
}
