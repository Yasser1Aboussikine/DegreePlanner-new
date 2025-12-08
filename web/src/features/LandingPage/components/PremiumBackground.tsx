import { motion } from 'framer-motion';

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAFAF9]">
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Drifting Beige Orb */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#E7E5E4] opacity-40 blur-[100px]"
      />

      {/* Drifting Green Orb */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[0%] h-[50vh] w-[50vh] rounded-full bg-[#dcfce7] opacity-30 blur-[120px]"
      />
    </div>
  );
}
