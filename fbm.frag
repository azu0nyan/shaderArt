#ifdef GL_ES
precision highp float;
#endif

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

#include "library.glsl"




#define OCTAVES 6
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

    // st = vec2(polarAngleNormalized(st),  polarLength(st) );

    float c = fbm(st);
    float c1 = fbm(vec2(c + sin(u_time * 0.05), c + cos(u_time * 0.1)));
    float c2 = fbm(vec2(c + sin(u_time * 0.02), c + cos(u_time * 0.2)));
    float c3 = fbm(vec2(c + sin(u_time * 0.01), c + cos(u_time * 0.121)));
    c1+= 0.5;
    c2+= 0.5;
    c3+= 0.7;
    vec3 color = vec3(c1, c2, c3);
    // vec3 color = vec3(fbm2(fbm2(st+ u_time* 0.2)), 0.0);
    // vec3 color = fbm23(st + u_time * 0.2) + vec3(0.5);
    gl_FragColor = vec4(color, 1.0);
}