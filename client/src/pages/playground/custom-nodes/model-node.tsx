import { Handle } from "@xyflow/react";

export const ModelNode = ({ data }: any) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200 min-w-[200px]">
            <Handle
                type="target"
                position="left"
                className="w-2 h-2 -left-1 rounded-full bg-blue-500 border-2 border-white"
            />
            <div className="text-gray-800 font-medium text-center py-1">
                {data.label}
            </div>
            <Handle
                type="source"
                position="right"
                className="w-2 h-2 -right-1 rounded-full bg-blue-500 border-2 border-white"
            />
        </div>
    );
};