import express, { type Request, type Response, type NextFunction, type ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import fs from 'fs';

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

app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if ('name' in err && err.name === 'ValidationError' && 'errors' in err) {
        const valErrors: any = [];
        Object.keys((err as any).errors).forEach(key => {
            valErrors.push((err as any).errors[key].message);
        });
        res.status(422).send(valErrors);
    } else {
        console.error('Error:', err);
        res.status(500).send('Something went wrong!');
    }
};

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});