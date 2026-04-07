import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // This handles the config automatically
import authRoutes from './src/routes/authRoutes.js';

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server flying on port ${PORT}`));