'use client';

import { use, useState } from 'react';
import { GraphAnnotation } from '@/react_agent/state';
import { z } from 'zod';

interface Result {
  data: {
    supervisor?: z.infer<typeof GraphAnnotation>;
    editor?: z.infer<typeof GraphAnnotation>;
    reviewer?: z.infer<typeof GraphAnnotation>;
    finalizer?: z.infer<typeof GraphAnnotation>;
  };
  timestamp: string;
}

export default function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<Result[]>([]);

  const projectId = use(params).project_id
  const topicId = "68afa28aac183d3329bd2989";

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await fetch(`/api/project/${projectId}/topic/${topicId}/completion`, {
      method: 'POST',
      body: JSON.stringify({ input_query: prompt }),
    });

    const reader = response.body?.getReader()
    const decoder = new TextDecoder();
    let isDone = false;
    while (reader && !isDone) {
      const { value, done } = await reader.read();
      isDone = done;

      if (value) {
        const json = JSON.parse(decoder.decode(value, { stream: true }));
        setResult(prev => [...prev, json]);
      }
    }
  };

  return (
    <div>
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} /> 
        <button onClick={handleSubmit}>Submit</button> 
        <div>{result.map((json) => <div key={json.timestamp}>
            {json.data.supervisor?.reasonings && json.data.supervisor.reasonings.length > 0 && <div>Supervisor: {json.data.supervisor.reasonings}</div>}
            {json.data.editor?.reasonings && json.data.editor.reasonings.length > 0 && <div>Editor: {json.data.editor.reasonings}</div>}
            {json.data.reviewer?.reasonings && json.data.reviewer.reasonings.length > 0 && <div>Reviewer: {json.data.reviewer.reasonings}</div>}
            {json.data.finalizer?.reasonings && json.data.finalizer.reasonings.length > 0 && <div>Finalizer: {json.data.finalizer.reasonings}</div>}
            <hr />
          </div>)}
        </div>
    </div>
  );
}