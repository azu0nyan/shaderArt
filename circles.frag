// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st){
    float y = smoothstep(0.340, 0.544, st.x) + smoothstep(0.124, 0.024, st.x);
    
    return 1.0 - smoothstep(0.0, 0.1, abs(st.y - y));
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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 2.0;
    vec2 pos = st;
    st = fract(st);
    float c = length(st - 0.2*vec2(sin(u_time + pos.x), sin(u_time * 2.5 * pos.y))) ;
    c *= 20.0;
	c = sin(c);
    c = smoothstep(0.2, 0.888, c);
    // float c1 = length(st - 0.3*vec2(sin(u_time + 20.0), sin(u_time * 2.0))) ;
    // c1 *= 40.0;
	// c1 = sin(c1);
    // c1 = smoothstep(0.2, 0.888, c1);
    // float c = rect(st, vec2(0.3), vec2(0.2, 0.1));
    vec3 color = vec3(c, c, c);
    gl_FragColor = vec4(color,1.0);
    // gl_FragColor = vec4(st,0.0,1.000);
}








