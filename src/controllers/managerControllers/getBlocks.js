// src/controllers/managers/getBlocks.js
const blocks = require("../../data/blocks");

function getBlocks(req, res) {
  const blocksNames = blocks.reduce((acc, block) => {
    acc.add(block.name); // Asegúrate de que 'name' existe en cada bloque
    return acc;
  }, new Set());

  res.json({ blocks: Array.from(blocksNames) });
}

module.exports = getBlocks; // Asegúrate de exportar la función
