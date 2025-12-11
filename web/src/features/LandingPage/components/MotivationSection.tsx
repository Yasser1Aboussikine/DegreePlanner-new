import { motion } from 'framer-motion';
import { FileText, Network } from 'lucide-react';

const MacOSWindow = ({ children, title }: { children: React.ReactNode; title: string }) => {
    return (
        <div className="rounded-xl border border-[#d6d3d1] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-[#f5f5f4] to-[#e7e5e4] border-b border-[#d6d3d1]">
                <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="flex-1 text-center text-xs text-[#57534e] font-medium pr-14">
                    {title}
                </p>
            </div>
            {children}
        </div>
    );
};

export default function MotivationSection() {
    const motivationItems = [
        {
            title: 'The Problem',
            description: 'Before DegreePlanner, students had to manually create their degree plans, often using a Word document. They would look up courses in separate course catalogs and try to track prerequisites and semester schedules on their own. This process was not only time-consuming but also frustrating and confusing. It was hard to keep the plan up to date, especially with all the different courses to manage and prerequisites to track. For first-year students, degree planning can be especially tricky, as it\'s an important assignment in the First-Year Experience (FYE) Seminar, and many students end up feeling overwhelmed.',
            icon: <FileText className="h-5 w-5 text-white" />,
            image: '/degreeplan_pic.png',
            imageTitle: 'Traditional Degree Planning'
        },
        {
            title: 'The Solution',
            description: 'DegreePlanner solves these problems by providing a streamlined, organized way to plan and track your degree, making the process smoother, faster, and much more reliable. Built with a modern architecture combining Neo4j graph database for prerequisite tracking, PostgreSQL for data management, and React with TypeScript for a seamless user experience, the platform offers real-time validation, AI-powered guidance, and interactive visualizations.',
            icon: <Network className="h-5 w-5 text-white" />,
            image: '/architecture_diagram.png',
            imageTitle: 'DegreePlanner Architecture'
        }
    ];

    return (
        <section id="motivation" className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-0">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <p className="text-xs tracking-widest text-[#57534e] mb-3 uppercase">
                    Our Story
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4 text-[#1c1917]">
                    Why DegreePlanner?
                </h2>
                <p className="text-[#57534e] max-w-2xl mx-auto">
                    Transforming the way students plan their academic journey from confusion to clarity.
                </p>
            </motion.div>

            <div className="relative pb-0 mb-0">
                <div className="absolute left-[19px] top-0 h-[calc(100%+12rem)] w-0.5 bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-600"></div>

                <div className="space-y-16">
                    {motivationItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative flex gap-6 items-start"
                        >
                            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/20">
                                {item.icon}
                            </div>

                            <div className="flex-1 pb-8">
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-serif font-semibold text-[#1c1917] mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#57534e] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <MacOSWindow title={item.imageTitle}>
                                        <div className="p-4 bg-[#fafafa]">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                loading="lazy"
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>
                                    </MacOSWindow>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
