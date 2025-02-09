// app.js
import express from 'express';
import config from './config.js'; // Use this for any other configuration if needed

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Set up your API routes here (e.g., app.use('/api', yourRoutes))
// Example: app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
