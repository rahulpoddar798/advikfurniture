'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshDistortMaterial } from '@react-three/drei';

const FurnitureModel = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh scale={1.5}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshDistortMaterial
          color="#1c1917"
          speed={3}
          distort={0.4}
          radius={1}
        />
      </mesh>
    </Float>
  );
};

const ShowroomCanvas = () => {
  return (
    <div className="h-full w-full">
      <Canvas 
        shadows="soft"
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]} // Limit DPR to 1.5 for performance on retina displays
        gl={{ 
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
          alpha: true,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0c0a09', 0); // Match dark background
        }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <FurnitureModel />
          </Stage>
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default ShowroomCanvas;
