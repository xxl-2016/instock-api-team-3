const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));

router.get("/", async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(`Error retrieving Users: ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const inventory = await knex("inventories").where("id", id).first();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(404).json(`Error getting inventory: ${error}`);
    }
});

module.exports = router;