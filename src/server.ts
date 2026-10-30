import http from "http";
import dotenv from "dotenv";
import connectMongo from "./config/db/mongo.db";
import app from "./app";
import { initSocket } from "./socket";

dotenv.config();
const port = Number(process.env.PORT) || 5000;

const server = http.createServer(app);
initSocket(server);

// Start the server
async function main() {
    try {
        await connectMongo();
        server.listen(port, "0.0.0.0", () => {
            console.log(`🚀 Server running... http://localhost:${port}`);
        });
    } 
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}

main();