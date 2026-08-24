'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Zap, Compass, Info, Sliders, Dices, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quantumAudio } from '@/utils/quantumAudio';

interface QuantumStatePreset {
  name: string;
  gateLabel: string;
  theta: number; // Polar angle [0, PI]
  phi: number;   // Azimuthal angle [0, 2PI]
  description: string;
  formula: string;
  p0: number;
  p1: number;
}

const PRESETS: QuantumStatePreset[] = [
  {
    name: 'Ground State |0⟩',
    gateLabel: 'Reset |0⟩',
    theta: 0,
    phi: 0,
    description: 'The standard computational zero state, pointing to the North Pole (+Z).',
    formula: '|ψ⟩ = 1.00|0⟩ + 0.00|1⟩',
    p0: 100,
    p1: 0,
  },
  {
    name: 'Superposition |+⟩',
    gateLabel: 'Hadamard (H)',
    theta: Math.PI / 2,
    phi: 0,
    description: 'Equal 50/50 superposition along the +X equator axis.',
    formula: '|ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩',
    p0: 50,
    p1: 50,
  },
  {
    name: 'Excited State |1⟩',
    gateLabel: 'Pauli-X (NOT)',
    theta: Math.PI,
    phi: 0,
    description: 'Computational one state, pointing directly to the South Pole (-Z).',
    formula: '|ψ⟩ = 0.00|0⟩ + 1.00|1⟩',
    p0: 0,
    p1: 100,
  },
  {
    name: 'Phase State |+i⟩',
    gateLabel: 'Phase (S Gate)',
    theta: Math.PI / 2,
    phi: Math.PI / 2,
    description: 'Superposition with +90° relative phase along the +Y equator axis.',
    formula: '|ψ⟩ = (1/√2)|0⟩ + (i/√2)|1⟩',
    p0: 50,
    p1: 50,
  },
  {
    name: 'Phase-Flipped |-⟩',
    gateLabel: 'Pauli-Z (Flip)',
    theta: Math.PI / 2,
    phi: Math.PI,
    description: 'Superposition with 180° phase flip along the -X equator axis.',
    formula: '|ψ⟩ = (1/√2)|0⟩ - (1/√2)|1⟩',
    p0: 50,
    p1: 50,
  },
];

