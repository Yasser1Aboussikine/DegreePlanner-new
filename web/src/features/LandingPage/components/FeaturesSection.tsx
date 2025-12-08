import { motion } from 'framer-motion';
import { Compass, Layers, GitMerge } from 'lucide-react';
import BentoCard from './BentoCard';

export default function FeaturesSection() {
    return (
        <section id="features" className="relative z-10 mx-auto max-w-6xl px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-32 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
            >
                {/* Main Large Card */}
                <BentoCard
                    title="The Graph Engine"
                    desc="Neo4j-powered logic visualizes prerequisites as a living network, not a list."
                    className="md:col-span-2 min-h-[300px]"
                >
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                        <GitMerge size={200} strokeWidth={0.5} />
                    </div>
                </BentoCard>

                {/* Tall Card */}
                <BentoCard
                    title="AI Advisor"
                    desc="Context-aware guidance for your specific major and minor requirements."
                    className="md:row-span-2 bg-[#f4f3f1]"
                >
                    <div className="mt-8 flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-[#e7e5e4] flex items-center justify-center">
                            <Compass className="text-emerald-700" />
                        </div>
                    </div>
                </BentoCard>

                {/* Standard Card */}
                <BentoCard
                    title="Drag & Drop"
                    desc="Fluid interactions powered by dnd-kit."
                    className=""
                >
                    <Layers className="absolute top-8 right-8 text-[#d6d3d1]" />
                </BentoCard>

                {/* Wide Bottom Card */}
                <BentoCard
                    title="Strict Validation"
                    desc="Server-side enforcement of credit limits and co-requisites."
                    className="md:col-span-2 lg:col-span-3"
                >
                    <div className="mt-4 flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-700" />
                        <div className="h-2 w-2 rounded-full bg-emerald-700 opacity-50" />
                        <div className="h-2 w-2 rounded-full bg-emerald-700 opacity-25" />
                    </div>
                </BentoCard>
            </motion.div>
        </section>
    );
}

