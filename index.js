const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// CORS middleware to allow requests from any origin (our client React app)
app.use(cors());

// Use JSON middleware to use req.body
app.use(express.json());

const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  res.send("Instock API Team 3 Test");
});

const inventoriesRoutes = require("./routes/inventories-routes");
const warehousesRoutes = require("./routes/warehouses-routes");

app.use("/api/inventories", inventoriesRoutes);
app.use("/api/warehouses", warehousesRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
