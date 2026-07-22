'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCsvWorker from '@/hooks/useCsvWorker';
import { streamCsvFile, validateCsvFile, getFileMetadata } from '@/lib/csv-streaming';
import { writeChunkToOPFS, isOPFSAvailable } from '@/lib/opfs-utils';
import { initializeWasmEngine } from '@/lib/wasm-engine';

const PROCESSING_STAGES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  CHUNKING: 'chunking',
  WRITING_OPFS: 'writing_opfs',
  INITIALIZING_WASM: 'initializing_wasm',
  COMPLETE: 'complete',
  ERROR: 'error',
};

const STAGE_LABELS = {
  [PROCESSING_STAGES.VALIDATING]: 'Validating File...',
  [PROCESSING_STAGES.CHUNKING]: 'Chunking File...',
  [PROCESSING_STAGES.WRITING_OPFS]: 'Writing to OPFS...',
  [PROCESSING_STAGES.INITIALIZING_WASM]: 'Initializing WASM Engine...',
  [PROCESSING_STAGES.COMPLETE]: 'Processing Complete!',
  [PROCESSING_STAGES.ERROR]: 'Error Processing File',
};

/**
 * CsvUploader Component
 * Handles CSV file upload with drag-and-drop UI
 * Orchestrates the four-pillar architecture:
 * 1. Streaming & Chunking (Papa Parse)
 * 2. Web Workers (main thread blocking prevention)
 * 3. WASM Engine (SQL query support)
 * 4. OPFS (browser-local storage)
 */
