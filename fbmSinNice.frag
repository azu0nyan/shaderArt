#ifdef GL_ES
precision highp float;
#endif

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

#include "library.glsl"


#define OCTAVES 6
float fbmSin (vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * (sin(st.x + 123.231 + sin(st.y * 0.921 + 12.2323)));
        st *= 2.0;
        amplitude *= .99;
    }
    return value;
}



void main( void ) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1./u_resolution;
    vec2 mouse = u_mouse/u_resolution;


    vec3 color = vec3(fbmSin(st ) + .5);
    color = vec3(fbmSin(vec2(color.x, u_time * 0.2)));
    gl_FragColor = vec4(color, 1.0);
}