"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float uTime;

  const vec3 NIGHT = vec3(0.012, 0.027, 0.09);
  const vec3 DEEP = vec3(0.059, 0.118, 0.329);
  const vec3 ACCENT = vec3(0.243, 0.388, 0.867);
  const vec3 SKY = vec3(0.72, 0.8, 1.0);

  // Broad sheens plus thin bright streaks, which is what reads as polished metal.
  vec3 metal(vec2 uv) {
    float t = uTime;
    float wave = sin(uv.y * 2.2 + t * 0.09) * 0.5;
    float sheen = pow(0.5 + 0.5 * sin(uv.x * 6.0 + wave + t * 0.11), 3.0);
    float glow = pow(0.5 + 0.5 * sin(uv.x * 2.5 - wave - t * 0.07 + 1.5), 6.0);
    float streak = pow(0.5 + 0.5 * sin(uv.x * 19.0 + wave * 2.0 - t * 0.13), 40.0);
    float fade = 0.35 + 0.65 * smoothstep(0.0, 1.0, uv.y);

    vec3 color = mix(NIGHT, DEEP, sheen * 0.7);
    color += ACCENT * glow * 0.24 * fade;
    color += SKY * streak * (0.12 + glow) * 0.5 * fade;
    return color;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Uneven ribs, each showing the metal from a shifted spot, as glass would.
    float rib = (gl_FragCoord.x + 24.0 * sin(gl_FragCoord.x * 0.017)) / 64.0;
    float across = fract(rib);
    float shift = (across - 0.5) * 0.2 + sin(floor(rib) * 12.9898) * 0.035;
    vec3 color = metal(vec2(uv.x + shift, uv.y));

    // A hard edge between ribs, with a thin glint on one side.
    color *= 0.62 + 0.38 * smoothstep(0.0, 0.14, across);
    color += SKY * 0.05 * smoothstep(0.95, 1.0, across);

    // Noise stops the dark gradients showing bands.
    color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 160.0;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Fixed ribbed-metal background, with a plain gradient if WebGL is missing. */
export default function FlutedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });

    if (!gl) return;

    const program = gl.createProgram();

    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX_SHADER],
      [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }

    gl.linkProgram(program);
    gl.useProgram(program);

    // One triangle big enough to cover the screen.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "uResolution");
    const time = gl.getUniformLocation(program, "uTime");

    function draw(now: number) {
      gl!.uniform1f(time, now / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(resolution, canvas.width, canvas.height);
      draw(performance.now());
    }

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let lastDraw = 0;

    // Slow light looks the same at 30fps and costs less.
    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (now - lastDraw < 33) return;
      lastDraw = now;
      draw(now);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[radial-gradient(70%_60%_at_25%_15%,var(--color-deep),var(--color-night))]">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
