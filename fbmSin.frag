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
float fbm (vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * perlin(st);
        st *= 3.0;
        amplitude *= .5;
    }
    return value;
}
vec2 fbm2(vec2 st){
    return vec2(fbm(st), fbm(st * vec2(1.231, 0.9321)));
}
vec3 fbm23(vec2 st){
    return vec3(fbm(st),
     fbm(st * vec2(1.231, 0.9321)),
     fbm(st * vec2(1.131, 0.8321))  );
}


void main( void ) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1./u_resolution;
    vec2 mouse = u_mouse/u_resolution;

    float fbmV = fbm(st * 0.2 + u_time * 0.01 );
    fbmV = fbm(vec2(st + vec2(sin(fbmV * u_time * .1) * .1,  cos(fbmV * u_time * .2) * .1)));
    // fbmV = fbm(vec2(st + vec2(sin(fbmV * u_time * .1) * .1,  cos(fbmV * u_time * .1) * .1)));
    float c1 = fbm(vec2(st + vec2(sin(fbmV * u_time * .1) * .1,  cos(fbmV * u_time * .1) * .1)));
    float c2 = fbmV = fbm(vec2(st + vec2(sin(fbmV * u_time * .21) * .11,  cos(fbmV * u_time * .31) * .21)));
    float c3 = fbmV = fbm(vec2(st + vec2(sin(fbmV * u_time * .31) * .31,  cos(fbmV * u_time * .11) * .31)));
    fbmV += 0.5;
    c1 += 0.5;
    c2 += 0.5;
    c3 += 0.5;


    
    vec3 color = vec3(c1, c2 ,c3);
    // color = vec3(fbmSin(vec2(color.x, u_time * 0.2)));
    gl_FragColor = vec4(color, 1.0);
}