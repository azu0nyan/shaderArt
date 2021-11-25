#ifdef GL_ES
precision highp float;
#endif

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

#include "library.glsl"

void main( void ) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1./u_resolution;
    vec2 mouse = u_mouse/u_resolution;

    float amplitude = 0.4;
    float frequency = 4.0;

    float color1 = 0.0;
    color1 += sin((u_time +st.x) * frequency) * 0.5;
    // color1 += sin((u_time * 1.05 + st.x) * frequency * 2.2);
    // color1 += sin((u_time + st.x) * frequency * 3.2);
    color1 += sin((u_time + st.x) * frequency * 44.2) * 0.05;
    color1 += sin((u_time * 1.06 + st.x) * frequency * 46.2) * 0.05;

    color1 = color1 * amplitude * 0.5 + 0.5;
    
    float color2 = 0.0;
    color2 += perlin01(vec2((u_time* 0.2 + st.x) * frequency * 0.5 )) * 2.0;
    color2 += perlin01(vec2((u_time * 0.25 + st.x) * frequency )) * 0.05;
    color2 += perlin01(vec2((u_time * 0.3 + st.x) * frequency * 2.0)) * 0.1;
    color2 += perlin01(vec2((u_time * 5.0 + st.x) * frequency * 10.0)) * 0.1;

    color2 *= 0.5;

    float color3 = smoothstep(color1, color2, st.y);
    // color3 = 0.0;
    // color1 = step(st.y - 0.005, color1) * step(color1, st.y + 0.005);
    // color2 = step(st.y - 0.005, color2) * step(color2, st.y + 0.001);
    // color1 = 0.0;


    gl_FragColor = vec4(color1, color2, color3, 1.0);
}