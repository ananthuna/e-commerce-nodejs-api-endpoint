const express = require('express')
const Item = require('../models/Item')
const Auth = require('../middleware/auth')
const router = new express.Router()

//create item
router.post('/addItem', Auth, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        await newItem.save()
        res.status(201).json(newItem)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

//fetch item
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if (!item) {
            res.status(404).json({ error: "Item not found" })
        }
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//fetch all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({})
        res.status(200).json(items)
    } catch (error) {
        res.status(400).json(error)
    }
})


//update item
router.patch('/items/:id', Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price', 'url', 'weight', 'off']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if (!item) {
            return res.status(404).json({ error: 'invalid product selection' })
        }
        updates.forEach((update) => item[update] = req.body[update])
        await item.save()
        res.status(201).json(item)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//delete items
router.delete('/items/:id', Auth, async (req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete({ _id: req.params.id })
        if (!deletedItem) {
            res.status(404).json({ error: "Item not found" })
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = router