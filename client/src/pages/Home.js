import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../Components/MovieCard";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="text-light text-center d-flex align-items-center justify-content-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1603190287605-914bb82a67d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div className="bg-dark bg-opacity-75 p-4 rounded">
          <h1 className="fw-bold">🎬 Online Cinema Ticketing</h1>
          <p className="lead">
            Book your favorite movies instantly, anytime, anywhere. Explore
            upcoming shows, reserve your seats, and enjoy hassle-free booking.
            Exclusive access for users and admins with real-time updates.
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="container py-5">
        {user ? (
          <div className="text-center mb-4">
            <h5>
              Welcome {user.firstName || user.email}!{" "}
              <span className="badge bg-secondary text-uppercase">
                {user.role}
              </span>
            </h5>
          </div>
        ) : (
          <p className="text-center text-muted">
            Please login to book your tickets.
          </p>
        )}

        {/* Featured Movies Section */}

        <div className="row g-4">
          {movies.slice(0, 3).map((movie) => (
            <div className="col-md-4" key={movie._id}>
              <MovieCard
                movie={movie}
                onDelete={() => {}}
                onUpdate={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
