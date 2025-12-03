const Blog = require('../Schema/blogSchema');

//Create Blog
const createBlog = async(req, res) => {
  try{

    const {title, content, category, tags} = req.body;

    const newBlog = await Blog.create({
      title,
      content,
      category,
      tags,
      author: req.userInfo.id
    });

    res.status(201).json({
      message: 'Blog created successfully',
      data: newBlog
    });

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

//Get all blogs

const getBlogs = async(req, res) => {
  try{

    const blog = await Blog.find().populate("author", "name").sort({createdAt: -1});

    res.status(200).json(blog);

  } catch(err) {
    res.status(404).json({
      message: err.message
    })
  }
}

//Get one blog
const oneBlog = async(req, res) => {
  try{

    const blog = await Blog.findById(req.params.id).populate('author', 'name');

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
} 

//Update blog
const updateBlog = async(req, res) => {
  try{

    const blog = await Blog.findById(req.params.id);

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    //Only the user can delete the blog
    if(blog.author.toString() !== req.userInfo.id) {
      return res.status(403).json({
        message: 'You are not allowed'
      });
    }

    const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json({
      message: 'Blog updated successfully',
      blog: updateBlog
    });

  } catch(err) {
    res.status(404).json({
      message: err.message
    })
  }
}

//Delete blog
const deleteBlog = async(req, res) => {
  try{

    const blog = await Blog.findById(req.params.id);

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    if(blog.author.toString() !== req.userInfo.id) {
      return res.status(403).json({
        message: 'Not allowed to delete blog'
      });
    }

    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Blog deleted successfully',
      data: deleteBlog
    })

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

//Add comment to blog
const addComment = async(req, res) => {
  try{

    const BlogId = req.params.id;
    const {text} = req.body;

    const blog = await Blog.findById(BlogId)

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    blog.comments.push({
      user: req.userInfo.id,
      text,
      createdAt: new Date()
    });

    await blog.save();

    res.status(201).json({
      message: 'Comment added',
      comments: blog.comments
    });

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

const deleteComment = async(req, res) => {
  try{

    const blogId = req.params.blogId;
    const commentId = req.params.commentId;

    const blog = await Blog.findById(blogId);

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    //Get object idex in comment array
    const index = blog.comments.findIndex((comm) => comm._id.toString() === commentId);

    if(blog.author.toString() !== req.userInfo.id && blog.comments[index].user.toString() !== req.userInfo.id) {
      return res.status(403).json({
        message: 'You are not allowed to delete this comment'
      });
    }

    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);

    await blog.save();

    res.status(200).json({
      message: 'Comment deleted'
    });

  } catch(err) {
    console.log(err);
    res.status(404).json({
      message: err.message
    });
  }
}

const viewAllComment = async(req, res) => {
  try{

    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);
    
    const comments = blog.comments;

    res.status(200).json({
      comments
    });
    
  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}
module.exports = {createBlog, getBlogs, oneBlog, updateBlog, deleteBlog, addComment, deleteComment, viewAllComment}