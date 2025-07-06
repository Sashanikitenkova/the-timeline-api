const postModel = require('../models/postModel');
const commentModel = require('../models/comentModel');

const getAllPosts = (req,res) => {
    postModel.find()
        .sort({ createdAt: -1 })
        .populate('comments', '_id body')
        .then((post) => {
         res.status(200).json(post);
       })
       .catch(err => {
        res.status(500).json({err: 'Could not load posts. Please try again later.'});
       });
};

const postOnePost = (req,res) => {
    const postText = req.body.post;
    
    if (!postText || postText.length < 25) {
      postModel.find().sort({ createdAt: -1 })
        .then(posts => {
            res.status(400).json({ posts, err: 'Post must be at least 25 characters long.'});
        })
        .catch(err => {
            res.status(500).json({ err: 'Server error'});
        });
        return;
      }

    postModel.create({ post: postText })
       .then(() => {
         return postModel.find().sort({ createdAt: -1 }).populate('comments', '_id body');
       })
       .then(posts => {
         res.status(201).json(posts);
       })
       .catch(err => {
         res.status(500).json({err: 'Server error'});
       });
};

const updateOnePost = (req,res) => {
    const postId = req.params.id;
    const postText = req.body.post;

    if (!postText || postText.length < 25) {
        return res.status(400).json({ err: 'Post must be at least 25 characters long.' });
    }

    postModel.findByIdAndUpdate(
        postId, 
        { post: postText, updatedAt: new Date()},
        { new: true })
        .then(post => {
            if(!post) {
                return res.status(404).json({err: 'Post not found'});
            }
            return postModel.find().sort({ createdAt: -1 }).populate('comments', '_id body');
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({err: 'Could not update post. Please try again later.'});
        });
};

const deletePost = (req,res) => {

    postModel.findByIdAndDelete(req.params.id)
       .then((post) => {
           if(!post) {
               return res.status(404).json({ err: 'Post not found'});
           }
           return postModel.find().sort({ createdAt: -1 }).populate('comments', '_id body');
       })
       .then(posts => {
           res.status(200).json(posts);
       })
       .catch(err => {
           res.status(500).json({err: 'Could not delete post. Please try again later.'});
      });
};

const postOneComment = (req,res) => {
    const postId = req.params.id;
    const { body } = req.body;
    
    if (!body || body.trim() === "") {
        return res.status(400).json({ error: 'Comment text cannot be empty.' });
    }
    
    const commentData = {
        body,
        post: postId,
    };
    
    const newComment = new commentModel(commentData);
    
    newComment.save()
      .then(() => {
        return postModel.findById(postId);
      })
      .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        
        post.comments.push(newComment._id);
        
        return post.save();
      })
      .then(() => {
        return postModel
          .find()
          .sort({ createdAt: -1 })
          .populate('comments') 
      })
      .then(allPosts => {
        res.status(201).json(allPosts); 
      })
      .catch(err => {
        res.status(500).json({ error: 'Failed to add comment.' });
      });
};

const deleteCommentPost = (req,res) => {
    const commentId = req.params.commentId;
    const postId = req.params.id;
    
    commentModel.findByIdAndDelete(commentId)
       .then(deletedComment => {
           if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found.' });
           }
           
           return postModel.findById(postId);
        })
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            
            post.comments = post.comments.filter(comment => comment.toString() !== commentId);
            
            return post.save();
        })
        .then(() => {
            return postModel.find()
            .sort({ createdAt: -1 })
            .populate('comments')
        })
        .then(allPosts => {
            res.status(200).json(allPosts);
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not delete comment. Please try again later.' });
        });
};

const notFoundPage = (req,res) => {
  res.status(404).json({ err: 'Page not found'});
};

module.exports = {
    getAllPosts,
    postOnePost,
    updateOnePost,
    deletePost,
    postOneComment,
    deleteCommentPost,
    notFoundPage,
}