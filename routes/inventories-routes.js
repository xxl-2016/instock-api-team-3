const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const inventoryControllers = require("../controllers/inventory-controllers");

router.get("/", async (req, res) => {
  try {
    const { warehouse_id } = req.query;

    let data;
    if (warehouse_id) {
      data = await knex("inventories").where({ warehouse_id });
    } else {
      data = await knex("inventories");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(`Error retrieving Inventory items: ${error}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      !quantity
    ) {
      return res.status(400).json("All fields are required");
    }

    if (isNaN(quantity)) {
      return res.status(400).json("Quantity needs to be a number");
    }

    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json("Invalid warehouse_id");
    }

    const [id] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    const [newInventoryItem] = await knex("inventories").where({ id });

    res.status(201).json(newInventoryItem);
  } catch (error) {
    res.status(400).json(`Error creating inventory item: ${error}`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      quantity < 0
    ) {
      return res.status(400).json("No fields can be left empty");
    }

    if (isNaN(quantity)) {
      return res.status(400).json("Only numbers are accepted");
    }

    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json("ID does not exist in warehouse");
    }

    const existingInventory = await knex("inventories").where({ id }).first();
    if (!existingInventory) {
      return res.status(404).json("This inventory item is not found");
    }

    await knex("inventories")
      .where({ id })
      .update({
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity: parseInt(quantity),
      });

    const updatedInventoryItem = await knex("inventories")
      .where({ id })
      .first();
    res.status(200).json(updatedInventoryItem);
  } catch (error) {
    res.status(400).json(`Problem updating item in inventory: ${error}`);
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
