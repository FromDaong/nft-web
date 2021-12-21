import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  // test
  const db = await mongoose.connect(process.env.MONGO_URL, {
    // const db = await mongoose.connect(
    //   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    //   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  );

  //
  // const db = await mongoose.connect("mongodb://localhost:27017/treat", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
