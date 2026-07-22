/**
 * Origin Private File System (OPFS) Utilities
 * Handles streaming chunk writes to the browser's local sandbox storage
 * Using modern navigator.storage API for secure, local file persistence
 */

/**
 * Check if OPFS is available in the current browser environment
 * @returns {boolean} True if OPFS is supported
 */
export const isOPFSAvailable = () => {
  return (
    typeof navigator !== 'undefined' &&
    navigator.storage &&
    typeof navigator.storage.getDirectory === 'function'
  );
};

/**
 * Write a data chunk to OPFS storage
 * This function demonstrates the streaming pattern for appending chunks
 * to browser-local sandbox storage without loading entire file into memory
 *
 * @param {string} fileName - The name of the file to write to
 * @param {Uint8Array|string} dataChunk - The chunk of data to write
 * @param {boolean} isFirstChunk - Whether this is the first chunk (creates file)
 * @returns {Promise<{success: boolean, bytes: number, error?: string}>}
 */
export const writeChunkToOPFS = async (
  fileName,
  dataChunk,
  isFirstChunk = false
) => {
  try {
    if (!isOPFSAvailable()) {
      throw new Error(
        'OPFS not available. Running in preview mode or unsupported browser.'
      );
    }

    // Get the root directory of OPFS
    const root = await navigator.storage.getDirectory();

    // Get or create the file
    const fileHandle = await root.getFileHandle(fileName, {
      create: isFirstChunk,
    });

    // Get writable stream for appending
    const writable = await fileHandle.createWritable({ keepExistingData: true });

    // Convert string to Uint8Array if needed
    const buffer =
      dataChunk instanceof Uint8Array
        ? dataChunk
        : new TextEncoder().encode(dataChunk);

    // Write the chunk
    await writable.write(buffer);
    await writable.close();

    return {
      success: true,
      bytes: buffer.byteLength,
    };
  } catch (error) {
    console.error('[OPFS] Error writing chunk:', error);
    return {
      success: false,
      bytes: 0,
      error: error.message,
    };
  }
};

/**
 * Read a file from OPFS storage
 * @param {string} fileName - The name of the file to read
 * @returns {Promise<{data: string|null, error?: string}>}
 */
export const readFileFromOPFS = async (fileName) => {
  try {
    if (!isOPFSAvailable()) {
      throw new Error('OPFS not available');
    }

    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const text = await file.text();

    return { data: text };
  } catch (error) {
    console.error('[OPFS] Error reading file:', error);
    return {
      data: null,
      error: error.message,
    };
  }
};

/**
 * Delete a file from OPFS storage
 * @param {string} fileName - The name of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFileFromOPFS = async (fileName) => {
  try {
    if (!isOPFSAvailable()) {
      throw new Error('OPFS not available');
    }

    const root = await navigator.storage.getDirectory();
    await root.removeEntry(fileName);

    return { success: true };
  } catch (error) {
    console.error('[OPFS] Error deleting file:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * List all files in OPFS storage
 * @returns {Promise<{files: string[], error?: string}>}
 */
export const listFilesInOPFS = async () => {
  try {
    if (!isOPFSAvailable()) {
      throw new Error('OPFS not available');
    }

    const root = await navigator.storage.getDirectory();
    const files = [];

    for await (const [name] of root.entries()) {
      files.push(name);
    }

    return { files };
  } catch (error) {
    console.error('[OPFS] Error listing files:', error);
    return {
      files: [],
      error: error.message,
    };
  }
};
