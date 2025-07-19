import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import eventRoutes from './routes/event.routes';
import registrationsRoutes from './routes/registrations.routes';
import profilesRoutes from './routes/profiles.routes';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth',authRoutes);
app.use('/admin',adminRoutes)
app.use('events',eventRoutes)
app.use('/registrations', registrationsRoutes);
app.use('/profiles', profilesRoutes);

export default app;
