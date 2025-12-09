import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface TimelineItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

interface TimelineProps {
    items: TimelineItem[];
}

export const Timeline = ({ items }: TimelineProps) => {
    return (
        <div className="relative">
            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-400 dark:from-emerald-500 dark:via-emerald-600 dark:to-emerald-700"></div>

            <div className="space-y-12">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative flex gap-6 items-start"
                    >
                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 shadow-lg shadow-emerald-600/20">
                            {item.icon || <CheckCircle2 className="h-5 w-5 text-white" />}
                        </div>

                        <div className="flex-1 pb-8">
                            <motion.div
                                whileHover={{ x: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
