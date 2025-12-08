import { motion } from 'framer-motion';

export default function TechStackSection() {
    const technologies = [
        'React', 'TypeScript', 'Neo4j', 'PostgreSQL',
        'Express', 'Prisma', 'Tailwind', 'dnd-kit'
    ];

    return (
        <section id="tech-stack" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <p className="text-xs tracking-widest text-[#57534e] mb-3 uppercase">
                    Built With
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-8 text-[#1c1917]">
                    Modern Technology Stack
                </h2>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-6 py-3 rounded-full border border-[#E7E5E4] bg-white/60 backdrop-blur-sm text-sm font-medium text-[#44403c] hover:border-emerald-700/30 transition-all"
                        >
                            {tech}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

