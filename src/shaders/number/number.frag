precision highp float;
precision highp sampler2D;

uniform sampler2D uInputTexture;
uniform vec4 uColor;

varying vec2 vTextureCoord;
// out vec4 fragColor;

void main() {
    gl_FragColor = texture2D(uInputTexture, vTextureCoord) * uColor;
}
