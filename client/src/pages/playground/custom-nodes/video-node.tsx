import { Handle } from "@xyflow/react";



export const VideoNode = ({ data }: any) => {
    return (
        <>
            <Handle
                type="source"
                position="right"
                className="w-3 h-3 bg-green-500"
            />
            <div className="flex flex-col">

                {data.file && (
                    <div className="w-full  bg-gray-100 rounded-md overflow-hidden">
                        <video
                            src={data.file}
                            autoPlay
                            loop
                            className="w-24 h-24 object-cover object-fit"
                        />
                    </div>
                )}

            </div>
        </>
    );
};
