const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  createOrUpdateUser,
  currentUser,
  currentAdmin,
  currentStaff,
  loginUser,
  checkEmail,
  updateUser,
  googleLogin,
} = require("../controllers/auth");

router.post("/check-email-availability", checkEmail);
router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/login-user", authCheck, loginUser);
router.post("/google-login", authCheck, googleLogin);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentAdmin);
router.post("/current-staff", authCheck, staffCheck, currentStaff);
router.post("/update-user/:slug", authCheck, updateUser);

module.exports = router;
