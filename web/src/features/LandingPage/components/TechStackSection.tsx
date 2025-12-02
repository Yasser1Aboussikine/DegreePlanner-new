import { 
    Database, 
    Code, 
    Server, 
    Bot, 
    Wrench
} from 'lucide-react';

export default function TechStackSection() {
    const techCategories = [
        {
            title: 'Database',
            icon: Database,
            technologies: [
                { name: 'Neo4j (Course Catalog Graph Database)', logo: 'neo4j' },
                { name: 'PostgreSQL (via Prisma ORM)', logo: 'postgresql' }
            ]
        },
        {
            title: 'Frontend',
            icon: Code,
            technologies: [
                { name: 'React.js (App Router)', logo: 'react' },
                { name: 'React 19', logo: 'react' },
                { name: 'TypeScript', logo: 'typescript' },
                { name: 'RTK Query', logo: 'redux' },
                { name: 'dnd-kit', logo: 'javascript' },
                { name: 'React Flow', logo: 'react' },
                { name: 'Tailwind CSS', logo: 'tailwindcss' },
                { name: 'shadcn/ui', logo: 'react' }
            ]
        },
        {
            title: 'Backend',
            icon: Server,
            technologies: [
                { name: 'Express.js (TypeScript)', logo: 'express' },
                { name: 'Prisma ORM (PostgreSQL)', logo: 'prisma' },
                { name: 'neo4j-driver (Neo4j graph DB)', logo: 'neo4j' },
                { name: 'JWT Authentication', logo: 'jsonwebtokens' },
                { name: 'Zod validation', logo: 'zod' }
            ]
        },
        {
            title: 'AI Integration',
            icon: Bot,
            technologies: [
                { name: 'ChatBase (AI degree advising)', logo: 'openai' }
            ]
        },
        {
            title: 'Dev Tools',
            icon: Wrench,
            technologies: [
                { name: 'Turborepo', logo: 'turborepo' },
                { name: 'pnpm', logo: 'pnpm' },
                { name: 'ESLint + Prettier', logo: 'eslint' },
                { name: 'Docker', logo: 'docker' },
                { name: 'Nodemon for dev backend', logo: 'nodemon' }
            ]
        }
    ];

    return (
        <section id="tech-stack" className="relative py-20 px-4 bg-gradient-to-b from-background to-emerald-50/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-xs tracking-widest text-muted-foreground mb-3 uppercase">
                        Built With
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                        Modern <span className="text-emerald-600">Technology Stack</span>
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                        Powered by cutting-edge tools and frameworks for a robust, scalable, and maintainable application.
                    </p>
                </div>

                {/* Tech Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {techCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={index}
                                className="bg-background border rounded-xl p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                                        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{category.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {category.technologies.map((tech, techIndex) => {
                                        // Use emerald color for logos to match theme
                                        const logoUrl = `https://cdn.simpleicons.org/${tech.logo}/10b981`;
                                        return (
                                            <li key={techIndex} className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20 rounded p-0.5">
                                                    <img 
                                                        src={logoUrl} 
                                                        alt={tech.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            // Fallback to a generic icon if logo fails to load
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{tech.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

