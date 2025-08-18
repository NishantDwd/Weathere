require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weatherRoutes = require('./src/routes/weatherRoutes');
const authRoutes = require('./src/routes/authRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const rateLimit = require('express-rate-limit');
const { connectMongo, mongoose } = require('./src/utils/db_pool');
const blogRoutes = require('./src/routes/blogRoutes');
const geminiRoutes = require('./src/routes/geminiRoutes');

const app = express();
const helmet = require('helmet');
app.use(helmet());

app.set('trust proxy', 1); 
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = isProduction
  ? {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  : {
      origin: true, // allow all origins in development
      credentials: true
    };

app.use(cors(corsOptions));

app.use(express.json());

//Rate limiting middleware to avoid Api abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

const PORT = process.env.PORT || 5000;

app.get('/api/dbtest', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    res.json({ success: true, mongoState: state });
  } catch (err) {
    console.error('DB Test error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// API routes

app.use('/api/gemini', geminiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/blogs', blogRoutes);


app.get('/', (req, res) => res.send('API Running'));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

(async function start() {
  try {
    await connectMongo(); // wait for mongo
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server due to DB connection error:', err);
    process.exit(1);
  }
})();