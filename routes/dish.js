const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { getDishes } = require("../controllers/dish");

router.post("/dishes", getDishes);
module.exports = router;
