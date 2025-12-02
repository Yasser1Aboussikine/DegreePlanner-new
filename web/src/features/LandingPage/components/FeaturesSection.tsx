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
            description: 'Build and manage your degree plan with drag-and-drop course planning, automatic validation, and smart eligibility tracking.'
        },
        {
            icon: Bot,
            title: 'AI-Powered Advisor',
            description: 'Get instant answers about course requirements, prerequisites, and graduation paths with ChatBase integration.'
        },
        {
            icon: Network,
            title: 'Visual Progress Tracking',
            description: 'See your academic journey with interactive graphs showing course relationships and progress status.'
        },
        {
            icon: Users,
            title: 'Advisor & Admin Tools',
            description: 'Comprehensive tools for advisors to review plans and admins to manage catalogs and prerequisites.'
        }
    ];

    const highlights = [
        { icon: GripVertical, title: 'Drag & Drop', description: 'Intuitive planning' },
        { icon: ShieldCheck, title: 'Auto Validation', description: 'Real-time checking' },
        { icon: Bot, title: 'AI Advisor', description: 'Smart guidance' },
        { icon: Network, title: 'Visual Graphs', description: 'See progress' }
    ];

    return (
        <section className="relative py-16 px-4 bg-background">
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

                
            </div>
        </section>
    );
}

