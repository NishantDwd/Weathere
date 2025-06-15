export async function fetchBlogs() {
  const res = await fetch("/api/blogs/list");
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data = await res.json();
  return data.blogs;
}

export async function postBlog({ title, content, token }) {
  const res = await fetch("/api/blogs/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { error: "Failed to post blog" };
    }
    throw new Error(err.error || "Failed to post blog");
  }
  return await res.json();
}

export async function deleteBlog({ id, token }) {
  const res = await fetch("/api/blogs/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete blog");
  }
  return await res.json();
}