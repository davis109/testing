import { useCallback, useState } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node for sliders
const SliderNode = ({ data }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="font-semibold mb-2">{data.label}</div>
            <input
                type="range"
                min="0"
                max="100"
                value={data.value}
                onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    data.onChange(data.label.toLowerCase(), newValue);
                }}
                className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{data.value}%</div>
            <Handle type="source" position={Position.Right} className="w-2 h-2" />
        </div>
    );
};

// Custom node for image display
const ImageNode = ({ data }) => {
    const style = {
        filter: `
            saturate(${data.saturation}%)
            brightness(${data.brightness}%)
            sepia(${data.colorize}%)
        `,
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
            <Handle type="target" position={Position.Left} className="w-2 h-2" />
            <div className="font-semibold mb-2">Result</div>
            <div className="w-64 h-64 overflow-hidden rounded-lg">
                <img
                    src="dog.webp"
                    alt="Sample"
                    className="w-full h-full object-cover"
                    style={style}
                />
            </div>
        </div>
    );
};

const nodeTypes = {
    slider: SliderNode,
    image: ImageNode,
};

function ImageEffectsFlow() {
    const [effects, setEffects] = useState({
        colorize: 0,
        saturation: 100,
        brightness: 100
    });

    const updateEffect = useCallback((type: any, value: any) => {
        setEffects(prev => {
            const newEffects = { ...prev, [type]: value };
            updateImageNode(newEffects);
            return newEffects;
        });
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: '1',
            type: 'slider',
            position: { x: 0, y: 0 },
            data: {
                label: 'Colorize',
                value: effects.colorize,
                onChange: updateEffect
            },
        },
        {
            id: '2',
            type: 'slider',
            position: { x: 0, y: 150 },
            data: {
                label: 'Saturation',
                value: effects.saturation,
                onChange: updateEffect
            },
        },
        {
            id: '3',
            type: 'slider',
            position: { x: 0, y: 300 },
            data: {
                label: 'Brightness',
                value: effects.brightness,
                onChange: updateEffect
            },
        },
        {
            id: '4',
            type: 'image',
            position: { x: 400, y: 100 },
            data: effects,
        },
    ]);

    const updateImageNode = useCallback((newEffects) => {
        setNodes(nds =>
            nds.map(node => {
                if (node.type === 'slider') {
                    const effectType = node.data.label.toLowerCase();
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            value: newEffects[effectType]
                        }
                    };
                }
                if (node.type === 'image') {
                    return {
                        ...node,
                        data: newEffects
                    };
                }
                return node;
            })
        );
    }, [setNodes]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([
        { id: 'e1-4', source: '1', target: '4' },
        { id: 'e2-4', source: '2', target: '4' },
        { id: 'e3-4', source: '3', target: '4' },
    ]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gray-50"
                nodesDraggable={false}
            />
        </div>
    );
}

export default ImageEffectsFlow;