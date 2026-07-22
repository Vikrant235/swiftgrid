'use client';

import { useState } from 'react';
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

  // Calculate proportional height (1 row = 0.2px, min 40px)
  const calculateHeight = (rowCount: number) => {
    return Math.max(40, rowCount * 0.2);
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
              <div key={file.id} className="space-y-3">
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
