import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ShowCard from "../Components/ShowCard";

export default function AllShows() {
  const { user } = useContext(AuthContext);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [booking, setBooking] = useState({ persons: 1, amount: 0 });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/shows");
        const data = await res.json();
        setShows(data);
      } catch (err) {
        console.error("Failed to fetch shows", err);
      }
    };
    fetchShows();
  }, []);

  // When user selects a show to book
  const handleBook = (show) => {
    setSelectedShow(show);
    setBooking({
      persons: 1,
      amount: show.price,
    });
  };

  // Handle booking form changes
  const handleBookingChange = (e) => {
    const persons = parseInt(e.target.value) || 1;
    setBooking({
      persons,
      amount: persons * selectedShow.price,
    });
  };

  // Handle Payment -> call backend booking API
  const handlePayment = async () => {
    try {
      setPaymentSuccess(true); // ✅ show success popup
    } catch (err) {
      console.error(err);
      console.log("Booking failed", err);
      alert("Error booking ticket");
    }
  };

  return (
    <div className="container py-4">
      <h2>All Shows</h2>

      <div className="row g-4">
        {shows.map((show) => (
          <div className="col-md-4" key={show._id}>
            <ShowCard show={show} onBook={handleBook} />
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedShow && !paymentSuccess && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h5 className="modal-title">Book Tickets</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedShow(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Movie Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedShow.movieName}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price per Ticket</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`₹${selectedShow.price}`}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Number of Persons</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={booking.persons}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`₹${booking.amount}`}
                      disabled
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handlePayment}
                  >
                    Do Payment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedShow(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Small Payment Success Popup */}
      {paymentSuccess && (
        <div
          className="position-fixed bottom-0 end-0 m-3 p-4 bg-white border shadow rounded"
          style={{ width: "300px", zIndex: 9999 }}
        >
          <h6 className="text-success">✅ Payment Successful</h6>
          <p>
            Movie: <strong>{selectedShow.movieName}</strong>
          </p>
          <p>
            Seats: <strong>{booking.persons}</strong>
          </p>
          <p>
            Paid: <strong>₹{booking.amount}</strong>
          </p>
          <button
            className="btn btn-outline-primary btn-sm w-100"
            onClick={() => alert("download started")}
          >
            🖨️ Print Ticket
          </button>
          <button
            className="btn btn-link btn-sm w-100 mt-2"
            onClick={() => {
              setPaymentSuccess(false);
              setSelectedShow(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
