const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan')
const carController = require('../controllers/indexController');

const mongoDB = 'mongodb+srv://admin:adminHead@cluster0.ukavakh.mongodb.net/carShop?retryWrites=true&w=majority&appName=Cluster0'

app.set('view engine', 'ejs')

mongoose.connect(mongoDB)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is live")
    })
  })
  .catch((err) => console.error(err))
app.use(express.urlencoded({ extended: true }))


app.get('/', carController)

