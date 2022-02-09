import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(
    "mongodb+srv://vercel:JQc7KIP793qFXFC5@treatcluster.9uuso.mongodb.net/treat?retryWrites=true&w=majority",
    // process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
