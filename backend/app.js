// app.js
import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the API routes defined in routes.js (all prefixed with /api)


// Connect to MongoDB Atlas
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // Start the server only after a successful DB connection
    app.listen(2000, () => {
      console.log(`Server is running on port ${2000}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });