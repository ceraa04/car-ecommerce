const Car = require('../models/Car')
const mongoose = require('mongoose');

const mongoDB = 'mongodb+srv://admin:adminHead@cluster0.ukavakh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const importCar = (req, res) => {
    mongoose.connect(mongoDB)
        .then(() => {
            const car = new Car({
                model: 'A4',
                price: 16000,
                brand: '65d89c4d0b4fff2c81525bc1',
                description: 'The Audi A4 is a luxury compact sedan known for its sleek design, refined performance, and advanced technology features. With its distinctive exterior styling characterized by clean lines and a bold front grille, the A4 exudes a sense of sophistication and modernity.',
                numberStock: 3
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
