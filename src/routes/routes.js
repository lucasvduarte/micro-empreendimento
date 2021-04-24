const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const saleController = require("../controllers/saleController");
const financialController = require("../controllers/financialController");

router.use("/auth", authController);
router.use("/estoque", productController);
router.use("/venda", saleController);
router.use("/financeiro", financialController);

module.exports = router;