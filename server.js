import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './configs/db.js';
import appRouter from './routes/index.js';

dotenv.config();
connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.send('Welcome to TC-web88 server');
});

// Mount Routers
app.use('/api', appRouter);

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethings went wrong');
});

app.listen(PORT, () => {
  console.log(`Server is running in 
        ${process.env.NODE_ENV || 'development'} mode 
        on port ${PORT}
        `);
});

/*SERVER
1. API (Post) Register (username, email, password) DONE
2. API (Post) Login (username, password) => token DONE
3. get current user profile: GET /api/auth/me (detect token attached headers)
*/
