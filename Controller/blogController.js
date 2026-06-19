import Blog from "../model/BlogModel.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { title, description, category, tags, images } = req.body;
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
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//READ BLOG
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("author", "name email");
    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//READ BLOG BY _ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
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
