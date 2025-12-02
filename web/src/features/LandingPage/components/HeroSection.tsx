import { Button } from '@/components/ui/button'; // Fixed import path
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-background flex items-center justify-center px-4 py-16 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-transparent to-transparent" />
            <div className="relative w-full max-w-6xl bg-background flex flex-col lg:flex-row overflow-hidden">
                
                {/* LEFT SECTION */}
                <div className="w-full lg:w-1/2 px-10 py-16 flex flex-col justify-center">
                    <p className="text-xs tracking-widest text-muted-foreground mb-4">
                        DEGREE PLANNING TOOL
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                        Build a <span className="text-emerald-600">Clearer</span> 
                        <span className="text-primary"> Academic Path</span>
                    </h1>

                    <p className="text-base text-muted-foreground max-w-md mb-8">
                        Understand program requirements, track your progress, and stay confident about your journey to graduation.
                    </p>

                    <Button
                        size="lg"
                        onClick={() => navigate('/sign-up')}
                        className="w-fit font-medium bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* RIGHT SECTION — VISUAL PLANNER CARD */}
                <div className="w-full lg:w-1/2 p-10 flex items-center justify-center">
                    <div className="relative w-80 h-80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="absolute inset-4 rounded-2xl border border-white/10" />

                        {/* Floating cards to hint at planning data */}
                        <div className="absolute inset-8 flex flex-col gap-4 z-10">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white shadow-lg">
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">Active Plan</p>
                                <p className="text-2xl font-semibold mb-2">Semester 3</p>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '68%' }} />
                                </div>
                                <p className="text-xs text-emerald-100 mt-2">68% requirements complete</p>
                            </div>

                            <div className="bg-background rounded-2xl p-4 shadow-xl text-emerald-900">
                                <p className="text-sm font-medium mb-1">Credits Completed</p>
                                <p className="text-3xl font-bold">48</p>
                                <p className="text-xs text-emerald-600">+12 this year</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}