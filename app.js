const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

client.connect((err, client) => {
  if (err) {
    console.error("Failed to connect to MongoDB", err);
    return;
  }
  console.log("Connected successfully to MongoDB");

  const db = client.db("nindo-task-db");
  const taskRoutes = require("./routes/tasks")(db);
  app.use("/api/tasks", taskRoutes);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
