import "dotenv/config";
import fastify from "fastify";
import { connectDB } from './src/config/connect.js';
import { buildAdminRouter, admin } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        const app = fastify();

        // Register Socket.IO
        app.register(fastifySocketIO, {
            cors: {
                origin: "*"
            },
            pingInterval: 10000,
            pingTimeout: 5000,
            transports: ["websocket"]
        });

        await registerRoutes(app);
        await buildAdminRouter(app); // Register the AdminJS router

        const rootPath = admin.options.rootPath || '';

        // Start the server
        await app.listen({ port: PORT });
        console.log(`Server started on http://localhost:${PORT}${rootPath}`);

        // Setup Socket.IO connection
        app.io.on("connection", (socket) => {
            console.log("A user connected");

            socket.on("joinRoom", (orderId) => {
                socket.join(orderId);
                console.log(`User joined room ${orderId}`);
            });

            socket.on('disconnect', () => {
                console.log("A user disconnected");
            });
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit if the database connection fails
    }
};

start();
