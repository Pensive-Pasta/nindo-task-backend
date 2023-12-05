const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = function (db) {
  const collection = db.collection("tasks");

  router.get("/", async (req, res) => {
    try {
      const tasks = await collection.find({}).toArray();
      res.json(tasks);
    } catch (e) {
      res.status(500).send("Failed to fetch tasks.");
    }
  });

  router.get("/:id", async (req, res) => {
    try {
        const task = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!task) {
            return res.status(404).send("Task not found.");
        }
        res.json(task);
    } catch (e) {
        res.status(500).send("Failed to fetch the task.");
    }
});

  router.post("/", async (req, res) => {
    try {
      const result = await collection.insertOne(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).send("Failed to create a new task.");
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      if (result.matchedCount === 0) {
        return res.status(404).send("Task not found.");
      }
      res.json(result);
    } catch (e) {
      res.status(500).send("Failed to update the task.");
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const result = await collection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      if (result.deletedCount === 0) {
        return res.status(404).send("Task not found.");
      }
      res.json(result);
    } catch (e) {
      res.status(500).send("Failed to delete the task.");
    }
  });

  return router;
};
