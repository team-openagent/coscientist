'use client'

import dynamic from "next/dynamic";


const Editor = dynamic(() => import ('./components/Editor'), {
  ssr: false,
});

export default function Home() {
  const initialData = {
    "time": 1723824000000,
    "blocks": [
      {
        "type": "header",
        "data": {
          "text": "Welcome to Editor.js in Next.js!",
          "level": 2,
        }
      }
    ]
  }
  return (
    <main className="p-2">
      <Editor holder="editor-container" initialData={initialData}></Editor>
    </main> 
  );
}
