import path from "node:path";
import dotenv from "dotenv"
dotenv.config()
dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') });

//Only takes a prompt array with format [{ "text": "Hi introduce yourself" }]
//returns JSON.parsed Object
export default async function promptAI(promptArrObj){
    try{
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent", {
            method: "POST",
            headers:{
                "X-goog-api-key": process.env.GEMINI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "contents": [{ "parts": promptArrObj }],

                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        })

        if(!res.ok){
            const errorData = await res.json();
            console.error('API Request Failed:', res.status, errorData);
            return;
        }
        const data = await res.json();
        return JSON.parse(data["candidates"][0]["content"]["parts"][0]["text"]);

        
    } catch(err){
        console.error('Error in getting response:', err);
        throw err;
    }
}