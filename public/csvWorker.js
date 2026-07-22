/**
 * CSV Processing Web Worker
 * Handles all CPU-intensive CSV operations on a background thread
 * Keeps the main thread responsive during large file processing
 *
 * Communication protocol:
 * - Main thread sends: { type: 'PROCESS_CHUNK', payload: chunkData }
 * - Worker sends back: { type: 'CHUNK_PROCESSED', payload: { ... } }
 */

// Listen for messages from the main thread
self.onmessage = async (event) => {
  const { type, payload, id } = event.data;

  try {
    // Route to appropriate handler based on message type
    switch (type) {
      case 'PROCESS_CHUNK':
        await handleProcessChunk(payload, id);
        break;

      case 'VALIDATE_CHUNK':
        await handleValidateChunk(payload, id);
        break;

      case 'TRANSFORM_CHUNK':
        await handleTransformChunk(payload, id);
        break;

      case 'PING':
        // Heartbeat/health check
        self.postMessage({
          type: 'PONG',
          id,
          timestamp: Date.now(),
        });
        break;

      default:
        self.postMessage({
          type: 'ERROR',
          id,
          error: `Unknown message type: ${type}`,
        });
    }
  } catch (error) {
    console.error('[CSV Worker] Error:', error);
    self.postMessage({
      type: 'ERROR',
      id,
      error: error.message,
    });
  }
};

/**
 * Process a CSV chunk - apply transformations and validations
 * This runs on the worker thread, preventing main thread blocking
 *
 * @param {object} payload - { chunkData, chunkIndex, totalChunks }
 * @param {string} id - Message ID for response correlation
 */
async function handleProcessChunk(payload, id) {
  const { chunkData, chunkIndex, totalChunks } = payload;

  try {
    // Simulate processing time (in real scenario, apply transformations)
    const processedRows = chunkData.map((row, idx) => ({
      ...row,
      _rowIndex: idx,
      _chunkIndex: chunkIndex,
      _processed: true,
    }));

    // Calculate statistics for this chunk
    const stats = {
      rowCount: processedRows.length,
      columnCount: processedRows.length > 0 ? Object.keys(processedRows[0]).length : 0,
      chunkIndex,
      totalChunks,
    };

    self.postMessage({
      type: 'CHUNK_PROCESSED',
      id,
      payload: {
        chunkIndex,
        totalChunks,
        rowCount: processedRows.length,
        stats,
        success: true,
      },
    });
  } catch (error) {
    self.postMessage({
      type: 'CHUNK_ERROR',
      id,
      error: error.message,
      chunkIndex,
    });
  }
}

/**
 * Validate a CSV chunk - check data integrity and types
 * @param {object} payload - { chunkData, rules }
 * @param {string} id - Message ID for response correlation
 */
async function handleValidateChunk(payload, id) {
  const { chunkData, rules = {} } = payload;

  try {
    const validationResults = {
      totalRows: chunkData.length,
      validRows: 0,
      invalidRows: [],
      errors: [],
    };

    chunkData.forEach((row, idx) => {
      let isValid = true;

      // Basic validation: check for required fields
      if (rules.requiredFields) {
        for (const field of rules.requiredFields) {
          if (!row[field]) {
            isValid = false;
            validationResults.errors.push(
              `Row ${idx}: Missing required field "${field}"`
            );
          }
        }
      }

      if (isValid) {
        validationResults.validRows += 1;
      } else {
        validationResults.invalidRows.push(idx);
      }
    });

    self.postMessage({
      type: 'VALIDATION_COMPLETE',
      id,
      payload: validationResults,
    });
  } catch (error) {
    self.postMessage({
      type: 'VALIDATION_ERROR',
      id,
      error: error.message,
    });
  }
}

/**
 * Transform a CSV chunk - apply column transformations, filters, etc.
 * @param {object} payload - { chunkData, transformations }
 * @param {string} id - Message ID for response correlation
 */
async function handleTransformChunk(payload, id) {
  const { chunkData, transformations = {} } = payload;

  try {
    let transformed = [...chunkData];

    // Apply transformations
    if (transformations.removeEmptyRows) {
      transformed = transformed.filter((row) =>
        Object.values(row).some((val) => val !== '' && val !== null)
      );
    }

    if (transformations.removeDuplicates) {
      const seen = new Set();
      transformed = transformed.filter((row) => {
        const key = JSON.stringify(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    if (transformations.columnMap) {
      transformed = transformed.map((row) => {
        const newRow = {};
        for (const [oldName, newName] of Object.entries(
          transformations.columnMap
        )) {
          newRow[newName] = row[oldName];
        }
        return newRow;
      });
    }

    self.postMessage({
      type: 'TRANSFORM_COMPLETE',
      id,
      payload: {
        rowsAfter: transformed.length,
        rowsBefore: chunkData.length,
        rowsRemoved: chunkData.length - transformed.length,
      },
    });
  } catch (error) {
    self.postMessage({
      type: 'TRANSFORM_ERROR',
      id,
      error: error.message,
    });
  }
}
