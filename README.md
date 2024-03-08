
# Car E-commerce Full Stack Shop
Welcome to the Car E-commerce Full Stack Shop! This project is a comprehensive solution for managing an online car dealership, featuring CRUD (Create, Read, Update, Delete) operations for admin functionalities. The project utilizes MongoDB for the database, Express.js for the backend, and EJS (Embedded JavaScript) for the frontend templating.

## Login credentials

For admin:
**username: admin**

**password: adminAdmin**
## Features
Authentication: Passport.js, authentication for every user, requirements for password strength, some pages are shown only when specific user is logged in (User or admin)

Admin Panel: Perform CRUD operations to manage cars available for sale and see all orders.

User Interface: Easily navigate through the available car inventory and make purchases, or delete existing ones.

Responsive Design: The application is designed to be usable on both desktop and mobile devices.

## Technologies Used

**MongoDB**: A NoSQL database used for storing car data.


**Express**: A Node.js web application framework used for building the backend.


**EJS**: A templating language used to generate HTML markup with plain JavaScript.


**Node.js**: A JavaScript runtime used for server-side scripting.


## Enviorment variables

```
DB_CONNECTION_STRING = connection string for mongo database
PORT = port on which the server will run
```
Before running the application, make sure to set up these environment variables in a `.env` file located in the root directory of the project.

## NPM commands

For server: 
`npm start`

For client:
` npm run dev `
