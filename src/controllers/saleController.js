const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const query = { user: req.userId };
        const sales = await Sale.find(query).populate('user').populate('product');
        return res.send(sales.reverse())
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar vendas' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const query = { user: req.userId, _id: req.params.id };
        const sale = await Sale.findOne(query).populate('user').populate('product');
        return res.send(sale)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar venda' });
    }
});

router.post("/", async (req, res) => {
    try {
        const { product, qtd } = req.body;
        const query = { user: req.userId, _id: product._id };
        const productAux = await Product.findOne(query);

        if ((productAux.qtd - Number(qtd)) < 0) {
            return res.status(400).send({ error: 'Quantidade insuficiente para realizar venda' });
        }

        const newSale = await Sale.create({ ...req.body, user: req.userId });

        await Product.findByIdAndUpdate(productAux._id, {
            qtd: productAux.qtd - qtd,
        }, { new: true });

        return res.send(newSale);

    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar venda' });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { product, qtd, value } = req.body;
        const query = { user: req.userId, _id: product._id };
        const productAux = await Product.findOne(query);
        const querySale = { user: req.userId, _id: req.params.id };
        const sale = await Sale.findOne(querySale);

        if ((productAux.qtd - (Number(qtd) - sale.qtd)) < 0) {
            return res.status(400).send({ error: 'Quantidade insuficiente para realizar a quantidade de venda' });
        }

        const newSale = await Sale.findByIdAndUpdate(sale._id, {
            product,
            value,
            qtd,
        }, { new: true });

        await Product.findByIdAndUpdate(productAux._id, {
            qtd: productAux.qtd + (sale.qtd - qtd),
        }, { new: true });

        return res.send(newSale);

    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar venda' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const querySale = { user: req.userId, _id: req.params.id };
        const sale = await Sale.findOne(querySale);
        const query = { user: req.userId, _id: sale.product._id };
        const product = await Product.findOne(query);

        if (product) {
            const newValue = ((product.qtd * product.value) + (sale.qtd * sale.value)) / (product.qtd + sale.qtd);
            await Product.findByIdAndUpdate(product._id, {
                qtd: product.qtd + sale.qtd,
                value: newValue
            }, { new: true });
        }

        await Sale.findByIdAndDelete(sale._id);
        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;