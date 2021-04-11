const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Product = require('../models/Product');

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const products = await Product.find(req.query).populate('user');
        return res.send({ products })
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar produtos' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user');
        return res.send({ product })
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar produto' });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, value, qtd, isUnity } = req.body;
        const query = { name: name };
        const product = await Product.findOne(query);
        if (product) {
            try {
                const newValue = ((product.qtd * product.value) + (qtd * value)) / (product.qtd + qtd);
                const productUpdate = await Product.findByIdAndUpdate(product._id, {
                    name,
                    value: newValue,
                    qtd: qtd + product.qtd,
                    isUnity
                }, { new: true });
                return res.send({ productUpdate });
            } catch (error) {
                return res.status(400).send({ error: 'Erro ao atualizar produto' });
            }
        }
        const newProduct = await Product.create({ ...req.body, user: req.userId });
        return res.send({ newProduct });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar produto' });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name, value, qtd, isUnity } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            value,
            qtd,
            isUnity
        }, { new: true });
        return res.send({ product });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao atualizar produto' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;