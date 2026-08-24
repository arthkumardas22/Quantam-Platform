'use client';

import React, { useEffect, useState } from 'react';

export const QuantumMouseFollower: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [trailPos, setTrailPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth spring lag for ambient background hover glow
    const animateTrail = () => {
      setTrailPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });
      animId = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [mousePos, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Darkened, elegant ambient background spotlight (No cursor circle) */}
      <div
        className="fixed w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none transition-opacity duration-300"
        style={{
          transform: `translate(${trailPos.x - 210}px, ${trailPos.y - 210}px)`,
          background:
            'radial-gradient(circle, rgba(114, 52, 128, 0.18) 0%, rgba(219, 212, 255, 0.3) 40%, transparent 75%)',
          opacity: 0.85,
        }}
      />
    </div>
  );
};
