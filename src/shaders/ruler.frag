precision highp float;
precision highp sampler2D;

varying vec2 vTextureCoord;
uniform float uWidth; // = 500.0;
uniform float uOffset; //= 10.0;
uniform float uScale; //= 10.0;
//float uScale = 10.0;
uniform float uMargin; //= 10.0;
float maxHeight = 15.0;

vec4 white = vec4(1.0);
vec4 lightGrey = vec4(232.0/255.0, 234.0/255.0, 237.0/255.0, 1.0);
vec4 darkGrey = vec4(189.0/255.0, 193.0/255.0, 198.0/255.0, 1.0);
float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}
bool isTick(float x, float y) {
    bool not = !(modI(x, uScale * 6.0) <= 0.0001);
    // 7px
    bool major = !(modI(x, (uScale*3.0)) > 0.0001) && y > 3.0 && y <= 9.0;
    // 3px
    bool minor = !(modI(x, uScale) > 0.0001) && y > 0.0 && y >= 5.0 && y <= 7.0;
    return y < 0.0001 || (not && (major || minor));
}

void main() {
    float tick = 0.0;
    float x = floor(vTextureCoord.x);
    float y = floor(vTextureCoord.y);
    vec4 background = (x >= uOffset && x < uWidth + uOffset) ? white : lightGrey;
    bool drawTicks = (x >= uOffset && x < uWidth + uOffset);
    vec4 grey = isTick(x - uOffset - uMargin, y) && drawTicks ? darkGrey : background;
    gl_FragColor = grey;
}
