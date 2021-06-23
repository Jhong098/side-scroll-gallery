uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793258;
void main() {
    vec2 newUV = vUv;
    newUV.x -= 0.5;
    newUV.x *= 0.25 * resolution.x/resolution.y;
    newUV.x += 0.5;

    newUV = fract(newUV*5.);
    vec4 map = texture2D(texture1, newUV);
    gl_FragColor = vec4(vUv, 0.0, 1.);
    gl_FragColor = map;
}