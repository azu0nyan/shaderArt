#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 u_resolution;
//audio
uniform sampler2D u_tex0;


#include "library.glsl"

float fft(float val){
    return texture2D(u_tex0, vec2(val, 0.0)).x;
}
float vol(float val){
    return texture2D(u_tex0, vec2(val, 0.0)).y;
}
float fftNormalized(float val){
    val = mix(0.0, 0.9, val);
    float res = fft(pow(val, 2.0));    
    res = res * (val * 0.8 + 0.2);
    return res;
}



vec2 glitch(vec2 st){
    float bars = 4.0;
    float imupulseParam = 3.0;
    float sincParam = 3.0;
    
    vec2 varSt = st;
    // varSt.y = sin(varSt.y);
    varSt.y = sinc(varSt.y, imupulseParam);
    varSt.y = expImpulse(varSt.y, sincParam);
    varSt.y = fract(abs(varSt.y));
    varSt.y *= bars;
    float bar = floor(varSt.y);

    float barShift = fftNormalized(bar / bars);
    // barShift *= 2.0;
    // barShift = fract(barShift);
    barShift = expImpulse(barShift, 3.0);
    barShift -= 0.5;
    barShift *= 0.25;

    // st.x += bar * 0.05;
    st.x += barShift;
    st.x = fract(st.x);
    return st;
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float aspect = u_resolution.x/u_resolution.y;
    st.x *= aspect;

    st = glitch(st);
    
    
  
    vec3 color = vec3(st.xy, 0.0);
    gl_FragColor = vec4(color, 1.0);

}