import { motion } from 'framer-motion';
import { Timeline } from './Timeline';
import {
    GraduationCap,
    Calendar,
    CheckCircle2,
    Brain,
    Network,
    Users,
    MessageSquare,
    Shield
} from 'lucide-react';

export default function FeaturesTimeline() {
    const features = [
        {
            title: 'Student Degree Planning',
            description: 'Build personalized degree plans with drag-and-drop course planning. Add, remove, and rearrange courses across semesters while viewing completed, planned, and missing courses in real-time.',
            icon: <GraduationCap className="h-5 w-5 text-white" />
        },
        {
            title: 'Automatic Validation',
            description: 'Every modification is validated server-side through rules enforced by Neo4j and Prisma. Check prerequisites, co-requisites, duplicate courses, credit limits, and requirement completion automatically.',
            icon: <CheckCircle2 className="h-5 w-5 text-white" />
        },
        {
            title: 'Eligibility System',
            description: 'Only courses with satisfied prerequisites are unlocked and shown as available. The system computes eligibility per semester using Prisma and Neo4j prerequisite graphs.',
            icon: <Shield className="h-5 w-5 text-white" />
        },
        {
            title: 'AI-Powered Degree Advisor',
            description: 'Ask structured or open-ended questions about your degree path. ChatBase integration provides intelligent guidance on course requirements, prerequisites, and optimal graduation paths.',
            icon: <Brain className="h-5 w-5 text-white" />
        },
        {
            title: 'Interactive Course Graphs',
            description: 'Visualize your degree progress with React Flow. See prerequisite chains, course dependencies, and locked/unlocked states in an interactive graph with color-coded nodes.',
            icon: <Network className="h-5 w-5 text-white" />
        },
        {
            title: 'Real-time Collaboration',
            description: 'Advisors and mentors can view student plans, provide comments, and approve degree plans. Students can chat with mentors through group messaging for personalized guidance.',
            icon: <MessageSquare className="h-5 w-5 text-white" />
        },
        {
            title: 'Role-Based Access Control',
            description: 'Secure, role-based system with Students, Advisors, Mentors, Registrars, and Admins. Each role has specific permissions and workflows tailored to their responsibilities.',
            icon: <Users className="h-5 w-5 text-white" />
        },
        {
            title: 'Semester Management',
            description: 'Organize courses by semester with support for Fall, Spring, Summer, and Winter terms. Track chronological order and manage course status (Planned, Completed, Dropped).',
            icon: <Calendar className="h-5 w-5 text-white" />
        }
    ];

    return (
        <section id="features-timeline" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <p className="text-xs tracking-widest text-muted-foreground mb-3 uppercase">
                    Core Features
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4 text-foreground">
                    Comprehensive Academic Planning
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    DegreePlanner combines AI guidance, graph-based visualization, and an interactive
                    drag-and-drop semester planner to help students build and optimize their degree progress.
                </p>
            </motion.div>

            <Timeline items={features} />
        </section>
    );
}
