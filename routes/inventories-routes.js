const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const inventoryControllers = require("../controllers/inventory-controllers");

router.get("/", async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(`Error retrieving Users: ${error}`);
  }
});

router.route("/:id").get(inventoryControllers.findOne);

// delete inventory item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await knex("inventories").where("id", id);
    if (inventory.length === 0) {
      return res.status(404).json("Inventory item not found");
    }
    await knex("inventories").where("id", id).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json(`Error deleting Inventory item: ${error}`);
  }
});

module.exports = router;
