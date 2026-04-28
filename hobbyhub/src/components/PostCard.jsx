import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/post/${post.id}`} className="post-card-link">
      <div className="post-card">
        <div className="post-header">
          <span className="post-date">{formatDate(post.created_at)}</span>
          <span className="post-upvotes">👍 {post.upvotes}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
      </div>
    </Link>
  );
};

export default PostCard;