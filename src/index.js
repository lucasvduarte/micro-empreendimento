require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./datebase/bd");

connectDB();

const router = require("./routes/routes");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //alterar para que apenas dominios restritos possam acessar

app.use(router);

app.listen(process.env.PORT || 4000);