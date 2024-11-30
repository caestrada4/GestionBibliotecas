const express = require("express");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(bodyParser.json());

// Rutas REST
app.use("/api/libros", bookRoutes);

app.listen(3000, () => console.log("Servidor REST corriendo en http://localhost:3000"));
