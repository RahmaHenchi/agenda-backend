const express = require('express');

const { eventValidator } = require('../utilities/validators');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error: error.message })
    }
})

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;