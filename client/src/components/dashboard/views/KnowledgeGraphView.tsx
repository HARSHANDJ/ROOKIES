import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  FileText, 
  RefreshCw,
  X
} from 'lucide-react';
import { api } from '../../../services/api';
import type { GraphNode, GraphTopologyData } from '../../../types';

export const KnowledgeGraphView: React.FC = () => {
  const [topology, setTopology] = useState<GraphTopologyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // SVG Pan & Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setIsLoading(true);
    api.getKnowledgeGraphTopology()
      .then((data) => {
        setTopology(data);
      })
      .catch((err) => console.warn('Graph topology load error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Calculate Node Layout Positions
  const getNodeCoordinates = (node: GraphNode, index: number) => {
    if (node.type === 'document') {
      return { x: 150, y: 120 + index * 130 };
    }
    if (node.type === 'topic') {
      return { x: 450, y: 100 + index * 120 };
    }
    if (node.type === 'rule') {
      return { x: 750, y: 80 + index * 100 };
    }
    // Chunk nodes
    return { x: 1050, y: 60 + index * 70 };
  };

  const filteredNodes = topology?.nodes?.filter((n) =>
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)] min-h-[650px]">
      
      {/* Header Controls */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-obsidian-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-accent-cyan shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Knowledge Graph & Entity Topology
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Interactive SVG Graph: Document → Topic → Entity/Rule → Vector Chunk
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Node Search Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-400 w-48">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
            />
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-950 p-1 rounded-xl border border-slate-200 dark:border-obsidian-800">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800 transition-colors"
              title="Reset Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="flex-1 glass-card rounded-3xl border border-slate-200 dark:border-obsidian-800 relative overflow-hidden flex shadow-inner bg-slate-950/90 text-white">
        
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
            <span>Constructing Knowledge Topology...</span>
          </div>
        ) : (
          <svg
            ref={svgRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            viewBox="0 0 1200 800"
          >
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
              
              {/* Draw Edges */}
              {topology?.edges?.map((edge) => {
                const sourceNode = topology.nodes.find((n) => n.id === edge.source);
                const targetNode = topology.nodes.find((n) => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                const sourceIndex = topology.nodes.filter((n) => n.type === sourceNode.type).indexOf(sourceNode);
                const targetIndex = topology.nodes.filter((n) => n.type === targetNode.type).indexOf(targetNode);

                const srcPos = getNodeCoordinates(sourceNode, sourceIndex);
                const tgtPos = getNodeCoordinates(targetNode, targetIndex);

                const isConnected = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={srcPos.x}
                      y1={srcPos.y}
                      x2={tgtPos.x}
                      y2={tgtPos.y}
                      stroke={isConnected ? '#06b6d4' : '#334155'}
                      strokeWidth={isConnected ? 2.5 : 1}
                      strokeDasharray={edge.label === 'Amends' ? '4 4' : undefined}
                      opacity={isConnected ? 1 : 0.4}
                    />
                    {edge.label && (
                      <text
                        x={(srcPos.x + tgtPos.x) / 2}
                        y={(srcPos.y + tgtPos.y) / 2 - 4}
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {filteredNodes.map((node) => {
                const sameTypeNodes = topology?.nodes?.filter((n) => n.type === node.type) || [];
                const index = sameTypeNodes.indexOf(node);
                const pos = getNodeCoordinates(node, index);

                const isSelected = selectedNode?.id === node.id;

                let nodeColor = '#3b82f6';
                if (node.type === 'document') nodeColor = '#6366f1';
                if (node.type === 'topic') nodeColor = '#06b6d4';
                if (node.type === 'rule') nodeColor = '#10b981';
                if (node.type === 'chunk') nodeColor = '#8b5cf6';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    {/* Node Glow Circle */}
                    <circle
                      r={isSelected ? 22 : 16}
                      fill={nodeColor}
                      fillOpacity={isSelected ? 0.3 : 0.15}
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <circle r={isSelected ? 10 : 7} fill={nodeColor} />

                    {/* Node Label Text */}
                    <text
                      x="24"
                      y="4"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

            </g>
          </svg>
        )}

        {/* Floating Canvas Legend */}
        <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-obsidian-900/90 border border-obsidian-800 space-y-2 text-[11px] font-mono shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Topology Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span>Document</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
            <span>Topic Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Entity / Rule</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            <span>Vector Chunk</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-6 right-6 w-80 p-5 rounded-3xl bg-obsidian-900/95 border border-obsidian-700 space-y-3 text-xs shadow-2xl backdrop-blur-xl animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
              <div className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent-cyan" />
                <span>Node Inspector</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Node Title</div>
              <div className="font-bold text-sm text-white mt-0.5">{selectedNode.label}</div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400">Node Type:</span>
              <span className="px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan font-bold uppercase">
                {selectedNode.type}
              </span>
            </div>

            {selectedNode.category && (
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-200">{selectedNode.category}</span>
              </div>
            )}

            {selectedNode.details?.text && (
              <div className="pt-2 border-t border-obsidian-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Passage Text</div>
                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 font-mono text-[11px] text-slate-300 italic max-h-36 overflow-y-auto leading-relaxed">
                  "{selectedNode.details.text}"
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
