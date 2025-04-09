import { Github } from 'lucide-react';
import InfiniteSlider from './Slider';
import { useNavigate } from 'react-router';
import { useHttpRequest } from '@/hooks/httpClient';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

interface UserData {
    name: string;
    profileImage: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
    <div className="relative group">
        <a
            href={href}
            className="relative flex items-center px-4 py-2 text-sm text-gray-400
                     group-hover:text-white
                     rounded-full
                     transition-all duration-300 ease-out"
        >
            <div className="absolute w-1.5 h-1.5 rounded-full 
                          bg-gray-500/40 group-hover:bg-emerald-400 
                          -left-1 group-hover:left-2
                          transition-all duration-300 ease-out"
            />
            <span className="ml-3 group-hover:ml-5 transition-all duration-300 ease-out">
                {children}
            </span>
            <div className="absolute inset-0 rounded-full border border-transparent
                          group-hover:border-white/20
                          transition-all duration-300 ease-out"
            />
        </a>
    </div>
);

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const sendRequest = useHttpRequest();
    const { toast } = useToast();

    const getUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            // Check if this is a guest user login
            if (token === 'guest-mock-token-123456') {
                // Get user data from localStorage for guest users
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                setUser(userData);
                toast({
                    title: "Welcome Guest!",
                    description: `${userData.name}`,
                    className: "bg-gray-900 border border-gray-800 text-white",
                    duration: 3000,
                });
                setIsLoading(false);
                return;
            }

            // For regular users, continue with the API call
            const response = await sendRequest("/api/user/info", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            setUser(response.data);
            toast({
                title: "Welcome !!",
                description: `${response.data.name}`,
                className: "bg-gray-900 border border-gray-800 text-white",
                duration: 3000,
            });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        return new Promise<void>((resolve) => {
            setIsVisible(false);
            localStorage.removeItem('token');
            setUser(null);

            toast({
                title: "Logged out",
                description: "See you soon!",
                className: "bg-gray-900 border border-gray-800 text-white",
                duration: 1000,
            });
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                resolve();
            }, 2000);
        });
    };

    const handleTryNowClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: "Access Denied",
                description: "Please login or continue as guest to access the playground",
                className: "bg-gray-900 border border-gray-800 text-white",
                duration: 3000,
            });
            navigate('/login');
            return;
        }
        navigate('/canvas/history');
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsVisible(true);
        }
    }, [isLoading]);

    const UserSection = () => {
        const baseButtonClasses = "relative inline-flex items-center px-4 py-2 text-sm rounded-full border transition-all duration-300 ease-out";
        const buttonStyles = "text-white/90 border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:text-white hover:border-gray-700 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-gray-900/20";

        if (isLoading) {
            return (
                <div className="w-50 h-10 pt-2 text-gray-400 text-sm italic animate-pulse">
                    Crunching latest data, please wait...
                </div>
            );
        }

        return (
            <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div className="w-50 h-10"> {/* Fixed container size */}
                    <div className="relative group flex items-center justify-between">
                        {user ? (
                            <>
                                <div className="flex items-center gap-1 min-w-0 flex-shrink">
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-gray-700 flex-shrink-0"
                                    />
                                    <span className="text-white text-sm truncate">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`${baseButtonClasses} ${buttonStyles} ml-4 flex-shrink-0`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex-1" /> {/* Spacer */}
                                <button
                                    onClick={() => { navigate('/login') }}
                                    className={`${baseButtonClasses} ${buttonStyles} flex-shrink-0`}
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <nav className="relative bg-black border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="relative group">
                            <a href="/" className="block">
                                <div className="relative w-10 h-10 bg-blue-500/90 rounded-full 
                                          flex items-center justify-center 
                                          transition-all duration-300 ease-out
                                          group-hover:bg-blue-400
                                          group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                    <div className="w-7 h-7 bg-white rounded-full 
                                              transform transition-transform duration-300 ease-out
                                              group-hover:scale-90"
                                    />
                                </div>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block flex-1 mx-8">
                            <div className="relative flex items-center justify-center space-x-1 rounded-full 
                                      border border-gray-800 bg-gray-900/50 backdrop-blur-sm
                                      px-3 py-2 transition-all duration-300 ease-out
                                      hover:border-gray-700 hover:bg-gray-900/80">
                                <NavLink href="/about">About</NavLink>
                                <NavLink href="/discord">Discord</NavLink>
                                <NavLink href="/github">
                                    <span className="flex items-center gap-2">
                                        <Github
                                            size={16}
                                            className="transform transition-transform duration-300 ease-out
                                                 group-hover:scale-110 group-hover:rotate-3"
                                        />
                                        Github
                                    </span>
                                </NavLink>
                                <NavLink href="/docs">Docs</NavLink>
                                <NavLink href="/blog">Blog</NavLink>
                            </div>
                        </div>

                        {/* User Section */}
                        <UserSection />
                    </div>
                </div>

                {/* Hero Section */}
                <div className="flex text-white mt-8">
                    <div className="container mx-auto px-4 pt-10 text-center">
                        <h1 className="text-6xl md:text-[12rem] font-light pb-5 transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r from-[#e3efe8] to-[#96a7cf]">
                            ReviveAI
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12">
                            Easily enhance images and videos using Gen-AI
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleTryNowClick}
                        className="relative inline-flex items-center px-6 py-3 text-sm 
                             text-white/90 rounded-full border border-gray-800
                             bg-gray-900/50 backdrop-blur-sm
                             transition-all duration-300 ease-out
                             hover:text-white hover:border-gray-700 
                             hover:bg-gray-900/80 hover:shadow-lg 
                             hover:shadow-gray-900/20"
                    >
                        Try Now
                    </button>
                </div>
                <div className='flex p-3'></div>
                <div className="flex">
                    <InfiniteSlider />
                </div>

                <div className="w-full flex p-10"></div>
            </nav>
            <Toaster />
        </>
    );
};

export default Navbar;