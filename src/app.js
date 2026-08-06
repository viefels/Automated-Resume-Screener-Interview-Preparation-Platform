import express from "express";
import uploadRoute from "./routes/main.route.js";
import cors from 'cors';
import { configDotenv } from "dotenv";


// const filePathWrite = path.join(import.meta.dirname,"src","data","data.json");
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(express.json())
app.use(cors());


app.use("/api", uploadRoute)

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON payload. Check quotes and formatting.' 
    });
  }
  next();
});


app.listen(PORT, HOST, ()=>{
    console.log(`Server running on http://${HOST}:${PORT}`)
})