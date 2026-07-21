'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Toolbar from '@/components/toolbar';
import Workspace from '@/components/workspace';

interface FileItem {
  id: string;
  name: string;
  rowCount: number;
  color: string;
}

export default function EditorPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'File 1',
      rowCount: 15000,
      color: '#10b981',
    },
    {
      id: '2',
      name: 'File 2',
      rowCount: 8500,
      color: '#ec4899',
    },
  ]);

  const handleImport = () => {
    // In a real app, this would open a file dialog
    console.log('[v0] Import file clicked');
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleExport = () => {
    console.log('[v0] Export merged file clicked');
  };

  const handleRemoveDuplicates = () => {
    console.log('[v0] Remove duplicates clicked');
  };

  const handleStripEmpty = () => {
    console.log('[v0] Strip empty lines clicked');
  };

  const sidebarFiles = files.map(f => ({
    id: f.id,
    name: f.name,
    rowCount: f.rowCount,
  }));

  return (
    <>
      <Header isLoggedIn={isLoggedIn} userInitials="SG" />
      <div className="flex flex-1 h-[calc(100vh-73px)] bg-background">
        {/* Left Sidebar */}
        <Sidebar
          files={sidebarFiles}
          onImport={handleImport}
          onRemoveFile={handleRemoveFile}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <Toolbar
            fileCount={files.length}
            onExport={handleExport}
            onRemoveDuplicates={handleRemoveDuplicates}
            onStripEmpty={handleStripEmpty}
          />

          {/* Workspace */}
          <Workspace files={files} />
        </div>
      </div>
    </>
  );
}
