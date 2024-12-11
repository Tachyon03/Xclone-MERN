import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";


export const createPost = async(req, res) =>{
    try{
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findOne({_id: userId})
        if(!user){
            return res.status(400).json({error: "Internal server error"});
        }

        if(!text && !img){
            return res.status(400).json({error: "Post mmust have text or image"});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(200).json(newPost);
    }
    catch(error){
        console.log(`Error in post.controller${error}`);
        res.status(201).json({error: "Internal server error"})    
    }
}

export const deletePost = async(req, res)=>{
    try{
        const {id} = req.params;
        const post = await Post.findOne({_id: id})
        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(404).json({error: "Unauthorized action"});
        }
        
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.destroy(img.id)
        }
        
        await Post.findByIdAndDelete({_id: id});
        res.status(200).json({message: "Post deleted successfully"});

    }
    catch(error){
        console.log(`error in deletePost controller ${error}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const createComment = async(req, res)=>{
    try{
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({error: "Text is mandatory"});   
        }
        const post = await Post.findOne({_id: postId});
        
        if(!post){
            return res.status(404).json({error: "Post is mandatory"});   
        }

        const comment = {
            user: userId,
            text
        }

        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    }
    catch(error){
        console.log(`error in commentPost controller ${error}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const likeUnlikePost = async(req, res) =>{
    try{
        const userId = req.user._id;
        const {id: postId} = req.params;

        const post = await Post.findOne({_id: postId});
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        const userLikedPost = post.likes.includes(userId);
        
        if(userLikedPost){
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId},{$pull: {likedPosts: postId}})
          
            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        }
        else{
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    }
    catch(error){
        console.log(`error in likeUnlikePost controller ${error}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getAllPosts = async(req, res)=>{
    try{
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
         })
         .populate({
            path: "comments.user",
            select: ["-password","-following","-followers","-bio","-link"]
         })
        
         if(posts.length===0){
            return res.status(200).json([])
        }
        res.status(200).json(posts);
    }
    catch(error){
        console.log(`error in GetALLPOSTS controller ${error}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getLikedPosts = async(req, res)=>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({error: "User not found"});
        }
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path: 'user',
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password -email -following -followers -bio -link"
        })
        res.status(200).json(likedPosts)
    }
    catch(error){
        console.log(`error in likedPost controller ${error}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getFollowingPosts = async(req,res)=>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        
        const following = user.following;
        const feedPosts = await Post.find({user: {$in: following}}).sort({createdAt : -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })
    res.status(200).json({feedPosts});
    
    }
    catch(error){
        console.log(`error in getFollowingPosts controller${error}`);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getUserPosts = async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username})
        if(!user){
            res.status(404).json({error: "User not found"});
        }
        const posts = await Post.find({user: user._id}).sort({createdAt : -1})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
    res.status(200).json(posts);
    }   
    catch(error){
        console.log(`error in User controller${error}`);
        res.status(500).json({error: "Internal Server Error"});
    }
}