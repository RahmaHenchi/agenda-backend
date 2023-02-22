const express = require('express');
const mongoose = require('mongoose');

const Event = require('./models/Event');

require('dotenv').config();

const { eventValidator } = require('./utilities/validators');


const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Mercado Marketplace API v1" })
});

app.post('/events', async (req, res) => {
    try {
        const validationResult = eventValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.status(400).json(validationResult)
        } else {
            const event = new Event({
                title: req.body.title,
                notes: req.body.notes,
                start: req.body.start,
                end: req.body.end
            })
            await event.save()
            res.status(201).json({ message: "Event created successfully" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

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