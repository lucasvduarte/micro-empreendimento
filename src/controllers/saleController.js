const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const sales = await Sale.find(req.query);
        return res.send({ sales })
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar vendas' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        return res.send({ sale })
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar venda' });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, qtd } = req.body;
        const query = { name: name };
        const product = await Product.findOne(query);

        if (product.qtd < 1) {
            return res.status(400).send({ error: 'Quantidad insuficiente para realizar a quantidade de venda' });
        }

        const newSale = await Sale.create({ ...req.body, user: req.userId });

        await Product.findByIdAndUpdate(product._id, {
            name,
            qtd: product.qtd - qtd,
        }, { new: true });

        return res.send({ newSale });

    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar venda' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        const query = { name: sale.name };
        const product = await Product.findOne(query);

        if (product) {
            await Product.findByIdAndUpdate(product._id, {
                qtd: product.qtd + sale.qtd
            }, { new: true });
        }

        await Sale.findByIdAndDelete(req.params.id);
        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;