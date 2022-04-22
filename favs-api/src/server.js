const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDb = require('./config/connectDb');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/authRouter');
const favsRouter = require('./routes/favsRouter');

const app = express();

connectDb();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());

// Routes
app.use('/api/auth/local', authRouter);
app.use('/api/favs', favsRouter);

app.use(errorHandler);

module.exports = app;
