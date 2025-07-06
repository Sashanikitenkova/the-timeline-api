const express = require("express");
const router = express.Router();
const postApiController = require("../controller/postApiController");

// Post API
router.get('/api/get-posts', postApiController.getAllPosts);
router.post('/api/create-post', postApiController.postOnePost);
router.put('/api/edit-post/:id', postApiController.updateOnePost);
router.delete('/api/delete-post/:id', postApiController.deletePost);

// Comment Post API
router.post('/api/post-post-comment/:id', postApiController.postOneComment);
router.delete('/api/delete-post-comments/:commentId/:id', postApiController.deleteCommentPost);

router.get('/{*any}', postApiController.notFoundPage);

module.exports = router;