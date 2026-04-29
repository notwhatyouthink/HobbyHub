import { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title) {
      alert('Title is required!');
      return;
    }

    await supabase
      .from('Posts')
      .insert({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
      })
      .select();

    navigate('/');
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
          placeholder="Enter post title"
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          rows="6"
          placeholder="Write your post content here..."
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={post.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />

        <button type="submit" className="submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;