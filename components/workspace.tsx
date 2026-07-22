'use client';

import { useState, useEffect } from 'react';
import CsvBlock from './csv-block';
import SlicerTool from './slicer-tool';

interface CsvFile {
  id: string;
  name: string;
  rowCount: number;
  color: string;
}

interface WorkspaceProps {
  files?: CsvFile[];
}

export default function Workspace({ files = [] }: WorkspaceProps) {
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [slicerLine, setSlicerLine] = useState(500);
  const [blocks, setBlocks] = useState<CsvFile[]>(files);
  const [, setRerenderKey] = useState(0);

  // Recalculate heights on window resize and when blocks change
  useEffect(() => {
    setBlocks(files);
  }, [files]);

  useEffect(() => {
    const handleResize = () => {
      setRerenderKey(prev => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate proportional height based on largest file
  const calculateHeight = (rowCount: number) => {
    if (blocks.length === 0) return 40;
    
    // Find the largest file by row count
    const largestRowCount = Math.max(...blocks.map(f => f.rowCount));
    
    // Calculate height: largest file gets 20% of screen height
    // Other files scale proportionally
    const screenHeightPercent = 20; // 20% of screen
    const baseHeightPixels = typeof window !== 'undefined' 
      ? (window.innerHeight * screenHeightPercent) / 100 
      : 300; // Fallback for SSR
    
    // Proportional height based on row count ratio
    const proportionalHeight = (rowCount / largestRowCount) * baseHeightPixels;
    
    return Math.max(40, proportionalHeight);
  };

  const handleDragStart = (fileId: string) => {
    setDraggedFile(fileId);
  };

  const handleDragEnd = () => {
    setDraggedFile(null);
  };

  return (
    <div className="h-full bg-gradient-to-b from-background to-card flex flex-col">
      {/* Canvas area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-xl">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">No files imported yet</p>
                <p className="text-sm text-muted-foreground mt-2">Use "Import Local File" in the sidebar to get started</p>
              </div>
            </div>
          ) : (
            blocks.map((file) => (
              <div key={`${file.id}-${blocks.length}`} className="space-y-3">
                <CsvBlock
                  id={file.id}
                  name={file.name}
                  rowCount={file.rowCount}
                  color={file.color}
                  height={calculateHeight(file.rowCount)}
                  onDragStart={() => handleDragStart(file.id)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedFile === file.id}
                />

                {/* Slicer tool below each block */}
                <SlicerTool lineNumber={slicerLine} onLineChange={setSlicerLine} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-border bg-card px-6 py-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {blocks.length > 0 && (
            <p>
              {blocks.length} file{blocks.length !== 1 ? 's' : ''} • Total: {blocks.reduce((sum, f) => sum + f.rowCount, 0).toLocaleString()} rows
            </p>
          )}
        </div>
        <div className="text-xs">Ready</div>
      </div>
    </div>
  );
}
