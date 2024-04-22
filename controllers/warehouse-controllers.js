const knex = require("knex")(require("../knexfile"));

const findOne = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses")
      .where({ id: req.params.id })
      .first();

    if (!warehouseFound) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(warehouseFound);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting warehouse",
    });
  }
};

module.exports = {
  findOne,
};
