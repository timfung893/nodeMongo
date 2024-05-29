const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const app = require('./app');
const Movie = require('./Models/moviesModel');

mongoose.connect(process.env.DB_CONN_STR, {
    useNewUrlParser: true
}).then(((connection) => {
    console.log('DB Connection Successful');
})).catch((err) => {
    console.log('DB Connection Error: ', err.message);
})

// const testMovie = new Movie({
//     name: 'Die Hard',
//     description: 'Action-packed movie starring Bruce Willis.',
//     duration: 139,
//     ratings: 4.5,
//     totalRatings: 4,
//     releaseYear: 1990,
//     createdAt: new Date().toISOString(),
//     genres: ['Action', 'Adventure'],
//     directors: 'Unknown',
//     coverImage: ['x'],
//     actors: [
//         'Bruce Willis'
//     ], 
//     price: 55
// })

// testMovie.save()
// .then(doc => {
//     console.log(doc);
// })
// .catch((err) => {
//     console.log('Error saving movie: ', err.message);
// });
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started!');
})