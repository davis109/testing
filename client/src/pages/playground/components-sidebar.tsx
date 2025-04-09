import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Play, Trash2, Image, Cpu, Sparkles, Film, Save } from "lucide-react";

interface ComponentsSideBarProps {
    onClear: () => void;
    onRunPipeline: () => void;
    onSaveCanvas: () => void;
    isProcessing: boolean;
    canvasName?: string;
    isGuestUser?: boolean;
}

const ComponentsSideBar = ({ 
    onClear, 
    onRunPipeline, 
    onSaveCanvas, 
    isProcessing, 
    canvasName = "Untitled Canvas",
    isGuestUser = false
}: ComponentsSideBarProps) => {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleRunPipeline = () => {
        onRunPipeline();
    };

    const onDragStart = (event, data) => {
        event.dataTransfer.setData('application/xyflow-type', data.type);
        event.dataTransfer.setData('application/xyflow-name', data.name);
        event.dataTransfer.setData('application/xyflow-category', data.category);
        event.dataTransfer.setData('application/xyflow-file', data.file);
        event.dataTransfer.setData('application/xyflow-text', data.text);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleFileUpload = (event: any) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadedImages(prev => [...prev, {
                        type: file.type.startsWith('image/') ? 'image' : 'video',
                        name: file.name,
                        color: 'green',
                        file: e.target.result,
                        thumbnail: file.type.startsWith('image/') ? e.target.result : null
                    }] as any);

                    // Create thumbnail for videos
                    if (file.type.startsWith('video/')) {
                        const video = document.createElement('video');
                        video.preload = 'metadata';
                        video.src = URL.createObjectURL(file);
                        video.onloadedmetadata = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 160;
                            canvas.height = 90;
                            video.currentTime = 1; // Capture frame at 1 second
                            video.onseeked = () => {
                                (canvas.getContext('2d') as any).drawImage(video, 0, 0, canvas.width, canvas.height);
                                const thumbnail = canvas.toDataURL();
                                setUploadedImages(prev =>
                                    prev.map(item =>
                                        item.file === e.target.result
                                            ? { ...item, thumbnail }
                                            : item
                                    ) as any
                                );
                            };
                        };
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: any) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const inputs = [
        { type: 'webcam', name: 'Webcam', color: 'green', image: null },
        { type: 'text', name: 'Text Input', color: 'green', text: null }
    ];

    const imageToImage = [
        { type: 'model', name: 'EnRes', color: 'blue', image: null },
        { type: 'model', name: 'Colorization', color: 'blue', image: null },
        { type: 'model', name: 'Stylize', color: 'blue', image: null }
    ];

    const text_to_image = [
        { type: 'model', name: 'Stable diffusion 3.5', color: 'blue', image: null }
    ];

    const video_to_video = [
        { type: 'model', name: 'EnRes video', color: 'blue', image: null },
        { type: 'model', name: 'Colorize video', color: 'blue', image: null }
    ];

    const imageGeneration = [
        { type: 'output', name: 'OUTPUT-IMAGE', color: 'blue', image: null },
        { type: 'output', name: 'OUTPUT-VIDEO', color: 'blue', image: null }
    ];

    return (
        <div className="w-80 h-full bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col gap-4 shadow-xl">

            <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm p-4 border-b border-gray-800/50 z-10">
                <div className="space-y-2">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white truncate">{canvasName}</h2>
                        {isGuestUser && (
                            <p className="text-xs text-yellow-500">Guest Mode - Data saved locally</p>
                        )}
                    </div>
                    
                    <Button
                        onClick={onRunPipeline}
                        disabled={isProcessing}
                        className={`w-full h-10 font-medium ${isProcessing
                            ? 'bg-blue-500/50 text-blue-200'
                            : 'bg-violet-500 hover:bg-violet-300 text-white shadow-lg shadow-blue-500/20'
                            } transition-all duration-200`}
                    >
                        <Play className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Processing...' : 'Run Pipeline'}
                    </Button>

                    <Button
                        onClick={onSaveCanvas}
                        disabled={isProcessing}
                        className="w-full h-10 bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 transition-all duration-200"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Canvas
                    </Button>

                    <Button
                        onClick={onClear}
                        variant="outline"
                        className="w-full h-10 bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-gray-200 shadow-lg shadow-gray-950/20"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Canvas
                    </Button>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-4 overflow-y-auto custom-scrollbar">

                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Image className="w-4 h-4 mr-2 text-gray-500" />
                            INPUTS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <label className="flex items-center justify-center p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-800/50 border border-dashed border-gray-700/50 transition-all duration-200 group">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                multiple
                            />
                            <Upload className="w-4 h-4 mr-2 text-emerald-500 group-hover:text-emerald-400" />
                            <span className="text-gray-400 text-sm group-hover:text-gray-300">Upload Image / Video</span>
                        </label>

                        {uploadedImages.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="relative bg-gray-900/50 rounded-lg group hover:bg-gray-800/50 transition-all duration-200 overflow-hidden"
                            >
                                <div
                                    draggable
                                    onDragStart={(event) => onDragStart(event, file)}
                                    className="cursor-move"
                                >
                                    <div className="flex items-center p-2 border-b border-gray-800/50">
                                        {file.type === 'video' ? (
                                            <Film className="w-4 h-4 text-emerald-400 mr-2" />
                                        ) : (
                                            <Image className="w-4 h-4 text-emerald-400 mr-2" />
                                        )}
                                        <span className="text-emerald-400 text-sm font-medium truncate max-w-[180px]">
                                            {file.name}
                                        </span>
                                    </div>


                                    <div className="relative w-full h-24 bg-gray-900/30">
                                        {file.thumbnail && (
                                            <img
                                                src={file.thumbnail}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/50 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        ))}

                        {inputs.map((input) => (
                            <div
                                key={input.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, input)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-emerald-400 text-sm font-medium">{input.name}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                            IMAGE TO IMAGE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {imageToImage.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                            TEXT TO IMAGE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {text_to_image.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                            VIDEO TO VIDEO
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {video_to_video.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                            OUTPUT
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {imageGeneration.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComponentsSideBar;