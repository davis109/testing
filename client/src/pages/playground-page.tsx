import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ComponentsSideBar from "./playground/components-sidebar";
import ReactFlowCanvas, { ReactFlowCanvasRef } from "./playground/react-flow-canvas";
import { Toaster } from '@/components/ui/toaster';
import { useCam } from '@/store/CamContext';
import { useText } from '@/store/TextContext';
import { useHttpRequest } from '@/hooks/httpClient';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const PlayGroundPage = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const sendRequest = useHttpRequest();
    const [shouldClear, setShouldClear] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [canvasName, setCanvasName] = useState("Untitled Canvas");
    const [isGuestUser, setIsGuestUser] = useState(false);
    const reactFlowRef = useRef<ReactFlowCanvasRef>(null);
    const { setCamdata } = useCam();
    const { setText } = useText();

    // Load canvas data when component mounts
    useEffect(() => {
        const loadCanvas = async () => {
            if (!id) return;
            
            const token = localStorage.getItem('token');
            
            // Check if guest user
            if (token === 'guest-mock-token-123456') {
                setIsGuestUser(true);
                // Load from localStorage for guest users
                const storedCanvases = localStorage.getItem('guestCanvases');
                if (storedCanvases) {
                    const guestCanvases = JSON.parse(storedCanvases);
                    const canvas = guestCanvases.find((c: any) => c._id === id);
                    if (canvas) {
                        setCanvasName(canvas.name);
                        // Load nodes and edges if they exist
                        if (canvas.nodes && reactFlowRef.current) {
                            reactFlowRef.current.loadCanvas(canvas.nodes, canvas.edges || []);
                        }
                    } else {
                        toast({
                            title: "Error",
                            description: "Canvas not found",
                            variant: "destructive"
                        });
                        navigate('/canvas/history');
                    }
                }
                return;
            }
            
            // For regular users - load from server
            try {
                const response = await sendRequest(`/api/user/canvas/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response && response.data) {
                    const canvas = response.data.data;
                    setCanvasName(canvas.name);
                    // Load nodes and edges if they exist and reactFlowRef is available
                    if (canvas.nodes && reactFlowRef.current) {
                        reactFlowRef.current.loadCanvas(canvas.nodes, canvas.edges || []);
                    }
                }
            } catch (error) {
                console.error('Failed to load canvas:', error);
                toast({
                    title: "Error",
                    description: "Failed to load canvas",
                    variant: "destructive"
                });
            }
        };
        
        loadCanvas();
    }, [id, sendRequest, navigate, toast]);

    const handleClear = () => {
        if (isProcessing) return; // Prevent clearing while processing
        setShouldClear(true);
        setCamdata("");
        setText("");
        setTimeout(() => setShouldClear(false), 100);
    };

    const handleRunPipeline = async () => {
        if (!reactFlowRef.current || isProcessing) return;

        try {
            setIsProcessing(true);
            await reactFlowRef.current.executePipeline();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveCanvas = async () => {
        if (!reactFlowRef.current || !id) return;
        
        try {
            const { nodes, edges } = reactFlowRef.current.getCanvasState();
            const token = localStorage.getItem('token');
            
            // For guest users, save to localStorage
            if (token === 'guest-mock-token-123456') {
                const storedCanvases = localStorage.getItem('guestCanvases');
                let guestCanvases = storedCanvases ? JSON.parse(storedCanvases) : [];
                
                // Find and update the current canvas
                guestCanvases = guestCanvases.map((canvas: any) => {
                    if (canvas._id === id) {
                        return {
                            ...canvas,
                            nodes,
                            edges,
                            updated_at: new Date()
                        };
                    }
                    return canvas;
                });
                
                localStorage.setItem('guestCanvases', JSON.stringify(guestCanvases));
                toast({
                    title: "Success",
                    description: "Canvas saved locally",
                });
                return;
            }
            
            // For regular users, save to server
            await sendRequest(`/api/user/canvas/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nodes,
                    edges
                })
            });
            
            toast({
                title: "Success",
                description: "Canvas saved",
            });
        } catch (error) {
            console.error('Failed to save canvas:', error);
            toast({
                title: "Error",
                description: "Failed to save canvas",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="relative flex w-full h-screen">
            <ComponentsSideBar
                onClear={handleClear}
                onRunPipeline={handleRunPipeline}
                onSaveCanvas={handleSaveCanvas}
                isProcessing={isProcessing}
                canvasName={canvasName}
                isGuestUser={isGuestUser}
            />
            <div className="flex-1">
                <ReactFlowCanvas
                    ref={reactFlowRef}
                    shouldClear={shouldClear}
                    isProcessing={isProcessing}
                />
            </div>
            <Toaster />
        </div>
    );
};

export default PlayGroundPage;