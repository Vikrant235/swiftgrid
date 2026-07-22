'use client';

interface CsvBlockProps {
  id: string;
  name: string;
  rowCount: number;
  color: string;
  height: number; // in pixels, calculated from rowCount
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export default function CsvBlock({
  id,
  name,
  rowCount,
  color,
  height,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: CsvBlockProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        relative rounded-lg cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:shadow-lg hover:ring-2 hover:ring-primary/50
      `}
      style={{
        backgroundColor: color,
        height: `${height}px`,
        minHeight: '40px',
      }}
    >
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none rounded-lg">
        <p className="text-xs md:text-sm font-semibold text-center px-2">
          {name}
        </p>
        <p className="text-xs opacity-90 mt-0.5">
          {rowCount.toLocaleString()} rows
        </p>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-white/50 rounded"></div>
          <div className="w-1 h-4 bg-white/50 rounded"></div>
          <div className="w-1 h-4 bg-white/50 rounded"></div>
        </div>
      </div>
    </div>
  );
}
