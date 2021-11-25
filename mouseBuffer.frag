#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D   u_buffer0; //current frame
uniform sampler2D   u_buffer1; //last Frame info

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;


void main( void ) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1./u_resolution;
    vec2 mouse = u_mouse/u_resolution;

#ifdef BUFFER_0
    // PING BUFFER
    //
    //  Note: Here is where most of the action happens. But need's to read
    //  te content of the previous pass, for that we are making another buffer
    //  BUFFER_1 (u_buffer1)
    vec3 color = vec3(0.0);
        // color = texture2D(u_buffer1, st).rgb;
    float mDist = 1.0 - distance(mouse, st) * 5.0;
    // mDist = pow(mDist, 0.4);
    color = vec3(mDist * vec3(1.0, .4, .1));
    color = max(color, texture2D(u_buffer1,
                                 st + -(st - mouse) * 0.01).rgb * vec3(.94, .995, .999));

    gl_FragColor = vec4(color, 1.0);
#elif defined( BUFFER_1 )
    // PONG BUFFER
    //
    //  Note: Just copy the content of the BUFFER0 so it can be 
    //  read by it in the next frame
    //
    gl_FragColor = texture2D(u_buffer0, st);
#else

    // Main Buffer
    gl_FragColor = texture2D(u_buffer1, st);
#endif
}