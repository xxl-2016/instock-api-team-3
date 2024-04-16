const knex = require("knex")(require("../knexfile"));
const router = require("express").Router();

router.get("/", async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(`Error retrieving Users: ${err}`);
  }
});

module.exports = router;