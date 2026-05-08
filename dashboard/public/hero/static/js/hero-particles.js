// hero-particles.js - WebGL Chromatic Sine-Wave
const canvas = document.getElementById('heroParticles');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
// Use orthographic camera to cover the plane completely
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Geometry covering the whole screen
const geometry = new THREE.PlaneBufferGeometry(2, 2);

const vertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    
    // Create organic sine waves
    float d = length(p);
    float wave1 = sin(d * 5.0 - time * 1.5) * 0.5 + 0.5;
    float wave2 = sin(p.x * 3.0 + p.y * 2.0 + time) * 0.5 + 0.5;
    float wave3 = sin(p.x * 5.0 - p.y * 5.0 - time * 0.8) * 0.5 + 0.5;
    
    // Mix waves to get RGB channels (raw colors)
    float r = wave1 * wave2;
    float g = wave2 * wave3;
    float b = wave3 * wave1;

    // Map to Navy-Blue-Teal Palette
    float finalR = r * 0.024 + g * 0.12 + b * 0.02;
    float finalG = r * 0.075 + g * 0.32 + b * 0.40;
    float finalB = r * 0.29  + g * 0.65 + b * 0.96;
    
    // Alpha falloff from center
    float alpha = max(0.0, 1.0 - d * 0.8) * 0.35; // max alpha 0.35

    gl_FragColor = vec4(finalR, finalG, finalB, alpha);
  }
`;

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    time: { value: 0.0 }
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function resize() {
  const container = canvas.parentElement;
  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value += 0.01;
  renderer.render(scene, camera);
}
animate();
