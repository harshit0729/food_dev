const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodflow';
mongoose.connect(MONGO_URI).then(() => console.log('Auth Service: MongoDB Connected'))
  .catch((e) => console.error('Auth Service: DB Error', e.message));

app.use('/api/auth', require('./routes/auth'));

app.get('/health', (_, res) => res.json({ service: 'auth-service', status: 'ok' }));

app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
