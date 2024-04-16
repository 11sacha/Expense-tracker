const express = require('express')
const cors = require('cors')
const port = 7770
require('dotenv').config();
const Transaction = require('./models/transaction.js')
const mongoose = require("mongoose")
const app = express();
const path = require('path');

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')))



app.get('/api/test', (req, res) => {
    res.json({body: 'test'})
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

app.listen(port, async () => {
    await mongoose.connect(process.env.MONGO_URL).then(
        console.log('Server connected to database')
    );
    console.log(`Server just started on port: ${port}`)
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})


