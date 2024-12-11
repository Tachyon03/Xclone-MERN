import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB online");
    }
    catch(error){
        console.log(`Error in connecting Db: ${error}`)
        process.exit(1)
    }
}

export default connectionDB;