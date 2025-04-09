import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const [currentQuote, setCurrentQuote] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate()

    const quotes = [
        {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill"
        },
        {
            text: "Innovation distinguishes between a leader and a follower.",
            author: "Steve Jobs"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Everything you've ever wanted is sitting on the other side of fear.",
            author: "George Addair"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        }
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleGoogleSignInUser = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(
            scopes.join(' '),
        )}&response_type=code&redirect_uri=${encodeURIComponent(
            redirectUri,
        )}&client_id=${encodeURIComponent(
            clientId,
        )}&access_type=offline&prompt=consent`;

        window.location.href = authUrl;
    };

    const handleGuestLogin = () => {
        // Create mock user data
        const mockUserData = {
            name: "Guest User",
            email: "guest@example.com",
            profileImage: "https://ui-avatars.com/api/?name=Guest+User&background=random"
        };
        
        // Set a mock token
        localStorage.setItem('token', 'guest-mock-token-123456');
        localStorage.setItem('userId', 'guest-user-id');
        
        // Store the mock user data
        localStorage.setItem('userData', JSON.stringify(mockUserData));
        
        // Navigate to the main page
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col md:flex-row">
            {/* Left Side - Login Card */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 z-20">
                <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl">
                    <div className="flex flex-col items-center p-6 md:p-8 space-y-6 md:space-y-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Welcome Back
                            </h1>
                            <p className="text-sm md:text-base text-gray-400">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <div className="w-full space-y-4">
                            <button
                                onClick={handleGoogleSignInUser}
                                className="group flex items-center gap-3 bg-white text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 w-full justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="font-medium">Continue with Google</span>
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 text-gray-400 bg-gray-800/50">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGuestLogin}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mb-4"
                            >
                                Continue as Guest
                            </button>

                            <button
                                onClick={() => {
                                    navigate('/')
                                }}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Side - Video and Quotes */}
            <div className="w-full md:w-1/2 relative overflow-hidden min-h-[300px] md:min-h-screen order-first md:order-last">
                {/* Video Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-gray-900 z-10" />
                <div className="absolute inset-0">
                    <div className="h-full w-full flex items-center justify-center">
                        <video
                            className="min-h-full min-w-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={() => setIsVideoLoaded(true)}
                            style={{ opacity: isVideoLoaded ? 1 : 0 }}
                        >
                            <source src="weird.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                {/* Quote Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12">
                    <div
                        className="text-center space-y-4 md:space-y-6 transition-all duration-500 ease-in-out"
                        style={{
                            opacity: isVideoLoaded ? 1 : 0,
                            transform: `translateY(${isVideoLoaded ? '0' : '20px'})`,
                        }}
                    >
                        <p className="text-xl md:text-3xl font-light text-white leading-relaxed max-w-lg">
                            "{quotes[currentQuote].text}"
                        </p>
                        <p className="text-lg md:text-xl text-gray-300 font-medium">
                            - {quotes[currentQuote].author}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;