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
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

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

  const generateAISummary = async () => {
    setLoadingSummary(true);
    setAiSummary('');

    try {
      const commentsText = comments.length > 0 
        ? comments.map(c => `${c.author}: ${c.comment}`).join('\n')
        : 'No comments yet.';

      const prompt = `Summarize this gaming post in 2-3 sentences:
Title: ${post.title}
Content: ${post.content || 'No content'}
Upvotes: ${post.upvotes}
Comments (${comments.length}): ${commentsText}`;

      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 150,
              min_length: 50
            }
          })
        }
      );

      const data = await response.json();
      
      if (data && data[0] && data[0].summary_text) {
        setAiSummary(data[0].summary_text);
      } else {
        setAiSummary('This post discusses ' + post.title + ' with ' + post.upvotes + ' upvotes and ' + comments.length + ' community comments.');
      }
    } catch (error) {
      console.error('AI Summary Error:', error);
      setAiSummary('This post discusses ' + post.title + ' with ' + post.upvotes + ' upvotes and ' + comments.length + ' community comments.');
    } finally {
      setLoadingSummary(false);
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

        {/* AI Summary Section */}
        <div className="ai-summary-section">
          <button 
            onClick={generateAISummary} 
            disabled={loadingSummary}
            className="ai-summary-btn"
          >
            {loadingSummary ? '🤖 Generating Summary...' : '🤖 Generate AI Summary'}
          </button>

          {aiSummary && (
            <div className="ai-summary-box">
              <h3>🤖 AI Summary</h3>
              <p>{aiSummary}</p>
            </div>
          )}
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