import { 
    GraduationCap, 
    GripVertical, 
    ShieldCheck, 
    Bot, 
    Network, 
    Users
} from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            icon: GraduationCap,
            title: 'Personalized Degree Planning',
            description: 'Build your degree plan with drag-and-drop course management, automatic validation, and smart eligibility tracking.'
        },
        {
            icon: Bot,
            title: 'AI-Powered Advisor',
            description: 'Get instant answers about course requirements, prerequisites, and graduation paths with ChatBase integration.'
        },
        {
            icon: Network,
            title: 'Visual Progress Tracking',
            description: 'Interactive graphs showing course relationships, progress status, and prerequisite chains for students and admins.'
        },
        {
            icon: Users,
            title: 'Advisor & Admin Tools',
            description: 'Comprehensive tools for advisors to review plans and admins to manage catalogs, prerequisites, and curriculum.'
        }
    ];

    const highlights = [
        { icon: GripVertical, title: 'Drag & Drop', description: 'Intuitive planning' },
        { icon: ShieldCheck, title: 'Auto Validation', description: 'Real-time checking' },
        { icon: Bot, title: 'AI Advisor', description: 'Smart guidance' },
        { icon: Network, title: 'Visual Graphs', description: 'See progress' }
    ];

    return (
        <section className="relative py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-xs tracking-widest text-muted-foreground mb-3 uppercase">
                        Features
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                        Everything You Need to <span className="text-emerald-600">Plan Your Degree</span>
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-background border rounded-xl p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex-shrink-0">
                                        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                
            </div>
        </section>
    );
}

