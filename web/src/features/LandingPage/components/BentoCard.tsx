import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  title: string;
  desc: string;
  children?: ReactNode;
  className?: string;
}

export default function BentoCard({
  title,
  desc,
  children,
  className,
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white/60 p-8 backdrop-blur-sm transition-all hover:border-emerald-700/30 hover:shadow-xl hover:shadow-emerald-700/5",
        className
      )}
    >
      <div className="relative z-10">
        <h3 className="font-serif text-2xl text-[#1c1917] mb-2">{title}</h3>
        <p className="text-[#57534e] leading-relaxed text-sm">{desc}</p>
      </div>
      {children}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4]/0 to-[#f0fdf4]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
}
