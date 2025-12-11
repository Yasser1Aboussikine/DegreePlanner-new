import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 lg:pt-48">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
            >
                <div className="mb-6 inline-block rounded-full border border-[#d6d3d1] bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#57534e]">
                    AUI Academic Suite v2.0
                </div>
                <h1 className="font-serif text-6xl font-medium leading-[1.1] text-[#1c1917] md:text-8xl">
                    Simplify<br />
                    <span className="italic text-emerald-700">Your Academic Journey.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg text-[#57534e] md:text-xl">
                DegreePlanner helps you seamlessly organize, track, and optimize your courses, 
                making sure you're always on the right path to graduate on time and with ease.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-3 rounded-full font-medium transition-all duration-300 active:scale-95 text-sm tracking-wide bg-[#1c1917] text-[#FAFAF9] hover:bg-emerald-700 shadow-lg shadow-stone-200"
                    >
                        Start Planning
                    </button>
                    {/* <button className="px-8 py-3 rounded-full font-medium transition-all duration-300 active:scale-95 text-sm tracking-wide border border-[#d6d3d1] text-[#44403c] hover:bg-[#FAFAF9] hover:border-emerald-700">
                        Explore Catalog
                    </button> */}
                </div>
            </motion.div>
        </main>
    );
}