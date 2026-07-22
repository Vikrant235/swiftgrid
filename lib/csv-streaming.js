/**
 * CSV Streaming & Chunking Utilities
 * Uses Papa Parse with chunk callbacks to process large files
 * without loading the entire file into memory
 */

import Papa from 'papaparse';

/**
 * Stream and chunk a CSV file using Papa Parse
 * This pattern enables processing of multi-gigabyte files incrementally
 * Each chunk is sent to a Web Worker or callback handler
 *
 * @param {File} file - The CSV file to process
 * @param {number} chunkSize - Number of rows per chunk (default: 1000)
 * @param {Function} onChunk - Callback function called for each chunk
 * @param {Function} onProgress - Callback function for progress updates
 * @returns {Promise<{totalRows: number, totalChunks: number, error?: string}>}
 */
export const streamCsvFile = (
  file,
  chunkSize = 1000,
  onChunk = null,
  onProgress = null
) => {
  return new Promise((resolve, reject) => {
    let totalRows = 0;
    let totalChunks = 0;
    let currentChunk = [];
    let headers = [];

    Papa.parse(file, {
      // Enable streaming mode to process in chunks
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,

      // Chunk callback fired at specified row intervals
      chunk: (results, parser) => {
        // Add rows to current chunk accumulator
        currentChunk = currentChunk.concat(results.data);
        totalRows += results.data.length;

        // When chunk reaches target size, emit it
        if (currentChunk.length >= chunkSize) {
          const chunkData = currentChunk.slice(0, chunkSize);
          totalChunks += 1;

          if (onChunk) {
            onChunk({
              chunkIndex: totalChunks - 1,
              data: chunkData,
              rowCount: chunkData.length,
              totalRowsProcessed: totalRows,
            });
          }

          // Keep overflow rows in current chunk for next iteration
          currentChunk = currentChunk.slice(chunkSize);

          if (onProgress) {
            onProgress({
              rowsProcessed: totalRows,
              chunksEmitted: totalChunks,
              percentComplete: Math.round((totalRows / file.size) * 100),
            });
          }
        }
      },

      // Complete callback fired after entire file is parsed
      complete: () => {
        // Emit any remaining rows as final chunk
        if (currentChunk.length > 0) {
          totalChunks += 1;

          if (onChunk) {
            onChunk({
              chunkIndex: totalChunks - 1,
              data: currentChunk,
              rowCount: currentChunk.length,
              totalRowsProcessed: totalRows,
              isFinal: true,
            });
          }
        }

        if (onProgress) {
          onProgress({
            rowsProcessed: totalRows,
            chunksEmitted: totalChunks,
            percentComplete: 100,
          });
        }

        resolve({
          totalRows,
          totalChunks,
        });
      },

      // Error callback
      error: (error) => {
        console.error('[CSV Streaming] Parse error:', error);
        reject({
          error: error.message,
          totalRows,
          totalChunks,
        });
      },
    });
  });
};

/**
 * Validate CSV file before processing
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 1000)
 * @returns {{valid: boolean, error?: string}}
 */
export const validateCsvFile = (file, maxSizeMB = 1000) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  if (!file.name.endsWith('.csv')) {
    return {
      valid: false,
      error: 'File must be a CSV file',
    };
  }

  return { valid: true };
};

/**
 * Get file metadata without full parse
 * @param {File} file - The file to analyze
 * @returns {{name: string, size: number, sizeFormatted: string, type: string}}
 */
export const getFileMetadata = (file) => {
  const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: sizeInMB > 1 ? `${sizeInMB} MB` : `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
  };
};
