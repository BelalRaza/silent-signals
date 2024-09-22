import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection :ConnectionObject={}

async function dbConnect():Promise<void>{
    if (connection.isConnected){
        console.log("Alreadt Connected to Database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
        connection.isConnected = db.connections[0].
        readyState
        // console.log("db ",db)
        // console.log("db.connections ",db.connections)
        console.log("db connected sucesfully ")

    }
    catch(error){
        console.log("database connection failed ", error);
        process.exit(1)

    }
}

export default dbConnect;