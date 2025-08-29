const mongoose = require("mongoose");

const getConnection = () => {
  try {
    mongoose
      .connect(process.env.MongoDB_URL)
      .then((connection) => {
        console.log("DB connected Sucessfully");
      })
      .catch((err) => {
        console.log(`DB connection failed`, err.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = getConnection;
