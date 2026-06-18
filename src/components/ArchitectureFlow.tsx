import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Database, MonitorSmartphone, Server } from 'lucide-react';

const initialNodes = [
  {
    id: 'client',
    type: 'default',
    position: { x: 50, y: 125 },
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <MonitorSmartphone className="w-6 h-6 text-indigo-400 mb-1" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Cliente (Navegador)</span>
          <span className="text-[10px] text-slate-400 mt-1">Interface do Usuário</span>
        </div>
      )
    },
    style: { 
      background: '#18181b', 
      border: '1px solid #3f3f46', 
      borderRadius: '12px',
      color: 'white',
      width: 150
    },
  },
  {
    id: 'front',
    type: 'default',
    position: { x: 300, y: 50 },
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="text-xl mb-1 text-cyan-400 font-bold">⚛️</div>
          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Front-end</span>
          <span className="text-[10px] text-slate-400 mt-1">Aba React / JS</span>
        </div>
      )
    },
    style: { 
      background: '#18181b', 
      border: '1px solid #3f3f46', 
      borderRadius: '12px',
      color: 'white',
      width: 150
    },
  },
  {
    id: 'back',
    type: 'default',
    position: { x: 550, y: 50 },
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <Server className="w-6 h-6 text-emerald-400 mb-1" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Worker / Servidor</span>
          <span className="text-[10px] text-slate-400 mt-1">Ambiente de Execução</span>
        </div>
      )
    },
    style: { 
      background: '#18181b', 
      border: '1px solid #3f3f46', 
      borderRadius: '12px',
      color: 'white',
      width: 150
    },
  },
  {
    id: 'db',
    type: 'default',
    position: { x: 550, y: 200 },
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <Database className="w-6 h-6 text-amber-400 mb-1" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Armazenamento</span>
          <span className="text-[10px] text-slate-400 mt-1">Estado & Storage</span>
        </div>
      )
    },
    style: { 
      background: '#18181b', 
      border: '1px solid #3f3f46', 
      borderRadius: '12px',
      color: 'white',
      width: 150
    },
  },
];

const initialEdges = [
  {
    id: 'e-client-front',
    source: 'client',
    target: 'front',
    animated: true,
    style: { stroke: '#22d3ee', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
    label: 'Eventos',
    labelStyle: { fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' },
    labelBgStyle: { fill: '#18181b', padding: 4 }
  },
  {
    id: 'e-front-back',
    source: 'front',
    target: 'back',
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#818cf8',
    },
    label: 'HTTP Fetch',
    labelStyle: { fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' },
    labelBgStyle: { fill: '#18181b', padding: 4 }
  },
  {
    id: 'e-back-db',
    source: 'back',
    target: 'db',
    animated: true,
    style: { stroke: '#34d399', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#34d399',
    },
    label: 'Queries',
    labelStyle: { fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' },
    labelBgStyle: { fill: '#18181b', padding: 4 }
  },
];

export function ArchitectureFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        minZoom={0.5}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={12} size={1} color="#3f3f46" />
        <Controls showInteractive={false} className="bg-neutral-900 border-neutral-800 fill-white" />
        {/* <MiniMap nodeColor="#3f3f46" maskColor="#18181b"  className="bg-neutral-950 border border-neutral-800"/> */}
      </ReactFlow>
    </div>
  );
}
