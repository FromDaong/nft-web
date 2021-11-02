import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  // test
  const db = await mongoose.connect(
    "mongodb+srv://user:bSWsBVXmkLr4L4hm@cluster0.amea3.mongodb.net/treat?retryWrites=true&w=majority",
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
