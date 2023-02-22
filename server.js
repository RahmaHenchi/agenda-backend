const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');

require('dotenv').config();

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Welcome !" })
});

app.use('/events', eventsRouter);
app.use('/auth', usersRouter);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log(error);
    })