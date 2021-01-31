parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"GbDR":[function(require,module,exports) {
"use strict";function r(r,t){if(!(r instanceof t))throw new TypeError("Cannot call a class as a function")}function t(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function e(r,e,n){return e&&t(r.prototype,e),n&&t(r,n),r}function n(r,t){return f(r)||u(r,t)||i(r,t)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function i(r,t){if(r){if("string"==typeof r)return a(r,t);var e=Object.prototype.toString.call(r).slice(8,-1);return"Object"===e&&r.constructor&&(e=r.constructor.name),"Map"===e||"Set"===e?Array.from(r):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?a(r,t):void 0}}function a(r,t){(null==t||t>r.length)&&(t=r.length);for(var e=0,n=new Array(t);e<t;e++)n[e]=r[e];return n}function u(r,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(r)){var e=[],n=!0,o=!1,i=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(e.push(a.value),!t||e.length!==t);n=!0);}catch(f){o=!0,i=f}finally{try{n||null==u.return||u.return()}finally{if(o)throw i}}return e}}function f(r){if(Array.isArray(r))return r}function c(r,t,e){var n=r.createShader(t);if(!n)throw new Error("Cannot create new GL Shader");if(r.shaderSource(n,e),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS))throw new Error("compile error: "+r.getShaderInfoLog(n));return n}function l(r,t,e){var n=r.createProgram();if(!n)throw new Error("Cannot create new GL Program");if(r.attachShader(n,c(r,r.VERTEX_SHADER,t)),r.attachShader(n,c(r,r.FRAGMENT_SHADER,e)),r.linkProgram(n),!r.getProgramParameter(n,r.LINK_STATUS))throw new Error("link error: "+r.getProgramInfoLog(n));return n}function s(r){return parseInt(r.slice(1,-1),10)}function m(r,t,e){if(r[t])throw new Error("uniform declared more than once");r[t]={type:e}}function h(r){for(var t,e=/uniform (\w+(\[\d+])?) ([a-zA-Z0-9_]*)(\[\d+])?;/gm,o={};null!==(t=e.exec(r));){console.log(t);var i=n(t,5),a=(i[0],i[1]),u=i[2],f=i[3],c=i[4];if(u||c){var l=s(u||c),h=a.replace(u||"",""),v=f.replace(c||"","");if(a.startsWith("mat"))for(var y=0;y<l;y++){m(o,"".concat(v,"[").concat(y,"]"),h)}else m(o,v,h+"Array")}else m(o,f,a)}return console.log(o),o}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Shader=void 0;var v=function(){function t(e,n,o){r(this,t),this.gl=e,this.program=l(e,n,o),this._uniforms=h(n+o),this._attributes={},this._uniformFuncByType={float:function(r,t){return e.uniform1f(r,t)},floatArray:function(r,t){return e.uniform1fv(r,t)},int:function(r,t){return e.uniform1i(r,t)},sampler2D:function(r,t){return e.uniform1i(r,t)},sampler2DArray:function(r,t){return e.uniform1iv(r,t)},sampler3D:function(r,t){return e.uniform1i(r,t)},vec2:function(r,t){return e.uniform2fv(r,t)},vec3:function(r,t){return e.uniform3fv(r,t)},vec4:function(r,t){return e.uniform4fv(r,t)},mat2:function(r,t){return e.uniformMatrix2fv(r,!1,t)},mat3:function(r,t){return e.uniformMatrix3fv(r,!1,t)},mat4:function(r,t){return e.uniformMatrix4fv(r,!1,t)}}}return e(t,[{key:"uniforms",value:function(r){var t=this.gl;for(var e in t.useProgram(this.program),r){var n=this._uniforms[e];if(n){var o=n.location||t.getUniformLocation(this.program,e);if(o)n.location=o,(0,this._uniformFuncByType[n.type])(o,r[e])}}}},{key:"draw",value:function(r,t,e){var n=r.indexBuffer,o=n?r.vertexBuffers:r,i=this.gl;this.uniforms(t||{});var a=0,u=null;for(u in o){var f=o[u],c=this._attributes[u]||i.getAttribLocation(this.program,u);-1!=c&&f.buffer&&(this._attributes[u]=c,i.bindBuffer(i.ARRAY_BUFFER,f.buffer),i.enableVertexAttribArray(c),i.vertexAttribPointer(c,f.spacing,i.FLOAT,!1,0,0),a=f.length/f.spacing)}for(u in this._attributes)u in o||i.disableVertexAttribArray(this._attributes[u]);a&&(n?(i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,n.buffer),i.drawElements(e||i.TRIANGLES,n.bufferLength,i.UNSIGNED_SHORT,0)):i.drawArrays(e||i.TRIANGLE_STRIP,0,a))}}]),t}();exports.Shader=v;
},{}],"bDrf":[function(require,module,exports) {

"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function r(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Mesh=exports.Buffer=void 0;var i=function(){function e(r,i,n){t(this,e),this.gl=r,this.target=i,this.type=n,this.buffer=null,this.length=0,this.spacing=0,this.data=[],this.gl=r,this.type=n}return r(e,[{key:"compile",value:function(t){for(var e=this.gl,r=[],i=0;i<this.data.length;i+=1e4)r=Array.prototype.concat.apply(r,this.data.slice(i,i+1e4));var n=this.data.length?r.length/this.data.length:0;if(n!=Math.round(n))throw new Error("buffer elements not of consistent size, average size is "+n);this.buffer=this.buffer||e.createBuffer(),this.length=r.length,this.spacing=n,e.bindBuffer(this.target,this.buffer),e.bufferData(this.target,new this.type(r),t||e.STATIC_DRAW)}}]),e}();exports.Buffer=i;var n=function e(){t(this,e)};exports.Mesh=n;
},{}],"YtYZ":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function r(e,r,i){return r&&t(e.prototype,r),i&&t(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Texture=void 0;var i=null,n=null,a=function(){function t(r,i,n,a){e(this,t),this.gl=r,this.width=i,this.height=n,this.id=r.createTexture();var T=a.format||r.RGBA,o=a.type||r.UNSIGNED_BYTE,f=a.filter||a.magFilter||r.LINEAR,l=a.filter||a.minFilter||r.LINEAR;if(o===r.FLOAT){if(!E(r))throw new Error("OES_texture_float is required but not supported");if((l!==r.NEAREST||f!==r.NEAREST)&&!u(r))throw new Error("OES_texture_float_linear is required but not supported")}r.bindTexture(r.TEXTURE_2D,this.id),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,1),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,f),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,l),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,a.wrap||a.wrapS||r.REPEAT),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,a.wrap||a.wrapT||r.REPEAT),a.data instanceof Image||a.data instanceof HTMLCanvasElement?r.texImage2D(r.TEXTURE_2D,0,r.RGBA,T,o,a.data||null):r.texImage2D(r.TEXTURE_2D,0,r.RGBA,i,n,0,T,o,a.data||null)}return r(t,[{key:"drawTo",value:function(e){var t=this.gl,r=t.getParameter(t.VIEWPORT);if(i=i||t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.id,0),t.checkFramebufferStatus(t.FRAMEBUFFER)!=t.FRAMEBUFFER_COMPLETE)throw new Error("Rendering to this texture is not supported (incomplete framebuffer)");t.viewport(0,0,this.width,this.height),e(),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(r[0],r[1],r[2],r[3])}},{key:"bind",value:function(e){var t=this.gl;t.activeTexture(t.TEXTURE0+(e||0)),t.bindTexture(t.TEXTURE_2D,this.id)}},{key:"unbind",value:function(e){var t=this.gl;t.activeTexture(t.TEXTURE0+(e||0)),t.bindTexture(t.TEXTURE_2D,null)}}]),t}();function E(e){return!!e.getExtension("EXT_color_buffer_float")}function u(e){return!!e.getExtension("OES_texture_float_linear")}exports.Texture=a;
},{}],"tG5k":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.GL=void 0;var r=require("./shader"),i=require("./buffer"),a=require("./texture");function u(e){var t;try{t=e.getContext("webgl")}catch(n){}if(!t)throw new Error("WebGL not supported");return t}var o=function(){function t(n){var r=this;e(this,t),this.canvas=n,this._onUpdate=null,this._onDraw=null,this._time=0,this._intervalId=null,this.running=!1,this.update=function(){if(r.running){var e=(new Date).getTime();r._onUpdate&&r._onUpdate((e-r._time)/1e3),r._onDraw&&r._onDraw(),r._intervalId=window.requestAnimationFrame(r.update),r._time=e}},this.canvas=n,this.gl=u(n)}return n(t,[{key:"createTexture",value:function(e,t,n){return new a.Texture(this.gl,e,t,n)}},{key:"createShader",value:function(e,t){return new r.Shader(this.gl,e,t)}},{key:"createBuffer",value:function(e,t){return new i.Buffer(this.gl,e,t)}},{key:"onUpdate",value:function(e){this._onUpdate=e}},{key:"onDraw",value:function(e){this._onDraw=e}},{key:"viewport",value:function(e,t){this.gl.viewport(0,0,e,t)}},{key:"clear",value:function(e,t,n,r){var i=this.gl;i.clearColor(e||0,t||0,n||0,r||1),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT)}},{key:"start",value:function(){this.running||(this._time=(new Date).getTime(),this.running=!0,this.update())}},{key:"stop",value:function(){this.running&&(this.running=!1,this._intervalId&&(window.cancelAnimationFrame(this._intervalId),this._intervalId=null))}}]),t}();exports.GL=o;
},{"./shader":"GbDR","./buffer":"bDrf","./texture":"YtYZ"}],"tgbp":[function(require,module,exports) {
module.exports="precision highp float;\n#define GLSLIFY 1\n\nattribute vec4 aVertexPosition;\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n\nvoid main() {\n  vTextureCoord = aTextureCoord;\n  gl_Position = aVertexPosition;\n}\n";
},{}],"hVTO":[function(require,module,exports) {
module.exports="precision highp float;\nprecision highp sampler2D;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform float uWidth; // = 500.0;\nuniform float uOffset; //= 10.0;\nuniform float uScale; //= 10.0;\n//float uScale = 10.0;\nuniform float uMargin; //= 10.0;\nfloat maxHeight = 15.0;\n\nvec4 white = vec4(1.0);\nvec4 lightGrey = vec4(232.0/255.0, 234.0/255.0, 237.0/255.0, 1.0);\nvec4 darkGrey = vec4(189.0/255.0, 193.0/255.0, 198.0/255.0, 1.0);\nfloat modI(float a,float b) {\n    float m=a-floor((a+0.5)/b)*b;\n    return floor(m+0.5);\n}\nbool isTick(float x, float y) {\n    bool not = !(modI(x, uScale * 6.0) <= 0.0001);\n    // 7px\n    bool major = !(modI(x, (uScale*3.0)) > 0.0001) && y > 3.0 && y <= 9.0;\n    // 3px\n    bool minor = !(modI(x, uScale) > 0.0001) && y > 0.0 && y >= 5.0 && y <= 7.0;\n    return y < 0.0001 || (not && (major || minor));\n}\n\nvoid main() {\n    float tick = 0.0;\n    float x = floor(vTextureCoord.x);\n    float y = floor(vTextureCoord.y);\n    vec4 background = (x >= uOffset && x < uWidth + uOffset) ? white : lightGrey;\n    bool drawTicks = (x >= uOffset && x < uWidth + uOffset);\n    vec4 grey = isTick(x - uOffset - uMargin, y) && drawTicks ? darkGrey : background;\n    gl_FragColor = grey;\n}\n";
},{}],"DODv":[function(require,module,exports) {
module.exports="precision highp float;\n#define GLSLIFY 1\n\nattribute vec4 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aViewDimensions;\nvarying vec2 vTextureCoord;\n\nfloat scale(float v, float max) {\n    return ((v / max) * 2.0) - 1.0;\n}\n\nvoid main() {\n    vTextureCoord = aTextureCoord;\n    gl_Position = vec4(scale(aVertexPosition.x, aViewDimensions.x), scale(aVertexPosition.y, aViewDimensions.y), 0, 1);\n}\n";
},{}],"F32p":[function(require,module,exports) {
module.exports="precision highp float;\nprecision highp sampler2D;\n#define GLSLIFY 1\n\nuniform sampler2D uInputTexture;\n\nvarying vec2 vTextureCoord;\n// out vec4 fragColor;\n\nvoid main() {\n    gl_FragColor = texture2D(uInputTexture, vTextureCoord);\n}\n";
},{}],"cWsb":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createNumbers=void 0;var r=e(require("./shaders/number/number.vert")),t=e(require("./shaders/number/number.frag"));function a(e){var r=document.createElement("canvas");r.width=20*e,r.height=20;var t=r.getContext("2d");if(null==t)throw new Error("Could not get 2d context from canvas");t.fillStyle="#000",t.textAlign="center",t.textBaseline="middle",t.font="9px sans-serif";for(var a=0;a<e;a++)t.fillText((a-Math.floor(e/2)).toString(),20*a+10,10);return r}function o(e){var r=e.gl,t=e.createBuffer(r.ARRAY_BUFFER,Float32Array);t.data=[[-1,-1],[1,-1],[-1,1],[1,1]],t.compile();var a=e.createBuffer(r.ARRAY_BUFFER,Float32Array);a.data=[[0,1],[1,1],[0,0],[1,0]],a.compile();var o=e.createBuffer(r.ARRAY_BUFFER,Float32Array);return o.data=[[0,1],[1,1],[0,0],[1,0]],o.compile(),{aTextureCoord:a,aVertexPosition:t,aViewDimensions:o}}function s(e,s,n){var i=Math.floor(10),u=a(20),d=e.createTexture(u.width,u.height,{data:u,wrap:e.gl.CLAMP_TO_EDGE,magFilter:e.gl.NEAREST,minFilter:e.gl.NEAREST}),l=o(e),c=e.createShader(r.default,t.default),f={verts:[],cords:[],dims:[]};return{add:function(e,r,t){var a,o=[[r-10,t-10],[r+10,t-10],[r-10,t+10],[r+10,t+10]];0==f.verts.length?f.verts=o:(f.verts.push(f.verts[f.verts.length-1]),f.verts.push(o[0]),(a=f.verts).push.apply(a,o));var u,d=[[(e+i)/20,0],[(e+i+1)/20,0],[(e+i)/20,1],[(e+i+1)/20,1]];0==f.cords.length?f.cords=d:(f.cords.push(f.cords[f.cords.length-1]),f.cords.push(d[0]),(u=f.cords).push.apply(u,d));f.dims=f.verts.map(function(){return[s,n]})},draw:function(){l.aVertexPosition.data=f.verts,l.aVertexPosition.compile(),l.aTextureCoord.data=f.cords,l.aTextureCoord.compile(),l.aViewDimensions.data=f.dims,l.aViewDimensions.compile(),d.bind(0),c.draw(l,{uInputTexture:0}),f.verts=[],f.cords=[]}}}function n(e,r,t){return s(e,r,t)}exports.createNumbers=n;
},{"./shaders/number/number.vert":"DODv","./shaders/number/number.frag":"F32p"}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./gl/gl"),t=e(require("./shaders/standard.vert")),a=e(require("./shaders/ruler.frag")),n=require("./numbers");function i(e,r,t,a){var n=e.gl,i=e.createBuffer(n.ARRAY_BUFFER,Float32Array),o=15*r*2/a-1,u=15*(r+1)*2/a-1;i.data=[[-1,o],[1,o],[-1,u],[1,u]],i.compile();var d=e.createBuffer(n.ARRAY_BUFFER,Float32Array);return d.data=[[0,15],[t,15],[0,0],[t,0]],d.compile(),{aTextureCoord:d,aVertexPosition:i}}function o(e){var r=e.width,t=e.margin;return{uWidth:r,uOffset:e.offset||0,uScale:e.scale||10,uMargin:t||0}}function u(e){return(Math.sin(e*Math.PI*2)+1)/2}function d(e,r,n){var d=Math.ceil(n/15),c=Array.from({length:d},function(t,a){return i(e,a,r,n)}),f=e.createShader(t.default,a.default),h=0,l=0;return{update:function(e){h+=e,l=(l+e)%1,e%10},draw:function(e){return c.forEach(function(r,t){for(var a=100+100*Math.cos(h+(t-30)/30),n=t+20*(.5*Math.sin(h+.2*(t+40))+1),i=500+200*Math.sin(h+(t+30)/30),d=(t+200*u((h+(t-30)/30)/5))%i,c=6*n,l=Math.floor(i/c),s=Math.floor(d/c),g=15*t+7,w=0;w<=l;w++){var v=w*c+a+d%c;v<=i+a&&e.add(w-s,v,g)}f.draw(r,o({width:i,scale:n,offset:a,margin:d}))})}}}function c(e,r){return e-e%r}window.onload=function(){var e=document.createElement("canvas");e.width=window.innerWidth,e.height=window.innerHeight,console.log(e.height);var t=new r.GL(e);t.gl.enable(t.gl.BLEND),t.gl.blendFunc(t.gl.ONE,t.gl.ONE_MINUS_SRC_ALPHA),t.viewport(e.width,e.height);var a=d(t,e.width,e.height),i=n.createNumbers(t,e.width,e.height);t.onUpdate(function(e){a.update(e)}),t.onDraw(function(){t.clear(),a.draw(i),i.draw()}),t.start(),document.body.append(e)};
},{"./gl/gl":"tG5k","./shaders/standard.vert":"tgbp","./shaders/ruler.frag":"hVTO","./numbers":"cWsb"}]},{},["QCba"], null)
//# sourceMappingURL=/src.8d3ef887.js.map