import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from  './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB!!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //middleware to allow json as an input of the server

app.use(cookieParser()); //middleware to allow cookies as an input of the server

app.listen(`${port}`, () => {
  console.log('API server is running on port 3000!!');
});

//we use /api/user as the base route for all user-related routes,
app.use('/api/user', userRouter ); 
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Global error-handling middleware that catches errors passed from controllers, extracts error details, and sends a standardized JSON response to the client
app.use((err, req, res, next) => {
  //if the error has a status code, we use it, otherwise we use 500 as the default status code
  const statusCode = err.statusCode || 500; 
  //if the error has a message, we use it, otherwise we use "Internal Server Error" as the default message
  const message = err.message || "Internal Server Error"; 

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  })
})