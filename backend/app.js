// app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the API routes defined in routes.js (all prefixed with /api)
app.use('/api', routes);

// Connect to MongoDB Atlas
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // Start the server only after a successful DB connection
    const port = config.PORT;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });