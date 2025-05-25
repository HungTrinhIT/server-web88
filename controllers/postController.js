import Post from '../models/Post.js';

const add = async (req, res) => {
  const { title, content } = req.body;
  const user = req.user;

  try {
    if (!title || !content) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const newPost = new Post({
      title,
      content,
      author: user.id,
    });

    const createdPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      data: createdPost,
    });
  } catch (error) {}
};

const SUPPORTED_SORT_OPTIONS = ['createdAt', 'reactionCount', 'commentCount'];
const SORT_ORDER_VALUES = {
  DESCENDING: 'desc',
  ASCENDING: 'asc',
};

// @desc Get all posts with pagination, sorting, searching
// @route GET /api/posts
// @access Private

// /api/posts?page=1&limit=10?q=Learning
const getAll = async (req, res) => {
  try {
    const {
      page = 1, // (page - 1) * limit  page=1: (1-1)*10 = 0 | page =2 (2 - 1)* 10 = 10  | page =3 (3-1)*10 = 20
      limit = 10, // total_items: 22, total_pages: 3, 11 -> 20
      sortBy = 'createdAt', // supports: createdAt, reactionCount, commentCount
      sortOrder = SORT_ORDER_VALUES.DESCENDING, // 'asc' (Tăng dần) | 'desc' (Giảm dần)
      q,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = {};

    // Searching
    if (!!q) {
      query = {
        $or: [{ title: { $regex: q } }, { content: { $regex: q } }], 
      };
    }

    // Sorting
    const sortOptions = {};
    if (SUPPORTED_SORT_OPTIONS.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === SORT_ORDER_VALUES.ASCENDING ? 1 : -1;
    } else {
      sortOptions['createdAt'] = -1;
    }

    // Filter: size, color, money range, location,...

    // Combine all logic
    let postsQuery = Post.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Execute query statment
    const posts = await postsQuery.exec();

    // Pagination
    const totalPosts = await Post.countDocuments({});
    const totalPages = (totalPosts % limitNum) + 1;

    res.json({
      data: posts,
      pagination: {
        limit: limitNum,
        page: pageNum,
        totalPages,
        totalPosts: posts?.length,
        totalItems: totalPosts,
        hasPreviousPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
      },
    });
  } catch (error) {
    console.error(`[ERROR] - Something went wrong:`, error);
  }
};

const PostController = {
  add,
  getAll,
};

export default PostController;
