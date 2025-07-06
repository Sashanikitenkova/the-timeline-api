const postModel = require('../models/postModel');
const commentModel = require('../models/comentModel');

const post = (req, res) => {
  postModel.find()
    .sort({ createdAt: -1 })
    .populate('comments', '_id body')
    .then(result => {
      res.render('index', { title: 'Posts', posts: result, errorMessage: null });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load posts. Please try again later.'
      });
    })
};

const addNewPost = async (req, res) => {
  const postText = req.body.post;

  if (!postText || postText.length < 25) {
    const posts = await postModel.find().sort({ createdAt: -1 });
    return res.render('index', {
      title: 'Posts',
      posts: posts,
      errorMessage: 'Post must be at least 25 characters long.'
    });
  }

  const newPost = new postModel({ post: postText });

  newPost.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
    });
};

const showPost = (req, res) => {
  const postId = req.params.id;

  postModel.findById(postId)
     .then(result => {
       res.render('post', { title: 'Post', post: result, errorMessage: null });
     })
     .catch(err => {
      console.log(arr);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load post. Please try again later.'
      });
     })
}

const deletePost = (req, res) => {
  const postId = req.params.id;

  postModel.findByIdAndDelete(postId)
     .then(() => {
      res.redirect('/');
     })
     .catch(err => {
      console.log(err);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not delete post. Please try again later.'
      });
     })

}

const editPostPage = (req, res) => {
  const postId = req.params.id;

  postModel.findById(postId)
    .then(result => {
      res.render('edit-post', { title: 'Edit Post', post: result, errorMessage: null })
     })
    .catch(err => {
      console.log(err);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load post for editing.'
      });
    })
}

const editPostForm = async(req, res) => {
  const postId = req.params.id;
  const postText = req.body.post;

  if (!postText || postText.length < 25) {
     try {
      const post = await postModel.findById(postId);

      return res.render('edit-post', {
        title: 'Edit Post',
        post: post,
        errorMessage: 'Post must be at least 25 characters long.'
      });
    } catch (err) {
      console.error(err);
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load post.'
      });
    }
  }

  postModel.findByIdAndUpdate(postId, {
      post: postText,
      updatedAt: new Date()
    }, { new: true })
    .then(() => {
      res.redirect('/'); 
    })
    .catch(err => {
      console.error(err);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not update post. Please try again later.'
      });
    });   
}

const addComment = (req,res) => {
  let postId = req.params.id;

  if(req.body.body !== "" && postId) {

    let commentData = {
      ...req.body,
      post: postId,
    }

    let newCommet = new commentModel(commentData);

    newCommet.save()
       .then(() => {
        //Update post table to add the comment ID
        postModel.findById(postId)
           .then(postInfo => {
            postInfo.comments.push(newCommet._id);

            postInfo.save()
               .then(result => {

                 res.redirect('/');
               })
               .catch(err => {
                console.error(err);
               })
            
           })
           .catch(err => {
            console.error(err);
            // res.status(500).render('error', {
            //   title: 'Error',
            //   message: 'Could not find post. Please try again later.'
            // });
           })
       })
       .catch(err => {
         console.error(err);
         res.status(500).render('error', {
          title: 'Error',
          message: 'Could not update post. Please try again later.'
         });
       })
  }
}

const delComment = (req, res) => {

  const commentId = req.params.commentId;
  const postId = req.params.id;

  commentModel.findByIdAndDelete(commentId)
     .then((result) => {

         postModel.findById(postId)
           .then(postInfo => {
               postInfo.comments = postInfo.comments.filter(comment => comment._id.toString() !== commentId);

               postInfo.save()
                    .then(() => {
                          res.redirect('/');
                     })
                    .catch(err => {
                          console.error(err);
                     })
           })
           .catch(err => {
            console.log(err);
           })
     })
     .catch(err => {
      console.log(err);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Could not delete comment. Please try again later.'
      });
     })
}

const notFoundPage = (req,res) => {
  res.send('404, Page not found');
}

module.exports = { 
  post,
  addNewPost,
  showPost,
  deletePost,
  editPostPage,
  editPostForm,
  notFoundPage,
  addComment,
  delComment
};




// const addNewPost = (req, res) => {
//   let newPost = new postModel(req.body);

//   newPost.save()
//     .then(savedPost => {
//       // const formattedDate = new Date(savedPost.createdAt).toLocaleDateString('en-US', {
//       //   day: 'numeric',
//       //   month: 'long',
//       //   year: 'numeric'
//       // });
      
//       // console.log({
//       //   post: savedPost.post,
//       //   createdAt: formattedDate
//       // });

//       res.redirect('/');
//     })
//     // .catch(err => {
//     //   console.log(err);
//     // })
//     .catch(async (err) => {
//       if (err.name === 'ValidationError') {
//         const posts = await postModel.find().sort({ createdAt: -1 });
        
//         res.render('index', {
//           title: 'Posts',
//           posts: posts,
//           errorMessage: err.errors.post.message,
//         });
//       } else {
//         res.status(500).send('Server error');
//       }
//     });
// }