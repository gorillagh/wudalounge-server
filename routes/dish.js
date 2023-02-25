const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { getDishes } = require("../controllers/dish");

router.get("/dishes", getDishes);
module.exports = router;
