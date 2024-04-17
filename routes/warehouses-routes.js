const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.get("/", async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(`Error retrieving Users: ${error}`);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const warehouse = await knex("warehouses").where("id", id);
    if (!warehouse) {
      return res.status(404).json("Warehouse not found");
    }
    await knex("inventories").where("warehouse_id", id).del();
    await knex("warehouses").where("id", id).del();
    res.status(204).json(`Warehouse with id ${id} deleted successfully`);
  } catch (error) {
    res.status(500).json(`Error deleting Warehouse: ${error}`);
  }
});

router.get("/:id/inventories", async (req, res) => {
  const warehouseId = req.params.id;
  const warehouse = await knex("warehouses").where({ id: warehouseId });

  if (!warehouse) {
    return res.status(404).json("Warehouse not found");
  }

  try {
    const inventories = await knex("inventories").where({
      warehouse_id: warehouseId,
    });
    return res.status(200).json({ inventories });
  } catch (error) {
    return res.status(400).json(`Error retrieving Inventories: ${error}`);
  }
});

module.exports = router;
