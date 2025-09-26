import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../Components/MovieCard";

export default function AllMovies() {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    movieName: "",
    genre: "",
    language: "English",
    duration: "",
    director: "",
    releaseDate: "",
    description: "",
    posterUrl: "",
  });

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

  // Delete movie
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setMovies(movies.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting movie");
    }
  };

  // Update movie
  const handleUpdate = async (id, updatedData) => {
    const payload = {
      movieName: updatedData.movieName,
      genre: updatedData.genre,
      language: updatedData.language,
      releaseDate: updatedData.releaseDate
        ? new Date(updatedData.releaseDate).toISOString()
        : null,
      description: updatedData.description,
      duration: updatedData.duration,
      director: updatedData.director,
      posterUrl: updatedData.posterUrl,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/admin/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update: ${errorText}`);
      }

      const { movie: updatedMovie } = await res.json();
      setMovies(movies.map((m) => (m._id === id ? updatedMovie : m)));
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating movie: " + err.message);
    }
  };

  // Add movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movieName: form.movieName,
        genre: form.genre,
        language: form.language,
        duration: form.duration,
        director: form.director,
        releaseDate: form.releaseDate
          ? new Date(form.releaseDate).toISOString()
          : null,
        description: form.description,
        posterUrl: form.posterUrl,
      };

      const res = await fetch("http://localhost:5000/api/admin/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add movie");
      const newMovie = await res.json();
      setMovies([...movies, newMovie]);
      setShowModal(false);
      setForm({
        movieName: "",
        genre: "",
        language: "English",
        duration: "",
        director: "",
        releaseDate: "",
        description: "",
        posterUrl: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding movie");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      {/* Header with Add Movie Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Upcoming Movies</h2>
        {user?.role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Movie
          </button>
        )}
      </div>

      {/* Movies Grid */}
      <div className="row g-4">
        {movies.map((movie) => (
          <div className="col-md-3" key={movie._id}>
            <MovieCard
              movie={movie}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </div>

      {/* Add Movie Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleAddMovie}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Movie</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Movie Name</label>
                    <input
                      name="movieName"
                      className="form-control"
                      value={form.movieName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <input
                      name="genre"
                      className="form-control"
                      value={form.genre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Language</label>
                    <input
                      name="language"
                      className="form-control"
                      value={form.language}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      value={form.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Director</label>
                    <input
                      name="director"
                      className="form-control"
                      value={form.director}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Release Date</label>
                    <input
                      type="date"
                      name="releaseDate"
                      className="form-control"
                      value={form.releaseDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Poster URL</label>
                    <input
                      name="posterUrl"
                      className="form-control"
                      value={form.posterUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
