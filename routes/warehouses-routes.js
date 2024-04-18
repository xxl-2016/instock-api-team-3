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

// create a new warehouse
router.post("/", async (req, res) => {
  const body = req.body;
  const requiredFields = [
    "warehouse_name",
    "address",
    "city",
    "country",
    "contact_name",
    "contact_position",
    "contact_phone",
    "contact_email",
  ];

  // check body for missing fields
  if (
    !requiredFields.every((field) => {
      const exists = body[field];
      return exists;
    })
  ) {
    return res.status(400).json("Missing properties in the request body");
  }

  // check phone number
  const phoneNumberDigits = body.contact_phone.match(/\d/g).length;
  if (phoneNumberDigits < 10 || phoneNumberDigits > 11) {
    return res.status(400).json("Invalid phone number");
  }

  // check email
  if (!/\S+@\S+\.\S+/.test(body.contact_email)) {
    return res.status(400).json("Invalid email");
  }

  // create warehouse
  const [id] = await knex("warehouses").insert(body);
  const [warehouse] = await knex("warehouses").where({ id });

  return res.status(200).json(warehouse);
});

module.exports = router;
