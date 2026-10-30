import { connection as mongoConnection, connect } from "mongoose";
import { ServiceUnavailableError } from "../../utils/GlobalError";

const connectMongo = async () => {
    const uri = process.env.MONGO_URI;

    if(!uri) {
        throw new Error("MONGO_URI is missing from environment variables");
    }

    try {
        await connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("✅ MongoDB connected successfully");
    } 
    catch(err: any) {
        console.error("❌ MongoDB connection failed");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error code:", err.code);

        if (err.cause) {
            console.error("Underlying cause:", err.cause);
        }

        if (err.reason) {
            console.error("Server selection reason:", err.reason);
        }

        throw new ServiceUnavailableError(
            "MongoDB connection failed"
        );
    }
};

mongoConnection.on("error", (err) => {
    console.error("❌ Unexpected MongoDB connection error:", err.message);
});

export default connectMongo;