


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

float shiftPoint(float from, float to, float val){
    if(val < from){
        return (val / from) * to;
    } else {
        return to + (val - from) /(1.0 -from) * (1.0 - to);
    }
}

float fftNormalized(float val){
    val = mix(0.0, 0.9, val);
    // val = shiftPoint(0.8, 0.3, val);
    float res = fft(pow(val, 2.0));    
    res = res * (val * 0.8 + 0.2);
    // res = res * step(0.05, res);
    return res;
}

#define bars 20.0

vec3 plotBars(vec2 st){
    st = st * 2.0 - vec2(1.0);
    // st = rotate(st, u_time);

    st = vec2(polarAngleNormalized(st),  polarLength(st) );
    // st.y *= 0.25;

    float bar = floor(st.x * bars);

    float barHeight = 1.0;  
    barHeight = fftNormalized(bar / bars);
    barHeight *= 4.0;
    barHeight += 0.1;
    // barHeight = bar / bars;
    vec3 color = vec3(1.0);
    color = vec3(step(st.y, barHeight));
    color = vec3(smoothstep(barHeight, 0.1, st.y));
    vec3 randColor1 = perlin3(vec2( + u_time ) ) * .5 + .5;
    randColor1 *= vec3(1.0, 0.5, 1.0);
    
    // vec3 randColor2 = perlin3(vec2(bar + 2.4  * 3.22)) * .5 + .5;
    color *= randColor1; //mix(randColor1, randColor2, barHeight);
    // color *= vec3(perlin01(vec2(volume * 20.0)));
    // color *= vec3(volume);
    // color = pow(color, vec3(.5));
    return color;
}

float plot1(vec2 st, float pct){
  return  smoothstep( pct-0.00002, pct, st.y) -
          smoothstep( pct, pct+0.2, st.y);
}
float plot2(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.y) -
          smoothstep( pct, pct+0.002, st.y);
}

vec3 plotWave(vec2 st){
    st = st * 2.0 - vec2(1.0);
    st = vec2(polarAngleNormalized(st),  polarLength(st) );

    float volume = vol(st.x);
    volume -= 0.5;
    volume *= 3.0;
    volume += 0.6;
    vec3 color1 = vec3(0.5, 0.2, 0.7);
    color1 *= plot1(st, volume);
    vec3 color2 = vec3(0.7, 0.7, 0.1);
    color2 *= plot2(st, volume);
    vec3 color = color1 + color2;
    return color;
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float aspect = u_resolution.x/u_resolution.y;
    st.x *= aspect;

    vec3 cBars = plotBars(st);
    vec3 cWave = plotWave(st);

    vec3 color = cWave + cBars;
    gl_FragColor = vec4(color, 1.0);

}




















