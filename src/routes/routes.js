const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const saleController = require("../controllers/saleController");

router.use("/auth", authController);
router.use("/produto", productController);
router.use("/venda", saleController);

module.exports = router;