
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
    // val = shiftPoint(0.8, 0.3, val);
    float res = fft(pow(val, 2.0));    
    res = res * (val * 0.8 + 0.2);
    // res = res * step(0.05, res);

    return res;
}


float fftClamped(float x){
    float res = fftNormalized(x);
    res = res * step(pow(1.0 - x, 4.0) * .20 + .05, res);
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
    barHeight = fftClamped(bar / bars);
    barHeight *= 4.0;
    barHeight += 0.2;
    // barHeight = bar / bars;
    vec3 color = vec3(1.0);
    // color = vec3(step(st.y, barHeight));
    color = vec3(smoothstep(barHeight, 0.1, st.y));
    float c2Fft = 
                  fftNormalized(bar / bars - 0.2) + 
                  fftNormalized(bar / bars - 0.1) + 
                  fftNormalized(bar / bars) + 
                  fftNormalized(bar / bars + 0.1) + 
                  fftNormalized(bar / bars + 0.2); 
    vec3 randColor1 = perlin3(vec2(c2Fft * 4.0, c2Fft * 12.0) );
    randColor1 = abs(randColor1);
    randColor1 = pow(randColor1, vec3(0.5, 0.6, 0.3));
    // randColor1 *= vec3(1.0, 0.5, 1.0);
    
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
    vec3 color1 = vec3(0.0, 0.3, 0.7);
    vec3 color11 = vec3(1.0, 0.2, 0.2);
    color1 = mix(color1, color11, fftNormalized(0.1)*2.0);
    color1 *= plot1(st, volume);
    vec3 color2 = vec3(0.0, 0.7, 0.1);
    vec3 color21 = vec3(1.0, 0.0, 1.0);
    float c2Fft = 
                  fftNormalized(0.45) + 
                  fftNormalized(0.50) + 
                  fftNormalized(0.55) + 
                  fftNormalized(0.6) + 
                  fftNormalized(0.65);
    c2Fft *= 1.0;
    color2 = mix(color2, color21, c2Fft);
    color2 *= plot2(st, volume);
    vec3 color = color1 + color2;
    return color;
}



vec2 glitch(vec2 st){
    float barsH = ceil(fftClamped(0.05) * 2.0) + 4.0;
    float imupulseParam = ceil(fftClamped(0.4) * 6.0) + 2.0;
    float sincParam = ceil(fftClamped(0.9) * 12.0) + 2.0;
    
    vec2 varSt = st;
    // varSt.y = sin(varSt.y);
    varSt.y = fract(varSt.y + perlin01(vec2(fftNormalized(0.3) * 0.6) )* 2.0);
    varSt.y = sinc(varSt.y, imupulseParam);
    varSt.y = expImpulse(varSt.y, sincParam);
    varSt.y = fract(abs(varSt.y));
    varSt.y *= barsH;
    float bar = floor(varSt.y);

    float barShift = fftNormalized(bar / barsH);
    // barShift = step(0.1, bar);
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

    vec3 cBars = plotBars(st);
    vec3 cWave = plotWave(st);

    vec3 color = cWave + cBars;
    gl_FragColor = vec4(color, 1.0);

}




















