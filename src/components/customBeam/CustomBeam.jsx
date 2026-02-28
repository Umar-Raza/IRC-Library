import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CustomBeam = ({ fromRef, toRef }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    const update = () => {
      if (fromRef.current && toRef.current) {
        const f = fromRef.current.getBoundingClientRect();
        const t = toRef.current.getBoundingClientRect();
        const container = fromRef.current.closest('.beam-container').getBoundingClientRect();

        const x1 = f.left + f.width / 2 - container.left;
        const y1 = f.top + f.height / 2 - container.top;
        const x2 = t.left + t.width / 2 - container.left;
        const y2 = t.top + t.height / 2 - container.top;

        setPath(`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [fromRef, toRef]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <path d={path} stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.2" />
      <motion.path
        d={path}
        stroke="url(#glowGradient)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ pathLength: [0.2, 0.2], pathOffset: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ filter: "drop-shadow(0 0 5px #6366f1)" }}
      />
      <defs>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};