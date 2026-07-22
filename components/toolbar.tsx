'use client';

import { Button } from '@/components/ui/button';
import { Download, Trash2, Wind } from 'lucide-react';

interface ToolbarProps {
  fileCount?: number;
  onExport?: () => void;
  onRemoveDuplicates?: () => void;
  onStripEmpty?: () => void;
  isProcessing?: boolean;
}

export default function Toolbar({
  fileCount = 0,
  onExport,
  onRemoveDuplicates,
  onStripEmpty,
  isProcessing = false,
}: ToolbarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-foreground">Visual Editor</h1>
          {fileCount > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {fileCount} file{fileCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/50"
            onClick={onExport}
            disabled={isProcessing || fileCount === 0}
            title="Export merged CSV file"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Merged
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/50"
            onClick={onRemoveDuplicates}
            disabled={isProcessing || fileCount === 0}
            title="Remove duplicate rows"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Duplicates
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/50"
            onClick={onStripEmpty}
            disabled={isProcessing || fileCount === 0}
            title="Strip empty lines"
          >
            <Wind className="w-4 h-4 mr-2" />
            Strip Empty
          </Button>
        </div>
      </div>
    </div>
  );
}
