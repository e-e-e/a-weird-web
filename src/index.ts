import { GL } from "./gl/gl";
import standardVertexShader from "./shaders/standard.vert";
import rulerFragmentShader from "./shaders/ruler.frag";
import { Buffer } from "./gl/buffer";
import { createNumbers } from "./numbers";

type RulerMesh = {
  aTextureCoord: Buffer<any>;
  aVertexPosition: Buffer<any>;
};

function createRulerMesh(
  context: GL,
  verticalOffset: number,
  width: number,
  height: number
): RulerMesh {
  const rulerHeight = 15;
  const gl = context.gl;
  const vertexBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array);
  const v1 = (verticalOffset * rulerHeight * 2.0) / height - 1.0;
  const v2 = ((verticalOffset + 1) * rulerHeight * 2.0) / height - 1.0;
  vertexBuffer.data = [
    [-1, v1],
    [1, v1],
    [-1, v2],
    [1, v2],
  ];
  vertexBuffer.compile();
  const textureCoordBuffer = context.createBuffer(
    gl.ARRAY_BUFFER,
    Float32Array
  );
  textureCoordBuffer.data = [
    [0, rulerHeight],
    [width, rulerHeight],
    [0, 0],
    [width, 0],
  ];
  textureCoordBuffer.compile();
  return {
    aTextureCoord: textureCoordBuffer,
    aVertexPosition: vertexBuffer,
  };
}

function createRuleUniforms({
  width,
  margin,
  offset,
  scale,
}: {
  width: number;
  offset?: number;
  scale?: number;
  margin?: number;
}) {
  return {
    uWidth: width,
    uOffset: offset || 0,
    uScale: scale || 10,
    uMargin: margin || 0,
  };
}

function osc(x: number) {
  return (Math.sin(x * Math.PI * 2) + 1) / 2;
}

function createRulers(context: GL, width: number, height: number) {
  const x = Math.ceil(height / 15);
  const rulerMeshes = Array.from({ length: x }, (_, i) =>
    createRulerMesh(context, i, width, height)
  );
  const shader = context.createShader(
    standardVertexShader,
    rulerFragmentShader
  );
  let acc = 0;
  let t = 0;
  let s = 0;
  return {
    update: (delta: number) => {
      acc += delta;
      t = (t + delta) % 1;
      s = s + (delta % 10);
    },
    draw: (numbers: any) =>
      rulerMeshes.forEach((mesh, i) => {
        // where do we draw our numbers
        const offset = 100 + Math.cos(acc + (i - 30) / 30) * 100;
        const scale = i + (Math.sin(acc + (i + 40) * 0.2) * 0.5 + 1) * 20;
        const width = 500 + Math.sin(acc + (i + 30) / 30) * 200;
        const margin = (i + osc((acc + (i - 30) / 30) / 5) * 200) % width;
        const step = scale * 6;
        const range = Math.floor(width / step);
        const tickOffset = Math.floor(margin / step);
        const y = i * 15 + 7;
        for (let x = 0; x <= range; x++) {
          const next = x * step + offset + (margin % step);
          if (next <= width + offset) numbers.add(x - tickOffset, next, y);
        }
        shader.draw(mesh, createRuleUniforms({ width, scale, offset, margin }));
      }),
  };
}

function ssss(v: number, m: number) {
  return v - (v % m);
}

window.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth; //ssss(window.innerWidth, 256);
  canvas.height = window.innerHeight; //ssss(window.innerWidth, 256);
  console.log(canvas.height);
  const gl = new GL(canvas);
  gl.gl.enable(gl.gl.BLEND);
  gl.gl.blendFunc(gl.gl.ONE, gl.gl.ONE_MINUS_SRC_ALPHA);
  // gl.gl.blendFunc(gl.gl.SRC_COLOR, gl.gl.DST_COLOR);
  gl.viewport(canvas.width, canvas.height);
  const rulers = createRulers(gl, canvas.width, canvas.height);
  const numbers = createNumbers(gl, canvas.width, canvas.height);
  gl.onUpdate((t) => {
    // console.log(t);
    rulers.update(t);
  });
  gl.onDraw(() => {
    gl.clear();
    rulers.draw(numbers);
    numbers.draw();
  });
  gl.start();
  document.body.append(canvas);
};
