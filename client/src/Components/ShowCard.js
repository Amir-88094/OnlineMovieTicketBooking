import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ShowCard({ show, onDelete, onUpdate, onBook }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    theatreName: show.theatreName,
    movieName: show.movieName,
    startTime: show.startTime ? show.startTime.split("T")[0] : "",
    endTime: show.endTime ? show.endTime.split("T")[0] : "",
    price: show.price,
    screenNumber: show.screenNumber,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    onUpdate(show._id, form);
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              name="theatreName"
              className="form-control mb-2"
              value={form.theatreName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="movieName"
              className="form-control mb-2"
              value={form.movieName}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="startTime"
              className="form-control mb-2"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="endTime"
              className="form-control mb-2"
              value={form.endTime}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              className="form-control mb-2"
              value={form.price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="screenNumber"
              className="form-control mb-2"
              value={form.screenNumber}
              onChange={handleChange}
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
            <h5 className="card-title">{show.movieName}</h5>
            <p className="card-text mb-1">
              <strong>Theatre:</strong> {show.theatreName}
            </p>
            <p className="card-text mb-1">
              <strong>Screen:</strong> {show.screenNumber}
            </p>
            <p className="card-text mb-1">
              <strong>Start:</strong>{" "}
              {new Date(show.startTime).toLocaleString()}
            </p>
            <p className="card-text mb-1">
              <strong>End:</strong> {new Date(show.endTime).toLocaleString()}
            </p>
            <p className="card-text">
              <strong>Price:</strong> ₹{show.price}
            </p>

            {/* Buttons */}
            {isAdmin ? (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm("Delete this show?")) {
                      onDelete(show._id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onBook(show)}
              >
                Book Ticket
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
