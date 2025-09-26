import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar";
import Home from "./pages/Home";
import AllMovies from "./pages/AllMovies";
import AllTheatres from "./pages/AllTheatres";
import LoginPage from "./pages/LoginPage";
import AllShows from "./pages/AllShows";

import ProtectedRoute from "./context/Protect"; // ✅ import

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <AllMovies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theatres"
              element={
                <ProtectedRoute>
                  <AllTheatres />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shows"
              element={
                <ProtectedRoute>
                  <AllShows />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <footer className="bg-dark text-light text-center py-3">
          © Copyright Cinema Booking 2025
        </footer>
      </div>
    </Router>
  );
}

export default App;
