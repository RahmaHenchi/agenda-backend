const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const Event = require('./models/Event');

require('dotenv').config();

const { eventValidator } = require('./utilities/validators');

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Mercado Marketplace API v1" })
});

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error: error.message })
    }
})

app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (event) {
            res.status(200).json(event)
        } else {
            res.status(404).json({ error: "Event not found" })
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

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
        res.status(500).json({error: error.message})
    }
})

app.put('/events/:id', async (req, res) => {
    try {
        const eventToUpdateId = req.params.id
        const validationResult = eventValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.json(validationResult)
        } else {
            const event = await Event.findByIdAndUpdate(eventToUpdateId, req.body)
            if (!event) {
                res.status(404).json({error: "Event not found"})
            } else {
                res.status(200).json({message: "Event updated successfully"})
            }
        }     
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/events/:id', async (req, res) => {
    try {
        const eventToDeleteId = req.params.id
        const result = await Event.deleteOne({ _id: eventToDeleteId })
        if (result.deletedCount === 1) {
            res.json({message: "Event deleted successfully"})
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
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