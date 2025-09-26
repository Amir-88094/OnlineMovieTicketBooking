import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  // ✅ Validation Schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const signupSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  // ✅ Handle Submit
  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");

    try {
      if (isSignup) {
        // ---- SIGN UP ----
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          }),
        });
        if (!res.ok) throw new Error("Signup failed");
        alert("User registered. Please login.");
        setIsSignup(false);
        navigate("/login");
      } else {
        // ---- LOGIN ----
        // ---- LOGIN ----
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();

        // ✅ extract from nested user
        login({
          token: data.token,
          role: data.user.role?.toLowerCase(),
          email: data.user.email,
          id: data.user.id,
        });

        console.log("Logged in as:", data.user.role);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">{isSignup ? "Sign Up" : "Login"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={isSignup ? signupSchema : loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {isSignup && (
              <>
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <Field name="firstName" className="form-control" />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <Field name="lastName" className="form-control" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger small"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="text-center">
        {isSignup ? (
          <p>
            Already have an account?{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => setIsSignup(false)}
            >
              Login here
            </button>
          </p>
        ) : (
          <p>
            Not a user?{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => setIsSignup(true)}
            >
              Sign up
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