export default function CsvUploader({ onFileProcessed = null }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingStage, setProcessingStage] = useState(PROCESSING_STAGES.IDLE);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState(null);

  const { isWorkerReady, workerError, processChunk } = useCsvWorker();

  // Check if we're in preview mode (OPFS or Workers not available)
  React.useEffect(() => {
    const opfsAvailable = isOPFSAvailable();
    const workersAvailable = typeof Worker !== 'undefined';

    if (!opfsAvailable || !workersAvailable) {
      setPreviewMode(true);
      console.warn('[CsvUploader] Preview mode: OPFS or Workers not available');
    }
  }, []);

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  /**
   * Handle drag over area
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle drag leave area
   */
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  /**
   * Main file upload and processing orchestrator
   * Coordinates all four pillars of the architecture
   */
  const handleFileUpload = async (file) => {
    try {
      setError(null);
      setStats(null);

      // Stage 1: Validate file
      setProcessingStage(PROCESSING_STAGES.VALIDATING);
      const validation = validateCsvFile(file);

      if (!validation.valid) {
        setError(validation.error);
        setProcessingStage(PROCESSING_STAGES.ERROR);
        return;
      }

      setSelectedFile(file);
      const metadata = getFileMetadata(file);
      console.log('[CsvUploader] File selected:', metadata);

      // Stage 2: Stream and chunk the file
      setProcessingStage(PROCESSING_STAGES.CHUNKING);
      let totalRowsProcessed = 0;
      let totalChunksProcessed = 0;

      try {
        const result = await streamCsvFile(
          file,
          1000, // chunk size
          async (chunk) => {
            // Send each chunk to worker for processing
            if (isWorkerReady) {
              try {
                const workerResult = await processChunk(
                  chunk.data,
                  chunk.chunkIndex,
                  chunk.totalRowsProcessed
                );
                totalChunksProcessed += 1;
                console.log(`[CsvUploader] Chunk ${chunk.chunkIndex} processed`);
              } catch (workerError) {
                console.error('[CsvUploader] Worker error:', workerError);
              }
            }

            totalRowsProcessed = chunk.totalRowsProcessed;

            // Stage 3: Write chunks to OPFS (if available)
            if (isOPFSAvailable() && !previewMode) {
              setProcessingStage(PROCESSING_STAGES.WRITING_OPFS);

              const csvContent = chunk.data
                .map((row) => Object.values(row).join(','))
                .join('\n');

              const opfsResult = await writeChunkToOPFS(
                file.name,
                csvContent,
                chunk.chunkIndex === 0
              );

              if (!opfsResult.success) {
                console.warn('[CsvUploader] OPFS write failed:', opfsResult.error);
              }
            }
          },
          (progressUpdate) => {
            setProgress(progressUpdate.percentComplete);
          }
        );

        // Stage 4: Initialize WASM Engine
        if (!previewMode) {
          setProcessingStage(PROCESSING_STAGES.INITIALIZING_WASM);

          const wasmResult = await initializeWasmEngine();
          if (!wasmResult.success) {
            console.warn('[CsvUploader] WASM initialization failed:', wasmResult.error);
          }
        }

        // Processing complete
        setProcessingStage(PROCESSING_STAGES.COMPLETE);
        setProgress(100);

        const finalStats = {
          fileName: file.name,
          fileSize: metadata.sizeFormatted,
          totalRows: result.totalRows,
          totalChunks: result.totalChunks,
          avgRowsPerChunk: Math.round(result.totalRows / result.totalChunks),
          processingTime: new Date().toLocaleTimeString(),
        };

        setStats(finalStats);
        console.log('[CsvUploader] Processing complete:', finalStats);

        if (onFileProcessed) {
          onFileProcessed({
            file,
            metadata: finalStats,
          });
        }

        // Auto-reset after 3 seconds
        setTimeout(() => {
          resetUploader();
        }, 3000);
      } catch (streamError) {
        console.error('[CsvUploader] Streaming error:', streamError);
        setError(`Streaming error: ${streamError.error}`);
        setProcessingStage(PROCESSING_STAGES.ERROR);
      }
    } catch (err) {
      console.error('[CsvUploader] Upload error:', err);
      setError(err.message);
      setProcessingStage(PROCESSING_STAGES.ERROR);
    }
  };

  /**
   * Reset uploader state
   */
  const resetUploader = () => {
    setProcessingStage(PROCESSING_STAGES.IDLE);
    setSelectedFile(null);
    setProgress(0);
    setError(null);
    setStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isProcessing = processingStage !== PROCESSING_STAGES.IDLE && processingStage !== PROCESSING_STAGES.COMPLETE;
  const isComplete = processingStage === PROCESSING_STAGES.COMPLETE;
  const isError = processingStage === PROCESSING_STAGES.ERROR;

  return (
    <div className="w-full">
      {/* Preview Mode Warning */}
      {previewMode && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold">Preview Mode: Local Execution Required</p>
            <p className="text-xs opacity-90 mt-1">
              Web Workers or OPFS not available in preview. Full processing works in local environment.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {!isProcessing && !isComplete && !isError && (
          <>
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Drop your CSV file here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click the button below to browse. Max 1000 MB.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isProcessing}
            >
              Browse File
            </Button>
          </>
        )}

        {/* Processing UI */}
        {isProcessing && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {STAGE_LABELS[processingStage]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFile?.name}
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        {/* Complete UI */}
        {isComplete && stats && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {STAGE_LABELS[processingStage]}
              </p>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <p>Rows processed: {stats.totalRows.toLocaleString()}</p>
                <p>Chunks created: {stats.totalChunks}</p>
                <p>File size: {stats.fileSize}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error UI */}
        {isError && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {STAGE_LABELS[processingStage]}
              </p>
              <p className="text-sm text-destructive mt-2">{error}</p>
              <Button
                onClick={resetUploader}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Worker Status */}
      {!isProcessing && !isComplete && (
        <div className="text-xs text-muted-foreground mt-3 text-center">
          {!isWorkerReady && !workerError && 'Web Worker initializing...'}
          {workerError && <span className="text-destructive">Worker error: {workerError}</span>}
          {isWorkerReady && !previewMode && 'Web Worker ready • OPFS available'}
        </div>
      )}
    </div>
  );
}
