const User = require('../models/user')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

const getAllUser = async (req, res, next) => {
    try {
        const allUser = await User.find({})
        if (allUser.length !== 0) {
            res.json({
                allUser
            })
        } else {
            res.status(204).json(`No users found!`)
        }
    } catch (error) {
        next(error)
    }
}

const deleteSingleUser = async (req, res, next) => {
    const {
        userId
    } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundUser = await User.findById({
            _id: userId
        })
        if (!foundUser) {
            const err = new Error(`No user found!`)
            err.status = 404
            throw err
        }
        const updatedUser =  await User.findByIdAndUpdate(userId,{delete:'1'});
        res.json({
            message: `User deleted successfully!`
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUser,
    deleteSingleUser
}