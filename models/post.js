const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: [120, 'Title can be maximum of 120 characters long']
    },
    content: {
        type: String,
        required: true
    },
    is_approved: {
        type: String,
        default: '0'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {
        type: String,
        enum: ["0", "1"],
        default:'0'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})



module.exports = mongoose.model('Post', postSchema);