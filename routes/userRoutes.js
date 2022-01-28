const express = require("express");
const { getAllUsers, getUser } = require("../controllers/userControllers.js")
const {signup,login,protect} = require("../controllers/authController.js")
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router
  .route('/')
  .get(protect,getAllUsers)

router
  .route('/:id')
  .get(getUser)

module.exports = router