const express = require('express')
const router = express.Router()
const multer  = require('multer');

const Category = require('../models/category')

router.post('/new_category', (req, res) => {
    let categoryData = req.body
    let category = new Category(categoryData)
    category.save((error, enteredCategory) => {
        if (error) {
            console.log(error)
        } else {
            res.status(200).send(enteredCategory)
        }
    })
})

module.exports = router
