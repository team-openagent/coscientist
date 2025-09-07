import { useState, useCallback, useRef } from 'react';

interface StreamChunk {
  type: 'chunk' | 'complete' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

interface UseStreamCompletionOptions {
  onChunk?: (chunk: any) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface UseStreamCompletionReturn {
  stream: (inputQuery: string, projectId?: string, topicId?: string) => Promise<void>;
  isStreaming: boolean;
  error: string | null;
  reset: () => void;
}

export function useStreamCompletion(options: UseStreamCompletionOptions = {}): UseStreamCompletionReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (
    inputQuery: string, 
    projectId?: string, 
    topicId?: string
  ) => {
    try {
      setIsStreaming(true);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_query: inputQuery,
          project_id: projectId,
          topic_id: topicId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamChunk = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'chunk':
                    options.onChunk?.(data.data);
                    break;
                  case 'complete':
                    options.onComplete?.();
                    break;
                  case 'error':
                    const errorMsg = data.error || 'Unknown error occurred';
                    setError(errorMsg);
                    options.onError?.(errorMsg);
                    break;
                }
              } catch (parseError) {
                console.error('Error parsing stream data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't set error
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsStreaming(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setError(null);
    setIsStreaming(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Auto-cleanup on unmount
  if (typeof window !== 'undefined') {
    // This is a simple way to handle cleanup, in a real app you might want to use useEffect
    window.addEventListener('beforeunload', cleanup);
  }

  return {
    stream,
    isStreaming,
    error,
    reset,
  };
}
