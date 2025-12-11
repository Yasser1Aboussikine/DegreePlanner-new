import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="relative z-10 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4">
                            DegreePlanner<span className="text-emerald-200">.</span>
                        </h3>
                        <p className="text-emerald-100 text-sm leading-relaxed">
                            An elegant intersection of graph theory and academic planning.
                            Build your degree with precision and foresight.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-emerald-100">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="text-white hover:text-emerald-200 transition-colors text-sm"
                                >
                                    Sign In
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white hover:text-emerald-200 transition-colors text-sm"
                                >
                                    Sign Up
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-emerald-100">
                            Contact
                        </h4>
                        <p className="text-emerald-100 text-sm">
                            Al Akhawayn University<br />
                            Ifrane, Morocco
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-emerald-500">
                    <p className="text-center text-emerald-100 text-sm">
                        © {new Date().getFullYear()} DegreePlanner. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
