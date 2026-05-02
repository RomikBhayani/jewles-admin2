const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`Database connected: ${mongoURI}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Database connection error:', err);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Database disconnection error:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  mongoose,
};
