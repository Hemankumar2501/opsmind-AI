import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NeuralSphereProps {
  className?: string;
}

export const NeuralSphere: React.FC<NeuralSphereProps> = ({ className = 'w-full h-[450px]' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 450;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.position.z = 220;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // Create Neural Network Sphere with nodes and interconnected lines
      const nodeCount = 70;
      const radius = 80;
      const nodeGeometry = new THREE.SphereGeometry(1.6, 8, 8);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
      const cyanMaterial = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

      const nodesGroup = new THREE.Group();
      const nodePositions: THREE.Vector3[] = [];

      for (let i = 0; i < nodeCount; i++) {
        // Fibonacci sphere distribution for uniform spread
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);

        const mesh = new THREE.Mesh(nodeGeometry, i % 3 === 0 ? cyanMaterial : nodeMaterial);
        mesh.position.copy(pos);
        nodesGroup.add(mesh);
      }

      // Connecting lines between nearby nodes
      const linePositions: number[] = [];
      const lineColors: number[] = [];
      const maxDistance = 46;

      const color1 = new THREE.Color(0x8b5cf6);
      const color2 = new THREE.Color(0x06b6d4);

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < maxDistance) {
            linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
            linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);

            const c = (i + j) % 2 === 0 ? color1 : color2;
            lineColors.push(c.r, c.g, c.b);
            lineColors.push(c.r, c.g, c.b);
          }
        }
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
      });

      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      nodesGroup.add(lines);

      // Inner glowing core
      const coreGeometry = new THREE.SphereGeometry(radius * 0.45, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
      nodesGroup.add(coreSphere);

      scene.add(nodesGroup);

      // Mouse parallax
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.8;
        mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.8;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      // Resize handler
      const handleResize = () => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      // Animation loop
      let angle = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isReducedMotion) {
          angle += 0.005;
          nodesGroup.rotation.y = angle + mouseX * 0.5;
          nodesGroup.rotation.x = Math.sin(angle * 0.5) * 0.15 + mouseY * 0.5;
          coreSphere.rotation.y = -angle * 1.5;
        }

        renderer?.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('WebGL initialization failed, using CSS fallback:', err);
      setHasWebGlError(true);
    }
  }, []);

  if (hasWebGlError) {
    return (
      <div className={`${className} flex items-center justify-center relative`}>
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-transparent blur-2xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full border border-purple-500/40 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-cyan-400/30 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`${className} relative flex items-center justify-center pointer-events-auto`}
      aria-label="Interactive 3D AI Neural Network Sphere"
    />
  );
};
