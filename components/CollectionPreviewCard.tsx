import React, { useRef, useEffect } from 'react';
import type { Artwork } from '../types';

interface WatercolorCanvasProps {
  setWebglAvailable: (isAvailable: boolean) => void;
  artworks: Artwork[];
  onArtworkSelect: (artwork: Artwork) => void;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 v_texCoord;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  
  uniform sampler2D u_artworks[6];
  uniform float u_aspect;
  uniform vec2 u_gridDims; // (cols, rows)

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = v_texCoord;
    st.y = 1.0 - st.y;
    vec2 uv = st;
    uv.x *= u_aspect;

    // --- Fluid / Ripple simulation ---
    vec2 mouse_norm = u_mouse / u_resolution;
    mouse_norm.x *= u_aspect;

    float dist_from_mouse = distance(uv, mouse_norm);
    float ripple_effect = smoothstep(0.2, 0.0, dist_from_mouse);
    float displacement = snoise(uv * 5.0 + u_time * 0.2) * 0.01 + ripple_effect * snoise(uv * 15.0 - u_time) * 0.03;

    vec2 distorted_uv = uv + vec2(displacement);
    
    // --- Watercolor background texture ---
    float paper_noise = snoise(distorted_uv * 20.0) * 0.5 + 0.5;
    vec3 paper_color = vec3(0.051) + paper_noise * 0.02;

    // --- Artworks Grid ---
    vec2 grid_uv = fract(st * u_gridDims);
    vec2 cell_id = floor(st * u_gridDims);
    int tex_index = int(cell_id.y * u_gridDims.x + cell_id.x);

    vec2 distorted_grid_uv = fract((st + vec2(displacement)) * u_gridDims);
    
    vec3 art_color = vec3(0.0);

    // This is not ideal but works for a fixed number of textures
    if(tex_index == 0) art_color = texture2D(u_artworks[0], distorted_grid_uv).rgb;
    else if(tex_index == 1) art_color = texture2D(u_artworks[1], distorted_grid_uv).rgb;
    else if(tex_index == 2) art_color = texture2D(u_artworks[2], distorted_grid_uv).rgb;
    else if(tex_index == 3) art_color = texture2D(u_artworks[3], distorted_grid_uv).rgb;
    else if(tex_index == 4) art_color = texture2D(u_artworks[4], distorted_grid_uv).rgb;
    else if(tex_index == 5) art_color = texture2D(u_artworks[5], distorted_grid_uv).rgb;

    // --- Pigment Bleed/Blend ---
    float edge_bleed = snoise(distorted_uv * 10.0 + u_time * 0.1) * 0.5 + 0.5;
    edge_bleed = smoothstep(0.4, 0.6, edge_bleed);
    
    // Calculate softness around grid cell edges
    float edge_x = smoothstep(0.0, 0.05, grid_uv.x) - smoothstep(0.95, 1.0, grid_uv.x);
    float edge_y = smoothstep(0.0, 0.05, grid_uv.y) - smoothstep(0.95, 1.0, grid_uv.y);
    float edge_softness = edge_x * edge_y * (1.0 - ripple_effect * 0.5);

    vec3 final_color = mix(paper_color, art_color, edge_softness);

    gl_FragColor = vec4(final_color, 1.0);
  }
`;

const GRID_COLS = 3;

export const WatercolorCanvas: React.FC<WatercolorCanvasProps> = ({ setWebglAvailable, artworks, onArtworkSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artworksRef = useRef(artworks);
  artworksRef.current = artworks;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn("WebGL not supported, falling back.");
      setWebglAvailable(false);
      return;
    }
    
    const program = gl.createProgram();
    if(!program) return;

    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if(!shader) return null;
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error: ' + gl.getShaderInfoLog(shader)); gl.deleteShader(shader); return null;
      }
      return shader;
    };

    const vShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vShader || !fShader) return;

    gl.attachShader(program, vShader); gl.attachShader(program, fShader); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('Program link error'); return; }
    gl.useProgram(program);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        mouse: gl.getUniformLocation(program, "u_mouse"),
        aspect: gl.getUniformLocation(program, "u_aspect"),
        gridDims: gl.getUniformLocation(program, "u_gridDims"),
        artworks: Array.from({length: 6}, (_, i) => gl.getUniformLocation(program, `u_artworks[${i}]`))
    };
    
    const textures: WebGLTexture[] = [];
    artworks.forEach((art, i) => {
      const texture = gl.createTexture();
      if (!texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = art.imageUrl;
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
      textures.push(texture);
    });

    let startTime = Date.now();
    let mousePos = { x: -999, y: -999 };
    const handleMouseMove = (e: MouseEvent) => { mousePos = { x: e.clientX, y: e.clientY }};
    const handleMouseLeave = () => { mousePos = {x: -999, y: -999 }};
    const handleClick = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const gridRows = Math.ceil(artworksRef.current.length / GRID_COLS);
        const col = Math.floor((x / rect.width) * GRID_COLS);
        const row = Math.floor((y / rect.height) * gridRows);
        const index = row * GRID_COLS + col;
        if (artworksRef.current[index]) {
            onArtworkSelect(artworksRef.current[index]);
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    let animFrameId: number;
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, (Date.now() - startTime) * 0.001);
      gl.uniform2f(uniforms.mouse, mousePos.x * dpr, (window.innerHeight - mousePos.y) * dpr);
      gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
      gl.uniform2f(uniforms.gridDims, GRID_COLS, Math.ceil(artworks.length / GRID_COLS));
      
      textures.forEach((tex, i) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uniforms.artworks[i], i);
      });

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [setWebglAvailable, artworks, onArtworkSelect]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};
