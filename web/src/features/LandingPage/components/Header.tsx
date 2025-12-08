import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const scrollToTechStack = () => {
        const techStackSection = document.getElementById('tech-stack');
        if (techStackSection) {
            techStackSection.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md">
            {/* Logo */}
            <div
                className="text-xl font-serif font-bold tracking-tight text-[#1c1917] cursor-pointer"
                onClick={() => navigate('/')}
            >
                DegreePlanner<span className="text-emerald-700">.</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-[#57534e]">
                <button
                    onClick={scrollToFeatures}
                    className="hover:text-[#1c1917] transition-colors"
                >
                    Features
                </button>
                <button
                    onClick={scrollToTechStack}
                    className="hover:text-[#1c1917] transition-colors"
                >
                    Tech Stack
                </button>
            </div>

            {/* Sign In Button */}
            <button
                onClick={() => navigate('/sign-up')}
                className="hidden md:block text-sm font-medium text-[#1c1917] underline decoration-emerald-700 decoration-2 underline-offset-4 hover:text-emerald-700"
            >
                Sign In
            </button>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 md:hidden border-t bg-white/95 backdrop-blur-md py-4 space-y-4">
                    <button
                        onClick={scrollToFeatures}
                        className="block w-full text-left px-8 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] transition-colors"
                    >
                        Features
                    </button>
                    <button
                        onClick={scrollToTechStack}
                        className="block w-full text-left px-8 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] transition-colors"
                    >
                        Tech Stack
                    </button>
                    <button
                        onClick={() => {
                            navigate('/sign-up');
                            setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-8 py-2 text-sm font-medium text-[#1c1917] underline decoration-emerald-700 decoration-2 underline-offset-4"
                    >
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    );
}

