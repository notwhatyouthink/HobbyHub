import { useState, useEffect } from 'react';
import { supabase } from '../client';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('Posts')
      .select()
      .order(sortBy, { ascending: false });

    setPosts(data || []);
    setFilteredPosts(data || []);
  };

  const handleSearch = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== '') {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  return (
    <div className="home">
      <div className="controls">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-bar"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="created_at">Sort by Time</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>
      </div>

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">No posts found. Create the first one!</p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;