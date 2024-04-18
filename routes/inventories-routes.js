const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));
const inventoryControllers = require('../controllers/inventory-controllers');

router.get("/", async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(`Error retrieving Users: ${error}`);
  }
});

router.route('/:id')
  .get(inventoryControllers.findOne);

module.exports = router;