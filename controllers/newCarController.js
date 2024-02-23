const Car = require('../models/Car')
const mongoose = require('mongoose');

// Link za DB sa naglasenim collection carShop
const mongoDB = 'mongodb+srv://admin:adminHead@cluster0.ukavakh.mongodb.net/carShop?retryWrites=true&w=majority&appName=Cluster0'


const importCar = (req, res) => {
    mongoose.connect(mongoDB)
        .then(() => {

            const car = new Car({
                model: 'Q7',
                category: 'SUV',
                price: 35000,
                brand: '65d89c4d0b4fff2c81525bc1',
                description: 'The Audi Q7 is a luxury midsize SUV known for its spacious and upscale interior, advanced technology features, and powerful performance capabilities. ',
                numberStock: 4
            })
            car.save()
                .then((result) => {
                    console.log(result);
                    res.redirect('/')
                })
        })
        .catch((err) => console.error(err))
}

module.exports = importCar
