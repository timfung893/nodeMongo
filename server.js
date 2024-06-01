const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

// start listening to unhandled exception before errors occur to catch them
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occurred! Shutting down.')
    // 0: status success, 1: unhandled exception
    process.exit(1);
})

const app = require('./app');
const Movie = require('./Models/moviesModel');

mongoose.connect(process.env.DB_CONN_STR, {
    useNewUrlParser: true
}).then(((connection) => {
    console.log('DB Connection Successful');
}))

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('Server has started!');
})
