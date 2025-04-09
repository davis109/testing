import { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Background,
    Controls,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    getIncomers,
    getOutgoers,
    Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from "@/hooks/use-toast";

import { ImageNode } from './custom-nodes/image-node';
import { ModelNode } from './custom-nodes/model-node';
import { OutputNode } from './custom-nodes/output-node';
import { WebCamNode } from './custom-nodes/webcam-node';
import { VideoNode } from './custom-nodes/video-node';
import { TextNode } from './custom-nodes/text-node';
import { useText } from '@/store/TextContext';
import { useCam } from '@/store/CamContext';



const nodeTypes = {
    image: ImageNode,
    model: ModelNode,
    output: OutputNode,
    video: VideoNode,
    webcam: WebCamNode,
    text: TextNode
};

export type ReactFlowCanvasRef = {
    executePipeline: () => Promise<void>;
    loadCanvas: (nodes: Node[], edges: any[]) => void;
    getCanvasState: () => { nodes: Node[], edges: any[] };
};

const ReactFlowCanvas = forwardRef<ReactFlowCanvasRef, PipelineProps>(({ shouldClear }, ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { text } = useText()
    const { camdata } = useCam()


    useEffect(() => {
        if (shouldClear) {
            setNodes([]);
            setEdges([]);
        }
    }, [shouldClear, setNodes, setEdges]);

    const validatePipelineConnections = useCallback((inputNodes: Node[]) => {
        for (const inputNode of inputNodes) {
            let currentNode = inputNode;
            let hasModelConnection = false;
            let hasOutputConnection = false;

            while (true) {
                const outgoers = getOutgoers(currentNode, nodes, edges);
                if (outgoers.length === 0) break;

                const nextNode = outgoers[0];

                if (nextNode.type === 'model') {
                    hasModelConnection = true;
                } else if (nextNode.type === 'output') {
                    hasOutputConnection = true;
                    // Check if this output node has a model as input
                    const outputIncomers = getIncomers(nextNode, nodes, edges);
                    if (!outputIncomers.some(node => node.type === 'model')) {
                        toast({
                            title: "Pipeline Error",
                            description: "Output node must be connected to a model node",
                            variant: "destructive"
                        });
                        return false;
                    }
                }

                currentNode = nextNode;
            }

            if (!hasModelConnection) {
                toast({
                    title: "Pipeline Error",
                    description: "Input node must be connected to a model node",
                    variant: "destructive"
                });
                return false;
            }

            if (!hasOutputConnection) {
                toast({
                    title: "Pipeline Error",
                    description: "Model node must be connected to an output node",
                    variant: "destructive"
                });
                return false;
            }
        }

        return true;
    }, [nodes, edges]);

    const validatePipeline = useCallback(() => {

        const inputNodes = nodes.filter(node =>
            node.type === 'image' || node.type === 'webcam' || node.type === 'video' || node.type === "text"
        );

        console.log(inputNodes)

        if (inputNodes.length === 0) {

            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one input node",
                variant: "destructive"
            });
            return false;
        }

        if (!nodes.some(node => node.type === 'model')) {
            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one model node",
                variant: "destructive"
            });
            return false;
        }

        if (!nodes.some(node => node.type === 'output')) {
            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one output node",
                variant: "destructive"
            });
            return false;
        }

        return validatePipelineConnections(inputNodes);
    }, [nodes, validatePipelineConnections]);

    const executePipeline = useCallback(async () => {
        console.log("inside execute pipeline")
        if (!validatePipeline()) return;

        setIsProcessing(true);
        try {
            const inputNodes = nodes.filter(node =>
                node.type === 'image' || node.type === 'webcam' || node.type === 'video' || node.type === "text"
            );

            console.log(inputNodes)

            for (const inputNode of inputNodes) {
                let currentNode = inputNode;
                let processedFile = inputNode.data.file;



                while (true) {
                    const outgoers = getOutgoers(currentNode, nodes, edges);
                    if (outgoers.length === 0) break;

                    const nextNode = outgoers[0];

                    if (nextNode.type === 'model') {


                        if (inputNode.data.type == "image" || inputNode.data.type == "webcam") {

                            if (nextNode.data.label == "Colorization") {
                                const response = await fetch('http://localhost:3000/colorize/image', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        image: camdata !== "" ? camdata : processedFile,
                                        model: nextNode.data.label,
                                    }),
                                });


                                if (!response.ok) {
                                    throw new Error(`Processing failed at ${nextNode.data.label}`);
                                }

                                const result = await response.json();
                                processedFile = result.processedImage;

                            }
                            else if (nextNode.data.label == "Stylize") {
                                const response = await fetch('http://localhost:3000/stylize/image', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    // body: JSON.stringify({
                                    //     image1: inputNodes[0].data.file,
                                    //     image2: inputNodes[1].data.file,
                                    //     model: nextNode.data.label,
                                    // }),
                                    body: JSON.stringify({
                                        image1: camdata !== "" ? camdata : inputNodes[0].data.file,
                                        image2: inputNodes[1].data.file,
                                        model: nextNode.data.label,
                                    }),
                                });


                                if (!response.ok) {
                                    throw new Error(`Processing failed at ${nextNode.data.label}`);
                                }

                                const result = await response.json();
                                processedFile = result.processedImage;

                            }
                            else {
                                const response = await fetch('http://localhost:3000/enhance/image', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        image: camdata !== "" ? camdata : processedFile,
                                        model: nextNode.data.label,
                                    }),
                                });


                                if (!response.ok) {
                                    throw new Error(`Processing failed at ${nextNode.data.label}`);
                                }

                                const result = await response.json();
                                processedFile = result.processedImage;

                            }


                        }
                        else if (inputNode.data.type == "video") {

                            if (nextNode.data.label == "Colorize video") {
                                const response = await fetch('http://localhost:3000/colorize/video', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        video: processedFile,
                                        model: nextNode.data.label,
                                    }),
                                });


                                if (!response.ok) {
                                    throw new Error(`Processing failed at ${nextNode.data.label}`);
                                }

                                const result = await response.json();
                                processedFile = result.processedVideo;
                            }
                            else {

                                const response = await fetch('http://localhost:3000/enhance/video', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        video: processedFile,
                                        model: nextNode.data.label,
                                    }),
                                });


                                if (!response.ok) {
                                    throw new Error(`Processing failed at ${nextNode.data.label}`);
                                }

                                const result = await response.json();
                                processedFile = result.processedVideo;
                            }


                        }

                        else if (inputNode.data.type == "text") {

                            const response = await fetch('http://localhost:3000/enhance/text', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    text: text,

                                }),
                            });


                            if (!response.ok) {
                                throw new Error(`Processing failed at ${nextNode.data.label}`);
                            }

                            const result = await response.json();
                            processedFile = result.processedImage;
                        }



                        setNodes(nds => nds.map(node => {
                            if (node.id === nextNode.id) {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        processedFile: processedFile
                                    }
                                };
                            }
                            return node;
                        }));
                    } else if (nextNode.type === 'output') {
                        setNodes(nds => nds.map(node => {
                            if (node.id === nextNode.id) {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        processedFile: processedFile
                                    }
                                };
                            }
                            return node;
                        }));
                    }

                    currentNode = nextNode;
                }
            }

            toast({
                title: "Success",
                description: "Pipeline executed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: (error as any).message || "Failed to execute pipeline",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    }, [nodes, edges, setNodes, validatePipeline]);

    useImperativeHandle(ref, () => ({
        executePipeline,
        loadCanvas: (savedNodes: Node[], savedEdges: any[]) => {
            setNodes(savedNodes);
            setEdges(savedEdges);
        },
        getCanvasState: () => ({
            nodes,
            edges
        })
    }));

    const onConnect = useCallback((params: any) => {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds) as any);
    }, [setEdges]);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/xyflow-type');
        console.log(type)
        const name = event.dataTransfer.getData('application/xyflow-name');
        const file = event.dataTransfer.getData('application/xyflow-file');


        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        const newNode = {
            id: `${type}-${nodes.length + 1}`,
            type,
            position,
            data: {
                label: name,
                type,
                file,
            },
        };

        console.log(newNode)

        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    const proOptions = { hideAttribution: true };

    return (
        <div
            style={{ height: "100vh", width: "100%" }}
            onDrop={onDrop}
            className='bg-gray-900 text-gray-500'
            onDragOver={onDragOver}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                fitView
            >
                <Background color="#aaa" gap={16} />
                <Controls className='space-y-1' />
            </ReactFlow>
        </div>
    );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;