import { useState, useEffect } from "react";
import { Plus, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchBlogs, postBlog, deleteBlog } from "@/lib/blogApi";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const currentUser = getCurrentUser();

  // Fetch blogs on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await fetchBlogs();
      setBlogs(data);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  const handlePost = async () => {
    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      toast.error("Title and content required");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await postBlog({ ...newBlog, token });
      toast.success("Blog posted!");
      setShowModal(false);
      setNewBlog({ title: "", content: "" });
      await loadBlogs();
    } catch (err) {
      toast.error(err.message || "Failed to post blog");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteBlog({ id, token });
      toast.success("Blog deleted!");
      await loadBlogs();
    } catch (err) {
      toast.error(err.message || "Failed to delete blog");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Weather Blog</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow transition"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" /> Add New Blog
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-8 w-full max-w-md border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">New Blog Post</h2>
            <input
              className="w-full mb-3 px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="Title"
              value={newBlog.title}
              onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
              maxLength={100}
            />
            <textarea
              className="w-full mb-3 px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="Write about weather..."
              rows={5}
              value={newBlog.content}
              onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
              maxLength={1000}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition"
                onClick={handlePost}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="space-y-6">
        {blogs.length === 0 ? (
          <div className="text-zinc-500 text-center mt-12">No blogs yet. Be the first to post!</div>
        ) : (
          blogs.map(blog => (
            <div
              key={blog.id}
              className="bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow p-6 border border-indigo-100 dark:border-indigo-900 relative flex items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">{blog.username}</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{blog.title}</div>
                <div className="text-zinc-700 dark:text-zinc-200 mb-4 whitespace-pre-line">{blog.content}</div>
                <div className="absolute bottom-3 right-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(blog.created_at).toLocaleString()}
                </div>
              </div>
              {/* Delete button for own posts */}
              {blog.username === currentUser.username && (
                <button
                  className="ml-4 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition absolute top-4 right-4"
                  onClick={() => handleDelete(blog.id)}
                  aria-label="Delete blog"
                  type="button"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}