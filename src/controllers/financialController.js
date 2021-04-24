const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const { year, month, endDate, startDate, _id } = req.query;
        const query = {
            user: req.userId,
        };

        if (_id) {
            query._id = _id;
        }

        if (month || endDate || startDate) {
            query.createAt = {
                $gte: startDate || new Date(year, month, '01'),
                $lt: endDate || new Date(year, Number(month) + 1, '01')
            };
        }

        const products = await Product.find(query);
        const sale = await Sale.find(query);
        let valueProducts = 0;
        products.map((el) => valueProducts += el.value);

        let valueSale = 0;
        sale.map((el) => valueSale += el.value);
        const lucro = ((valueSale / valueProducts) - 1) * 100;
        return res.send({
            totalProducts: products.length,
            valueProducts,
            totalSale: sale.length,
            valueSale,
            lucro: lucro || 0,
        })
    } catch (error) {
        return res.status(400).send({ error: 'Error' });
    }
});

module.exports = router;