#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sphere(float rad, vec3 pos){
    return sqrt((pos.x * pos.x)   + pos.y *pos.y + pos.z *pos.z ) - rad;
}

float plane(float y, vec3 pos){
    return pos.y - y;
}

float dist(vec3 pos){
    float c1 = sphere( 0.25, pos);
    float c2 = sphere( 0.25, pos - vec3(0.5, 0.5, 0.3));

    float p1 = plane(-0.25, pos);
    return min(min(c1, c2), p1);
}

vec3 normalAt(in vec3 pos){
    vec2 e = vec2(0.0001, 0.0);
        return normalize(
                          vec3(dist(pos + e.xyy) -dist(pos - e.xyy),
                              dist(pos + e.yxy) - dist(pos - e.yxy),
                              dist(pos + e.yyx) - dist(pos - e.yyx)
                             ));
}

#define ITER 100
float castRay(vec3 rayOrigin, vec3 rayDirection){
    float traveled = 0.0;
    for(int i = 0; i < ITER; i++){
        vec3 pos = rayOrigin + traveled * rayDirection;
        float cur = dist(pos);
        if(cur < 0.01) break;
        traveled += cur;
        if(traveled > 40.0){
            traveled =  -1.0;
            break;
        }

    }
    return traveled;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2.0 - 1.0;

    vec3 baseColor = vec3(.5, .1, .1);

    vec3 sunDirection = normalize(vec3(.5, .2, .3));

    vec3 color = vec3(0.0);

    vec3 rayOrigin = vec3(0.0, 0.0, 2.0);
    vec3 rayDirection = normalize(vec3(st, -1.5));

    float c = castRay(rayOrigin, rayDirection);

    if(c > 0.0){
        vec3 rayHit = rayOrigin + c * rayDirection;
        vec3 normal = normalAt(rayHit);
        float sunPower = clamp(dot(normal, sunDirection), 0.0, 1.0);

        float inShadow = step(castRay(rayHit + normal * 0.01, sunDirection), 0.0);

        color =  baseColor * (.3 + sunPower  * inShadow);
    }

    gl_FragColor = vec4(color,1.0);
}