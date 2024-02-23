const Car = require('../models/Car')

// Display all cars function

const cars_displayAll = (req, res) => {
    Car.find()
        .then((result) => {
            console.log("Number of cars retreived is: " + result.length)
            res.render('index', {
                title: 'Car Shop',
                cars: result
            })
        })
        .catch((err) => console.error(err))
}


module.exports = cars_displayAll
