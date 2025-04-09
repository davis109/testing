import { useText } from "@/store/TextContext";
import { Handle } from "@xyflow/react";
import { useState } from "react";

export const TextNode = ({ data }: any) => {
    const { setText } = useText();
    const [isDisabled, setIsDisabled] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSetText = () => {
        setText(inputValue);
        setIsDisabled(true);
    };

    const handleEdit = () => {
        setIsDisabled(false);
    };

    return (
        <div className="flex items-center bg-gray-100 p-2 rounded-md shadow-md gap-2">
            <Handle
                type="source"
                position="right"
                className="w-3 h-3 bg-green-500"
            />
            <input
                type="text"
                onChange={handleInputChange}
                value={inputValue}
                disabled={isDisabled}
                className={`p-1 border border-gray-300 rounded-md ${isDisabled
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'bg-white cursor-text'
                    }`}
                placeholder="Enter text..."
            />
            {!isDisabled ? (
                <button
                    onClick={handleSetText}
                    className="px-3 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                    Set
                </button>
            ) : (
                <button
                    onClick={handleEdit}
                    className="px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600"
                >
                    Edit
                </button>
            )}
        </div>
    );
};