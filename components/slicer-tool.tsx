'use client';

import { useState, useRef } from 'react';
import { GripHorizontal } from 'lucide-react';

interface SlicerToolProps {
  lineNumber: number;
  onLineChange?: (newLine: number) => void;
  isDragging?: boolean;
}

export default function SlicerTool({ lineNumber, onLineChange, isDragging = false }: SlicerToolProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragActive(true);

    const startY = e.clientY;
    const startLine = lineNumber;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const linesDelta = Math.floor(delta / 5); // 5px per line
      const newLine = Math.max(1, startLine + linesDelta);
      onLineChange?.(newLine);
    };

    const handleMouseUp = () => {
      setIsDragActive(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative h-12 flex items-center group transition-all
        ${isDragActive ? 'bg-primary/20' : 'hover:bg-primary/10'}
      `}
    >
      {/* Horizontal line */}
      <div className="absolute left-0 right-0 h-0.5 bg-primary" />

      {/* Grab handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          absolute right-2 flex items-center justify-center
          w-10 h-10 rounded-lg cursor-grab active:cursor-grabbing
          transition-colors
          ${isDragActive ? 'bg-primary/30 text-primary' : 'bg-card hover:bg-primary/20 text-muted-foreground hover:text-primary'}
          border border-border hover:border-primary/50
        `}
      >
        <GripHorizontal className="w-5 h-5" />
      </div>

      {/* Label */}
      <div className="ml-4 flex flex-col">
        <p className="text-xs font-semibold text-muted-foreground">Cut Position</p>
        <p className="text-sm font-bold text-foreground">Line {lineNumber.toLocaleString()}</p>
      </div>
    </div>
  );
}
