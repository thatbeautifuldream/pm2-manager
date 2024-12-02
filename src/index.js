const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
require("dotenv").config();
const path = require("path");

// Express App for API
const app = express();
const apiPort = process.env.PORT || 3000;
app.use(bodyParser.json());

// PM2 Helper function
const runPM2Command = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve(stdout);
    });
  });
};

// API Endpoints
app.get("/pm2/list", async (req, res) => {
  try {
    const output = await runPM2Command("pm2 jlist");
    res.json(JSON.parse(output));
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/pm2/:action", async (req, res) => {
  const { action } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Process name is required" });

  const validActions = ["start", "stop", "restart", "delete", "reload"];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const output = await runPM2Command(`pm2 ${action} ${name}`);
    res.json({ message: output });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Serve HTML file for the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Start the Express API
app.listen(apiPort, () => {
  console.log(`API running on port ${apiPort}`);
});
