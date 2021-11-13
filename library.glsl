
#define PI 3.1415926538
#define PI_INVERSE 1.0/3.1415926538


float polarAngle(vec2 st){
    return atan(st.x, st.y); 
}

float polarLength(vec2 st){
    return length(st); 
}


float rect(vec2 st, vec2 center, vec2 halfExtents){
    // halfExtents *= .5;
    vec2 pos = st - center;
    float l = step(-halfExtents.x, pos.x);
    float r = 1.0 - step(halfExtents.x, pos.x);
    float t = step(-halfExtents.y, pos.y);
    float b = 1.0 - step(halfExtents.y, pos.y);
    return l * r * t * b; 
}

float circle(vec2 st, vec2 center,  float radius){
    return step(length(st - center), radius);
}

mat2 rotateMat(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

vec2 rotate(vec2 st, float angle) {
    return rotateMat(angle) * st;
}


float normalizePiToPi(float val){
    return val * PI_INVERSE * 0.5 + 0.5; 
}

float polarAngleNormalized(vec2 st){
    return normalizePiToPi(polarAngle(st));
}

float random11(float x){
    return -1.0 + 2.0 * fract(sin(x *10020.0) * 1044.0 );
}

float random12(vec2 x){ 
    return -1.0 + 2.0 * fract(sin(dot(x.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);    
}

vec2 random22(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

vec3 random31(float x){
    vec3 res = vec3(
        x * 223.9832,
        x *3223.8321,
        x *42.38323
    );
    return -1.0 + 2.0 * fract(sin(res) * 23344.92323);
}
vec2 random21(float x){
    vec2 res = vec2(
        x * 223.9832,
        x *3223.8321
    );
    return -1.0 + 2.0 * fract(sin(res) * 23344.92323);
}


float perlin(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random22(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random22(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random22(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random22(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float perlin01(vec2 st) {
    return perlin(st) *.5 + .5;
}

vec3 perlin3(vec2 st) {
    return vec3(
        perlin(st + vec2(23.231, 13.234)),
        perlin(st + vec2(24333.231, 133.234)),
        perlin(st + vec2(23213.231, 12133.234)));
}



float shiftPoint(float from, float to, float val){
    if(val < from){
        return (val / from) * to;
    } else {
        return to + (val - from) /(1.0 -from) * (1.0 - to);
    }
}


float sinc( float x, float k ){
    float a = PI * (k*x-1.0);
    return sin(a) / a;
}

float expImpulse( float x, float k ){
    float h = k*x;
    return h*exp(1.0-h);
}













































































//