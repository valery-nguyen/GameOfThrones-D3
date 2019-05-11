const path = require('path');
const express = require("express");
const app = express();

const visualizations = require("./routes/api/visualizations");

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.use("/api/visualizations", visualizations);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));