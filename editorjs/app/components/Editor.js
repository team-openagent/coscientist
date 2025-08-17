'use client'

import React, {useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import Paragraph from '@editorjs/paragraph';
import Shortcut from '@codexteam/shortcuts';

import SimpleImage from '../editor-plugin/simple/simple';
import MyBlockTune from '../editor-plugin/mytune/simple';


// editorjs output format
const outputFormat = {
    "time": "timestamp",
    "blocks": [
        {
            "id": "",
            "type": "header",
            "data": {
                "text": "",
                "level":"",
            }
        }
    ],
    "version": "2.8.1",
}

const EditorComponent = ({ holder, initialData }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if(!editorRef.current) {
            editorRef.current = new EditorJS({
                holder: holder,
                data: initialData,
                tools: {
                   
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    header: {
                        class: Header,
                        config: {
                            levels: [1,2,3],
                            defaultLevel: 1,
                        },
                        tunes: ["alignmentTuneTool"]
                    },
                    imageTool: ImageTool,
                    codeTool: CodeTool,
                    simpleImage: {
                        class: SimpleImage,
                        tunes: ['mytune'],
                    },
                    alignmentTuneTool: {
                        class: AlignmentTuneTool,
                        tunes: false,
                        config: {
                            default: "left",
                            blocks: {
                                "header": "center",
                            },
                        }
                    },
                    mytune: MyBlockTune,
                    example: {
                        class: "",
                        config: "",
                        shortcut: "",
                        toolbox: "", // Rewrite Toolbox icon and title
                        inlineToolbar: [""], // list of inlinetoolbar or true
                        tunes: [''], // list of blocktunes
                    }
                },
                tunes: false, // connect block tunes
                inlineToolBar: [], // order of inline tools
                defaultBlock: 'paragraph',
                onChange: (api, event) => {
                    event = {
                        type: "string",
                        details: {
                            target: "BlockAPI",
                        },
                    }
                },
                onReady: () => {
                    const editor = editorRef.current
                    new Undo({editor});
                    new DragDrop(editor, "2px solid #fff");

                    let ctrlS = new Shortcut({
                        name: 'CTRL+S',
                        on: document.body,
                        callback: function(event) {
                            event.preventDefault();
                            editor.save().then( savedData => {
                                console.log(JSON.stringify(savedData, null, 4));
                            })
                        }
                    })
                },
            })
        }
        return () => {
            if(editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [holder, initialData]);

    return <div id={holder}></div>;
};

export default EditorComponent