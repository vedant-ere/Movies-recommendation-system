import React from "react";

const MovieCard = ({
  movie: { title, poster_path, release_date, vote_average, original_language },
}) => {
  return (
    <div className="movie-card">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'np-movie.png'}
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
            <div className="rating">
                <img src="/star.svg" alt="star icon" />
                <p>{vote_average ? vote_average.toFixed(1) : null}</p>
                <span>•</span>
                <p><div className="lang">{original_language}</div></p>
                <span>•</span>
                <p>{release_date ? release_date.split("-")[0] : 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
