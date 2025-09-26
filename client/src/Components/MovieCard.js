import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MovieCard({ movie, onDelete, onUpdate }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    Title: movie.Title,
    genre: movie.genre,
    language: movie.language,
    releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
    description: movie.description,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(movie._id, form);
    setIsEditing(false);
  };

  return (
    <div className="card h-100 shadow-sm">
      {/* Poster */}
      <img
        src={
          movie.posterUrl ||
          (movie.imageUrl?.[0] ?? "https://via.placeholder.com/300")
        }
        className="card-img-top"
        alt={movie.Title}
        style={{ height: "250px", objectFit: "cover" }}
      />

      <div className="card-body">
        {isEditing ? (
          <>
            {/* Editable fields */}
            <input
              type="text"
              name="Title"
              value={form.Title}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control mb-2"
              rows={2}
            />
            <button
              className="btn btn-success btn-sm me-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">{movie.Title}</h5>
            <p className="card-text mb-1">
              <strong>Genre:</strong> {movie.genre || "N/A"}
            </p>
            <p className="card-text mb-1">
              <strong>Language:</strong> {movie.language}
            </p>
            <p className="card-text mb-1">
              <strong>Release Date:</strong>{" "}
              {movie.releaseDate
                ? new Date(movie.releaseDate).toDateString()
                : "N/A"}
            </p>
            <p className="card-text text-muted">
              {movie.description
                ? movie.description.length > 80
                  ? movie.description.substring(0, 80) + "..."
                  : movie.description
                : "No description"}
            </p>
          </>
        )}

        {/* Admin controls */}
        {isAdmin && !isEditing && (
          <div className="d-flex justify-content-between mt-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this movie?")
                ) {
                  onDelete(movie._id);
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
