import { useEffect, useState } from 'react';
import { PlusCircle, Search, Clock, Layout, Grid, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useHttpRequest } from '@/hooks/httpClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Interface for canvas type
interface Canvas {
    _id: string;
    name: string;
    canvas_id?: string;
    updated_at?: Date;
    created_at?: Date;
    last_modified?: Date;
}

function CanvasHistoryPage() {
    const navigate = useNavigate();
    const sendRequest = useHttpRequest();
    const [isOpen, setIsOpen] = useState(false);
    const [canvasName, setCanvasName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canvases, setCanvases] = useState<Canvas[]>([]);
    const [isGridView, setIsGridView] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGuestUser, setIsGuestUser] = useState(false);

    const filteredCanvases = canvases.filter(canvas =>
        canvas.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function handleGetAllCanvas() {
        try {
            const token = localStorage.getItem('token');
            
            // Check if this is a guest user
            if (token === 'guest-mock-token-123456') {
                setIsGuestUser(true);
                // For guest users, get canvases from localStorage
                const storedCanvases = localStorage.getItem('guestCanvases');
                if (storedCanvases) {
                    setCanvases(JSON.parse(storedCanvases));
                } else {
                    setCanvases([]);
                }
                return;
            }
            
            // For regular users, get canvases from server
            const response = await sendRequest('/api/user/canvas', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCanvases(response.data.data);
        } catch (error) {
            console.error('Failed to retrieve canvases:', error);
        }
    }

    useEffect(() => {
        handleGetAllCanvas();
    }, []);

    async function handleCreateCanvas() {
        if (!canvasName.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Special handling for guest users
            if (token === 'guest-mock-token-123456') {
                // Create a local canvas for guest users
                const newCanvasId = `guest-canvas-${Date.now()}`;
                const newCanvas = {
                    _id: newCanvasId,
                    name: canvasName.trim(),
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                
                // Add to local state
                const updatedCanvases = [...canvases, newCanvas];
                setCanvases(updatedCanvases);
                
                // Save to localStorage
                localStorage.setItem('guestCanvases', JSON.stringify(updatedCanvases));
                
                setIsOpen(false);
                setCanvasName('');
                // Navigate to the new canvas
                navigate(`/canvas/${newCanvasId}`);
                return;
            }
            
            // For regular users, use the API
            const response = await sendRequest('/api/user/canvas/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: canvasName.trim()
                })
            });

            if (response != null) {
                setIsOpen(false);
                setCanvasName('');
                handleGetAllCanvas();
            }
        } catch (error) {
            console.error('Failed to create canvas:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function formatDate(dateString: any) {
        const date = dateString instanceof Date 
            ? dateString 
            : new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function handleCanvasClick(canvas: Canvas) {
        if (isGuestUser) {
            navigate(`/canvas/${canvas._id}`);
        } else {
            navigate(`/canvas/${canvas._id}`);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Left Sidebar */}
            <div className="w-72 bg-gray-900 border-r border-gray-800 p-6 shadow-md">
                <div className="space-y-6">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full gap-2 bg-violet-500 hover:bg-violet-300 text-white">
                                <PlusCircle className="h-4 w-4 " />
                                New Canvas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gray-900 text-white">
                            <DialogHeader>
                                <DialogTitle>Create New Canvas</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Canvas Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter canvas name..."
                                        value={canvasName}
                                        onChange={(e) => setCanvasName(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="bg-gray-900" >Cancel</Button>
                                </DialogClose>
                                <Button
                                    onClick={handleCreateCanvas}
                                    disabled={!canvasName.trim() || isLoading}
                                    className="bg-violet-500 hover:bg-violet-300 text-white"
                                >
                                    {isLoading ? 'Creating...' : 'Create Canvas'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search canvases..."
                                className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 font-medium">View Mode</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={isGridView ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsGridView(true)}
                                    className="text-gray-900 "
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={!isGridView ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsGridView(false)}
                                    className="text-gray-900"
                                >
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Your Canvases</h1>
                    <p className="text-gray-400 mt-1">You have {filteredCanvases.length} canvas{filteredCanvases.length !== 1 ? 'es' : ''}</p>
                    {isGuestUser && (
                        <div className="mt-2 p-3 bg-gray-800 text-white rounded-lg border border-yellow-500">
                            <p>⚠️ You are using a guest account. Canvases will be stored in your browser only and will be lost if you clear your browser data.</p>
                        </div>
                    )}
                </div>

                {isGridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCanvases.map((canvas) => (
                            <Card
                                key={canvas._id}
                                className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-gray-900 border-gray-800"
                                onClick={() => handleCanvasClick(canvas)}
                            >
                                <CardContent className="p-4">
                                    <div className="h-32 bg-gray-800 rounded-md mb-4 flex items-center justify-center">
                                        <Layout className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-200">
                                        {canvas.name}
                                    </h3>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>Last edited {formatDate(canvas.updated_at || canvas.last_modified || new Date())}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredCanvases.map((canvas) => (
                            <Card
                                key={canvas._id}
                                className="group hover:shadow-md transition-shadow duration-200 cursor-pointer bg-gray-900 border-gray-800"
                                onClick={() => handleCanvasClick(canvas)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-800 rounded-md flex items-center justify-center">
                                            <Layout className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-200">
                                                {canvas.name}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-400">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>Last edited {formatDate(canvas.updated_at || canvas.last_modified || new Date())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}

export default CanvasHistoryPage;