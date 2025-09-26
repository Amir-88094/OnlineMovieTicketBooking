import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TheatreCard({ theatre, onDelete, onUpdate }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: theatre.name,
    location: theatre.location,
    totalScreens: theatre.totalScreens,
    imageUrl: theatre.imageUrl,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    onUpdate(theatre._id, form);
    setIsEditing(false);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={form.imageUrl}
        className="card-img-top"
        alt={theatre.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="number"
              name="totalScreens"
              value={form.totalScreens}
              onChange={handleChange}
              className="form-control mb-2"
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
            <h5 className="card-title">{theatre.name}</h5>
            <p className="card-text mb-1">
              <strong>Location:</strong> {theatre.location}
            </p>
            <p className="card-text mb-1">
              <strong>Total Screens:</strong> {theatre.totalScreens}
            </p>
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => navigate(`/shows`)}
            >
              See Shows
            </button>
          </>
        )}

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
                  window.confirm(
                    "Are you sure you want to delete this theatre?"
                  )
                ) {
                  onDelete(theatre._id);
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
