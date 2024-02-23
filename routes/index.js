const express = require('express');
const app = express();
const logger = require('morgan')
const mongoose = require('mongoose');
const car = require('../controllers/carController')

const mongoDB = 'mongodb+srv://admin:adminHead@cluster0.ukavakh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Polovni Automobili' })
})
app.get('/newCar', car)
app.listen(3000, () => {
  console.log("Server is live")
})