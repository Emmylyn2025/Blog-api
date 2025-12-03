const express = require('express');
const {registerUser, loginUser, refreshAccessToken, logOut, decodeToken} = require('../controllers/userControllers');
const {createBlog, getBlogs, oneBlog, updateBlog, deleteBlog, addComment, deleteComment, viewAllComment} = require('../controllers/blogControllers');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();


//User Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logOut);
router.get('/decode', protect, decodeToken);

//Blog routes
router.post('/post', protect, createBlog);
router.get('/view', protect, getBlogs);
router.get('/viewone/:id', protect, oneBlog);
router.patch('/update/:id', protect, updateBlog);
router.delete('/delete/:id', protect , deleteBlog);
router.post('/comment/:id', protect, addComment);
router.delete('/deletecomment/:blogId/:commentId', protect, deleteComment);
router.get('/allcomments/:blogId', protect, viewAllComment);


module.exports = router;