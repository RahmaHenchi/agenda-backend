const Event = require('../models/Event')
const { eventValidator } = require('../utilities/validators')

const getAllEvents = async (req, res) => {
    try {
        const userId = req.params.id
        /* console.log(userId) */
        const events = await Event.find( { user:userId } ).populate('user', 'userName email')
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getOneEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('user', 'userName email')
        if (event) {
            res.status(200).json(event)
        } else {
            res.status(404).json({ error: "Event not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createEvent = async (req, res) => {
    try {
        const validationResult = eventValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.status(400).json(validationResult)
        } else {
            const event = new Event({
                title: req.body.title,
                notes: req.body.notes,
                start: req.body.start,
                end: req.body.end,
                user: req.user._id
            })
            let savedEvent = await event.save()
            req.user.password = undefined
            req.user.__v = undefined
            savedEvent.user = req.user
            res.status(201).json({
                message: "Event created successfully",
                event: savedEvent
            })
        }   
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateEvent = async (req, res) => {
    try {
        const eventToUpdateId = req.params.id
        const validationResult = eventValidator.validate(req.body, { abortEarly: false })
        if (validationResult.error) {
            res.status(400).json(validationResult)
        } else {
            const event = await Event.findOneAndUpdate({ _id: eventToUpdateId, user: req.user._id }, { $set: req.body }, { new: true })
            if (!event) {
                res.status(404).json({error: "Event not found"})
            } else {
                res.status(200).json({message: "Event updated successfully"})
            }
        }     
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteEvent = async (req, res) => {
    try {
        const eventToDeleteId = req.params.id
        const result = await Event.deleteOne({ _id: eventToDeleteId, user: req.user._id })
        if (result.deletedCount === 1) {
            res.json({message: "Event deleted successfully"})
        } else {
            res.status(404).json({error: "Event not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllEvents,
    getOneEvent,
    createEvent,
    updateEvent,
    deleteEvent
}
