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
        let qtdProducts = 0;
        products.map((el) => {
            qtdProducts += Number(el.qtd);
            valueProducts += Number(el.value) * Number(el.qtd);
            return el;
        });

        let valueSale = 0;
        let qtdSale = 0;
        sale.map((el) => {
            qtdSale += Number(el.qtd);
            valueSale += Number(el.value) * Number(el.qtd);
            return el;
        });
        const lucro = ((valueSale / valueProducts) - 1) * 100;
        return res.send({
            totalProducts: qtdProducts,
            valueProducts,
            totalSale: qtdSale,
            valueSale,
            lucro: lucro || 0,
        })
    } catch (error) {
        return res.status(400).send({ error: 'Error' });
    }
});

module.exports = router;