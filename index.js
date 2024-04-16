const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  res.send("Instock API Team 3 Test");
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

const inventoriesRoutes = require("./routes/inventories-routes");
const warehousesRoutes = require("./routes/warehouses-routes");

app.use("/inventories", inventoriesRoutes);
app.use("/warehouses", warehousesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
