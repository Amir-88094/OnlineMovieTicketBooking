import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings/my-bookings",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    if (user?.token) fetchBookings();
  }, [user]);

  return (
    <div className="container py-4">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings yet.</p>
      ) : (
        <div className="row g-3">
          {bookings.map((b) => (
            <div className="col-md-4" key={b._id}>
              <div className="card shadow-sm p-3">
                <h5>{b.movie.movieName}</h5>
                <p>
                  <strong>Show Time:</strong>{" "}
                  {new Date(b.showTime).toLocaleString()}
                </p>
                <p>
                  <strong>Seats:</strong> {b.seatsBooked}
                </p>
                <p>
                  <strong>Booked On:</strong>{" "}
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
