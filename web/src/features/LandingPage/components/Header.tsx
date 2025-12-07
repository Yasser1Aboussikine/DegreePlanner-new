import { Button } from '@/components/ui/button';
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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <h1 className="text-2xl font-bold text-emerald-600">
                            DegreePlanner
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={scrollToFeatures}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </button>
                        <button
                            onClick={scrollToTechStack}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Tech Stack
                        </button>
                        <Button
                            onClick={() => navigate('/sign-up')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            Sign Up
                        </Button>
                    </nav>

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
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t py-4 space-y-4">
                        <button
                            onClick={scrollToFeatures}
                            className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </button>
                        <button
                            onClick={scrollToTechStack}
                            className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Tech Stack
                        </button>
                        <button
                            onClick={() => {
                                navigate('/sign-in');
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </button>
                        <div className="px-4">
                            <Button
                                onClick={() => {
                                    navigate('/sign-up');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

