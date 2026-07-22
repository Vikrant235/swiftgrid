'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Toolbar from '@/components/toolbar';
import Workspace from '@/components/workspace';
import CsvUploader from '@/components/CsvUploader';

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
  const [showUploader, setShowUploader] = useState(false);

  const handleImport = () => {
    setShowUploader(true);
  };

  const handleFileProcessed = (fileData: { file: File; metadata: any }) => {
    // Add the processed file to the workspace
    const newFile: FileItem = {
      id: `file_${Date.now()}`,
      name: fileData.file.name.replace('.csv', ''),
      rowCount: fileData.metadata.totalRows,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    setFiles([...files, newFile]);
    setShowUploader(false);
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

          {/* Uploader Modal / Workspace */}
          {showUploader ? (
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              <div className="w-full max-w-2xl">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload CSV File</h2>
                  <p className="text-muted-foreground">
                    Upload a new CSV file to add to your workspace. Files are processed locally with streaming chunks.
                  </p>
                </div>
                <CsvUploader onFileProcessed={handleFileProcessed} />
              </div>
            </div>
          ) : (
            <Workspace files={files} />
          )}
        </div>
      </div>
    </>
  );
}
