// src/routes/workerRoutes.js
const express = require("express");
const getCoursesSociety = require("../controllers/workerControllers/getCoursesSociety");
const getManagerWorkerList = require("../controllers/workerControllers/getManagerWorkerList");
const getSignedDocuments = require("../controllers/docControllers/getSignedDocuments");
const getManagerWorkerDocuments = require("../controllers/docControllers/getManagerWorkerDocuments");

const router = express.Router();

// Rutas relacionadas con trabajadores
router.get("/coursesSociety/:workerId", getCoursesSociety);
router.get("/manager/worker-list/:managerId", getManagerWorkerList);
router.get(
  "/manager/worker-documents/:managerId/:workerId",
  getManagerWorkerDocuments
);

module.exports = router;
