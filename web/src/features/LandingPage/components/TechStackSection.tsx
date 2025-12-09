import { motion } from 'framer-motion';
import { LogoLoop } from '@/components/LogoLoop';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TechStackSection() {
    const technologies = [
        {
            name: 'React',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            alt: 'React logo'
        },
        {
            name: 'TypeScript',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
            alt: 'TypeScript logo'
        },
        {
            name: 'Neo4j',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg',
            alt: 'Neo4j logo'
        },
        {
            name: 'PostgreSQL',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
            alt: 'PostgreSQL logo'
        },
        {
            name: 'Express',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
            alt: 'Express logo'
        },
        {
            name: 'Prisma',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
            alt: 'Prisma logo'
        },
        {
            name: 'Tailwind CSS',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
            alt: 'Tailwind CSS logo'
        },
        {
            name: 'Redux',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
            alt: 'Redux logo'
        },
        {
            name: 'Vite',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
            alt: 'Vite logo'
        },
        {
            name: 'Node.js',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
            alt: 'Node.js logo'
        }
    ];

    const logoItems = technologies.map((tech) => ({
        node: (
            <Tooltip>
                <TooltipTrigger asChild>
                    <img
                        src={tech.logo}
                        alt={tech.alt}
                        className="h-12 w-12 object-contain cursor-pointer"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tech.name}</p>
                </TooltipContent>
            </Tooltip>
        ),
        title: tech.name,
        ariaLabel: tech.alt
    }));

    return (
        <section id="tech-stack" className="relative z-10 mx-auto max-w-full px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <p className="text-xs tracking-widest text-[#57534e] dark:text-muted-foreground mb-3 uppercase">
                    Built With
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-12 text-[#1c1917] dark:text-foreground">
                    Modern Technology Stack
                </h2>

                <div className="mt-12">
                    <TooltipProvider>
                        <LogoLoop
                            logos={logoItems}
                            speed={50}
                            direction="left"
                            logoHeight={48}
                            gap={35}
                            pauseOnHover={true}
                            scaleOnHover={true}
                            fadeOut={true}
                            ariaLabel="Technology stack logos"
                            className="py-8"
                        />
                    </TooltipProvider>
                </div>
            </motion.div>
        </section>
    );
}

