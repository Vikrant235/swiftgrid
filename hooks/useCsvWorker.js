/**
 * useCsvWorker Hook
 * Manages Web Worker lifecycle and communication for CSV processing
 * Keeps the main thread completely unblocked during heavy operations
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook to manage CSV processing Web Worker
 * @returns {object} Worker management interface
 */
export const useCsvWorker = () => {
  const workerRef = useRef(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [workerError, setWorkerError] = useState(null);
  const messageCallbacksRef = useRef({});
  const messageIdCounterRef = useRef(0);

  // Initialize worker on mount
  useEffect(() => {
    try {
      // Check if Web Workers are supported
      if (typeof Worker === 'undefined') {
        setWorkerError('Web Workers not supported in this browser');
        console.warn('[useCsvWorker] Web Workers not supported');
        return;
      }

      console.log('[useCsvWorker] Initializing Web Worker...');

      // Create worker from public directory
      workerRef.current = new Worker(new URL(
        '../public/csvWorker.js',
        import.meta.url
      ));

      // Set up message listener
      workerRef.current.onmessage = (event) => {
        const { id, type, payload, error } = event.data;

        // Route to callback if registered
        if (id && messageCallbacksRef.current[id]) {
          const callback = messageCallbacksRef.current[id];
          callback({ type, payload, error });
          delete messageCallbacksRef.current[id];
        }

        // Log for debugging
        if (type === 'ERROR') {
          console.error('[CSV Worker] Error:', error);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('[CSV Worker] Runtime error:', error);
        setWorkerError(error.message);
      };

      setIsWorkerReady(true);
      console.log('[useCsvWorker] Web Worker ready');
    } catch (error) {
      console.error('[useCsvWorker] Failed to initialize worker:', error);
      setWorkerError(error.message);
    }

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        console.log('[useCsvWorker] Worker terminated');
      }
    };
  }, []);

  /**
   * Send a message to the worker and wait for response
   * @param {string} type - Message type
   * @param {object} payload - Message payload
   * @returns {Promise<object>} Worker response
   */
  const postMessage = useCallback(
    (type, payload) => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        if (!isWorkerReady) {
          reject(new Error('Worker not ready'));
          return;
        }

        const id = `msg_${++messageIdCounterRef.current}`;

        // Register callback for this message
        messageCallbacksRef.current[id] = ({ type: responseType, payload: responsePayload, error }) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve({ type: responseType, payload: responsePayload });
          }
        };

        // Send message to worker
        try {
          workerRef.current.postMessage({
            id,
            type,
            payload,
          });

          // Timeout after 30 seconds
          const timeout = setTimeout(() => {
            delete messageCallbacksRef.current[id];
            reject(new Error(`Worker message timeout: ${type}`));
          }, 30000);

          // Clear timeout if response received
          const originalCallback = messageCallbacksRef.current[id];
          messageCallbacksRef.current[id] = (response) => {
            clearTimeout(timeout);
            originalCallback(response);
          };
        } catch (error) {
          delete messageCallbacksRef.current[id];
          reject(error);
        }
      });
    },
    [isWorkerReady]
  );

  /**
   * Process a CSV chunk on the worker
   * @param {Array} chunkData - Array of row objects
   * @param {number} chunkIndex - Index of this chunk
   * @param {number} totalChunks - Total number of chunks
   * @returns {Promise<object>} Processing result
   */
  const processChunk = useCallback(
    (chunkData, chunkIndex, totalChunks) => {
      return postMessage('PROCESS_CHUNK', {
        chunkData,
        chunkIndex,
        totalChunks,
      });
    },
    [postMessage]
  );

  /**
   * Validate a CSV chunk on the worker
   * @param {Array} chunkData - Array of row objects
   * @param {object} rules - Validation rules
   * @returns {Promise<object>} Validation result
   */
  const validateChunk = useCallback(
    (chunkData, rules = {}) => {
      return postMessage('VALIDATE_CHUNK', {
        chunkData,
        rules,
      });
    },
    [postMessage]
  );

  /**
   * Transform a CSV chunk on the worker
   * @param {Array} chunkData - Array of row objects
   * @param {object} transformations - Transformation rules
   * @returns {Promise<object>} Transformation result
   */
  const transformChunk = useCallback(
    (chunkData, transformations = {}) => {
      return postMessage('TRANSFORM_CHUNK', {
        chunkData,
        transformations,
      });
    },
    [postMessage]
  );

  /**
   * Health check - ping the worker
   * @returns {Promise<object>} Pong response
   */
  const ping = useCallback(() => {
    return postMessage('PING', {});
  }, [postMessage]);

  return {
    isWorkerReady,
    workerError,
    processChunk,
    validateChunk,
    transformChunk,
    ping,
  };
};

export default useCsvWorker;
