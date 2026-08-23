'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useQuantum } from '@/context/QuantumContext';
import { BlochCoordinates } from '@/types/quantum';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

export const BlochSphere3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { simulationResult, selectedQubitForBloch, setSelectedQubitForBloch, circuit } = useQuantum();

  const blochCoords: BlochCoordinates =
    simulationResult?.blochSpheres?.[selectedQubitForBloch] ?? {
      x: 0,
      y: 0,
      z: 1,
      theta: 0,
      phi: 0,
    };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for entire rotatable sphere
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const RADIUS = 1.6;

    // 1. Translucent Bloch Sphere
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.15,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(sphereMesh);

    // 2. Wireframe / Latitude Longitude Lines
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xcbd5e1,
      transparent: true,
      opacity: 0.8,
    });
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    sphereGroup.add(wireLines);

    // 3. Equator Circle (XY plane)
    const circleGeo = new THREE.BufferGeometry();
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS));
    }
    circleGeo.setFromPoints(circlePoints);
    const equatorLine = new THREE.Line(
      circleGeo,
      new THREE.LineBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.8 })
    );
    sphereGroup.add(equatorLine);

    // 4. Coordinate Axes (X: Cyan, Y: Green, Z: Purple)
    const axisMatX = new THREE.LineBasicMaterial({ color: 0x0891b2, linewidth: 2 });
    const axisMatY = new THREE.LineBasicMaterial({ color: 0x059669, linewidth: 2 });
    const axisMatZ = new THREE.LineBasicMaterial({ color: 0x9333ea, linewidth: 2 });

    const createAxis = (from: THREE.Vector3, to: THREE.Vector3, mat: THREE.LineBasicMaterial) => {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
      return new THREE.Line(geo, mat);
    };

    // Z-axis (Vertical: |0> to |1>)
    sphereGroup.add(createAxis(new THREE.Vector3(0, -RADIUS * 1.3, 0), new THREE.Vector3(0, RADIUS * 1.3, 0), axisMatZ));
    // X-axis (|+> to |->)
    sphereGroup.add(createAxis(new THREE.Vector3(-RADIUS * 1.3, 0, 0), new THREE.Vector3(RADIUS * 1.3, 0, 0), axisMatX));
    // Y-axis (|+i> to |-i>)
    sphereGroup.add(createAxis(new THREE.Vector3(0, 0, -RADIUS * 1.3), new THREE.Vector3(0, 0, RADIUS * 1.3), axisMatY));

    // 5. State Vector Arrow
    const target3D = new THREE.Vector3(
      blochCoords.x * RADIUS,
      blochCoords.z * RADIUS,
      blochCoords.y * RADIUS
    );

    const arrowLength = Math.max(0.2, target3D.length());
    const arrowDir = target3D.clone().normalize();
    const arrowHelper = new THREE.ArrowHelper(
      arrowDir,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      0xe11d48, // Rose-600
      0.35,
      0.18
    );
    sphereGroup.add(arrowHelper);

    // Tip Sphere Marker
    const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.copy(target3D);
    sphereGroup.add(tipMesh);

    // Projection dashed line to XY equator
    const projGeo = new THREE.BufferGeometry().setFromPoints([
      target3D,
      new THREE.Vector3(target3D.x, 0, target3D.z),
      new THREE.Vector3(0, 0, 0),
    ]);
    const projLine = new THREE.Line(
      projGeo,
      new THREE.LineDashedMaterial({
        color: 0x64748b,
        dashSize: 0.1,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.8,
      })
    );
    projLine.computeLineDistances();
    sphereGroup.add(projLine);

    camera.lookAt(0, 0, 0);

    // Orbital drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      sphereGroup.rotation.y += deltaX * 0.008;
      sphereGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.5, Math.min(7.0, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);

    // Render loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isDragging) {
        sphereGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [blochCoords, selectedQubitForBloch]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 select-none overflow-hidden">
      {/* Qubit Selector Bar */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-slate-500 font-mono font-semibold mr-1">Qubit:</span>
          {Array.from({ length: circuit.numQubits }).map((_, q) => (
            <button
              key={q}
              onClick={() => setSelectedQubitForBloch(q)}
              className={cn(
                'px-2.5 py-1 text-xs font-mono font-bold rounded-xl transition-all shadow-sm',
                selectedQubitForBloch === q
                  ? 'bg-cyan-600 text-white shadow-cyan-600/30'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              )}
            >
              q{q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <Compass className="w-3.5 h-3.5 text-cyan-600" />
          <span>Drag to Rotate</span>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative min-h-[220px]">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* HUD Basis Pole Labels */}
        <div className="absolute top-2 left-3 pointer-events-none text-[10px] font-mono space-y-0.5 bg-white/90 p-2 rounded-xl border border-slate-200 shadow-md backdrop-blur-sm">
          <div className="text-purple-700 font-bold">|0⟩ (North Pole: +Z)</div>
          <div className="text-purple-700 font-bold">|1⟩ (South Pole: -Z)</div>
          <div className="text-cyan-700 font-semibold">|+⟩ / |-⟩ (Equator: ±X)</div>
          <div className="text-emerald-700 font-semibold">|+i⟩ / |-i⟩ (Equator: ±Y)</div>
        </div>

        {/* State Vector Indicator Overlay */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-right font-mono bg-white/95 p-2.5 rounded-2xl border border-slate-200 backdrop-blur-md shadow-lg">
          <div className="text-xs font-bold text-rose-600 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>State Vector |ψ⟩</span>
          </div>
          <div className="text-[11px] text-slate-700 mt-1 font-semibold">
            (x: {blochCoords.x.toFixed(2)}, y: {blochCoords.y.toFixed(2)}, z: {blochCoords.z.toFixed(2)})
          </div>
          <div className="text-[10px] text-cyan-700 font-bold mt-0.5">
            θ = {(blochCoords.theta / Math.PI).toFixed(2)}π, φ = {(blochCoords.phi / Math.PI).toFixed(2)}π
          </div>
        </div>
      </div>

      {/* Mathematical Readout Footer */}
      <div className="p-3 border-t border-slate-200 bg-white font-mono text-xs shadow-sm">
        <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1">
          <span>Single Qubit Pure State Formalism</span>
          <span className="text-cyan-700 font-bold">q{selectedQubitForBloch}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center font-semibold text-xs tracking-wide shadow-inner">
          |ψ⟩ = cos({(blochCoords.theta / 2 / Math.PI).toFixed(2)}π)|0⟩ + e^(i·{(blochCoords.phi / Math.PI).toFixed(2)}π)sin({(blochCoords.theta / 2 / Math.PI).toFixed(2)}π)|1⟩
        </div>
      </div>
    </div>
  );
};
