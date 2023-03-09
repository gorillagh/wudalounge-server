const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { getMenu } = require("../controllers/menu");

router.post("/get-menu", authCheck, adminCheck, getMenu);

module.exports = router;
