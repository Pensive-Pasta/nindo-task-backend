const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://main.d2l2xcdjiw7jsr.amplifyapp.com", ],
  })
);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client.db("nindoTaskDB");
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
    process.exit(1);
  }
}

connectToMongoDB()
  .then((db) => {
    const taskRoutes = require("./routes/tasks")(db);
    app.use("/api/tasks", taskRoutes);
    app.get('/api/ping', (req, res) => {
      res.json({ message: 'Server is up and running' });
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(console.error);
