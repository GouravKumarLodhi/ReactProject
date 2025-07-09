
import React, { useState, useEffect, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";

// Create Context
const PostsContext = createContext();

// Provider Component
const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    setPosts(data);
  };

  const removePost = (id) => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        loading,
        setLoading,
        fetchPosts,
        currentPage,
        setCurrentPage,
        removePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Post Card Component
const PostCard = ({ post }) => {
  const { removePost } = useContext(PostsContext);

  return (
    <div style={styles.card}>
      <button style={styles.cross} onClick={() => removePost(post.id)}>
        ×
      </button>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </div>
  );
};

// Posts List Component
const PostsList = () => {
  const { posts, currentPage } = useContext(PostsContext);
  const startIndex = (currentPage - 1) * 6;
  const currentPosts = posts.slice(startIndex, startIndex + 6);

  return (
    <div style={styles.grid}>
      {currentPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

// Pagination Component
const Pagination = () => {
  const { posts, currentPage, setCurrentPage } = useContext(PostsContext);
  const totalPages = Math.ceil(posts.length / 6);

  return (
    <div style={styles.pagination}>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          style={{
            fontWeight: currentPage === i + 1 ? "bold" : "normal",
          }}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const {
    loading,
    setLoading,
    fetchPosts,
  } = useContext(PostsContext);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchPosts();
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div style={styles.app}>
      <h1>Posts Viewer</h1>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <>
          <PostsList />
          <Pagination />
        </>
      )}
    </div>
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PostsProvider>
    <App />
  </PostsProvider>
);

// Simple styles
const styles = {
  app: {
    padding: "20px",
    fontFamily: "Arial",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  card: {
    position: "relative",
    background: "#fefefe",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "left",
  },
  cross: {
    position: "absolute",
    top: "5px",
    right: "10px",
    background: "none",
    border: "none",
    color: "red",
    fontSize: "20px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
  },
  loading: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};
export default App;
