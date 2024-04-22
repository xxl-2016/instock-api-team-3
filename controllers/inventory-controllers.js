const knex = require("knex")(require("../knexfile"));

const findOne = async (req, res) => {
  try {
    const inventoryFound = await knex("inventories")
      .where({ id: req.params.id })
      .first();

    if (!inventoryFound) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(inventoryFound);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting inventory",
    });
  }
};

module.exports = {
  findOne,
};
