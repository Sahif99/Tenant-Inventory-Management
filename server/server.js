import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import { initSocket } from "./src/socket/index.js";
import cors from "cors";

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

app.set("io", io);
app.use(cors({
  origin: "*",
}));

server.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
