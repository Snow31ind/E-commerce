import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log('Already connected to mongo database');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log('Use previous connection to mongo database');
      return;
    }

    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('New connection to mongo database');
  connect.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await db.disconnect();
      connection.isConnected = false;
    } else {
      console.log('Not disconnected to mongo database');
    }
  }
}

function convertMongoDocToObject(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt.toString(),
    updatedAt: doc.updatedAt.toString(),
  };
}

const db = {
  connect,
  disconnect,
  convertMongoDocToObject,
};

export default db;
