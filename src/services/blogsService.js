import api from './http';

// Normalize blog data from backend to frontend shape
function normalizeBlog(raw) {
  if (!raw) return raw;
  return {
    id: raw.id || null,
    title: raw.title || '',
    excerpt: raw.excerpt || '',
    content: raw.content || '',
    category: raw.category || '',
    image: raw.image || '',
    author: raw.author || '',
    publishedDate: raw.publishedDate || raw.published_date || null,
    createdAt: raw.createdAt || raw.created_at || null,
    updatedAt: raw.updatedAt || raw.updated_at || null,
    _raw: raw,
  };
}

// Fetch all blogs with optional filters
export async function fetchBlogs(params = {}) {
  try {
    const res = await api.get('/blogs', { params });
    const data = res.data;
    const list = Array.isArray(data) ? data : (data.items || []);
    console.debug('[blogsService] fetched blogs count=', list.length);
    return list.map(normalizeBlog);
  } catch (err) {
    console.error('[blogsService] fetchBlogs error', err?.message || err);
    throw err;
  }
}

// Fetch blog by ID
export async function fetchBlogById(id) {
  try {
    const res = await api.get(`/blogs/${id}`);
    return normalizeBlog(res.data);
  } catch (err) {
    console.error('[blogsService] fetchBlogById error', err?.message || err);
    throw err;
  }
}

// Fetch all available categories
export async function fetchBlogCategories() {
  try {
    const res = await api.get('/blogs/categories');
    return res.data || [];
  } catch (err) {
    console.error('[blogsService] fetchBlogCategories error', err?.message || err);
    throw err;
  }
}

// Create a new blog
export async function createBlog(payload) {
  try {
    const res = await api.post('/blogs', payload);
    return normalizeBlog(res.data);
  } catch (err) {
    console.error('[blogsService] createBlog error', err?.message || err);
    throw err;
  }
}

// Update existing blog
export async function updateBlogById(id, payload) {
  try {
    const res = await api.put(`/blogs/${id}`, payload);
    return normalizeBlog(res.data);
  } catch (err) {
    console.error('[blogsService] updateBlogById error', err?.message || err);
    throw err;
  }
}

// Delete blog
export async function deleteBlogById(id) {
  try {
    const res = await api.delete(`/blogs/${id}`);
    return res.data;
  } catch (err) {
    console.error('[blogsService] deleteBlogById error', err?.message || err);
    throw err;
  }
}
