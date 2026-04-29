import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', comment: '' });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('Posts')
      .select()
      .eq('id', id)
      .single();

    setPost(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('Comments')
      .select()
      .eq('postId', id)
      .order('created_at', { ascending: true });

    setComments(data || []);
  };

  const handleUpvote = async () => {
    await supabase
      .from('Posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);

    setPost({ ...post, upvotes: post.upvotes + 1 });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.author || !newComment.comment) {
      alert('Please fill in both author name and comment!');
      return;
    }

    await supabase
      .from('Comments')
      .insert({
        postId: id,
        author: newComment.author,
        comment: newComment.comment,
      });

    setNewComment({ author: '', comment: '' });
    fetchComments();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    
    if (confirmDelete) {
      await supabase.from('Posts').delete().eq('id', id);
      navigate('/');
    }
  };

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-content">
        <div className="post-header-detail">
          <h1>{post.title}</h1>
          <div className="post-actions">
            <Link to={`/edit/${id}`} className="edit-btn">Edit</Link>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        </div>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="post-image" />
        )}

        <p className="post-content-text">{post.content}</p>

        <div className="upvote-section">
          <button onClick={handleUpvote} className="upvote-btn">
            👍 Upvote
          </button>
          <span className="upvote-count">{post.upvotes} upvotes</span>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Your name"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          />
          <textarea
            placeholder="Write a comment..."
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            rows="3"
          />
          <button type="submit" className="comment-submit-btn">Post Comment</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.author}</strong>
                <p>{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;