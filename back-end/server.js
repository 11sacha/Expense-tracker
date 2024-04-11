const express = require('express')
const cors = require('cors')
const port = 7770
require('dotenv').config();
const Transaction = require('./models/transaction.js')
const mongoose = require("mongoose")
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({body: 'tes7'})
})

app.post('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({name,price,description,datetime});
    res.json(transaction)
})

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions)
})

app.listen(port, () => {
    console.log(`Server just started on port: ${port}`)
});
