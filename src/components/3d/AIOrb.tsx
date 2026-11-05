import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type AIOrbState = 'idle' | 'thinking' | 'responding';

interface AIOrbProps {
  state?: AIOrbState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AIOrb: React.FC<AIOrbProps> = ({ state = 'idle', size = 'md', className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dimensions = {
    sm: { width: 50, height: 50, cameraZ: 45 },
    md: { width: 140, height: 140, cameraZ: 65 },
    lg: { width: 220, height: 220, cameraZ: 85 },
  }[size];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, dimensions.width / dimensions.height, 0.1, 500);
      camera.position.z = dimensions.cameraZ;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // Core particle orb
      const particleCount = size === 'sm' ? 45 : 120;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorIdle = new THREE.Color(0x8b5cf6);
      const colorThinking = new THREE.Color(0x06b6d4);
      const colorResponding = new THREE.Color(0x22c55e);

      const radius = size === 'sm' ? 12 : 22;

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * radius;

        const sinPhi = Math.sin(phi);
        positions[i * 3] = r * sinPhi * Math.cos(theta);
        positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        colors[i * 3] = colorIdle.r;
        colors[i * 3 + 1] = colorIdle.g;
        colors[i * 3 + 2] = colorIdle.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: size === 'sm' ? 2.5 : 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Orbital rings
      const ringGeom = new THREE.TorusGeometry(radius * 1.3, 0.6, 6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const ring1 = new THREE.Mesh(ringGeom, ringMat);
      const ring2 = new THREE.Mesh(ringGeom, ringMat);
      ring2.rotation.x = Math.PI / 2;
      scene.add(ring1);
      scene.add(ring2);

      let clock = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        clock += 0.02;

        const currentState = stateRef.current;
        let speed = 0.015;
        let targetColor = colorIdle;

        if (currentState === 'thinking') {
          speed = 0.06;
          targetColor = colorThinking;
        } else if (currentState === 'responding') {
          speed = 0.035;
          targetColor = colorResponding;
        }

        particleSystem.rotation.y += speed;
        particleSystem.rotation.x += speed * 0.5;

        ring1.rotation.z += speed * 1.2;
        ring2.rotation.y -= speed * 1.4;

        // Subtle pulse
        const scale = 1 + Math.sin(clock * (currentState === 'thinking' ? 5 : 2)) * 0.08;
        particleSystem.scale.set(scale, scale, scale);

        // Update colors smoothly
        ringMat.color.lerp(targetColor, 0.05);

        renderer?.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn('AIOrb WebGL init failed:', e);
      setHasWebGlError(true);
    }
  }, [dimensions.width, dimensions.height, dimensions.cameraZ, size]);

  if (hasWebGlError) {
    const pulseColors = {
      idle: 'from-violet-500/40 via-cyan-500/20 to-transparent',
      thinking: 'from-cyan-400/60 via-purple-500/30 to-transparent animate-spin',
      responding: 'from-emerald-400/60 via-violet-500/30 to-transparent animate-pulse',
    }[state];

    return (
      <div className={`${className} flex items-center justify-center`} style={{ width: dimensions.width, height: dimensions.height }}>
        <div className={`w-3/4 h-3/4 rounded-full bg-gradient-to-tr ${pulseColors} blur-sm`} />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      title={`OpsMind AI Assistant (${state})`}
    />
  );
};
