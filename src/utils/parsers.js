import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import path from "node:path";

export default async function extractTextFile(filePath){

    try{

        const getExt = path.extname(filePath).toLowerCase();

        if(getExt === ".pdf"){
            const parser = new PDFParse({url: filePath});
            const res = await parser.getText();
            return res.text;
        } 
        else if(getExt === ".docx"){
            const res = await mammoth.extractRawText({path: filePath});
            return res.value;
        } 

    } catch(err){
        
        throw err;
    }
}
