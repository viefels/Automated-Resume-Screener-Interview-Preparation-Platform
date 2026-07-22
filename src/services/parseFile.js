import path from "node:path";
import fs from "fs/promises";
import handlePromptRes from '../prompts/handlePromptRes.js';
import  extractTextFile from '../utils/parsers.js';
import { candidateStructure } from '../prompts/parseJSONStructure.js';



// const extractTextFilePath = path.join(import.meta.dirname,"../uploads", "1784642457945-Miguel_Angel_Oliveira_Resume.pdf");


fs.writeFile(candidateFilePath, JSON.stringify(candidateObj, null, 2));

// console.log(await extractTextFile(extractTextFilePath))