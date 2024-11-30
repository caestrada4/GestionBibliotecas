const sequelize = require("./config/config");
const Book = require("./models/book");

sequelize.sync({ force: true }).then(() => {
  console.log("Base de datos sincronizada");
  process.exit();
});
