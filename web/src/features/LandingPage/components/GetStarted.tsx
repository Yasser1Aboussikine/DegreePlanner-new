import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GetStarted() {
    const navigate = useNavigate();

    const features = [
        'Track your degree progress in real-time',
        'Plan semesters with our Drag-and-Drop Feature',
        'Visualize your academic journey',
        'Stay on track to graduation'
    ];

    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-background to-emerald-50/30">
            <div className="max-w-6xl mx-auto">
                <div className="bg-background rounded-2xl border shadow-lg p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* LEFT: Features & Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                                    Ready to <span className="text-emerald-600">Get Started</span>?
                                </h2>
                                <p className="text-muted-foreground">
                                    Join thousands of students taking control of their academic journey.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-muted-foreground">{feature}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Quick Setup</p>
                                        <p className="text-sm font-semibold">5 minutes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Free Forever</p>
                                        <p className="text-sm font-semibold">No cost</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </section>
    );
}

