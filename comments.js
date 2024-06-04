// Create web server
const express = require('express');
const router = express.Router();
const Comments = require('../models/comments');
const User = require('../models/user');

// Create a new comment
router.post('/comments', async (req, res) => {
    try {
        const comment = new Comments(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all comments
router.get('/comments', async (req, res) => {
    try {
        const comments = await Comments.find({});
        res.send(comments);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get a comment by id
router.get('/comments/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const comment = await Comments.findById(_id);
        if (!comment) {
            return res.status(404).send();
        }
        res.send(comment);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Update a comment by id
router.patch('/comments/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comment'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const comment = await Comments.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comment) {
            return res.status(404).send();
        }
        res.send(comment);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete a comment by id
router.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comments.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).send();
        }
        res.send(comment);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;