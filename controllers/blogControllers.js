const Blog = require('../Schema/blogSchema');
const User = require('../Schema/userSchema');

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

//Delete comment from the blog
const deleteComment = async(req, res) => {
  try{

    /*
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;
    */
    const {blogId, commentId} = req.params;

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

//View all comment from one blog
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

//Like blogs
const createLikes = async(req, res) => {
  try{

    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId).populate('author', 'name');

    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    blog.likes.push({
      user: req.userInfo.id
    });

    await blog.save();

    res.status(200).json({
      message: `You just liked ${blog.author.name} post`,
      totalLikes: blog.likes.length
    });

  } catch(error) {
    res.status(404).json({
      message: error.message
    });
  }
}

//Unlike blogs
const unLike = async(req, res) => {
  try{

    const { blogId, likeId } = req.params;

    const blog = await Blog.findById(blogId).populate('author', 'name');
    
    if(!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    const index = blog.likes.findIndex((like) => like._id.toString() === likeId);

    if(blog.likes[index].user.toString() !== req.userInfo.id) {
      return res.status(403).json({
        message: "You can't unlike this Blog"
      });
    }

    blog.likes = blog.likes.filter((like) => like._id.toString() !== likeId);

    await blog.save();

    res.status(200).json({
      message: `You just unliked ${blog.author.name} post`
    });
    
  } catch(err) {
    console.log(err);
    res.status(404).json({
      message: err.message
    });
  }
}

const tagUser = async(req, res) => {
  try{

    const {blogId, userId} = req.params;

    const blog = await Blog.findById(blogId);
    const userOne = await User.findById(userId);

    if(!blog) {
      return res.status(404).json({
        message: 'blog not found'
      });
    }

    if(blog.author._id.toString() !== req.userInfo.id) {
      return res.status(403).json({
        message: "You can't tag a person, when it is not your post"
      });
    }

    blog.tags.push({
      user: userId
    });

    await blog.save();

    res.status(200).json({
      message: `You just tagged ${userOne.name} to your post`
    });

  } catch(error) {
    console.log(error);
    res.status(404).json({
      message: error.message
    });
  }
}
module.exports = {createBlog, getBlogs, oneBlog, updateBlog, deleteBlog, addComment, deleteComment, viewAllComment, createLikes, unLike, tagUser};