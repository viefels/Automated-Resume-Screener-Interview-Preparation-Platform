import express from "express";
import uploadRoute from "./src/routes/mainRoute.js";
import { configDotenv } from "dotenv";


// const filePathWrite = path.join(import.meta.dirname,"src","data","data.json");
const port = process.env.PORT;
const hostname = process.env.IP;
const app = express();

app.use(express.json())


app.use("/api", uploadRoute)



app.listen(port, ()=>{
    console.log("Port is running")
})