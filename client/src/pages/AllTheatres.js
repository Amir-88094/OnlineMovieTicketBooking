import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TheatreCard from "../Components/TheatreCard";

export default function AllTheatres() {
  const { user } = useContext(AuthContext);
  const [theatres, setTheatres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    totalScreens: "",
    imageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  });

  // Fetch theatres
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/theatres");
        const data = await res.json();
        setTheatres(data);
      } catch (err) {
        console.error("Failed to fetch theatres", err);
      }
    };
    fetchTheatres();
  }, []);

  // Delete theatre
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/theatres/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setTheatres(theatres.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting theatre");
    }
  };

  // Update theatre
  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/theatres/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      const { theatre: updatedTheatre } = await res.json();
      setTheatres(theatres.map((t) => (t._id === id ? updatedTheatre : t)));
    } catch (err) {
      console.error(err);
      alert("Error updating theatre");
    }
  };

  // Add theatre
  const handleAddTheatre = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/theatres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add theatre");
      const newTheatre = await res.json();
      setTheatres([...theatres, newTheatre]);
      setShowModal(false);
      setForm({
        name: "",
        location: "",
        totalScreens: "",
        imageUrl:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding theatre");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Theatres</h2>
        {user?.role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Theatre
          </button>
        )}
      </div>

      {/* Theatre Grid */}
      <div className="row g-4">
        {theatres.map((theatre) => (
          <div className="col-md-4" key={theatre._id}>
            <TheatreCard
              theatre={theatre}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </div>

      {/* Add Theatre Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleAddTheatre}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Theatre</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Theatre Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      name="location"
                      className="form-control"
                      value={form.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Screens</label>
                    <input
                      type="number"
                      name="totalScreens"
                      className="form-control"
                      value={form.totalScreens}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      name="imageUrl"
                      className="form-control"
                      value={form.imageUrl}
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
