import express from "express";
import uploadRoute from "./src/routes/mainRoute.js";


// const filePathWrite = path.join(import.meta.dirname,"src","data","data.json");
const port = "3000";
const hostname = '127.0.0.1';
const app = express();

app.use(express.json())


app.use("/api", uploadRoute)



app.listen(port, ()=>{
    console.log("Port is running")
})