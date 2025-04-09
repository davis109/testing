import { Handle } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

import { Camera } from 'lucide-react';
import { useCam } from "@/store/CamContext";

export const WebCamNode = ({ data }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(true);

    const { setCamdata } = useCam()


    useEffect(() => {
        if (videoRef.current && isStreaming) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.error("Error accessing webcam:", err);
                });
        }

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isStreaming]);

    const captureImage = () => {
        if (videoRef.current) {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            // Draw the current video frame
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);

                // Convert to data URL
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImageUrl(dataUrl);
                setCamdata(dataUrl)

                // Stop the video stream
                if (videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                }
                setIsStreaming(false);
            }
        }
    };

    const restartStream = () => {
        setImageUrl(null);
        setIsStreaming(true);
    };

    return (
        <div className="relative flex flex-col">
            {/* Always visible toolbar */}
            <div className="absolute -top-10 left-0 z-50 bg-white shadow-md rounded-md p-1">
                {isStreaming ? (
                    <button
                        onClick={captureImage}
                        className="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm"
                    >
                        <Camera size={16} />
                        <span>Capture</span>
                    </button>
                ) : (
                    <button
                        onClick={restartStream}
                        className="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm"
                    >
                        <Camera size={16} />
                        <span>Restart</span>
                    </button>
                )}
            </div>

            <div className="w-full bg-gray-100 rounded-md overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Captured"
                        className="w-24 h-24 object-cover"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-24 h-24 object-cover"
                    />
                )}
            </div>

            <Handle type="source" position="right" className="w-3 h-3" />
        </div>
    );
};