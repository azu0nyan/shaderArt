#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


#include "library.glsl"

float sphere(float rad, vec3 pos){
    return length(pos) - rad;
}

float dist(vec3 pos){
    float c1 = sphere( 0.25, pos - vec3(1.2, -1.5, -2.5));
    float c2 = sphere( 0.25, pos - vec3(-0.8, -0.7, -1.3));
    float c3 = sphere( 0.25, pos - vec3(.7, -2.0, -1.0));

    
    return min(c3, min(c1, c2));
}

vec3 normalAtObject(in vec3 pos){
    vec2 e = vec2(0.0001, 0.0);
        return normalize(
                          vec3(dist(pos + e.xyy) -dist(pos - e.xyy),
                              dist(pos + e.yxy) - dist(pos - e.yxy),
                              dist(pos + e.yyx) - dist(pos - e.yyx)
                             ));
}

#define RMITER 30
float castRayObjects(vec3 rayOrigin, vec3 rayDirection){
    float traveled = 0.0;
    for(int i = 0; i < RMITER; i++){
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



float heightAt(vec2 at){
    return perlin(at) + 
    perlin(at * 2.4 + vec2(u_time)) * 0.3 +
    perlin(at * 4.4 + vec2(u_time* -2.0)) * 0.1 +
    -2.0;
}
#define EPS 0.1

vec3 normalAtTerrain(vec2 at){
     return normalize( vec3( 
         heightAt(vec2(at.x + EPS, at.y)) - heightAt(vec2(at.x - EPS, at.y)),
         EPS * 2.0, 
         heightAt(vec2(at.x, at.y + EPS)) - heightAt(vec2(at.x, at.y - EPS))         
         ));
}

#define ITER 100
#define STEP 0.3


float castRayTerrain(vec3 rayOrigin, vec3 rayDirection){
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

float castRay(vec3 rayOrigin, vec3 rayDirection, out bool isTerrain){
    float terrain = castRayTerrain(rayOrigin, rayDirection);
    float object = castRayObjects(rayOrigin, rayDirection);
    if(object < 0.0 && terrain < 0.0){
        return -1.0;
    } else if(object < 0.0){
        isTerrain = true;
        return terrain;    
    } else if(terrain < 0.0){
        isTerrain = false;
        return object;
    } else if(terrain < object){
        isTerrain = true;
        return terrain;
    }  else {
        isTerrain = false;
        return object;
    }
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2.0 - 1.0;

    vec3 baseColor = vec3(.5, .1, .1);

    vec3 sunDirection = normalize(vec3(.2, .7, .5));

    vec3 color = vec3(0.0);

    vec3 rayOrigin = vec3(0.0, 2.0, 2.0);
    vec3 rayDirection = normalize(vec3(st.xy, 0.0) - rayOrigin);

    bool isTerrain = false;
    float castDist = castRay(rayOrigin, rayDirection, isTerrain);

    vec3 sunColor = vec3(1.0, 0.7, 0.1);
    vec3 shadowColor = vec3(1.0) - sunColor;
    
    if(castDist > 0.0){        

        vec3 objectColor; 
        if(isTerrain){
            objectColor = vec3(.5, 1.0, 0.3);
        } else {
            objectColor = vec3(1.0, 0.0, 1.0);
        }     


        vec3 rayHit = rayOrigin + castDist * rayDirection;
        vec3 normal;
        if(isTerrain){
            normal = normalAtTerrain(rayHit.xz);
        } else {
            normal = normalAtObject(rayHit);
        }
        float sunPower = clamp(dot(normal, sunDirection), 0.0, 1.0);

        float inShadow = step(castRayObjects(rayHit + normal * 0.01, sunDirection), 0.0);

        sunPower *= inShadow;

        color = objectColor * mix(shadowColor, sunColor, sunPower);
    }

    gl_FragColor = vec4(color,1.0);
}