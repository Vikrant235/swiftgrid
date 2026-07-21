'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  rowCount: number;
}

interface SidebarProps {
  files?: FileItem[];
  onImport?: () => void;
  onRemoveFile?: (fileId: string) => void;
}

export default function Sidebar({ files = [], onImport, onRemoveFile }: SidebarProps) {
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-bold text-foreground mb-3">Files</h2>
        <Button
          onClick={onImport}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Local File
        </Button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {files.length === 0 ? (
          <div className="text-center py-8 px-2">
            <p className="text-xs text-muted-foreground">
              No files imported yet. Click above to add your first CSV.
            </p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              onMouseEnter={() => setHoveredFile(file.id)}
              onMouseLeave={() => setHoveredFile(null)}
              className="group p-3 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer relative"
            >
              <div className="flex items-start justify-between gap-2 pr-6">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {file.rowCount.toLocaleString()} rows
                  </p>
                </div>
              </div>

              {/* Remove button */}
              {hoveredFile === file.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile?.(file.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-destructive/20 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {files.length} file{files.length !== 1 ? 's' : ''} • {files.reduce((sum, f) => sum + f.rowCount, 0).toLocaleString()} total rows
        </p>
      </div>
    </div>
  );
}
