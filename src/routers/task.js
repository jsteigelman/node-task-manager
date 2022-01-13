const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// create new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// fetch all tasks of logged in user
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {

    const match = {} 
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        })
        res.send(req.user.tasks)

    } catch(e) {
        res.status(500).send()
    }
})

// fetch task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('Error: cannot retrieve task (authentication or task ID is incorrect)')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// update task by id 
router.patch('/tasks/:id', auth, async (req, res) => {
    // check that update is valid
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    // handle validation errors
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Update is invalid' })
    }

    try {     
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // handle task not found
        if (!task) {
            return res.status(404).send('Error: user authentication failed or task ID does not exist')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        // handle success
        res.send(task)

    } catch (e) {
        res.status(400).send()
    }
})

// delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        // handle success
        res.send(task)

    } catch (e) {
        return res.status(500).send()
    }
})

module.exports = router