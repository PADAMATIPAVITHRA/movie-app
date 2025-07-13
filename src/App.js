import React, { useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';

const API_KEY = '00b962cf31bf73c98021ba4e3bd6c5a0'; // replace this

function App() {
  const [query, setQuery] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setError('');
      setVideoId('');

      // 1. Search for the movie
      const searchRes = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );

      if (!searchRes.data.results.length) {
        setError('No movie found');
        return;
      }

      const movieId = searchRes.data.results[0].id;

      // 2. Get movie videos
      const videosRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );

      const trailers = videosRes.data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (!trailers.length) {
        setError('No trailer found');
        return;
      }

      setVideoId(trailers[0].key); // This is the YouTube video ID

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="App">
      <div className="search-box">
        <label>Search for any movie/show: </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {videoId && (
        <>
          <h3>Trailer:</h3>
          <YouTube videoId={videoId} opts={{ height: '390', width: '640', playerVars: { autoplay: 1 } }} />
        </>
      )}
    </div>
  );
}

export default App;
