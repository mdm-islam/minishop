// ✅ Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Get post ID from URL query string (?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get("id"));

  // ✅ Fetch blog data from JSON file
  fetch("data/blog.json")
    .then(response => response.json())
    .then(posts => {
      // ✅ Find the blog post by ID
      const post = posts.find(p => p.id === postId);

      // ❌ Show error message if post not found
      if (!post) {
        document.getElementById("blog-post-content").innerHTML = "<h2>Post not found</h2>";
        return;
      }

      // ✅ Set dynamic page title
      document.title = `${post.title} | MiniShop`;

      // ✅ Render blog post content into HTML
      document.getElementById("blog-post-content").innerHTML = `
        <h1 class="mb-3">${post.title}</h1>
        <p class="text-muted">By ${post.author} on ${post.date}</p>
        <img src="${post.image}" class="img-fluid rounded mb-4" alt="${post.title}">
        <p>${post.content}</p>
        <a href="blog.html" class="btn btn-outline-primary mt-3">← Back to Blog</a>
      `;
    })
    .catch(error => {
      // ❌ Log error if blog data fails to load
      console.error("Error loading blog post:", error);
    });
});