export const Interactive3DCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showAxesInfo, setShowAxesInfo] = useState<boolean>(false);
  const [showCustomSliders, setShowCustomSliders] = useState<boolean>(false);
  const [customTheta, setCustomTheta] = useState<number>(Math.PI / 2);
  const [customPhi, setCustomPhi] = useState<number>(0);
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const activePreset = PRESETS[activePresetIndex];

  const targetAnglesRef = useRef({ theta: PRESETS[1].theta, phi: PRESETS[1].phi });
  const currentAnglesRef = useRef({ theta: PRESETS[1].theta, phi: PRESETS[1].phi });

  // Calculate live probabilities from custom theta
  const prob0 = Math.round(Math.pow(Math.cos(customTheta / 2), 2) * 100);
  const prob1 = 100 - prob0;

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setMeasurementResult(null);
    const p = PRESETS[idx];
    setCustomTheta(p.theta);
    setCustomPhi(p.phi);
    targetAnglesRef.current = {
      theta: p.theta,
      phi: p.phi,
    };
    quantumAudio.playGateChime(523.25 + idx * 70);
  };

  const handleThetaChange = (val: number) => {
    setCustomTheta(val);
    setMeasurementResult(null);
    targetAnglesRef.current.theta = val;
  };

  const handlePhiChange = (val: number) => {
    setCustomPhi(val);
    setMeasurementResult(null);
    targetAnglesRef.current.phi = val;
  };

  // Interactive Quantum Measurement
  const handleMeasureWavefunction = () => {
    setIsMeasuring(true);
    setMeasurementResult('Collapsing wavefunction...');
    quantumAudio.playCollapseSweep();

    setTimeout(() => {
      const rand = Math.random() * 100;
      const result = rand < prob0 ? '0' : '1';
      setMeasurementResult(`Collapsed to |${result}⟩`);
      setIsMeasuring(false);

      if (result === '0') {
        targetAnglesRef.current = { theta: 0, phi: 0 };
        setCustomTheta(0);
      } else {
        targetAnglesRef.current = { theta: Math.PI, phi: 0 };
        setCustomTheta(Math.PI);
      }

      quantumAudio.playCelebration();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }, 600);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.6, 2.6, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const updateSize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    updateSize();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);


    const RADIUS = 1.65;

    // HIGH-VISIBILITY LIGHTING SYSTEM FOR DARK OBSIDIAN / DARK BLUE SPHERE
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    mainKeyLight.position.set(5, 8, 5);
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    fillLight.position.set(-5, -4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x60a5fa, 4, 15);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 1. DARK OBSIDIAN / DARK NAVY BLUE PHYSICAL SPHERE
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x071126,
      transparent: true,
      opacity: 0.88,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    rootGroup.add(sphereMesh);

    // 2. LUMINOUS BLUE WIREFRAME
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(RADIUS * 1.003, 24, 24));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      linewidth: 1.5,
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    rootGroup.add(wireLines);

    // 3. GLOWING EQUATORIAL RING
    const equatorPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const angle = (i / 96) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS));
    }
    const equatorGeo = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorLine = new THREE.Line(
      equatorGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3, transparent: true, opacity: 0.95 })
    );
    rootGroup.add(equatorLine);

    // Equatorial disk
    const planeGeo = new THREE.CircleGeometry(RADIUS, 48);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x0f2744,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI / 2;
    rootGroup.add(planeMesh);

    // 4. ORBITAL GYROSCOPE RINGS
    const createOrbitalRing = (radius: number, color: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.032, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.y = tiltY;
      return ringMesh;
    };

    const ring1 = createOrbitalRing(RADIUS * 1.32, 0x38bdf8, Math.PI / 4, 0);
    const ring2 = createOrbitalRing(RADIUS * 1.48, 0x818cf8, -Math.PI / 3, Math.PI / 6);
    rootGroup.add(ring1);
    rootGroup.add(ring2);

    // 5. COORDINATE AXIS LINES & POLES
    const axisMatX = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 });
    const axisMatY = new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 3 });
    const axisMatZ = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });

    const createAxisLine = (from: THREE.Vector3, to: THREE.Vector3, mat: THREE.LineBasicMaterial) => {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
      return new THREE.Line(geo, mat);
    };

    rootGroup.add(createAxisLine(new THREE.Vector3(-RADIUS * 1.3, 0, 0), new THREE.Vector3(RADIUS * 1.3, 0, 0), axisMatX));
    rootGroup.add(createAxisLine(new THREE.Vector3(0, 0, -RADIUS * 1.3), new THREE.Vector3(0, 0, RADIUS * 1.3), axisMatY));
    rootGroup.add(createAxisLine(new THREE.Vector3(0, -RADIUS * 1.3, 0), new THREE.Vector3(0, RADIUS * 1.3, 0), axisMatZ));

    const createPoleBead = (y: number, color: number) => {
      const beadGeo = new THREE.SphereGeometry(0.09, 24, 24);
      const beadMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.y = y;
      return bead;
    };
    rootGroup.add(createPoleBead(RADIUS, 0xffffff));
    rootGroup.add(createPoleBead(-RADIUS, 0x38bdf8));

    // 6. STATE VECTOR ARROW
    const arrowGroup = new THREE.Group();
    rootGroup.add(arrowGroup);

    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      metalness: 0.7,
      roughness: 0.1,
    });

    const arrowShaftGeo = new THREE.CylinderGeometry(0.045, 0.045, RADIUS, 24);
    const arrowShaft = new THREE.Mesh(arrowShaftGeo, arrowMat);
    arrowShaft.position.y = RADIUS / 2;

    const arrowHeadGeo = new THREE.ConeGeometry(0.15, 0.42, 24);
    const arrowHead = new THREE.Mesh(arrowHeadGeo, arrowMat);
    arrowHead.position.y = RADIUS;

    arrowGroup.add(arrowShaft);
    arrowGroup.add(arrowHead);

    const tipSphereGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const tipSphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const tipSphere = new THREE.Mesh(tipSphereGeo, tipSphereMat);
    tipSphere.position.y = RADIUS + 0.1;
    arrowGroup.add(tipSphere);

    // 7. PARTICLES
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = RADIUS * (1.08 + Math.random() * 0.55);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.cos(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    camera.lookAt(0, 0, 0);

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let mouseHoverOffset = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseHoverOffset.x = normX * 0.4;
      mouseHoverOffset.y = normY * 0.4;

      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseLeave = () => {
      isDragging = false;
      mouseHoverOffset.x = 0;
      mouseHoverOffset.y = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - prevMousePos.x;
      const deltaY = touch.clientY - prevMousePos.y;

      rootGroup.rotation.y += deltaX * 0.015;
      rootGroup.rotation.x += deltaY * 0.015;

      prevMousePos = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);


    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const cur = currentAnglesRef.current;
      const tgt = targetAnglesRef.current;
      cur.theta += (tgt.theta - cur.theta) * 0.09;
      cur.phi += (tgt.phi - cur.phi) * 0.09;

      const x = Math.sin(cur.theta) * Math.cos(cur.phi);
      const y = Math.cos(cur.theta);
      const z = Math.sin(cur.theta) * Math.sin(cur.phi);

      const targetDir = new THREE.Vector3(x, y, z).normalize();
      const defaultDir = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDir, targetDir);
      arrowGroup.setRotationFromQuaternion(quaternion);

      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;
      particles.rotation.y += 0.002;

      // Mouse hover parallax tilt
      camera.position.x += (3.6 + mouseHoverOffset.x - camera.position.x) * 0.06;
      camera.position.y += (2.6 + mouseHoverOffset.y - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);

      if (autoRotate && !isDragging) {
        rootGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };

  }, [autoRotate]);

  return (
    <div className="w-full rounded-3xl bg-white p-6 text-[#723480] relative overflow-hidden shadow-xl border-2 border-[#DBD4FF]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#DBD4FF] pb-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#531D5E] flex items-center justify-center shadow-md shadow-[#531D5E]/30 text-[#FFFFE3] border border-[#DBD4FF]">
            <Sparkles className="w-5 h-5 text-[#FFFFE3]" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-[#723480] flex items-center gap-2">
              <span>Interactive 3D Quantum Qubit Core</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DBD4FF] text-[#531D5E] text-[11px] font-mono font-bold border border-[#531D5E]/30 shadow-xs">
                3D WebGL
              </span>
            </div>
            <div className="text-xs text-[#808034] font-bold">
              Click quantum gates or drag angles to observe real-time 3D rotations on the Bloch sphere.
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Custom Angle Sliders Toggle */}
          <button
            onClick={() => setShowCustomSliders(!showCustomSliders)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showCustomSliders
                ? 'bg-[#531D5E] border-[#531D5E] text-[#FFFFE3]'
                : 'bg-[#FFFFE3] border-[#DBD4FF] text-[#723480] hover:bg-[#DBD4FF]'
            }`}
            title="Custom θ/φ angle controls"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showCustomSliders ? 'Presets' : 'Custom Angles'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[#531D5E] border-[#531D5E] text-[#FFFFE3] shadow-md'
                : 'bg-[#FFFFE3] border-[#DBD4FF] text-[#723480] hover:bg-[#DBD4FF]'
            }`}
            title="Toggle 3D auto rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            onClick={() => setShowAxesInfo(!showAxesInfo)}
            className="p-1.5 rounded-xl bg-[#FFFFE3] border border-[#DBD4FF] hover:border-[#531D5E] text-[#723480] hover:text-[#531D5E] transition-colors cursor-pointer"
            title="Toggle coordinate guide"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: 3D Canvas (Deep Dark Navy Obsidian Background #050B18) */}
        <div className="lg:col-span-7 relative h-[340px] sm:h-[380px] rounded-3xl bg-[#050B18] border-2 border-[#1E293B] overflow-hidden flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 bg-radial from-[#0284C7]/20 via-transparent to-transparent pointer-events-none" />

          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />

          {/* Drag Overlay Hint */}
          <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-1.5 text-xs text-[#531D5E] bg-[#FFFFE3]/95 px-3 py-1.5 rounded-xl font-bold border border-[#DBD4FF] shadow-lg backdrop-blur-md z-20">
            <Compass className="w-4 h-4 text-[#723480]" />
            <span>Drag or move mouse to rotate</span>
          </div>

          {/* State Vector Badge */}
          <div className="absolute top-3 right-3 pointer-events-none text-right bg-[#FFFFE3]/95 px-3.5 py-2 rounded-2xl border border-[#DBD4FF] shadow-xl backdrop-blur-md z-20">
            <div className="text-[11px] text-[#808034] font-mono font-bold flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#531D5E] animate-pulse" />
              <span>State Vector |ψ⟩</span>
            </div>
            <div className="text-sm font-black text-[#531D5E] font-mono mt-0.5">
              {measurementResult ? measurementResult : activePreset.name}
            </div>
          </div>

          {/* Basis Poles HUD */}
          {showAxesInfo && (
            <div className="absolute top-3 left-3 bg-[#FFFFE3]/95 text-[#723480] p-3 rounded-2xl border border-[#DBD4FF] text-[11px] font-mono space-y-1 shadow-2xl backdrop-blur-md z-20">
              <div className="font-bold text-[#531D5E]">|0⟩ = North Pole (+Z Axis)</div>
              <div className="font-bold text-[#531D5E]">|1⟩ = South Pole (-Z Axis)</div>
              <div className="font-bold text-[#808034]">|+⟩ = Superposition (+X Axis)</div>
              <div className="font-bold text-[#723480]">|+i⟩ = Phase (+Y Axis)</div>
            </div>
          )}
        </div>


        {/* Right: Gate Selector & Math Readout */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {showCustomSliders ? (
            /* Custom Angle Sliders */
            <div className="p-4 rounded-2xl bg-[#FFFFE3] border-2 border-[#DBD4FF] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#531D5E]">
                <span>Polar Angle θ (Latitude)</span>
                <span className="font-mono">{((customTheta / Math.PI) * 180).toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.PI}
                step={0.01}
                value={customTheta}
                onChange={(e) => handleThetaChange(parseFloat(e.target.value))}
                className="w-full accent-[#531D5E] cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-bold text-[#531D5E]">
                <span>Phase Angle φ (Longitude)</span>
                <span className="font-mono">{((customPhi / (2 * Math.PI)) * 360).toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={customPhi}
                onChange={(e) => handlePhiChange(parseFloat(e.target.value))}
                className="w-full accent-[#531D5E] cursor-pointer"
              />
            </div>
          ) : (
            /* Preset Gate Buttons */
            <div>
              <div className="text-xs font-bold font-mono text-[#808034] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#723480]" />
                <span>Apply Unitary Operator</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-3 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer ${
                      activePresetIndex === idx && !measurementResult
                        ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E] shadow-md shadow-[#531D5E]/30 font-black scale-102'
                        : 'bg-[#FFFFE3] border-[#DBD4FF] text-[#723480] hover:border-[#531D5E] hover:bg-[#531D5E] hover:text-[#FFFFE3] font-bold hover:scale-102'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{preset.gateLabel}</span>
                      <span className="text-[10px] font-mono opacity-85">{preset.name.split(' ')[1]}</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5 truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Probability Distribution Gauge */}
          <div className="p-4 rounded-2xl bg-[#FFFFE3] border-2 border-[#DBD4FF] space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#808034] font-bold">Measurement Probabilities:</span>
              <span className="text-[#723480] font-bold">Born Rule: P(x) = |⟨x|ψ⟩|²</span>
            </div>

            {/* Probability Bars */}
            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#531D5E] font-bold">|0⟩ Ground State</span>
                  <span className="text-[#531D5E] font-black">{prob0}%</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#DBD4FF]">
                  <div
                    className="h-full bg-[#531D5E] rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${prob0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#808034] font-bold">|1⟩ Excited State</span>
                  <span className="text-[#808034] font-black">{prob1}%</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#DBD4FF]">
                  <div
                    className="h-full bg-[#808034] rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${prob1}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Measure Button */}
            <div className="pt-2 border-t border-[#DBD4FF] flex items-center gap-2">
              <button
                onClick={handleMeasureWavefunction}
                disabled={isMeasuring}
                className="flex-1 py-2 px-3 rounded-xl bg-[#531D5E] hover:bg-[#42134C] text-[#FFFFE3] text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#531D5E]/25 cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                <Dices className={`w-4 h-4 ${isMeasuring ? 'animate-spin' : ''}`} />
                <span>{isMeasuring ? 'Measuring...' : 'Collapse Wavefunction (Measure)'}</span>
              </button>

              <button
                onClick={() => handleSelectPreset(1)}
                className="p-2 rounded-xl bg-white border border-[#DBD4FF] hover:border-[#531D5E] text-[#723480] hover:text-[#531D5E] transition-colors cursor-pointer"
                title="Reset Superposition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
