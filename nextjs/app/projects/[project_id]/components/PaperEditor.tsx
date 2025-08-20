'use client';

import { useState, useRef, useEffect } from 'react';
import { GlobeAltIcon, ShareIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// EditorJS Tools
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import Undo from 'editorjs-undo';
import DragDrop from 'editorjs-drag-drop';
import Shortcut from '@codexteam/shortcuts';
import EJLaTeX from 'editorjs-latex';

import { IPaper } from '@/domain/model';

interface PaperEditorProps {
  holder: string;
  projectId: string;
}

export default function PaperEditor({
  holder,
  projectId,
}: PaperEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [paper, setPaper] = useState<IPaper | null>(null);

  // Initialize EditorJS
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: holder,
        placeholder: 'Start writing your paper...',
        data: {
          blocks: [
            {
              type: "header",
              data: {
                text: "Hello",
                level: 1
              },
              tunes: {
                alignmentTuneTool: {
                  alignment: "center"
                }
              }
            }
          ]
        },
        tools: {
          header: {
            class: Header, // TODO: fix this
            config: {
              levels: [1,2,3],
              defaultLevel: 2,
            },
            tunes: ["alignmentTuneTool"]
          },
          imageTool: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByUrl: async (url: string) => {
                  //: implement this
                },
                uploadByFile: async (file: File) => {
                  const timestamp = Date.now();
                  const storageRef = ref(storage, `/projects/${projectId}/images/${timestamp}_${file.name}`);
                  const uploadTask = await uploadBytesResumable(storageRef, file);
                  const url = await getDownloadURL(uploadTask.ref);
                  console.log(url);
                  return {
                    success: 1,
                    file: {
                      url: url,
                    }
                  }
                }
              }
            }
          },
          Math: {
            class: EJLaTeX,
            shortcut: 'CMD+SHIFT+M',
            config: {}
          },
          codeTool: CodeTool,
          alignmentTuneTool: {
            class: AlignmentTuneTool,
            tunes: false,
            config: {
              default: "left",
            }
          }
        },
        tunes: ["alignmentTuneTool"],
        onChange: (api, event) => {
          event = {
            type: "string",
            details: {
              target: "BlockAPI",
            },
          }
        },
        onReady: async () => {
          const editor = editorRef.current
          new Undo({editor});
          new DragDrop(editor, "2px solid #fff");
          const paper = await fetchPaper();
          editor?.blocks.render(paper || {});

          new Shortcut({
            name: 'CTRL+S',
            on: document.body,
            callback: function(event: KeyboardEvent) {
              event.preventDefault();
              editor?.save().then( savedData => {
                // POST method
                fetch(`/api/project/${projectId}/paper`, {
                  method: 'POST',
                  body: JSON.stringify(savedData)
                })
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
              })
            }
          })
        }
      })
    }
    return () => {
      if(editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const fetchPaper = async () => {
    const res = await fetch(`/api/project/${projectId}/paper`);
    const data = await res.json();
    if (data && data.paper) {
      setPaper(data.paper);
      return data.paper;
    }
  };

  const handlePublish = () => {
    console.log('Publishing document...', paper);
  };

  const handleShare = () => {
    console.log('Sharing document...', paper);
  };

  const handleExport = () => {
    console.log('Exporting document...', paper);
  };

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        const response = await fetch(`/api/project/${projectId}/paper`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(savedData)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Paper saved successfully:', data);
          // You could add a toast notification here
        } else {
          console.error('Failed to save paper');
        }
      } catch (error) {
        console.error('Error saving paper:', error);
      }
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600"> </span>
        </div>
        
        {/* Right-aligned actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors p-2"
            title="Save document"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handlePublish}
            className="text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition-colors p-2"
            title="Publish document"
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors p-2"
            title="Share document"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* EditorJS Container */}
      <div className="flex-1 overflow-auto text-black">
        <div 
          id="editorjs-container"
          className="h-full"
          style={{ minHeight: 'calc(100vh - 80px)' }}
        />
      </div>
    </div>
  );
} 