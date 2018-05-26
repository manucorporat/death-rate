

export const WAVE_SHADER = `
precision highp float;
uniform float u_time;
uniform float u_y;

void main() {
    float a = sin(u_time*0.001 + gl_FragCoord.x * 0.004)*20.0 + u_y;
    if(gl_FragCoord.y < a) {
      gl_FragColor = vec4(0.945, 0.255, 0.251, 0.8);
    } else {
      gl_FragColor = vec4(0.945, 0.255, 0.251, 0.5);
    }
}
`;
