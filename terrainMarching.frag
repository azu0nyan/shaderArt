#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


#include "library.glsl"

float heightAt(vec2 at){
    return perlin(at) + 
    perlin(at * 2.4) + vec2(u_time)) * 0.3 +
    perlin(at * 4.4) + vec2(u_time* -2.0)) * 0.1 +
    -2.0;
}
#define EPS 0.1

vec3 normalAt(vec2 at){
     return normalize( vec3( 
         heightAt(vec2(at.x + EPS, at.y)) - heightAt(vec2(at.x - EPS, at.y)),
         EPS * 2.0, 
         heightAt(vec2(at.x, at.y + EPS)) - heightAt(vec2(at.x, at.y - EPS))         
         ));
}

#define ITER 60
#define STEP 0.3


float castRay(vec3 rayOrigin, vec3 rayDirection){
    float lh = 0.;
    float ld = 0.;
    float ly = 0.;
    for(int i = 1; i < ITER; i++){
        float dist = float(i) * STEP;
        vec3 pos = rayOrigin + dist * rayDirection;
        float h = heightAt(pos.xz);
        if(h > pos.y){            
            // return dist;
            return ld + STEP * (lh - ly) / (pos.y - ly - h + lh);
        }
        lh = h; 
        ld = dist;
        ly = pos.y;
    }
    return -1.0;
}



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2.0 - 1.0;

    vec3 baseColor = vec3(.5, .1, .1);

    vec3 sunDirection = normalize(vec3(.5, .2, .3));

    vec3 color = vec3(0.0);

    vec3 rayOrigin = vec3(0.0, 2.0, 2.0);
    vec3 rayDirection = normalize(vec3(st.xy, 0.0) - rayOrigin);

    float castDist = castRay(rayOrigin, rayDirection);

    vec3 sunColor = vec3(1.0, 0.7, 0.1);
    vec3 shadowColor = vec3(1.0) - sunColor;

    vec3 groundColor = vec3(.5, 1.0, 0.3);
    
    if(castDist > 0.0){
        vec3 rayHit = rayOrigin + castDist * rayDirection;
        vec3 normal = normalAt(rayHit.xz);
        float sunPower = clamp(dot(normal, sunDirection), 0.0, 1.0);

        // float inShadow = step(castRay(rayHit + normal * 0.01, sunDirection), 0.0);

        // color =  baseColor * (.3 + sunPower  * inShadow);
        // color = vec3(castDist / (float(ITER) * STEP));
        // color = groundColor * .3 +  sunPower * groundColor * sunColor * .7;
        color = groundColor * mix(shadowColor, sunColor, sunPower);
    } else {
        color = vec3(0.5, 0.5, 1.0);
    }

    gl_FragColor = vec4(color,1.0);
}