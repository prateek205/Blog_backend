import Blog from "../Model/blogModel.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  console.time("CREAT_BLOG");
  console.time("TOTAL");
  try {
    const { title, description } = req.body;
    const author = req.users.id;

    const existingBlog = await Blog.findOne({ title });
    if (!title || !description || !author) {
      return res
        .status(400)
        .json({ message: "Title, Content and Author are required" });
    }

    if (existingBlog) {
      return res
        .status(401)
        .json({ success: false, message: "Blog Already Exist", existingBlog });
    }

    const imgUrl = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const newBlog = new Blog({ ...req.body, author, images: imgUrl });

    await newBlog.save();

    const populatedBlog = await Blog.findById(newBlog._id).populate(
      "author",
      "name",
    );

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: populatedBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//READ BLOG
export const getBlogs = async (req, res) => {
  try {
    
    console.log("REQUEST.QUERY:", req.query)

    const queryObj = {};
    if (req.query.category) {
      queryObj.category = req.query.category;
    }
    console.log("QUERY:", queryObj);

    let sortObj = { createdAt: -1 };
    if (req.query.sort === "Oldest") {
      sortObj = { createdAt: 1 };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .lean();

    const totalBlogs = await Blog.countDocuments(queryObj);
    const totalPages = Math.ceil(totalBlogs / limit);
    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalResult: totalBlogs,
      },
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//READ BLOG BY _ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE BLOG
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.users.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own blog",
      });
    }

    const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updateBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE BLOG
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.users.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own blog",
      });
    }

    const delBlog = await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully!!!",
      delBlog,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET MY_BLOG
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.users.id,
    }).populate("author", "name email");

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
