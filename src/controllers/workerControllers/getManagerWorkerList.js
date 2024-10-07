// src/controllers/workerControllers/getManagerWorkerList.js
const users = require("../../data/users");

function getManagerWorkerList(req, res) {
  const managerId = req.params.managerId;
  const manager = users.find((u) => u.id == managerId && u.role === "manager");

  if (!manager) {
    return res.status(404).json({ message: "Manager no encontrado" });
  }

  const workers = users
    .filter((u) => u.societyId == manager.societyId && u.role === "worker")
    .map((worker) => ({
      id: worker.id,
      name: worker.name,
    }));

  res.json({ workers });
}

module.exports = getManagerWorkerList;
