const Post = require('../models/post')
const mongoose = require('mongoose')
const User = require('../models/user')


// For Fetch All the posts on main page
const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find({is_approved:'0',deleted:'0'}).populate('author', '_id name');
        if (allPosts.length !== 0) {
            res.json({
                allPosts
            })
        } else {
            res.status(204).json(`No post found!`)
        }
        console.log(allPosts)
    } catch (error) {
        next(err)
    }
}


const getMyPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find({author:req.params.userId,deleted:'0'}).populate('author', '_id name');
        if (allPosts.length !== 0) {
            res.json({
                allPosts
            })
        } else {
            res.status(204).json(`No post found!`)
        }
        console.log(allPosts)
    } catch (error) {
        next(err)
    }
}

const getPostByUser = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const userWithPost = await User.findById({_id: req.params.userId}, '_id name email').populate('posts')
        if (!userWithPost) {
            const err = new Error(`User not found!`)
            err.status = 404
            throw err
        }
        res.json({
            userWithPost
        })
    } catch (error) {
        next(error)
    }
}

//For Ftech single post by postId
const getSinglePost = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postid)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundPost = await Post.findOne({
            _id: req.params.postid
        }).populate({
            path: 'comments',
            populate: {
                path: 'commentBy',
                select: 'name', 
                model: 'User'
            }
        }).populate('author', '_id name');
        if (!foundPost) {
            res.status(404).json({
                message: `No post found!`
            })
        }
        return res.json({
            info: foundPost
        })
    } catch (error) {
        next(error)
    }

}

// For save post
const savePost = async (req, res, next) => {
    try {
        const title = req.body.title,
            content = req.body.content
        const newPost = new Post({
            title: title,
            content: content,
            author: req.userId
        })


        //console.log(req.user)
        const savedPost = await newPost.save()
        const foundUser = await User.findById({
            _id: req.userId
        })
        foundUser.posts.push(newPost)
        await foundUser.save()

        res.status(201).json({
            message: `Post created successfully`,
            postId: savedPost._id
        })

    } catch (error) {
        next(error)
    }
}

const getAllPostsAdmin = async (req, res, next) => {
    try {
        const allPosts = await Post.find({deleted:'0'}).populate('author', '_id name').sort({is_approved:1});
        if (allPosts.length !== 0) {
            res.json({
                allPosts
            })
        } else {
            res.status(204).json(`No post found!`)
        }
        console.log(allPosts)
    } catch (error) {
        next(err)
    }
}
const updatePost = async (req, res, next) => {
    const postid = req.params.postid
    try {
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }

        const foundPost = await Post.findOne({
            _id: postid
        })
        // Checking if the logged user is the owner of the post
        if (foundPost.author.toString() !== req.userData.userId) {
            const error = new Error(`Not authorized!`)
            error.status = 403
            throw error
        }
        if (!foundPost) {
            const err = new Error(`No post found for provided id!`)
            err.status = 404
            throw err
        } else {
            await Post.updateOne({
                _id: postid
            }, {
                $set: req.body
            }, {
                upsert: true,
                new: true,
                // Available options new: bool - if true, return the modified 
                // document rather than the original. defaults to false
                runValidators: true
            })
            res.json({
                message: `Post updated successfully`
            })
        }
    } catch (error) {
        next(error)
    }
}


const deleteSinglePost = async (req, res, next) => {
    try {
        console.log('hiii');
        const postId = req.params.postid
        console.log(postId)
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundPost = await Post.findById({
            _id: postId
        })
        
        if (!foundPost) {
            const error = new Error(`No post found for the given id!`)
            error.status = 404
            throw error
        }
        const foundUser = await User.findById({
            _id: req.userData.userId
        })
        console.log(postId)
        const updatedUser =  await Post.findByIdAndUpdate(postId,{deleted:'1'});
        console.log('hiii');
        await foundUser.posts.pull(postId)
        await foundUser.save()

        res.json({
            message: `Post deleted successfully!`
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}


const approvePost = async (req, res, next) => {
    try {
        const postId = req.params.postid
        console.log(postId)
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundPost = await Post.findById({
            _id: postId
        })
        
        if (!foundPost) {
            const error = new Error(`No post found for the given id!`)
            error.status = 404
            throw error
        }
        const updatedUser =  await Post.findByIdAndUpdate(postId,{is_approved:'1'});
        const allPosts = await Post.find({deleted:'0'}).populate('author', '_id name').sort({is_approved:1});
        if (allPosts.length !== 0) {
            res.json({
                message: `Post approve successfully!`,
                allPosts: allPosts
            })
        } else {
            res.status(204).json(`No post found!`)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    getAllPosts,
    getPostByUser,
    getSinglePost,
    savePost,
    updatePost,
    deleteSinglePost,
    getMyPosts,
    getAllPostsAdmin,
    approvePost
}