const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const warehouseControllers = require('../controllers/warehouse-controllers');

router.get("/", async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(`Error retrieving Users: ${error}`);
  }
});

router.route('/:id').get(warehouseControllers.findOne);

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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await knex("warehouses").where("id", id);
    if (!warehouse) {
      return res.status(404).json("Warehouse not found");
    }
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    if (!warehouse_name) {
      return res.status(400).json("Warehouse name is required");
    } else if (!address) {
      return res.status(400).json("Address is required");
    } else if (!city) {
      return res.status(400).json("City is required");
    } else if (!country) {
      return res.status(400).json("Country is required");
    } else if (!contact_name) {
      return res.status(400).json("Contact name is required");
    } else if (!contact_position) {
      return res.status(400).json("Contact position is required");
    } else if (!contact_phone) {
      return res.status(400).json("Contact phone is required");
    } else if (!contact_email) {
      return res.status(400).json("Contact email is required");
    }
    const phoneRegex = /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(contact_phone)) {
      return res.status(400).json("Invalid phone number");
    } else if (!emailRegex.test(contact_email)) {
      return res.status(400).json("Invalid email address");
    }
    const updatedWarehouse = await knex("warehouses").where({ id }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
    res.status(200).json(updatedWarehouse);
  } catch (error) {
    res.status(500).json(`Error updating Warehouse: ${error}`);
  }
}); // <-- Missing closing brace for router.put("/:id")

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

