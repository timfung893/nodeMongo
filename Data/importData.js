const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Movie = require('../Models/moviesModel')
dotenv.config({path: './config.env'})

mongoose.connect(process.env.DB_CONN_STR, {
    useNewUrlParser: true
}).then(((connection) => {
    console.log('DB Connection Successful');
})).catch((err) => {
    console.log('DB Connection Error: ', err.message);
})

const dataStr = fs.readFileSync('./Data/mymovies.movies.json', 'utf-8');
const movies = JSON.parse(dataStr);

const importData = async () => {

    try {
        await Movie.create(movies);
        console.log('Data imported successfully');
        
    } catch (err) {
        console.log('Data import failed: ', err.message);
    }
    process.exit();

}

const deleteData = async () => {

    try {
        await Movie.deleteMany();
        console.log('Data deleted successfully');
        
    } catch (err) {
        console.log('Data deletion failed: ', err.message);
    }
    process.exit();

}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
