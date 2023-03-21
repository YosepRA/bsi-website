const mongoose = require('mongoose');

async function mongoConnect(mongoUrl) {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(mongoUrl, connectionOptions);

    const dbConnection = mongoose.connection;
    dbConnection.once('open', () =>
      console.log('Successfully connected to database...'),
    );
    dbConnection.on('disconnected', () =>
      console.log('Disconnected from database.'),
    );
    dbConnection.on('close', () =>
      console.log('Database connection is closed.'),
    );

    return dbConnection;
  } catch (error) {
    handleConnectionError(error);
  }
}

function handleConnectionError(error) {
  console.error('Database initial connection error:', error.message);
}

module.exports = mongoConnect;
