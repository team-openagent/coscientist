
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.join(__dirname, '..', 'config', '.env.development')});

import {graph} from "./graph";
import * as fs from "fs";
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GraphAnnotation } from "./state";
import { defaultConfiguration } from "./configuration";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { pushPrompts } from './prompt';



async function drawGraph() {
    const drawableGraph = await graph.getGraphAsync();
    const image = await drawableGraph.drawMermaidPng();
    const arrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer)

    // The directory where you want to save the image
    const uploadDir = path.join(__dirname, 'static');
    const filename = 'graph.png';
    const filePath = path.join(uploadDir, filename);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    }

    // Save the image buffer to a file
    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log('Image saved successfully to', filePath);
        }
    });
}

async function runGraph() {
    const chunks = [];
    const state = GraphAnnotation.parse({
        input_query: "Write abstract of a research paper on the benefits of renewable energy.",
        research_note: "",
        reviews: [],
        old_draft: [],
        new_draft: [],
        explanations: [],
        recursion_count: 0,
    });
    const stream = await graph.withConfig({
        configurable: defaultConfiguration(),
    }).stream(state);
    for await (const chunk of stream) {
        chunks.push(chunk);
        console.log(JSON.stringify(chunks, null, 2))
    }
}

async function getState(thread_id: string) {
    const checkpointer = graph.checkpointer!;
    if (checkpointer instanceof MongoDBSaver) {
        const state = await checkpointer.get(
            {
                "configurable": {
                    "thread_id": "68afa28aac183d3329bd2989"
                }
            }
        );
        console.log("State: ", state);
    }
}

//await drawGraph().catch(console.error).finally(() => {});
await pushPrompts().catch(console.error).finally(() => {});
//await runGraph().catch(console.error).finally(() => {});
//await getState("1").catch(console.error).finally(() => {});
