import * as tslab from "tslab";
import {graph} from "./graph";

// Assume 'app' is your compiled LangGraph.js application instance
const drawableGraph = await graph.getGraphAsync();
const image = await drawableGraph.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();
await tslab.display.png(new Uint8Array(arrayBuffer));