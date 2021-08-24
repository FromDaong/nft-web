import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(
    "mongodb+srv://treat:hfqqjOWs0WS1mUGE@treatcluster.9uuso.mongodb.net/treat_test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // const db = await mongoose.connect("mongodb://localhost:27017/treat", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
