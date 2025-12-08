import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

export default function CursorSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = (e: MouseEvent) => {
    const newSparks: Spark[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      newSparks.push({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        angle: (360 / count) * i,
        scale: Math.random() * (1 - 0.5) + 0.5,
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.slice(count));
    }, 600);
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 0 }}
            animate={{
              x: spark.x + Math.cos((spark.angle * Math.PI) / 180) * 40,
              y: spark.y + Math.sin((spark.angle * Math.PI) / 180) * 40,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-700"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
