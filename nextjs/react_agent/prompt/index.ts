import { PromptTemplate } from '@langchain/core/prompts';
import * as fs from "fs";
import path, * as apth from "path";

export function loadPromptTemplateFromFile(filePath: string) {
    const templatePath = path.resolve(__dirname, filePath + ".txt");
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    return templateString;
}