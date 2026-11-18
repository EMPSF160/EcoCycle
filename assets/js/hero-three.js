/**
 * VERDANT ECOSYSTEMS | 2027 SUSTAINABILITY PLATFORM
 * Three.js Hero 3D Clean Energy & Recycling Loop Animation
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('heroThreeContainer');
  if (!container || !window.THREE) return;

  let scene, camera, renderer, knot, particles, animationFrameId;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  try {
    init();
    animate();
  } catch (err) {
    console.warn('Three.js initialization skipped:', err);
  }

  function init() {
    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 24;

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Central Wireframe Möbius / Torus Knot (Symbolizing the infinite recycling loop)
    const knotGeometry = new THREE.TorusKnotGeometry(6, 1.8, 120, 24, 2, 3);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A5E4D,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.35
    });
    knot = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knot);

    // 4. Luminous Electric Lime Particles swirling around the loop
    const particleCount = 1800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xA8D85C); // Electric Lime
    const color2 = new THREE.Color(0x3CD070); // Eco Mint
    const color3 = new THREE.Color(0x1B4D3E); // Deep Emerald

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const radius = 9 + (Math.random() - 0.5) * 8;

      positions[i * 3] = radius * Math.cos(u) * Math.sin(v);
      positions[i * 3 + 1] = radius * Math.sin(u) * Math.sin(v) + (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = radius * Math.cos(v);

      const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Canvas particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(168,216,92,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xA8D85C, 2.5, 50);
    pointLight.position.set(10, 10, 15);
    scene.add(pointLight);

    // 6. Mouse & Resize Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0006;
    mouseY = (event.clientY - windowHalfY) * 0.0006;
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (knot) {
      knot.rotation.x += 0.003;
      knot.rotation.y += 0.005;
      knot.rotation.z += 0.002;
      knot.position.x = targetX * 10;
      knot.position.y = -targetY * 10;
    }

    if (particles) {
      particles.rotation.y += 0.0015;
      particles.rotation.x += 0.001;
      particles.position.x = targetX * 12;
      particles.position.y = -targetY * 12;
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
});
