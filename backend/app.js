import express from "express";
import taskRoutes from "./routes/task-routes.js";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("TASK MANAGEMENT APPLICATION");
});

app.use("/api/task", taskRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
