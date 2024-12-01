const sequelize = require("./config/config");
const Book = require("./models/book");
const User = require("./models/user");
const Loan = require("./models/loan");

sequelize
  .sync({ force: true }) // Elimina y recrea las tablas cada vez que se ejecuta
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    process.exit();
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
