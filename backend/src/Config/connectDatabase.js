const mysql = require("mysql2/promise");

const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "2101",
  database: "campingk",
});

const connectDatabase = async () => {
  try {
    const connection = await con.getConnection();
    console.log("Connection has been established successfully.");
    connection.release();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDatabase();

module.exports = con;
// const mysql = require("mysql2");

// const con = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "2101",
//   database: "campingk",
// });

// con.getConnection(function (err, connection) {
//   if (err) {
//     console.error("Error connecting to database:", err);
//     return;
//   }
//   console.log("Connected to database successfully");
//   // Do something with the connection if needed
//   connection.release(); // Always release the connection when done with it
// });

// module.exports = con;
