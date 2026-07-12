const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const apiRoutes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
const PORT = process.env.PORT || 3000;

app.set("io", io);
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("leaveConversation", (conversationId) => {
        socket.leave(conversationId);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
