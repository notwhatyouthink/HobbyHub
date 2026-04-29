import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('Posts')
      .select()
      .eq('id', id)
      .single();

    if (data) {
      setPost({
        title: data.title,
        content: data.content || '',
        imageUrl: data.imageUrl || '',
      });
    }
  };

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
      .update({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
      })
      .eq('id', id);

    navigate(`/post/${id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    
    if (confirmDelete) {
      await supabase.from('Posts').delete().eq('id', id);
      navigate('/');
    }
  };

  return (
    <div className="edit-post">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          rows="6"
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={post.imageUrl}
          onChange={handleChange}
        />

        <div className="button-group">
          <button type="submit" className="submit-btn">
            Update Post
          </button>
          <button type="button" onClick={handleDelete} className="delete-btn">
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;