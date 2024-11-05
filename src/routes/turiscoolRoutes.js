const Express = require("express");
const TuriscoolController = require("../controllers/turiscoolController");

const router = Express.Router();

router.get("/courses", TuriscoolController);

module.exports = router;
