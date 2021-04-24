const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Product = require('../models/Product');

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const query = { user: req.userId };
        const products = await Product.find(query).populate('user');
        return res.send(products.reverse())
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar produtos' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const query = { user: req.userId, _id: req.params.id };
        const product = await Product.findOne(query).populate('user');
        return res.send(product)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao consultar produto' });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create({ ...req.body, user: req.userId });
        return res.send(newProduct);
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Erro ao cadastrar produto' });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name, value, qtd } = req.body;
        const query = { user: req.userId, _id: req.params.id };
        const productFind = await Product.findOne(query);

        const product = await Product.findByIdAndUpdate(productFind._id, {
            name,
            value,
            qtd,
        }, { new: true });
        return res.send(product);
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao atualizar produto' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const query = { user: req.userId, _id: req.params.id };
        const productFind = await Product.findOne(query);
        await Product.findByIdAndDelete(productFind._id);
        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;