const path = require('path');
const express = require("express");
const app = express();

const data = require("./routes/api/data");

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.use("/api/data", data);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));