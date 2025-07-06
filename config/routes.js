const express = require("express");
const route = express.Router();
const postInform = require('../controller/postController');

route.get('/', postInform.post);
route.post('/add-new-post', postInform.addNewPost);
route.get('/post/:id', postInform.showPost);
route.get('/delete/post/:id', postInform.deletePost);
route.get('/update/post/:id', postInform.editPostPage);
route.post('/edit-post-form/:id', postInform.editPostForm);
route.post('/post/add/new-comment/:id', postInform.addComment);
route.get('/delete/post/comment/:commentId/:id', postInform.delComment);


route.get('/{*any}', postInform.notFoundPage);

module.exports = route;