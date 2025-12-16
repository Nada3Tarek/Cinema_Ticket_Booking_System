require('dotenv').config();
const connectDB = require('./src/config/database');
const app = require('./src/app');

async function startServer() {
  try {
    await connectDB(); // استخدام singleton

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
