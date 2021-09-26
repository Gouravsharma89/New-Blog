const express = require('express')
const router = express.Router()
const User = require('../models/user')
const userController = require('../controllers/user')

router.route('/all-users')
    .get(userController.getAllUser)

router.route('/delete/:userId')
    .delete(userController.deleteSingleUser)

module.exports = router