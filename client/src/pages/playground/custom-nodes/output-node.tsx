import { Handle, NodeToolbar } from "@xyflow/react";


interface OutputNodeData {
    processedFile?: string;
    label?: string;
}

export const OutputNode = ({ data }: { data: OutputNodeData }) => {


    const handleFileDownload = () => {
        const data_url = data.processedFile;

        const byteString = atob((data_url as any).split(',')[1]);
        const mimeString = (data_url as any).split(',')[0].split(':')[1].split(';')[0];

        const getFileExtension = (mimeType: any) => {
            const mimeToExt = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'image/webp': 'webp',
                'video/mp4': 'mp4',
                'video/webm': 'webm',
                'video/quicktime': 'mov'
            };
            return (mimeToExt as any)[mimeType] || 'file';
        };

        const fileExtension = getFileExtension(mimeString);
        const fileName = `downloaded_file.${fileExtension}`;

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        // Create file object
        const file = new File([blob], fileName, { type: mimeString });

        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };


    const baseNodeStyle = "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 p-2";

    const ChessboardSkeleton = () => (
        <div className="w-36 h-36 bg-gray-50 rounded-md grid grid-cols-6 grid-rows-6 overflow-hidden">
            {[...Array(36)].map((_, i) => (
                <div
                    key={i}
                    className={`${(Math.floor(i / 6) + (i % 6)) % 2 === 0
                        ? 'bg-gray-100'
                        : 'bg-gray-200'
                        }`}
                />
            ))}
        </div>
    );

    return (
        <>
            {data.label === "OUTPUT-IMAGE" && (
                <div className={baseNodeStyle}>
                    <Handle
                        type="target"
                        position="left"
                        className="w-2 h-2 -left-1 rounded-full bg-blue-500 border-2 border-white"
                    />


                    <div className="w-full h-full flex items-center justify-center">
                        {data.processedFile ? (
                            <img
                                src={data.processedFile}
                                alt="Processed"
                                className="w-36 h-36 rounded-md object-cover"
                            />
                        ) : (
                            <ChessboardSkeleton />
                        )}
                        <NodeToolbar isVisible={(data as any).toolbarVisible} position={(data as any).toolbarPosition}>
                            <button onClick={handleFileDownload}>Download</button>

                        </NodeToolbar>
                    </div>
                </div>
            )}

            {data.label === "OUTPUT-VIDEO" && (
                <div className={`${baseNodeStyle} flex items-center justify-center p-4 bg-gray-800 rounded-lg shadow-md`}>
                    <Handle
                        type="target"
                        position="left"
                        className="w-2 h-2 -left-1 rounded-full bg-blue-500 border-2 border-white"
                    />

                    {data.processedFile ? (
                        <button
                            onClick={handleFileDownload}
                            className="mt-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
                        >
                            Download
                        </button>
                    ) : (
                        <div className="mt-2 text-gray-400">Waiting for video...</div>
                    )}
                </div>
            )}
        </>
    );
};

export default OutputNode;