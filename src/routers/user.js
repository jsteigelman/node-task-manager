const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')


// sign up new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send({ error: "Email is already in use"})
    }
})

// find user by credentials
router.post('/users/login', async (req, res) => {
    try {
        // use own method (not built in) on User
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        // unable to login
        res.status(400).send(e.message)
    }
})

// allow user to logout of current session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// allow user to logout of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Success! All sessions have been logged out.')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error: could not log out of all sessions.')
    }
})

// middlware (auth) called as second arg, third arg will only run if middleware calls next()
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// update user profile
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Update is invalid"})
    } 

    try {        
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

// delete user account
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// specify file information and file limits
const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB max size
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File type must be jpg, jpeg, or png.'))
        }

        cb(undefined, true)
    }
})

// add avatar to user
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Avatar uploaded successfully!')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete avatar from user profile
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Avatar deleted successfully!')
}) 

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id) 

        if (!user || !user.avatar) {
            throw new Error('User does not exist or does not have image associated to their account.')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send('Could not find image.')
    }
})

module.exports = router