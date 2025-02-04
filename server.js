const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files (index.html, script.js, styles.css)
app.use(express.static(path.join(__dirname, 'public')));

// Load JSON data with error handling
let classesData = [];
try {
  const filePath = path.join(__dirname, 'classes.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  classesData = JSON.parse(rawData);
  console.log("Classes data loaded successfully.");
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Error: ${error.message}. Please ensure 'classes.json' exists in the project root.`);
  } else {
    console.error("Error parsing classes.json:", error.message);
  }
}

// API: Get available (optional) classes for a time slot
app.get('/api/available', (req, res) => {
  const { day, time } = req.query;
  if (!day || !time) {
    return res.status(400).json({ error: "Missing day or time parameter" });
  }

  const [start, end] = time.split('–').map(t => t.trim());
  const availableClasses = classesData.filter(cls =>
    cls.day === day && cls.start_time === start && cls.end_time === end
  );

  res.json(availableClasses);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});