import path from "node:path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

// Only takes a prompt array with format [{ "text": "Hi introduce yourself" }]
// Returns a JSON-parsed object when possible.
export async function promptAI(promptArrObj) {
    try {
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent", {
            method: "POST",
            headers: {
                "x-goog-api-key": process.env.GEMINI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: promptArrObj }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!res.ok) {
            try{
                const errorData = await res.json();
                console.error("API Request Failed:", res.status, errorData);
            
            }
            catch(err){
                throw new Error(`Gemini API request failed with status ${res.status}, ${err}`);
            }
        }

        const data = await res.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText?.trim()) {
            throw new Error("Gemini API returned an empty or blank response");
        }

        try {
            return JSON.parse(responseText);
        } catch {
            return responseText;
        }
    } catch (err) {
        console.error("Error in getting response:", err);
        throw err;
    }
}

export default promptAI;