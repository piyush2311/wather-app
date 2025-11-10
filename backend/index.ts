import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import type { Request, Response } from 'express';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/temp/:city', async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const { main, weather, name } = response.data;
    
    res.json({
      temp: main.temp,
      city: name,
      description: weather[0].description,
      humidity: main.humidity,
      wind: response.data.wind.speed
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Serve static files from the Next.js app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the Next.js app
  app.use(express.static(path.join(__dirname, '../frontend/.next')));
  
  // Serve the main index.html for all non-API GET requests
  app.get('/*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Serve index.html for all other routes
    res.sendFile(path.join(__dirname, '../frontend/.next/static/chunks/pages/index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});