const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require('../config/jwtsecret');

const User = require('../models/User');

const router = express.Router();

router.post("/registrar", async (req, res) => {
    const { email } = req.body;

    try {

        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'Usuário já existe' })
        }

        const user = await User.create(req.body);
        user.password = undefined;


        jwt.sign({ token: user._id }, TOKEN_SECRET, (err, token) => {
            return res.send({
                success: true,
                token,
            });
        });

    } catch (error) {
        return res.status(400).send({ error: 'Falha no cadastro' })
    }
});

router.post("/autenticacao", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    const validPass = await bcrypt.compare(password, user.password);

    if (!user) {
        return res.status(400).send({ error: 'Usuario não existe' })
    }

    user.passwor = undefined;

    jwt.sign({ token: user._id }, TOKEN_SECRET, (err, token) => {
        return res.send({
            success: true,
            name: user.name,
            _id: user._id,
            token,
        });
    });

});

module.exports = router;