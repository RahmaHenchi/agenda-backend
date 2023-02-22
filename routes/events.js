const express = require('express');

const { getAllEvents, getOneEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getOneEvent);
router.post('/', checkAuth, createEvent);
router.put('/:id', checkAuth, updateEvent);
router.delete('/:id', checkAuth, deleteEvent);

module.exports = router;