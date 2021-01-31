precision highp float;

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aViewDimensions;
varying vec2 vTextureCoord;

float scale(float v, float max) {
    return ((v / max) * 2.0) - 1.0;
}

void main() {
    vTextureCoord = aTextureCoord;
    gl_Position = vec4(scale(aVertexPosition.x, aViewDimensions.x), scale(aVertexPosition.y, aViewDimensions.y), 0, 1);
}
